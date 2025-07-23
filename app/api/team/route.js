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

// Helper function to upload file to S3
async function uploadFileToS3(file, fileName) {
  const buffer = Buffer.from(await file.arrayBuffer());
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
  return result.Location;
}

export async function POST(req) {
  try {
    // Authentication check
    const authHeader = req.headers.get("authorization");
    const decoded = verifyToken(authHeader);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const teamDataRaw = formData.get("teamData");
    const teamImageFile = formData.get("teamImage");

    if (!teamDataRaw) {
      return NextResponse.json(
        { error: "No team data provided" },
        { status: 400 }
      );
    }

    // Parse the raw team data
    const teamData = JSON.parse(teamDataRaw);
    const { name, description, members } = teamData;

    console.log("Received team data:", teamData);

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    // Validate members
    if (!members || !Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        { error: "At least one team member is required" },
        { status: 400 }
      );
    }

    // Handle team logo upload
    let teamLogoUrl = null;
    if (teamImageFile && typeof teamImageFile.arrayBuffer === "function") {
      const fileName = `team-logos/${uuidv4()}-${teamImageFile.name}`;
      teamLogoUrl = await uploadFileToS3(teamImageFile, fileName);
    }

    // Process member images
    const processedMembers = [];

    for (const member of members) {
      let memberImageUrl = null;

      // Check if there's an image for this member
      if (member.id) {
        const memberImageFile = formData.get(`memberImage_${member.id}`);
        if (
          memberImageFile &&
          typeof memberImageFile.arrayBuffer === "function"
        ) {
          const fileName = `member-photos/${uuidv4()}-${memberImageFile.name}`;
          memberImageUrl = await uploadFileToS3(memberImageFile, fileName);
        }
      }

      processedMembers.push({
        name: member.name,
        specialization: member.specialization,
        email: member.email || null,
        imageUrl: memberImageUrl,
      });
    }

    // Create the team with members
    const newTeam = await prisma.team.create({
      data: {
        name,
        description,
        // specialization: specialization || null,
        // projectType: projectType || null,
        logoUrl: teamLogoUrl,
        members: {
          create: processedMembers,
        },
      },
      include: {
        members: true,
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
    console.error("Team API error:", error);
    return NextResponse.json(
      {
        error: "Failed to create team",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req) {
  try {
    // Authentication check
    const authHeader = req.headers.get("authorization");
    const decoded = verifyToken(authHeader);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all teams with their members
    const teams = await prisma.team.findMany({
      include: {
        members: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      teams,
    });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch teams",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
