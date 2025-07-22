import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET(request, { params }) {
  const { contractorId } = await params;

  const { searchParams } = new URL(request.url);
  const resumeProfile = searchParams.get("resumeProfile");

  try {
    if (resumeProfile === "true") {
      const resume = await prisma.publicResume.findFirst({
        where: { id: contractorId },
      });

      if (!resume) {
        return NextResponse.json(
          { error: "Resume Not Found!" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: "Success",
          resume: resume,
        },
        { status: 200 }
      );
    } else {
      const authtoken = request.headers.get("Authorization");

      if (!authtoken) {
        return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
      }

      const contractor = await prisma.user.findFirst({
        where: { id: contractorId },
      });

      if (!contractor) {
        return NextResponse.json(
          { error: "Contractor Not Found!" },
          { status: 404 }
        );
      }

      const { password, ...contractorDetails } = contractor;

      const contractorProfile = await prisma.contractorProfile.findFirst({
        where: { userId: contractorId },
      });

      return NextResponse.json(
        {
          message: "Success",
          user: contractorDetails,
          CV: contractorProfile || null,
        },
        { status: 200 }
      );
    }
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
