"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  buildQrToken,
  generateCertificateNo,
  makeDefaultDraft,
  referenceFromCertificateNo,
  type AdvocateInLawFirm,
  type CertificateType,
  type GoodStandingCertificate,
  type GoodStandingReason,
} from "../../_lib/certificateData";
import { CertificateOfGoodStanding } from "./CertificateOfGoodStanding";
import { saveCertificateAsPdf } from "./pdfExport";

const PURPOSE_OPTIONS: GoodStandingReason[] = [
  "Practicing certificate renewal",
  "Employment / appointment",
  "Visa / immigration",
  "Foreign bar registration",
  "Tender / procurement",
  "Other",
];

type Props = {
  initial: GoodStandingCertificate;
};

function updateDraft(draft: GoodStandingCertificate): GoodStandingCertificate {
  return {
    ...draft,
    reference: referenceFromCertificateNo(draft.certificateNo),
    qrToken: buildQrToken(draft.certificateNo, draft.rollNumber),
  };
}

function dedupeCertificates(
  certificates: GoodStandingCertificate[],
): GoodStandingCertificate[] {
  const seen = new Set<string>();
  const deduped: GoodStandingCertificate[] = [];

  for (const certificate of certificates) {
    if (seen.has(certificate.certificateNo)) continue;
    seen.add(certificate.certificateNo);
    deduped.push(certificate);
  }

  return deduped;
}

function getNextCertificateSequence(certificates: GoodStandingCertificate[]) {
  const currentYear = new Date().getFullYear();

  const highestSequence = certificates.reduce((highest, certificate) => {
    const match = /^ACC-CGS-(\d{4})-(\d+)$/.exec(certificate.certificateNo);
    if (!match) return highest;

    const year = Number(match[1]);
    const sequence = Number(match[2]);
    if (year !== currentYear || !Number.isFinite(sequence)) return highest;

    return Math.max(highest, sequence);
  }, 0);

  return highestSequence + 1;
}

function getRecipientEmail(certificate: GoodStandingCertificate) {
  return certificate.advocateEmail.trim();
}

function getDisplayEntity(certificate: GoodStandingCertificate) {
  return certificate.type === "individual"
    ? certificate.advocateName || "Unnamed advocate"
    : certificate.firmName || "Unnamed institution";
}

function buildMailtoLink(certificate: GoodStandingCertificate) {
  const recipient = getRecipientEmail(certificate);
  if (!recipient) return "";

  const subject = encodeURIComponent(
    `Certificate of Good Standing - ${certificate.certificateNo}`,
  );
  const body = encodeURIComponent(
    `Hello,\n\nPlease find your Certificate of Good Standing details below:\n\nCertificate No: ${certificate.certificateNo}\nEntity: ${getDisplayEntity(certificate)}\nIssued On: ${certificate.issuedOn}\nValid Until: ${certificate.validUntil}\nReference: ${certificate.reference}\n\nYou may open the certificate from the dashboard to print or save it as PDF.\n\nRegards,\nAdvocates Complaints Commission`,
  );

  return `mailto:${encodeURIComponent(recipient)}?subject=${subject}&body=${body}`;
}

function buildCertificateViewUrl(
  certificateNo: string,
  options: { print?: boolean } = {},
) {
  const base = `/dashboard/certificates/view/${certificateNo}`;
  if (options.print) return `${base}?print=1`;
  return base;
}

