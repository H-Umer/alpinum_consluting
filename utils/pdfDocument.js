import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const mergePDFWithSignature = async (pdfUrl, signatureDataURL, date, contractorName) => {
  try {
    const pdfResponse = await fetch(pdfUrl);
    const pdfBytes = await pdfResponse.arrayBuffer();

    const pdfDoc = await PDFDocument.load(pdfBytes);

    const signatureImage = await pdfDoc.embedPng(signatureDataURL);

    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 2];

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 10;

    lastPage.drawImage(signatureImage, {
      x: 120,
      y: 340,
      width: 80,
      height: 40,
    });

    lastPage.drawText(contractorName || "N/A", {
      x: 148,
      y: 326,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    lastPage.drawText(date || "N/A", {
      x: 120,
      y: 306,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    const modifiedPdfBytes = await pdfDoc.save();
    return new Blob([modifiedPdfBytes], { type: "application/pdf" });
  } catch (error) {
    console.error("Error adding signature to PDF:", error);
    throw error;
  }
};
