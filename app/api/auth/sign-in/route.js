import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email And Password Are Required!" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
      include: {
        contractorProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid Email Or Password!" }, { status: 400 });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return NextResponse.json({ error: "Invalid Credentials!" }, { status: 400 });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    if (user.role === "COMPANY") {
      const company = await prisma.companyProfile.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (company) {
        userWithoutPassword.companyName = company.companyName;
      }
    }

    return NextResponse.json(
      {
        message: "Signed In Successfully!",
        user: userWithoutPassword,
        token,
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": [
            `token=${token}; Path=/; HttpOnly; Max-Age=${24 * 60 * 60}; SameSite=Strict`,
            `role=${user.role}; Path=/; HttpOnly; Max-Age=${24 * 60 * 60}; SameSite=Strict`,
          ],
        },
      }
    );
  } catch (error) {
    console.error("Sign-in error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
