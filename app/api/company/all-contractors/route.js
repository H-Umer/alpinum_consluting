import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { verifyAuthToken } from "@/utils/verifyAuthToken";

export async function GET(request) {
  try {
    const authtoken = request.headers.get("Authorization");

    if (!authtoken) {
      const allCandidates = await prisma.user.findMany({
        where: {
          role: "CONTRACTOR",
        },
        select: {
          firstName: true,
          lastName: true,
          id: true,
          role: true,
          email: true,
          contractorProfile: true,
          createdAt: true,
        },
      });
      return NextResponse.json(
        {
          candidates: allCandidates,
        },
        { status: 200 }
      );
    }

    const tokenDetails = verifyAuthToken(authtoken);

    if (!tokenDetails) {
      return NextResponse(
        {
          error: "Invalid Token!",
        },
        {
          status: 400,
        }
      );
    }

    const allCandidates = await prisma.user.findMany({
      where: {
        role: "CONTRACTOR",
      },
      select: {
        firstName: true,
        lastName: true,
        id: true,
        role: true,
        email: true,
        contractorProfile: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Success!",
        candidates: allCandidates,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
