import { NextResponse } from "next/server";
import { parseResumeData } from "@/utils/parseResume";
import mammoth from "mammoth";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume");

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "Resume File Is Required!" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { value: text } = await mammoth.extractRawText({ buffer });

    const parsed = parseResumeData(text);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Parsing error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
