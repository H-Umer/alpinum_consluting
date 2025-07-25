// pages/api/contractor-teams/update-status.ts (or .js)
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuthToken } from "@/utils/verifyAuthToken";

const prisma = new PrismaClient();

export async function PATCH(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const decoded = verifyAuthToken(authHeader);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // console.log("1-decoded", decoded);

    const { teamId, status } = await req.json();

    // console.log("2- teamId, status", teamId, status);

    if (!teamId || !status) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updated = await prisma.teamMember.updateMany({
      where: {
        teamId: teamId,
        userId: decoded.userId,
      },
      data: {
        isAccepted: status, // must match enum: "accepted" or "rejected"
      },
    });
    // console.log("3-updated", updated);

    if (updated.count === 0) {
      return NextResponse.json(
        { message: "No matching record found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Status updated successfully",
      updated,
    });
  } catch (error) {
    console.error("Error updating invitation status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
