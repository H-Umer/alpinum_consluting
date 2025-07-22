import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { NextResponse } from "next/server";

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
  "application/pdf": true,
  "text/plain": true,
  "text/html": true,
  "video/mp4": true,
  "video/webm": true,
  "audio/mpeg": true,
  "audio/wav": true,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": false,
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No File Provided!" }, { status: 400 });
    }

    let buffer;

    if (typeof file.arrayBuffer === "function") {
      buffer = Buffer.from(await file.arrayBuffer());
    } else if (typeof file.stream === "function") {
      const stream = file.stream();
      const chunks = [];

      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      buffer = Buffer.concat(chunks);
    } else {
      throw new Error("Unsupported file format");
    }

    const fileName = `${Date.now()}-${file.name}`;

    const contentDisposition = PREVIEWABLE_TYPES[file.type] ? "inline" : "attachment";

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

    return NextResponse.json({
      success: true,
      fileUrl: result.Location,
      isPreviewable: PREVIEWABLE_TYPES[file.type] || false,
    });
  } catch (error) {
    console.error("Uploading file error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
