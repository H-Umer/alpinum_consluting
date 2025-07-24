import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Helper function to verify JWT token
function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function GET(req) {
  // Authentication check
  const authHeader = req.headers.get("authorization");
  const decoded = verifyToken(authHeader);
  //   console.log("Decoded JWT:", decoded);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const teams = await prisma.teamMember.findMany({
      where: { userId: decoded.userId },
      include: {
        team: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // console.log("Fetched teamsssssssssss:", teams);

    return NextResponse.json({ teams }, { status: 200 });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams", details: error.message },
      { status: 500 }
    );
  }
}
