import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { verifyAuthToken } from "@/utils/verifyAuthToken";

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
        message: "Invalid Token!",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: tokenDetails.userId },
      include: { companyProfile: true },
    });

    if (!user || !user.companyProfile) {
      return NextResponse.json({ error: "Company Profile Not Found!" }, { status: 404 });
    }

    const jobPost = await prisma.jobPost.create({
      data: {
        role: body.role,
        description: body.description,
        additionalRequirements: body.additionalRequirements || "",
        experience: parseInt(body.experience),
        rate: parseInt(body.rate),
        currency: body.currency,
        location: body.location,
        availability: body.availability ? new Date(body.availability) : null,
        jobType: body.jobType,
        status: body.status || "ACTIVE",
        skills: body.skills,
        companyId: user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Job Post Created Successfully!",
        data: jobPost,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(request) {
  try {
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

    const jobPosts = await prisma.jobPost.findMany({
      where: {
        companyId: tokenDetails.userId,
      },
      include: {
        company: {
          select: {
            companyProfile: {
              select: {
                companyName: true,
                logoUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      message: "Job Posts Fetched Successfully!",
      data: jobPosts,
    });
  } catch (error) {
    console.error("Error fetching job posts:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
