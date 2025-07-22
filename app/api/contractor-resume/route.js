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
      include: {
        contractorProfile: true,
        contractorResume: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User Does Not Exist!" }, { status: 404 });
    }

    const { password, ...userDetails } = user;

    return NextResponse.json(
      {
        message: "Success",
        user: userDetails,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
