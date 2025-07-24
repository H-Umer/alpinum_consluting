import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const PREVIEWABLE_TYPES = {
  "image/jpeg": true,
  "image/png": true,
  "image/gif": true,
  "image/webp": true,
};

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

export async function POST(req) {
  // Authentication check
  const authHeader = req.headers.get("authorization");
  const decoded = verifyToken(authHeader);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const teamDataRaw = formData.get("teamData");
  const file = formData.get("teamImage");

  if (!teamDataRaw) {
    return NextResponse.json(
      { error: "No team data provided" },
      { status: 400 }
    );
  }

  // Parse the team data
  const teamData = JSON.parse(teamDataRaw);
  const { name, description, members, projectType } = teamData;

  console.log("Received team data:", teamData);
  try {
    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name, description, and project type are required" },
        { status: 400 }
      );
    }

    if (!members || !Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        { error: "At least one team member is required" },
        { status: 400 }
      );
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

    // Handle image upload if present
    let imageUrl = null;
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

    // Create the team
    const newTeam = await prisma.team.create({
      data: {
        name,
        description,
        logoUrl: imageUrl, // Create relations for existing members
        projectType,
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

    return NextResponse.json(
      {
        message: "Team created successfully",
        team: newTeam,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Team creation error:", error);
    return NextResponse.json(
      {
        error: "Failed to create team",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      orderBy: { createdAt: "desc" },
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

    return NextResponse.json({ teams }, { status: 200 });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams", details: error.message },
      { status: 500 }
    );
  }
}
