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

    const userProfile = await prisma.moodleUser.findUnique({
      where: { userId: user.id },
    });

    if (!userProfile) {
      return NextResponse.json(
        { message: "Moodle Account Not Registered!", data: [] },
        { status: 200 }
      );
    }

    const userEnrollments = await prisma.moodleEnrollment.findMany({
      where: { moodleUserId: userProfile.id },
    });

    return NextResponse.json(
      {
        userEnrollments: userEnrollments,
        message: "Success",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
