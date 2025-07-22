import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { verifyAuthToken } from "@/utils/verifyAuthToken";

export async function GET(request, { params }) {
  try {
    const { jobId } = await params;

    const authtoken = request.headers.get("Authorization");

    if (!authtoken) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const tokenDetails = verifyAuthToken(authtoken);

    if (!tokenDetails) {
      return NextResponse.json({ error: "UnAuthorized!" }, { status: 401 });
    }

    const job = await prisma.jobPost.findFirst({
      where: { id: jobId },
      include: {
        jobApplication: {
          include: {
            contractor: {
              include: {
                contractorResume: {
                  orderBy: { uploadedAt: "desc" },
                },
                contractorProfile: true,
              },
            },
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job Not Found!" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Success",
        data: job,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("err", err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
