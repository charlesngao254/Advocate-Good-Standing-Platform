"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CertificateOfGoodStanding } from "../../_components/CertificateOfGoodStanding";
import { saveCertificateAsPdf } from "../../_components/pdfExport";
import type { GoodStandingCertificate } from "../../../_lib/certificateData";

function makeSafeFileName(input: string) {
  return input
    .replace(/[<>:"/\\|?*\x00-\x1F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getRecipientEmail(certificate: GoodStandingCertificate) {
  return certificate.advocateEmail.trim();
}

function buildMailtoLink(certificate: GoodStandingCertificate) {
  const recipient = getRecipientEmail(certificate);
  if (!recipient) return "";

  const subject = encodeURIComponent(
    `Certificate of Good Standing - ${certificate.certificateNo}`,
  );
  const body = encodeURIComponent(
    `Hello,\n\nPlease find the Certificate of Good Standing details below:\n\nCertificate No: ${certificate.certificateNo}\nEntity: ${certificate.type === "individual" ? certificate.advocateName : certificate.firmName}\nIssued On: ${certificate.issuedOn}\nValid Until: ${certificate.validUntil}\nReference: ${certificate.reference}\n\nOpen the certificate page to print or save it as PDF.\n\nRegards,\nAdvocates Complaints Commission`,
  );

  return `mailto:${encodeURIComponent(recipient)}?subject=${subject}&body=${body}`;
}

export default function ViewCertificatePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const certNo = params.certNo as string;
  const [certificate, setCertificate] =
    useState<GoodStandingCertificate | null>(null);
  const [loading, setLoading] = useState(true);
  const autoPrintedRef = useRef(false);

  useEffect(() => {
    const shouldAutoPrint = searchParams.get("print") === "1";
    if (!certificate || !shouldAutoPrint || autoPrintedRef.current) return;

    autoPrintedRef.current = true;
    const timeoutId = window.setTimeout(() => {
      window.print();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [certificate, searchParams]);

  useEffect(() => {
    if (!certificate) return;

    const originalTitle = document.title;
    const nextTitle = makeSafeFileName(
      `${certificate.advocateName} - ${certificate.certificateNo}`,
    );

    document.title = nextTitle;

    const handleBeforePrint = () => {
      document.title = nextTitle;
    };

    window.addEventListener("beforeprint", handleBeforePrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      document.title = originalTitle;
    };
  }, [certificate]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("issuedCertificates");
      if (raw) {
        const certificates = JSON.parse(raw) as GoodStandingCertificate[];
        const found = certificates.find((c) => c.certificateNo === certNo);
        // This state mirrors localStorage for the current certificate view.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCertificate(found || null);
      }
    } catch (e) {
      console.error("Error reading certificate:", e);
    }
    setLoading(false);
  }, [certNo]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mb-4 inline-flex h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
          <p className="text-sm text-black/60">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-black/80">
            Certificate not found
          </h1>
          <p className="mt-2 text-black/60">
            The certificate you&apos;re looking for doesn&apos;t exist or has
            been removed.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  function handlePrint() {
    window.print();
  }

  async function handleDownloadPdf() {
    await saveCertificateAsPdf(certificate, {
      fileName: `${certificate.certificateNo}.pdf`,
    });
  }

  function handleEmailCertificate() {
    const mailto = buildMailtoLink(certificate);
    if (!mailto) return;
    window.location.href = mailto;
  }

  return (
    <div className="-m-6 min-h-[calc(100dvh-3rem)] overflow-x-hidden bg-slate-50/80 p-6 print:m-0 print:bg-white print:p-0">
      <div className="mx-auto max-w-[1100px]">
        {/* Non-Print Controls */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <button
            onClick={() => router.back()}
            className="rounded-lg border border-black/10 bg-white px-3 py-2 text-[13px] text-black/75 hover:bg-black/2"
          >
            ← Back
          </button>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleEmailCertificate}
              disabled={!getRecipientEmail(certificate)}
              className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-[13px] font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:border-black/10 disabled:bg-black/5 disabled:text-black/35"
            >
              Dispatch via Email
            </button>
            <button
              onClick={handleDownloadPdf}
              className="rounded-lg bg-slate-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-slate-800"
            >
              Save PDF
            </button>
            <button
              onClick={handlePrint}
              className="rounded-lg border border-black/10 bg-white px-4 py-2 text-[13px] text-black/75 hover:bg-black/2"
            >
              Print
            </button>
          </div>
        </div>

        {/* Certificate */}
        <div className="mx-auto w-full max-w-full overflow-hidden certificate-printable">
          <CertificateOfGoodStanding certificate={certificate} />
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

            * {
              scrollbar-width: none !important;
            }

            *::-webkit-scrollbar {
              display: none !important;
            }

            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              overflow: hidden !important;
              width: 210mm !important;
              height: 297mm !important;
              scrollbar-width: none !important;
            }

            .print\\:hidden {
              display: none !important;
            }

            .certificate-printable,
            .mx-auto {
              width: 210mm !important;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              overflow: visible !important;
            }
        }
      `}</style>
    </div>
  );
}
