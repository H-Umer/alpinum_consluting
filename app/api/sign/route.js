import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/utils/verifyAuthToken";
import prisma from "@/utils/prisma";

export async function POST(request) {
  try {
    const authtoken = request.headers.get("Authorization");

    if (!authtoken) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const tokenDetails = verifyAuthToken(authtoken);

    if (!tokenDetails) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const formData = await request.formData();
    const signedContract = formData.get("signedContract");
    const contractId = formData.get("contractId");

    let pdfFile;

    if (signedContract) {
      const pdfFileStore = new FormData();
      pdfFileStore.append("file", signedContract);

      const protocol = request.headers.get("x-forwarded-proto") || "http";
      const host = request.headers.get("host");
      const baseUrl = `${protocol}://${host}`;

      const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        body: pdfFileStore,
      });

      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || "Failed to upload resume");
      }

      pdfFile = uploadResult.fileUrl;
    }

    await prisma.jobContract.update({
      where: { id: contractId },
      data: {
        status: "ACCEPTED",
        signedDocument: pdfFile,
      },
    });

    return NextResponse.json(
      {
        message: "Contract Accepted Successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
