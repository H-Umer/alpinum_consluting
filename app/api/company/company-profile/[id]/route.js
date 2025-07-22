import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { verifyAuthToken } from "@/utils/verifyAuthToken";

export async function GET(request, { params }) {
  const companyParams = await params;
  try {
    const authtoken = request.headers.get("Authorization");

    if (!authtoken) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const companyProfileID = companyParams.id;

    const tokenDetails = verifyAuthToken(authtoken);

    if (!tokenDetails) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const companyProfile = await prisma.companyProfile.findFirst({
      where: { id: companyProfileID },
    });

    if (!companyProfile) {
      return NextResponse.json({ error: "Company Does Not Exist!" }, { status: 404 });
    }

    const user = await prisma.user.findFirst({
      where: { id: companyProfile.userId },
    });

    return NextResponse.json(
      {
        message: "Success!",
        companyProfile: companyProfile,
        user: user,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
