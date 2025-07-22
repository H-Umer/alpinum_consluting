import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { verifyAuthToken } from "@/utils/verifyAuthToken";

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

    const companyProfile = await prisma.companyProfile.findFirst({
      where: { userId: user.id },
    });

    return NextResponse.json(
      {
        message: "Success!",
        user: userDetails,
        companyProfile: !companyProfile ? null : companyProfile,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const authtoken = request.headers.get("Authorization");

    if (!authtoken) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const tokenDetails = verifyAuthToken(authtoken);
    if (!tokenDetails) {
      return NextResponse.json({
        message: "Token is not Valid",
      });
    }

    const socialLinks = [
      { platform: "github", url: body?.github },
      { platform: "linkedIn", url: body?.linkedIn },
    ];

    const user = await prisma.companyProfile.update({
      where: { userId: tokenDetails.userId },
      data: {
        industry: body.industry,
        companySize: body.companySize,
        website: body?.website,
        description: body.description,
        location: body.address,
        foundedYear: Number(body.foundedYear),
        socialLinks: socialLinks,
      },
    });

    return NextResponse.json(
      {
        message: "Success",
        user: user,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const authtoken = request.headers.get("Authorization");

    if (!authtoken) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const tokenDetails = verifyAuthToken(authtoken);
    if (!tokenDetails) {
      return NextResponse.json({
        message: "Invalid Token!",
      });
    }

    const profileImage = formData.get("profileImage");
    const jsonData = formData.get("data");
    const body = JSON.parse(jsonData);

    if (body.companyName) {
      const existingCompany = await prisma.companyProfile.findFirst({
        where: {
          companyName: body.companyName,
          NOT: {
            userId: tokenDetails.userId,
          },
        },
      });

      if (existingCompany) {
        return NextResponse.json(
          {
            error: "A Company With This Name Already Exists!",
          },
          { status: 400 }
        );
      }
    }

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
      { platform: "github", url: body?.github },
      { platform: "linkedIn", url: body?.linkedIn },
    ];

    const user = await prisma.companyProfile.update({
      where: { userId: tokenDetails.userId },
      data: {
        companyName: body.companyName,
        industry: body.industry,
        companySize: body.companySize,
        website: body?.website,
        description: body.description,
        location: body.address,
        foundedYear: Number(body.foundedYear),
        socialLinks: socialLinks,
        ...(imageUrl && { logoUrl: imageUrl }),
      },
    });

    return NextResponse.json(
      {
        message: "Success!",
        user: user,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
