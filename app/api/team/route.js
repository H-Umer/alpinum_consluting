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
  try {
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

    // Parse the raw team data
    const teamData = JSON.parse(teamDataRaw);
    const { name, description, projectType, members } = teamData;

    // Validate required fields
    if (!name || !description || !projectType) {
      return NextResponse.json(
        { error: "Name, description, and project type are required" },
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

    // Separate existing and manual members
    const existingMembers = members.filter((m) => m.type === "existing");
    const manualMembers = members.filter((m) => m.type === "manual");

    // Validate existing members
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
        const missingUsers = existingUserIds.filter(
          (id) => !existingUsers.some((user) => user.id === id)
        );
        return NextResponse.json(
          {
            error:
              "One or more selected users don't exist or aren't contractors",
            missingUsers,
          },
          { status: 400 }
        );
      }
    }

    // Handle file upload if present
    let imageUrl = null;
    if (file && typeof file.arrayBuffer === "function") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${uuidv4()}-${file.name}`;
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

    // Create the team with all members
    const newTeam = await prisma.team.create({
      data: {
        name,
        description,
        projectType,
        logoUrl: imageUrl,
        NewTeamMembers: manualMembers, // Store manual members in JSON field
        members: {
          create: existingMembers.map((member) => ({
            userId: member.contractorId,
            joinedAt: new Date(),
          })),
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
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
    console.error("Team API error:", error);
    return NextResponse.json(
      {
        error: "Failed to create team",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// export async function GET(req) {
//   try {
//     // Authentication check
//     const authHeader = req.headers.get("authorization");
//     const decoded = verifyToken(authHeader);
//     if (!decoded) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // 🔄 CHANGED: Use 'members' instead of 'teamMembers' for the include
//     const teams = await prisma.team.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },
//       include: {
//         members: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 firstName: true,
//                 lastName: true,
//                 email: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     return NextResponse.json({ teams }, { status: 200 });
//   } catch (error) {
//     console.error("GET /api/team error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch teams" },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        members: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
    console.log("teamsteamsteams", teams);

    return NextResponse.json({ teams: teams }, { status: 200 });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams", details: error.message },
      { status: 500 }
    );
  }
}
