import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import type { GoodStandingCertificate } from "../../_lib/certificateData";
import { toPrintableDate } from "../../_lib/certificateData";

type PdfExportOptions = {
  fileName: string;
};

function drawWrappedText(
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight = 5,
) {
  const lines = pdf.splitTextToSize(text, maxWidth) as string[];
  pdf.text(lines, x, y);
  return y + lines.length * lineHeight;
}

async function buildCertificatePdf(certificate: GoodStandingCertificate) {
  const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();

  pdf.setProperties({
    title: `Certificate of Good Standing - ${certificate.certificateNo}`,
    subject: "Certificate of Good Standing",
    author: "Advocates Complaints Commission",
    creator: "Advocate Good Standing Platform",
  });

  pdf.setTextColor(123, 27, 27);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("OFFICE OF THE ATTORNEY-GENERAL", pageWidth / 2, 16, {
    align: "center",
  });
  pdf.setFontSize(10);
  pdf.text("STATE LAW OFFICE", pageWidth / 2, 21, { align: "center" });

  pdf.setTextColor(17, 17, 17);
  pdf.setFont("courier", "normal");
  pdf.setFontSize(11);
  pdf.text(`REF: ${certificate.reference}`, 14, 34);
  pdf.text(
    `DATE: ${toPrintableDate(certificate.issuedOn)}`,
    pageWidth - 14,
    34,
    {
      align: "right",
    },
  );
  pdf.setDrawColor(0, 0, 0);
  pdf.line(14, 40, pageWidth - 14, 40);

  pdf.setTextColor(17, 17, 17);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("CERTIFICATE OF GOOD STANDING", pageWidth / 2, 52, {
    align: "center",
  });

  pdf.setTextColor(123, 27, 27);
  pdf.setFontSize(11);
  if (certificate.type === "individual") {
    pdf.text(
      certificate.advocateName || "Unnamed advocate",
      pageWidth / 2,
      60,
      {
        align: "center",
      },
    );
    pdf.setFont("helvetica", "bold");
    pdf.text(
      `ADMISSION NUMBER - ${certificate.rollNumber || "-"}`,
      pageWidth / 2,
      66,
      {
        align: "center",
      },
    );
  } else {
    pdf.text(certificate.firmName || "Unnamed institution", pageWidth / 2, 60, {
      align: "center",
    });
  }

  pdf.setDrawColor(0, 0, 0);
  pdf.line(14, 73, pageWidth - 14, 73);

  pdf.setTextColor(17, 17, 17);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);

  let cursorY = 84;
  const leftX = 14;
  const labelWidth = 18;
  const valueX = leftX + labelWidth;
  const valueWidth = 182 - labelWidth;

  pdf.setFont("helvetica", "bold");
  pdf.text("Entity:", leftX, cursorY);
  pdf.setFont("helvetica", "normal");
  cursorY = drawWrappedText(
    pdf,
    certificate.type === "individual"
      ? [certificate.advocateName, certificate.advocateAddress]
          .filter(Boolean)
          .join("\n")
      : certificate.advocateAddress,
    valueX,
    cursorY,
    valueWidth,
    5,
  );
  cursorY += 4;

  if (certificate.advocateEmail) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Email:", leftX, cursorY);
    pdf.setFont("helvetica", "normal");
    cursorY = drawWrappedText(
      pdf,
      certificate.advocateEmail,
      valueX,
      cursorY,
      valueWidth,
      5,
    );
    cursorY += 4;
  }

  pdf.setFontSize(12);
  if (certificate.type === "individual") {
    cursorY = drawWrappedText(
      pdf,
      "This is to certify that the above-named Advocate is in good standing, and that there are no pending complaint/s against them before the Commission.",
      leftX,
      cursorY,
      182,
      6,
    );
  } else {
    cursorY = drawWrappedText(
      pdf,
      "This is to certify that the advocates listed below are in good standing and that there are no pending complaint/s against them before the Commission.",
      leftX,
      cursorY,
      182,
      6,
    );

    cursorY += 4;
    const advocates = certificate.advocatesInFirm || [];
    const tableHeight = Math.max(18, advocates.length * 8 + 8);
    pdf.setFontSize(10);
    pdf.rect(leftX, cursorY, 182, tableHeight);
    pdf.line(leftX + 12, cursorY, leftX + 12, cursorY + tableHeight);
    pdf.line(leftX + 95, cursorY, leftX + 95, cursorY + tableHeight);
    pdf.setFont("helvetica", "bold");
    pdf.text("S/No.", leftX + 2, cursorY + 6);
    pdf.text("Advocate's Name", leftX + 16, cursorY + 6);
    pdf.text("Admission No.", leftX + 97, cursorY + 6);
    pdf.setFont("helvetica", "normal");
    let rowY = cursorY + 12;
    advocates.forEach((advocate, index) => {
      pdf.line(leftX, rowY + 2, leftX + 182, rowY + 2);
      pdf.text(String(index + 1), leftX + 2, rowY);
      const nameLines = pdf.splitTextToSize(
        advocate.advocateName || "-",
        74,
      ) as string[];
      const rollLines = pdf.splitTextToSize(
        advocate.rollNumber || "-",
        80,
      ) as string[];
      pdf.text(nameLines, leftX + 16, rowY);
      pdf.text(rollLines, leftX + 97, rowY);
      rowY += 8;
    });
    cursorY += tableHeight + 4;
  }

  pdf.setFontSize(11);
  pdf.text(certificate.signerName, 14, 245);
  pdf.setFont("helvetica", "bold");
  pdf.text(certificate.signerTitle, 14, 251);
  pdf.setFont("helvetica", "normal");
  pdf.text(certificate.signerDepartment, 14, 257);

  const qrDataUrl = await QRCode.toDataURL(certificate.qrToken, {
    margin: 1,
    width: 192,
    errorCorrectionLevel: "M",
    color: { dark: "#111111", light: "#ffffff" },
  });
  pdf.setDrawColor(220, 220, 220);
  pdf.rect(pageWidth - 35, 236, 24, 24);
  pdf.addImage(qrDataUrl, "PNG", pageWidth - 34, 237, 22, 22);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(90, 90, 90);
  pdf.text("Verify Certificate", pageWidth - 23, 264, { align: "center" });

  pdf.text("ADVOCATES COMPLAINTS COMMISSION", pageWidth / 2, 275, {
    align: "center",
  });
  pdf.text(
    "COOPERATIVE BANK HOUSE, 20TH FLOOR, HAILE SELASSIE AVENUE",
    pageWidth / 2,
    280,
    {
      align: "center",
    },
  );
  pdf.text(
    "P.O Box 48048-00100, NAIROBI, KENYA. TEL: +254 20 2224029/2240337/0700072929/0732529995",
    pageWidth / 2,
    285,
    { align: "center" },
  );
  pdf.text("EMAIL: acc@ag.go.ke WEBSITE: www.acc.go.ke", pageWidth / 2, 290, {
    align: "center",
  });

  return pdf.output("blob");
}

export async function saveCertificateAsPdf(
  certificate: GoodStandingCertificate,
  options: PdfExportOptions,
) {
  const blob = await buildCertificatePdf(certificate);

  if ("showSaveFilePicker" in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: options.fileName,
        types: [
          {
            description: "PDF document",
            accept: { "application/pdf": [".pdf"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch {
      return;
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = options.fileName;
  link.rel = "noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
