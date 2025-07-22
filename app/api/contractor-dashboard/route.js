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

    if (!tokenDetails) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    // Step 1: Get basic user info without password
    const baseUser = await prisma.user.findFirst({
      where: { id: tokenDetails.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        connects: true,
      },
    });

    if (!baseUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Step 2: Get full user info based on role
    const user = await prisma.user.findFirst({
      where: { id: baseUser.id },
      include:
        baseUser.role === "CONTRACTOR"
          ? { contractorProfile: true }
          : baseUser.role === "COMPANY"
          ? { companyProfile: true }
          : {},
    });

    return NextResponse.json(
      {
        message: "Success",
        data: user,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
