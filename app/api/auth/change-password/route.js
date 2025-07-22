import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { verifyAuthToken } from "@/utils/verifyAuthToken";
import bcrypt from "bcrypt";

export async function POST(request) {
  const body = await request.json();
  const { currentPassword, newPassword, confirmPassword } = body;

  try {
    const authtoken = request.headers.get("Authorization");
    const tokenDetails = verifyAuthToken(authtoken);

    const { userId } = tokenDetails;

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User Does Not Exist!" }, { status: 400 });
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json({ error: "Current Password Is Incorrect!" }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Both Passwords Do Not Match!" }, { status: 400 });
    }

    const newGeneratedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: newGeneratedPassword,
      },
    });

    return NextResponse.json({ message: "Password Changed Successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
