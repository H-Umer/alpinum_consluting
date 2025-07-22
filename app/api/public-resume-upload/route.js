import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");
    const codes = formData.getAll("codes");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (!codes || codes.length !== files.length) {
      return NextResponse.json(
        { error: "Number of codes must match number of files" },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    // Process files in batches to avoid overwhelming the server
    const batchSize = 5;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchCodes = codes.slice(i, i + batchSize);

      const batchPromises = batch.map(async (file, index) => {
        try {
          const code = batchCodes[index];

          // Upload to AWS
          const protocol = request.headers.get("x-forwarded-proto") || "http";
          const host = request.headers.get("host");
          const baseUrl = `${protocol}://${host}`;

          const uploadFormData = new FormData();
          uploadFormData.append("file", file);

          const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
            method: "POST",
            body: uploadFormData,
          });

          const uploadResult = await uploadResponse.json();
          if (!uploadResponse.ok) {
            throw new Error(uploadResult.error || "Failed to upload file");
          }

          // Update database
          const updatedResume = await prisma.publicResume.update({
            where: { code: code },
            data: {
              resumeUrl: uploadResult.fileUrl,
            },
          });

          return {
            success: true,
            code: code,
            fileName: file.name,
            fileUrl: uploadResult.fileUrl,
            resume: updatedResume,
          };
        } catch (error) {
          return {
            success: false,
            code: batchCodes[index],
            fileName: file.name,
            error: error.message,
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches to avoid rate limiting
      if (i + batchSize < files.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    return NextResponse.json({
      message: `Processed ${files.length} files`,
      successful: successful.length,
      failed: failed.length,
      results: results,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
