import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { randomToken } from "@/utils/randomToken";
import { forgetPasswordMail } from "@/utils/generateEmail/forgetPassword";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email Is Required!" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      return NextResponse.json({ error: "No User Found With This Email!" }, { status: 400 });
    }

    const token = randomToken();
    const tokenExpire = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPassToken: token,
        tokenExpire: tokenExpire,
      },
    });

    await forgetPasswordMail({
      email: user.email,
      token,
    });

    return NextResponse.json(
      {
        message: "A Verification Code Has Been Sent To Your Email!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
