/* eslint-disable @next/next/no-img-element */
"use client";

import { QRCodeSVG } from "qrcode.react";
import type { GoodStandingCertificate } from "../../_lib/certificateData";
import { toPrintableDate } from "../../_lib/certificateData";

type Props = {
  certificate: GoodStandingCertificate;
};

export function CertificateOfGoodStanding({ certificate }: Props) {
  return (
    <>
      <article className="certificate-paper mx-auto w-full bg-white shadow-[0_16px_48px_rgba(15,23,42,0.16)] print:shadow-none">
        <div className="certificate-sheet relative flex h-full min-h-full flex-col overflow-hidden border border-black/10 bg-white px-12 py-10 print:border-0 print:px-12 print:py-10">
          <header className="text-center">
            <img
              src="/coat-of-arms.svg"
              alt="Kenya coat of arms"
              className="mx-auto h-20 w-20 object-contain"
              draggable={false}
            />
            <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#7b1b1b]">
              OFFICE OF THE ATTORNEY-GENERAL
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7b1b1b]">
              STATE LAW OFFICE
            </div>
          </header>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <img
              src="/coat-of-arms.svg"
              alt="watermark"
              className="h-[360px] w-[360px] object-contain opacity-[0.08]"
              draggable={false}
            />
          </div>

          <div className="relative z-10 mt-5 flex justify-between text-[13px] leading-6 text-black/85">
            <div className="max-w-[68%]">
              <div className="font-mono text-[12px] text-black/70">
                REF: {certificate.reference}
              </div>
              <div className="mt-3 whitespace-pre-line text-[13px] leading-6 text-black/85">
                {certificate.type === "individual" ? (
                  <>
                    {certificate.advocateName}
                    {"\n"}
                    {certificate.advocateAddress}
                  </>
                ) : (
                  certificate.advocateAddress
                )}
              </div>
              {certificate.advocateEmail ? (
                <div className="mt-2 text-[12px] text-blue-700">
                  Email: {certificate.advocateEmail}
                </div>
              ) : null}
            </div>

            <div className="text-right text-[12px] text-black/80">
              DATE: {toPrintableDate(certificate.issuedOn)}
            </div>
          </div>

          <hr className="relative z-10 my-4 border-black/20" />

          <div className="relative z-10 text-center">
            <div className="text-[19px] font-semibold uppercase tracking-[0.06em] text-black/90">
              CERTIFICATE OF GOOD STANDING
            </div>
            {certificate.type === "individual" ? (
              <>
                <div className="mt-2 text-[14px] font-semibold text-[#7b1b1b]">
                  {certificate.advocateName}
                </div>
                <div className="mt-1 text-[12px] font-medium tracking-wide text-[#7b1b1b]">
                  ADMISSION NUMBER - {certificate.rollNumber}
                </div>
              </>
            ) : (
              <>
                <div className="mt-2 text-[14px] font-semibold text-[#7b1b1b]">
                  {certificate.firmName}
                </div>
                {/* <div className="mt-2 text-[12px] text-[#7b1b1b]">
                  Advocates in Good Standing
                </div> */}
              </>
            )}
          </div>

          <hr className="relative z-10 my-4 border-black/20" />

          <div className="relative z-10 space-y-5 text-[13px] leading-7 text-black/80">
            {certificate.type === "individual" ? (
              <p>
                This is to certify that the above-named Advocate is in good
                standing, and that there are no pending complaint/s against them
                before the Commission.
              </p>
            ) : (
              <>
                <p>
                  This is to certify that the advocates listed below are in good
                  standing and that there are no pending complaint/s against
                  them before the Commission.
                </p>

                {/* Law Firm Advocates Table */}
                {certificate.advocatesInFirm &&
                  certificate.advocatesInFirm.length > 0 && (
                    <div className="mt-3 text-[14px]">
                      <table className="w-full border border-black">
                        <thead>
                          <tr className="border-b border-black">
                            <th className="border-r border-black px-2 w-1/12 py-2 text-left font-bold uppercase text-black font-bold">
                              S/No.
                            </th>
                            <th className="border-r border-black px-2 py-2 text-left font-semibold uppercase text-black">
                              Advocate&apos;s Name
                            </th>
                            <th className="px-2 py-2 text-left font-semibold uppercase text-black">
                              Admission No.
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {certificate.advocatesInFirm.map((advocate, idx) => (
                            <tr
                              key={idx}
                              className="capitalize text-[14px] border-b border-black font-semibold"
                            >
                              <td className="border-r border-black px-2 py-1.5 text-black">
                                {idx + 1}.
                              </td>
                              <td className="border-r border-black px-2 py-1.5 text-black">
                                {advocate.advocateName}
                              </td>
                              <td className="px-2 py-1.5 text-black">
                                {advocate.rollNumber}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
              </>
            )}
          </div>

          <div className="relative z-10 mt-auto pt-8">
            <div className="flex items-start justify-between gap-6">
              <div className="max-w-[65%]">
                {certificate.signerSignature ? (
                  <img
                    src={certificate.signerSignature}
                    alt="signature"
                    className="h-16 object-contain"
                  />
                ) : (
                  <div className="mb-2 h-12 w-[260px] border-b border-black/40" />
                )}
                <div className="mt-1 text-[12px] font-bold uppercase text-black/85">
                  {certificate.signerName}
                </div>
                <div className="text-[12px] text-black/75">
                  {certificate.signerTitle}
                </div>
                <div className="text-[11px] text-black/60">
                  {certificate.signerDepartment}
                </div>
              </div>

              <div className="text-center">
                <div className="rounded border border-black/15 bg-white p-1.5">
                  <QRCodeSVG
                    value={certificate.qrToken}
                    size={96}
                    level="M"
                    fgColor="#111111"
                  />
                </div>
                <div className="mt-1 text-[10px] text-black/60">
                  Verify Certificate
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-black/55 pt-2">
              <div className="text-center text-[11px] font-semibold text-[#7b1b1b]">
                ADVOCATES COMPLAINTS COMMISSION
              </div>
              <div className="text-center text-[9px] text-black/70">
                COOPERATIVE BANK HOUSE, 20TH FLOOR, HAILE SELASSIE AVENUE
              </div>
              <div className="text-center text-[9px] text-black/70">
                P.O Box 48048-00100, NAIROBI, KENYA. TEL: +254 20
                2224029/2240337/0700072929/0732529995
              </div>
              <div className="text-center text-[9px] text-black/70">
                EMAIL: acc@ag.go.ke WEBSITE: www.acc.go.ke
              </div>
              <div className="mt-1 border-t border-black/45 pt-1 text-[9px] text-black/55">
                Verification token:{" "}
                <span className="font-mono">{certificate.qrToken}</span>
              </div>
              <div className="mt-2 border-t border-black/10 pt-2 text-center text-[9px] italic text-black/55">
                Disclaimer: This certificate is only valid as of the date of
                issue ({toPrintableDate(certificate.issuedOn)}).
              </div>
            </div>
          </div>
        </div>
      </article>

      <style>{`
        .certificate-paper {
          width: 210mm;
          min-height: 297mm;
        }

        .certificate-sheet {
          min-height: 297mm;
        }

        @media screen {
          .certificate-paper {
            width: min(100%, 210mm);
            margin: 0 auto;
            box-sizing: border-box;
          }

          .certificate-sheet {
            min-height: auto;
          }
        }

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

            html,
            body {
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              background: #fff;
              overflow: hidden !important;
              scrollbar-width: none !important;
            }

            img {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .certificate-paper,
            .certificate-sheet {
              width: 210mm !important;
              min-height: 297mm !important;
              margin: 0 !important;
              box-shadow: none !important;
              overflow: visible !important;
            }
        }
      `}</style>
    </>
  );
}