export function CertificateBuilder({ initial }: Props) {
  const router = useRouter();
  const [draft, setDraft] = useState<GoodStandingCertificate>(() =>
    updateDraft(initial),
  );
  const [issued, setIssued] = useState<GoodStandingCertificate[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [certificateType, setCertificateType] =
    useState<CertificateType>("individual");
  const [newAdvocate, setNewAdvocate] = useState<AdvocateInLawFirm>({
    advocateName: "",
    rollNumber: "",
    idNumber: "",
  });

  // Load issued certificates from localStorage on mount to maintain correct sequence numbers
  useEffect(() => {
    try {
      const raw = localStorage.getItem("issuedCertificates");
      if (raw) {
        const certificates = JSON.parse(raw) as GoodStandingCertificate[];
        const normalized = Array.isArray(certificates)
          ? dedupeCertificates(certificates)
          : [];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIssued(normalized);

        // If there are existing certificates, generate the next sequence number
        if (normalized.length > 0) {
          const nextSequence = getNextCertificateSequence(normalized);
          const next = makeDefaultDraft(new Date());
          next.certificateNo = generateCertificateNo(new Date(), nextSequence);
          setDraft(updateDraft(next));
        }
      }
    } catch (e) {
      // ignore
    }
    setInitialized(true);
  }, []);

  const isValid = useMemo(() => {
    if (certificateType === "individual") {
      return Boolean(
        draft.advocateName.trim() &&
        draft.rollNumber.trim() &&
        draft.idNumber.trim() &&
        draft.issuedOn.trim() &&
        draft.validUntil.trim(),
      );
    } else {
      // For law firm
      return Boolean(
        draft.firmName?.trim() &&
        draft.advocateAddress.trim() &&
        draft.issuedOn.trim() &&
        draft.validUntil.trim() &&
        draft.advocatesInFirm &&
        draft.advocatesInFirm.length > 0,
      );
    }
  }, [draft, certificateType]);

  function patch<K extends keyof GoodStandingCertificate>(
    key: K,
    value: GoodStandingCertificate[K],
  ) {
    setDraft((prev) => updateDraft({ ...prev, [key]: value }));
  }

  function handleIssue() {
    if (!isValid) return;

    const issuedCert = {
      ...draft,
      status: "Issued",
    } as GoodStandingCertificate;

    // Create the new issued array immediately
    const newIssued: GoodStandingCertificate[] = dedupeCertificates([
      { ...issuedCert },
      ...issued,
    ]);

    // Update state and localStorage with the new array
    setIssued(newIssued);
    try {
      localStorage.setItem("issuedCertificates", JSON.stringify(newIssued));
      const bc = new BroadcastChannel("issued-certificates");
      bc.postMessage({ type: "update", data: newIssued });
      bc.close();
    } catch (e) {
      // ignore
    }

    // Calculate next sequence based on the highest existing certificate number
    const nextSequence = getNextCertificateSequence(newIssued);
    const next = makeDefaultDraft(new Date());
    next.certificateNo = generateCertificateNo(new Date(), nextSequence);
    setDraft(updateDraft(next));
  }

  function handleReset() {
    const freshDraft = makeDefaultDraft(new Date());
    freshDraft.type = certificateType;
    setDraft(freshDraft);
    setNewAdvocate({ advocateName: "", rollNumber: "", idNumber: "" });
  }

  function handleTypeChange(newType: CertificateType) {
    setCertificateType(newType);
    const freshDraft = makeDefaultDraft(new Date());
    freshDraft.type = newType;
    setDraft(freshDraft);
    setNewAdvocate({ advocateName: "", rollNumber: "", idNumber: "" });
  }

  function handleAddAdvocate() {
    if (
      !newAdvocate.advocateName.trim() ||
      !newAdvocate.rollNumber.trim() ||
      !newAdvocate.idNumber.trim()
    ) {
      return;
    }

    setDraft((prev) =>
      updateDraft({
        ...prev,
        advocatesInFirm: [...(prev.advocatesInFirm || []), { ...newAdvocate }],
      }),
    );
    setNewAdvocate({ advocateName: "", rollNumber: "", idNumber: "" });
  }

  function handleRemoveAdvocate(index: number) {
    setDraft((prev) =>
      updateDraft({
        ...prev,
        advocatesInFirm: (prev.advocatesInFirm || []).filter(
          (_, i) => i !== index,
        ),
      }),
    );
  }

  function handlePrint() {
    window.print();
  }

  async function handleDownloadPdf() {
    await saveCertificateAsPdf(draft, {
      fileName: `${draft.certificateNo}.pdf`,
    });
  }

  function handleEmailDraft() {
    const mailto = buildMailtoLink(draft);
    if (!mailto) return;
    window.location.href = mailto;
  }

  function openCertificate(certificateNo: string) {
    router.push(buildCertificateViewUrl(certificateNo));
  }

  function printCertificate(certificateNo: string) {
    router.push(buildCertificateViewUrl(certificateNo, { print: true }));
  }

  return (
    <div className="-m-6 min-h-[calc(100dvh-3rem)] overflow-x-hidden bg-slate-50/80 p-6 print:m-0 print:bg-white print:p-0">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-5 xl:grid-cols-[minmax(380px,430px)_minmax(0,1fr)] 2xl:grid-cols-[420px_minmax(0,1fr)]">
        <section className="rounded-xl border border-black/5 bg-white p-4 shadow-sm print:hidden xl:sticky xl:top-6 xl:h-fit">
          <div>
            <div className="text-xs text-black/50">Certificates</div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Issue Good Standing Certificate
            </h1>
            <p className="mt-1 text-[12px] text-black/60">
              Enter details and review preview. Reference and QR code
              auto-generate. Use Print Preview for printing and Save PDF for
              downloading a file.
            </p>
          </div>

          {/* Certificate Type Tabs */}
          <div className="mt-4 flex gap-2 border-b border-black/10">
            <button
              onClick={() => handleTypeChange("individual")}
              className={`px-4 py-2 text-[13px] font-medium transition-colors ${
                certificateType === "individual"
                  ? "text-slate-900 border-b-2 border-slate-900"
                  : "text-black/50 hover:text-black/75"
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => handleTypeChange("law-firm")}
              className={`px-4 py-2 text-[13px] font-medium transition-colors ${
                certificateType === "law-firm"
                  ? "text-slate-900 border-b-2 border-slate-900"
                  : "text-black/50 hover:text-black/75"
              }`}
            >
              Law Firm / Institution
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 text-[13px]">
            <label className="space-y-1">
              <div className="text-black/65">
                Reference Number (Auto-generated)
              </div>
              <input
                value={draft.reference}
                readOnly
                className="w-full rounded-lg border border-black/15 bg-slate-50 px-3 py-2 text-black/70 outline-none"
              />
            </label>

            {/* Individual Tab Content */}
            {certificateType === "individual" && (
              <>
                <label className="space-y-1">
                  <div className="text-black/65">Advocate Full Name</div>
                  <input
                    value={draft.advocateName}
                    onChange={(e) => patch("advocateName", e.target.value)}
                    placeholder="e.g. Jane Wambui Njeri"
                    className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none ring-slate-900/20 placeholder:text-black/35 focus:ring"
                  />
                </label>

                <label className="space-y-1">
                  <div className="text-black/65">Advocate Address</div>
                  <textarea
                    value={draft.advocateAddress}
                    onChange={(e) => patch("advocateAddress", e.target.value)}
                    placeholder={"Firm name\nStreet address\nP.O Box\nTown"}
                    className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none ring-slate-900/20 placeholder:text-black/35 focus:ring resize-y"
                    rows={3}
                  />
                </label>

                <label className="space-y-1">
                  <div className="text-black/65">Advocate Email</div>
                  <input
                    type="email"
                    value={draft.advocateEmail}
                    onChange={(e) => patch("advocateEmail", e.target.value)}
                    placeholder="info@firm.co.ke"
                    className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none ring-slate-900/20 placeholder:text-black/35 focus:ring"
                  />
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="space-y-1">
                    <div className="text-black/65">P-105 Number</div>
                    <input
                      value={draft.rollNumber}
                      onChange={(e) => patch("rollNumber", e.target.value)}
                      placeholder="e.g. P.105/1391/84"
                      className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none ring-slate-900/20 placeholder:text-black/35 focus:ring"
                    />
                  </label>
                  <label className="space-y-1">
                    <div className="text-black/65">ID/Passport Number</div>
                    <input
                      value={draft.idNumber}
                      onChange={(e) => patch("idNumber", e.target.value)}
                      className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none ring-slate-900/20 placeholder:text-black/35 focus:ring"
                    />
                  </label>
                </div>
              </>
            )}

            {/* Law Firm Tab Content */}
            {certificateType === "law-firm" && (
              <>
                <label className="space-y-1">
                  <div className="text-black/65">
                    Law Firm / Institution Name
                  </div>
                  <input
                    value={draft.firmName || ""}
                    onChange={(e) => patch("firmName", e.target.value)}
                    placeholder="e.g. John Doe & Associates"
                    className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none ring-slate-900/20 placeholder:text-black/35 focus:ring"
                  />
                </label>

                <label className="space-y-1">
                  <div className="text-black/65">Firm Address</div>
                  <textarea
                    value={draft.advocateAddress}
                    onChange={(e) => patch("advocateAddress", e.target.value)}
                    placeholder={"Street address\nP.O Box\nTown"}
                    className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none ring-slate-900/20 placeholder:text-black/35 focus:ring resize-y"
                    rows={3}
                  />
                </label>

                <label className="space-y-1">
                  <div className="text-black/65">Firm Email</div>
                  <input
                    type="email"
                    value={draft.advocateEmail}
                    onChange={(e) => patch("advocateEmail", e.target.value)}
                    placeholder="info@firm.co.ke"
                    className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none ring-slate-900/20 placeholder:text-black/35 focus:ring"
                  />
                </label>

                {/* Advocates in Firm Section */}
                <div className="space-y-2 pt-2 border-t border-black/10">
                  <div className="text-black/65 font-medium">
                    Advocates in Firm
                  </div>

                  <div className="space-y-2 rounded-lg border border-black/10 bg-slate-50 p-3">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <input
                        value={newAdvocate.advocateName}
                        onChange={(e) =>
                          setNewAdvocate({
                            ...newAdvocate,
                            advocateName: e.target.value,
                          })
                        }
                        placeholder="Advocate Name"
                        className="rounded-lg border border-black/15 px-3 py-2 text-[12px] outline-none ring-slate-900/20 placeholder:text-black/35 focus:ring"
                      />
                      <input
                        value={newAdvocate.rollNumber}
                        onChange={(e) =>
                          setNewAdvocate({
                            ...newAdvocate,
                            rollNumber: e.target.value,
                          })
                        }
                        placeholder="P-105 Number"
                        className="rounded-lg border border-black/15 px-3 py-2 text-[12px] outline-none ring-slate-900/20 placeholder:text-black/35 focus:ring"
                      />
                    </div>
                    <input
                      value={newAdvocate.idNumber}
                      onChange={(e) =>
                        setNewAdvocate({
                          ...newAdvocate,
                          idNumber: e.target.value,
                        })
                      }
                      placeholder="ID/Passport Number"
                      className="w-full rounded-lg border border-black/15 px-3 py-2 text-[12px] outline-none ring-slate-900/20 placeholder:text-black/35 focus:ring"
                    />
                    <button
                      onClick={handleAddAdvocate}
                      disabled={
                        !newAdvocate.advocateName.trim() ||
                        !newAdvocate.rollNumber.trim() ||
                        !newAdvocate.idNumber.trim()
                      }
                      className="w-full rounded-lg bg-blue-600 px-3 py-2 text-[12px] font-medium text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                    >
                      + Add Advocate
                    </button>
                  </div>

                  {/* Advocates List */}
                  {draft.advocatesInFirm && draft.advocatesInFirm.length > 0 ? (
                    <div className="rounded-lg border border-black/10 overflow-hidden">
                      <table className="w-full text-[12px]">
                        <thead className="text-[11px] uppercase tracking-wide text-black/50 bg-black/5">
                          <tr>
                            <th className="py-2 px-3 text-left">Name</th>
                            <th className="py-2 px-3 text-left">Roll No</th>
                            <th className="py-2 px-3 text-left">ID</th>
                            <th className="py-2 px-3 text-center w-12">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {draft.advocatesInFirm.map((advocate, idx) => (
                            <tr key={idx} className="border-t border-black/5">
                              <td className="py-2 px-3 text-black/80">
                                {advocate.advocateName}
                              </td>
                              <td className="py-2 px-3 text-black/70">
                                {advocate.rollNumber}
                              </td>
                              <td className="py-2 px-3 text-black/70">
                                {advocate.idNumber}
                              </td>
                              <td className="py-2 px-3 text-center">
                                <button
                                  onClick={() => handleRemoveAdvocate(idx)}
                                  className="text-red-600 hover:text-red-700 font-medium text-[11px]"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <p className="text-[12px] text-amber-700">
                        No advocates added yet. Add at least one advocate to
                        issue the certificate.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <div className="text-black/65">Date Issued</div>
                <input
                  type="date"
                  value={draft.issuedOn}
                  onChange={(e) => patch("issuedOn", e.target.value)}
                  className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none ring-slate-900/20 focus:ring"
                />
              </label>
              <label className="space-y-1">
                <div className="text-black/65">Valid Until</div>
                <input
                  type="date"
                  value={draft.validUntil}
                  onChange={(e) => patch("validUntil", e.target.value)}
                  className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none ring-slate-900/20 focus:ring"
                />
              </label>
            </div>

            <label className="space-y-1">
              <div className="text-black/65">Purpose of Certificate</div>
              <select
                value={draft.purpose}
                onChange={(e) =>
                  patch("purpose", e.target.value as GoodStandingReason)
                }
                className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 outline-none ring-slate-900/20 focus:ring"
              >
                {PURPOSE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <div className="text-black/65">Signer Name</div>
                <input
                  value={draft.signerName}
                  onChange={(e) => patch("signerName", e.target.value)}
                  className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none ring-slate-900/20 focus:ring"
                />
              </label>
              <label className="space-y-1">
                <div className="text-black/65">Signer Title</div>
                <input
                  value={draft.signerTitle}
                  onChange={(e) => patch("signerTitle", e.target.value)}
                  className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none ring-slate-900/20 focus:ring"
                />
              </label>
            </div>

            <label className="space-y-1">
              <div className="text-black/65">Department</div>
              <input
                value={draft.signerDepartment}
                onChange={(e) => patch("signerDepartment", e.target.value)}
                className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none ring-slate-900/20 focus:ring"
              />
            </label>

            <div className="space-y-2">
              <div className="text-black/65 font-medium text-[13px]">
                Signature
              </div>
              <div className="rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-4">
                <p className="text-[12px] text-black/60 mb-3">
                  Signature is optional. Upload an image if you want a digital
                  signature, or leave this blank for manual signing.
                </p>
                <div className="flex flex-col gap-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-blue-400 bg-white px-4 py-2 hover:bg-blue-50 transition">
                    <span className="text-[13px] font-medium text-blue-600">
                      📁 Upload Signature
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          patch("signerSignature", reader.result as string);
                        };
                        reader.readAsDataURL(f);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {draft.signerSignature ? (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="text-[12px] font-medium text-green-700 mb-2">
                    ✓ Uploaded signature selected
                  </p>
                  <div className="h-20 w-full overflow-hidden rounded border border-green-200 bg-white p-2">
                    <img
                      src={draft.signerSignature}
                      alt="signature preview"
                      className="h-full object-contain mx-auto"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => patch("signerSignature", "")}
                    className="mt-2 w-full rounded-lg border border-red-300 bg-white px-3 py-1 text-[12px] text-red-600 hover:bg-red-50 transition"
                  >
                    Remove Signature
                  </button>
                </div>
              ) : (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-[12px] text-amber-700">
                    No digital signature uploaded. This certificate can still be
                    signed manually after printing.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={handleIssue}
                disabled={!isValid}
                className={[
                  "rounded-lg px-4 py-2 text-[13px] font-medium text-white",
                  isValid
                    ? "bg-slate-900 hover:bg-slate-800"
                    : "cursor-not-allowed bg-slate-300",
                ].join(" ")}
              >
                Issue Certificate
              </button>
              <button
                onClick={handlePrint}
                className="rounded-lg border border-black/10 bg-white px-4 py-2 text-[13px] text-black/75 hover:bg-black/2"
              >
                Print Preview
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg border border-black/10 bg-white px-4 py-2 text-[13px] text-black/75 hover:bg-black/2"
              >
                Reset
              </button>
            </div>

            <div className="mt-4 rounded-lg border border-black/10 bg-slate-50 p-3 text-[12px] text-black/65">
              <div className="font-medium text-black/75">Usability tips</div>
              <ul className="mt-1 list-disc pl-4">
                <li>
                  Reference number and verification token update automatically
                  from certificate details.
                </li>
                <li>
                  Use Print Preview to export or print the exact certificate
                  layout.
                </li>
                <li>
                  After issue, draft resets to a fresh certificate number for
                  the next issuance.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="min-w-0 space-y-4 overflow-x-hidden">
          <CertificateOfGoodStanding certificate={draft} />

          <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm print:hidden">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-black/85">
                  Certificate Actions
                </h2>
                <p className="mt-1 text-[12px] text-black/55">
                  Send the draft by email or export the certificate from the
                  current preview.
                </p>
              </div>
              <div className="text-[11px] text-black/45">
                {draft.type === "individual"
                  ? "Individual"
                  : "Law Firm / Institution"}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-lg border border-black/10 bg-white px-3 py-2 text-[13px] text-black/75 hover:bg-black/2"
              >
                Print Certificate
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="rounded-lg bg-slate-900 px-3 py-2 text-[13px] font-medium text-white hover:bg-slate-800"
              >
                Save PDF
              </button>
              <button
                type="button"
                onClick={handleEmailDraft}
                disabled={!getRecipientEmail(draft)}
                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-[13px] font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:border-black/10 disabled:bg-black/5 disabled:text-black/35"
              >
                Dispatch via Email
              </button>
            </div>

            {!getRecipientEmail(draft) ? (
              <p className="mt-2 text-[11px] text-black/45">
                Add an email address in the form to enable dispatch.
              </p>
            ) : null}
          </div>

          <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm print:hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide">
                Recently Issued In This Session
              </h2>
              <span className="text-xs text-black/55">
                {issued.length} item{issued.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {issued.length === 0 ? (
                <div className="rounded-lg border border-dashed border-black/10 bg-slate-50 px-4 py-8 text-center text-[12px] text-black/45">
                  No certificates issued in this session yet.
                </div>
              ) : (
                issued.map((item) => {
                  const recipient = getRecipientEmail(item);
                  const mailto = buildMailtoLink(item);

                  return (
                    <div
                      key={item.certificateNo}
                      className="rounded-xl border border-black/10 bg-slate-50 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-mono text-[11px] text-black/50">
                            {item.certificateNo}
                          </div>
                          <div className="mt-1 truncate text-[13px] font-medium text-black/80">
                            {getDisplayEntity(item)}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-black/50">
                            <span>
                              {item.type === "individual"
                                ? "Individual"
                                : "Institution"}
                            </span>
                            <span>•</span>
                            <span>{item.issuedOn}</span>
                          </div>
                        </div>
                        <span
                          className={`inline-flex shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${
                            item.type === "individual"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {item.type === "individual"
                            ? "Individual"
                            : "Law Firm"}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openCertificate(item.certificateNo)}
                          className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[12px] text-black/70 hover:bg-black/2"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => printCertificate(item.certificateNo)}
                          className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[12px] text-black/70 hover:bg-black/2"
                        >
                          Print
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            void saveCertificateAsPdf(item, {
                              fileName: `${item.certificateNo}.pdf`,
                            })
                          }
                          className="rounded-lg bg-slate-900 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-slate-800"
                        >
                          Save PDF
                        </button>
                        <a
                          href={mailto || undefined}
                          aria-disabled={!recipient}
                          className={[
                            "rounded-lg border px-3 py-1.5 text-[12px] font-medium",
                            recipient
                              ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                              : "pointer-events-none border-black/10 bg-black/5 text-black/30",
                          ].join(" ")}
                        >
                          Email
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
