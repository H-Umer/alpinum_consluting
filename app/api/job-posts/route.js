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
    if (!tokenDetails) {
      return NextResponse.json({
        message: "Invalid Token!",
      });
    }

    const jobPosts = await prisma.jobPost.findMany({
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
        jobApplication: true,
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
