import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // Step 1: Delete related team members
    await prisma.teamMember.deleteMany({
      where: {
        teamId: id,
      },
    });

    // Step 2: Delete the team
    const deletedTeam = await prisma.team.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Team deleted successfully",
        deletedTeam,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error while deleting the team:", error);

    return NextResponse.json(
      {
        message: "Server Error while deleting the team",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req, { params }) {
  const { id } = params;
  // console.log("iddddddddddd", id);

  try {
    const team = await prisma.team.findUnique({ where: { id: id } });
    const teamMembers = await prisma.teamMember.findMany({
      where: { teamId: id },
      include: {
        user: true,
      },
    });
    console.log({ team });

    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({ team, teamMembers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching team details:", error);

    return NextResponse.json(
      {
        message: "Server error while fetching team details",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
