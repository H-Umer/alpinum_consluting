import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/utils/verifyAuthToken";
import { jsPDF } from "jspdf";

export async function POST(request) {
  try {
    const authtoken = request.headers.get("Authorization");
    const tokenDetails = verifyAuthToken(authtoken);

    if (!tokenDetails) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const body = await request.json();
    const { courseName, userName } = body;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(30);
    doc.text("Certificate of Completion", pageWidth / 2, 40, "center");

    doc.setFontSize(18);
    doc.text("This is to certify that", pageWidth / 2, 80, "center");

    doc.setFontSize(24);
    doc.text(userName + " (" + tokenDetails?.email + ")", pageWidth / 2, 100, "center");

    doc.setFontSize(18);
    doc.text("has successfully completed the course", pageWidth / 2, 120, "center");

    doc.setFontSize(24);
    doc.text(courseName, pageWidth / 2, 140, "center");

    doc.setFontSize(14);
    doc.text(`Completion Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 170, "center");

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=certificate-${courseName}.pdf`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 });
  }
}
