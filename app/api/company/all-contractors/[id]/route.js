import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { verifyAuthToken } from "@/utils/verifyAuthToken";

export async function GET(request, { params }) {
  const contractorParams = await params;
  try {
    const authtoken = request.headers.get("Authorization");

    if (!authtoken) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const paramsID = contractorParams.id;

    const tokenDetails = verifyAuthToken(authtoken);

    if (!tokenDetails) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const contractorProfile = await prisma.contractorProfile.findFirst({
      where: { id: paramsID },
    });

    const data = await prisma.user.findFirst({
      where: { id: contractorProfile.userId },
      include: {
        contractorProfile: true,
      },
    });

    if (!data) {
      return NextResponse.json({ error: "User Does Not Exist!" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Schedule Appointment!",
        data: data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
