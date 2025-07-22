import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, confirmPassword, companyName, userRole } = body;

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords Do Not Match!" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email Already Registered! Please Try another Account" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let user;

    if (userRole === "COMPANY") {
      if ((!companyName || !email, !password || !confirmPassword)) {
        return NextResponse.json({ error: "Necessary Fields Are Missing!" }, { status: 400 });
      }

      const existingCompany = await prisma.companyProfile.findUnique({
        where: {
          companyName: companyName,
        },
      });

      if (existingCompany) {
        return NextResponse.json(
          { error: "Company With This Name Already Registered!" },
          { status: 400 }
        );
      }

      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          role: userRole,
        },
      });
      if (user) {
        await prisma.companyProfile.create({
          data: {
            companyName: companyName,
            userId: user.id,
          },
        });
      }
    }

    if (userRole === "CONTRACTOR") {
      if ((!firstName || !lastName || !email, !password || !confirmPassword)) {
        return NextResponse.json({ error: "Necessary Fields Are Missing!" }, { status: 400 });
      }

      user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          connects: 50,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: userRole,
        },
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Account Created Successfully!",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
