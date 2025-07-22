import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { verifyAuthToken } from "@/utils/verifyAuthToken";

export async function GET(request) {
  try {
    const authtoken = request.headers.get("Authorization");

    if (!authtoken) {
      const PublicResumes = await prisma.publicResume.findMany({
        orderBy: { uploadedAt: "desc" },
        select: {
          id: true,
          code: true,
          designation: true,
          experience: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: PublicResumes,
        total: PublicResumes.length,
      });
    }

    // Token present → verify
    let tokenDetails;
    try {
      tokenDetails = verifyAuthToken(authtoken);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check user exists
    const user = await prisma.user.findFirst({
      where: { id: tokenDetails.userId },
    });

    if (!user || user.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // User is a COMPANY → show full data
    const CompanyResumes = await prisma.publicResume.findMany({
      orderBy: { uploadedAt: "desc" },
      select: {
        id: true,
        code: true,
        designation: true,
        experience: true,
        resumeUrl: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: CompanyResumes,
      total: CompanyResumes.length,
    });
  } catch (error) {
    console.error("Error fetching public resumes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { resumes } = body;

    if (!resumes || !Array.isArray(resumes)) {
      return NextResponse.json({ error: "Resumes array is required" }, { status: 400 });
    }

    const results = [];
    const errors = [];

    for (const resume of resumes) {
      try {
        if (!resume.code) {
          errors.push({
            code: resume.code || "UNKNOWN",
            error: "Code is required",
          });
          continue;
        }

        const existingResume = await prisma.publicResume.findUnique({
          where: {
            code: resume.code,
          },
        });

        if (existingResume) {
          errors.push({
            code: resume.code,
            error: "Resume with this code already exists",
          });
          continue;
        }

        const resumeData = {
          code: resume.code,
          designation: resume.designation || null,
          objective: resume.objective || null,
          summary: Array.isArray(resume.summary) ? resume.summary : [],
          experience:
            typeof resume.experience === "number"
              ? resume.experience.toString()
              : typeof resume.experience === "string"
              ? resume.experience
              : null,
          skills: Array.isArray(resume.skills) ? resume.skills : [],
          techniques: Array.isArray(resume.techniques) ? resume.techniques : [],
          tools: Array.isArray(resume.tools) ? resume.tools : [],
          education: Array.isArray(resume.education) ? resume.education : [],
          methodologies: Array.isArray(resume.methodologies) ? resume.methodologies : [],
        };

        const createdResume = await prisma.publicResume.create({
          data: resumeData,
        });

        results.push({
          code: resume.code,
          id: createdResume.id,
          status: "created",
        });
      } catch (error) {
        console.error(`Error processing resume ${resume.code}:`, error);
        errors.push({
          code: resume.code || "UNKNOWN",
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${resumes.length} resumes`,
      results: {
        created: results.length,
        errors: errors.length,
        details: {
          successful: results,
          failed: errors,
        },
      },
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
