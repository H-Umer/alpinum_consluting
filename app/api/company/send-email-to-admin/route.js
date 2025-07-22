import { NextResponse } from "next/server";
import { resumeInterestEmail } from "@/utils/generateEmail/resumeInterest";

export async function POST(request) {
  try {
    const body = await request.json();
    const { resumeCode, companyName } = body;

    await resumeInterestEmail({ resumeCode, companyName });

    return NextResponse.json(
      {
        status: "success",
        message: "Resume Interest Email Sent Successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
