import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { verifyAuthToken } from "@/utils/verifyAuthToken";
import { generatePassword } from "@/utils/generatePassword";
import { createMoodleAccount, enrolUserInCourse } from "@/utils/moodle";
import { sendMoodleLoginMail } from "@/utils/generateEmail/moodleLogin";

const TOKENS_REQUIRED = 50;

export async function POST(request) {
  try {
    const authtoken = request.headers.get("Authorization");
    const body = await request.json();
    const { courseId, courseName } = body;

    if (!authtoken) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const tokenDetails = verifyAuthToken(authtoken);

    const currentUser = await prisma.user.findFirst({
      where: { id: tokenDetails.userId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User Does Not Exist!" }, { status: 404 });
    }

    if (!currentUser.connects || currentUser.connects < TOKENS_REQUIRED) {
      return NextResponse.json(
        {
          error: "Insufficient Tokens! You Need 50 Tokens To Enroll In This Course.",
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, email } = currentUser;
    const passwordForMoodle = generatePassword();

    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
    const password = passwordForMoodle;
    const firstname = firstName;
    const lastname = lastName;

    let moodleUserRecord = await prisma.moodleUser.findFirst({
      where: { userId: currentUser.id },
    });

    if (!moodleUserRecord) {
      const createdMoodleAccount = await createMoodleAccount({
        username,
        password,
        firstname,
        lastname,
        email,
      });

      moodleUserRecord = await prisma.moodleUser.create({
        data: {
          moodleUserId: createdMoodleAccount[0].id,
          moodleUsername: username,
          userId: currentUser.id,
        },
      });

      await sendMoodleLoginMail({
        passwordForMoodle,
        username,
        email,
      });
    }

    const moodleUserId = moodleUserRecord.moodleUserId;
    const enrolCourse = await enrolUserInCourse({
      userId: moodleUserId,
      courseId,
    });

    if (enrolCourse.status === 200 && enrolCourse.ok) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: currentUser.id },
          data: {
            connects: currentUser.connects - TOKENS_REQUIRED,
          },
        }),

        prisma.connectUsage.create({
          data: {
            userId: currentUser.id,
            connectsUsed: TOKENS_REQUIRED,
            reason: `Course Enrollment: ${courseName} (ID: ${courseId})`,
          },
        }),

        prisma.moodleEnrollment.create({
          data: {
            moodleCourseId: parseInt(courseId),
            enrolledAt: new Date(),
            moodleUserId: moodleUserRecord.id,
          },
        }),
      ]);

      return NextResponse.json(
        {
          message: "Course Enrolled Successfully! Please Check Your Email!",
          remainingTokens: currentUser.connects - TOKENS_REQUIRED,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Failed To Enroll In The Course. Please Try Again." + enrolCourse.error,
        },
        { status: 500 }
      );
    }
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
