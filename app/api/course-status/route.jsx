import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { verifyAuthToken } from "@/utils/verifyAuthToken";
import { coursesStatus } from "@/utils/moodle";

export async function POST(request) {
  try {
    const body = await request.json();
    const { courseId } = body;
    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    const authtoken = request.headers.get("Authorization");

    if (!authtoken) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const tokenDetails = verifyAuthToken(authtoken);

    if (!tokenDetails) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: { id: tokenDetails.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User Does Not Exist!" }, { status: 404 });
    }

    const moodleUser = await prisma.moodleUser.findUnique({
      where: { userId: user.id },
    });

    if (!moodleUser) {
      return NextResponse.json(
        { message: "Moodle Account Not Registered!", data: [] },
        { status: 200 }
      );
    }

    const courseStatus = await coursesStatus({
      userId: moodleUser.moodleUserId,
      courseId: courseId,
    });

    return NextResponse.json(
      {
        message: `Fetch courses successfully!`,
        coursesDetail: courseStatus.data.completionstatus.completions,
        aggregation: courseStatus.data.completionstatus.aggregation,
        status: courseStatus.data.completionstatus.completed,
        coursesLength: courseStatus.data.completionstatus.completions.length,
        courseID: courseId,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
