import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { verifyAuthToken } from "@/utils/verifyAuthToken";

export async function POST(request) {
  try {
    const body = await request.json();
    const { courses } = body;
    const authtoken = request.headers.get("Authorization");

    if (!authtoken) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const tokenDetails = verifyAuthToken(authtoken);

    if (!tokenDetails) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const createdAllCourses = await prisma.moodleCourses.createMany({
      data: courses.map((course) => ({
        courseId: course.id,
        courseName: course.fullname,
        startDate: new Date(course.startdate * 1000),
        endDate: new Date(course.enddate * 1000),
      })),
    });

    const insertedCount = createdAllCourses.count;

    return NextResponse.json(
      {
        message: `Enrolled successfully ${insertedCount} courses`,
        insertCount: createdAllCourses.count,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const authtoken = request.headers.get("Authorization");

    if (!authtoken) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const tokenDetails = verifyAuthToken(authtoken);

    if (!tokenDetails) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const courses = await prisma.moodleCourses.findMany({
      where: {
        status: "OPEN",
      },
    });

    return NextResponse.json(
      {
        message: "All Courses Fetched Successfully",
        courses: courses,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "something went wrong, Please try again", error: error },
      { status: 500 }
    );
  }
}
