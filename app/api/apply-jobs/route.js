import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { verifyAuthToken } from "@/utils/verifyAuthToken";

export async function POST(request) {
  try {
    const authtoken = request.headers.get("Authorization");
    const body = await request.json();

    const tokenDetails = verifyAuthToken(authtoken);
    const { userId } = tokenDetails;

    const checkAlreadyApplied = await prisma.jobApplication.findFirst({
      where: { contractorId: userId, jobId: body.jobID },
    });

    if (checkAlreadyApplied) {
      return NextResponse.json(
        { error: "This Job is already Applied with this Contractor" },
        { status: 500 }
      );
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId: body.jobID,
        contractorId: userId,
        status: "APPLIED",
      },
    });

    return NextResponse.json(
      {
        status: "Job Applied Successfully!",
        data: application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("error in Catch", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
