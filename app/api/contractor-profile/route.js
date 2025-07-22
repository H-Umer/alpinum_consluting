import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { verifyAuthToken } from "@/utils/verifyAuthToken";

export async function POST(request) {
  try {
    const authtoken = request.headers.get("Authorization");
    const formData = await request.formData();

    const resumeDoc = formData.get("file");
    const cvInfo = formData.get("cvInfo");
    const body = JSON.parse(cvInfo);

    const tokenDetails = verifyAuthToken(authtoken);
    const { userId } = tokenDetails;

    let imageUrl;
    if (resumeDoc) {
      const resumeFile = new FormData();
      resumeFile.append("file", resumeDoc);

      const protocol = request.headers.get("x-forwarded-proto") || "http";
      const host = request.headers.get("host");
      const baseUrl = `${protocol}://${host}`;

      const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        body: resumeFile,
      });

      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || "Failed to upload resume");
      }

      imageUrl = uploadResult.fileUrl;
    }
    const availabilityDate = new Date(body.availability);

    await prisma.contractorResume.create({
      data: {
        fileUrl: imageUrl,
        userId: userId,
      },
    });

    const existingProfile = await prisma.contractorProfile.findFirst({
      where: { userId },
    });

    let resumeDetails;

    if (existingProfile) {
      resumeDetails = await prisma.contractorProfile.update({
        where: { userId },
        data: {
          yearsExperience: String(body.experience),
          hourlyRate: body.rate,
          country: body.country,
          city: body.city,
          onSiteWorkDays: body.maxDays,
          isRelocate: body.willingToRelocate === "Yes" ? true : false,
          availability: availabilityDate,
          currency: body.currency,
          designation: body.designation,
          degreeInfo: body.degreeInfo.degree,
          languages: body.skills.languages,
          tools: body.skills.tools,
          methodologies: body.skills.methodologies,
        },
      });
    } else {
      resumeDetails = await prisma.contractorProfile.create({
        data: {
          yearsExperience: String(body.experience),
          hourlyRate: body.rate,
          country: body.country,
          city: body.city,
          onSiteWorkDays: body.maxDays,
          isRelocate: body.willingToRelocate === "Yes" ? true : false,
          availability: availabilityDate,
          currency: body.currency,
          designation: body.designation,
          degreeInfo: body.degreeInfo.degree,
          languages: body.skills.languages,
          tools: body.skills.tools,
          methodologies: body.skills.methodologies,
          userId: userId,
        },
      });
    }

    return NextResponse.json(
      {
        data: resumeDetails,
        message: existingProfile
          ? "Profile Updated Successfully!"
          : "Profile Created Successfully!",
        message: "success",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("error in Catch", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const authtoken = request.headers.get("Authorization");

    if (!authtoken) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const tokenDetails = verifyAuthToken(authtoken);

    const user = await prisma.user.findFirst({
      where: { id: tokenDetails.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User Does Not Exist!" }, { status: 404 });
    }

    const { password, ...userDetails } = user;

    const userProfile = await prisma.contractorProfile.findFirst({
      where: { userId: user.id },
    });

    const UserResume = await prisma.contractorResume.findFirst({
      where: { userId: tokenDetails.userId },
    });

    return NextResponse.json(
      {
        message: "Success",
        user: userDetails,
        UserResume: UserResume,
        CV: !userProfile ? null : userProfile,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const authtoken = request.headers.get("Authorization");
    const tokenDetails = verifyAuthToken(authtoken);
    const { userId } = tokenDetails;

    const profileImage = formData.get("profileImage");
    const jsonData = formData.get("data");
    const body = JSON.parse(jsonData);

    let imageUrl;
    if (profileImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", profileImage);

      const protocol = request.headers.get("x-forwarded-proto") || "http";
      const host = request.headers.get("host");
      const baseUrl = `${protocol}://${host}`;

      const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        body: imageFormData,
      });

      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || "Failed to upload image");
      }

      imageUrl = uploadResult.fileUrl;
    }

    const socialLinks = [
      { platform: "twitter", url: body.socialLinks?.twitter },
      { platform: "github", url: body.socialLinks?.github },
      { platform: "linkedIn", url: body.socialLinks?.linkedIn },
    ];

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: body.user.firstName,
        lastName: body.user.lastName,
      },
    });

    const availabilityTimeZone = new Date(body.CV.startTime).toString().split(" ")[5];

    const startTime = new Date(body.CV.startTime).toString().split(" ")[4];

    const endTime = new Date(body.CV.endTime).toString().split(" ")[4];

    const updatedCV = await prisma.contractorProfile.update({
      where: { userId: userId },
      data: {
        yearsExperience: String(body.CV.yearsExperience),
        hourlyRate: Number(body.CV.hourlyRate),
        city: body.CV.city,
        country: body.CV.country,
        onSiteWorkDays: parseInt(body.CV.onSiteWorkDays),
        designation: body.CV.designation,
        degreeInfo: body.CV.degreeInfo,
        startTime: startTime,
        endTime: endTime,
        availabilityZone: availabilityTimeZone,
        languages: body.CV.languages,
        tools: body.CV.tools,
        methodologies: body.CV.methodologies,
        availabilityDays: body.CV.availabilityDays,
        socialLink: socialLinks,
        ...(imageUrl && { imageUrl }),
      },
    });

    return NextResponse.json(
      {
        message: "Profile Updated Successfully!",
        user: updatedUser,
        CV: updatedCV,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
