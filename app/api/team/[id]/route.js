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

// export async function GET(req, { params }) {
//   try {
//     // Get team ID from params
//     const { id } = params;

//     console.log("Fetching team details for ID:", id);

//     // Fetch specific team with all related data
//     const team = await prisma.team.findUnique({
//       where: { id: id },
//     });

//     // console.log("Fetched team details:", team);

//     const teamMembers = await prisma.teamMember.findMany({
//       where: { teamId: id },
//     });

//     // console.log("Fetched team members:", teamMembers);
//     // Check if team exists
//     if (!team) {
//       return NextResponse.json({ error: "Team not found" }, { status: 404 });
//     }

//     if (!teamMembers) {
//       return NextResponse.json(
//         { error: "team members not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       team,
//       teamMembers,
//     });
//   } catch (error) {
//     console.error("Error fetching team details:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to fetch team details",
//         details: error.message,
//       },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }

export async function GET(req, { params }) {
  try {
    // Get team ID from params
    const { id } = params;

    console.log("Fetching team details for ID:", id);

    // Fetch specific team with all related data
    const team = await prisma.team.findUnique({
      where: { id: id },
    });

    console.log("Fetched team detailssssssssssss:", team);

    const teamMembers = await prisma.teamMember.findMany({
      where: { teamId: id },
      include: {
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

    console.log("Fetched team members:", teamMembers);
    // Check if team exists
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    if (!teamMembers) {
      return NextResponse.json(
        { error: "team members not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      team,
      teamMembers,
    });
  } catch (error) {
    console.error("Error fetching team details:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch team details",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
