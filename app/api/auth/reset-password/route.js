import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const body = await request.json();
    const { password, confirmPassword, token } = body;

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords Do Not Match!" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetPassToken: token,
      },
    });

    if (!user?.resetPassToken) {
      return NextResponse.json({ error: "Invalid Password Reset Token!" }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ error: "User Not Found. Please Try Again!" }, { status: 400 });
    }

    const hashpassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPassToken: null,
        tokenExpire: null,
        password: hashpassword,
      },
    });

    return NextResponse.json(
      {
        message: "Password Reset Successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
