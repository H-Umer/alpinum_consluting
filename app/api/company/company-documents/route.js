import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { verifyAuthToken } from "@/utils/verifyAuthToken";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const authtoken = request.headers.get("Authorization");

    if (!authtoken) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const tokenDetails = verifyAuthToken(authtoken);
    if (!tokenDetails) {
      return NextResponse.json({
        message: "UnAuthorized User",
      });
    }

    const file = formData.get("file");
    const contractorId = formData.get("contractorId");
    // const documentType = formData.get("documentType");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const companyDocument = new FormData();
    companyDocument.append("file", file);

    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host");
    const baseUrl = `${protocol}://${host}`;

    const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      body: companyDocument,
    });

    const uploadResult = await uploadResponse.json();

    if (!uploadResponse.ok) {
      return NextResponse.json({
        error: uploadResult.error,
      });
    }

    await prisma.jobContract.create({
      data: {
        companyId: tokenDetails.userId,
        contractorId: contractorId,
        contractDocument: uploadResult.fileUrl,
        contractorId: contractorId,
        status: "PENDING", // or we can skip this colume when the user create first jobContract its byDefault status will be pending
      },
    });

    return NextResponse.json(
      { status: "success", message: "Job Offer Create Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
