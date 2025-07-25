import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuthToken } from "@/utils/verifyAuthToken";

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

export async function PUT(req, { params }) {
  const authHeader = req.headers.get("authorization");
  const decoded = verifyAuthToken(authHeader);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("1-decodedddddddddddddddddddd", decoded);

  try {
    const formData = await req.formData();
    console.log("formData", formData);
    const teamDataRaw = formData.get("teamData");
    const file = formData.get("teamImage");

    if (!teamDataRaw) {
      return NextResponse.json(
        { error: "No team data provided" },
        { status: 400 }
      );
    }

    const teamData = JSON.parse(teamDataRaw);
    const { name, description, members, projectType } = teamData;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    if (!members || !Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        { error: "At least one team member is required" },
        { status: 400 }
      );
    }

    // Check if team exists
    const existingTeam = await prisma.team.findUnique({
      where: { id: params.id },
      include: {
        teamMembers: true,
      },
    });

    if (!existingTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Handle image upload if present
    let imageUrl = existingTeam.logoUrl; // Keep existing image by default
    if (file && typeof file.arrayBuffer === "function") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `team-logos/${uuidv4()}-${file.name}`;
      const contentDisposition = PREVIEWABLE_TYPES[file.type]
        ? "inline"
        : "attachment";

      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
          ACL: "public-read",
          ContentDisposition: contentDisposition,
        },
      });

      const result = await upload.done();
      imageUrl = result.Location;
    }

    // Separate existing and manual members
    const existingMembers = members.filter((m) => m.type === "existing");

    // Validate existing members exist in database
    if (existingMembers.length > 0) {
      const existingUserIds = existingMembers.map((m) => m.contractorId);
      const existingUsers = await prisma.user.findMany({
        where: {
          id: { in: existingUserIds },
          role: "CONTRACTOR",
        },
        select: { id: true },
      });

      if (existingUsers.length !== existingUserIds.length) {
        return NextResponse.json(
          { error: "One or more selected contractors don't exist" },
          { status: 400 }
        );
      }
    }

    // Update team using transaction
    const updatedTeam = await prisma.$transaction(async (tx) => {
      // Delete existing team members
      await tx.teamMember.deleteMany({
        where: { teamId: params.id },
      });

      // Update team and create new team members
      const team = await tx.team.update({
        where: { id: params.id },
        data: {
          name,
          description,
          projectType,
          logoUrl: imageUrl,
          teamMembers: {
            create: existingMembers.map((member) => ({
              userId: member.contractorId,
              joinedAt: new Date(),
            })),
          },
        },
        include: {
          teamMembers: {
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
          },
        },
      });

      return team;
    });

    return NextResponse.json(
      {
        message: "Team updated successfully",
        team: updatedTeam,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Team update error:", error);
    return NextResponse.json(
      {
        error: "Failed to update team",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
