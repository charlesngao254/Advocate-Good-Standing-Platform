"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { GoodStandingCertificate } from "../../_lib/certificateData";

const PAGE_SIZE = 5;

function buildSearchText(row: GoodStandingCertificate) {
  const advocatesText = row.advocatesInFirm
    ?.map(
      (advocate) =>
        `${advocate.advocateName} ${advocate.rollNumber} ${advocate.idNumber}`,
    )
    .join(" ")
    .trim();

  return [
    row.certificateNo,
    row.advocateName,
    row.rollNumber,
    row.idNumber,
    row.firmName,
    advocatesText,
    row.issuedOn,
    row.validUntil,
    row.status,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getInstitutionLabel(row: GoodStandingCertificate) {
  return row.firmName?.trim() || "Institution";
}

function isInstitutionCertificate(row: GoodStandingCertificate) {
  return (
    row.type === "law-firm" ||
    Boolean(row.firmName?.trim()) ||
    Boolean(row.advocatesInFirm && row.advocatesInFirm.length > 0)
  );
}

function getInstitutionAdvocates(row: GoodStandingCertificate) {
  if (!row.advocatesInFirm || row.advocatesInFirm.length === 0) {
    return "No advocates listed";
  }

  return row.advocatesInFirm
    .map(
      (advocate, index) =>
        `${index + 1}. ${advocate.advocateName} (${advocate.rollNumber})`,
    )
    .join("\n");
}

function statusPill(status: GoodStandingCertificate["status"]) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ring-inset",
        status === "Issued"
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : status === "Expired"
            ? "bg-amber-50 text-amber-800 ring-amber-200"
            : "bg-rose-50 text-rose-700 ring-rose-200",
      ].join(" ")}
    >
      {status}
    </span>
  );
}

type SectionKind = "individual" | "institution";

type SectionProps = {
  title: string;
  description: string;
  rows: GoodStandingCertificate[];
  page: number;
  onPageChange: (page: number) => void;
  onRemove: (certificateNo: string) => void;
  kind: SectionKind;
};

function IssuedLogSection({
  title,
  description,
  rows,
  page,
  onPageChange,
  onRemove,
  kind,
}: SectionProps) {
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = rows.slice(start, start + PAGE_SIZE);
  const isIndividual = kind === "individual";

  return (
    <section className="mt-4 rounded-xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-black/85">
            {title}
          </h2>
          <div className="text-[12px] text-black/50">{description}</div>
        </div>
        <div className="text-[12px] text-black/50">
          {rows.length} record{rows.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table
          className={[
            "w-full text-left text-[13px]",
            isIndividual ? "min-w-[940px]" : "min-w-[860px]",
          ].join(" ")}
        >
          <thead className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
            {isIndividual ? (
              <tr className="border-b border-black/5">
                <th className="py-2 pr-4">Certificate No</th>
                <th className="py-2 pr-4">Advocate</th>
                <th className="py-2 pr-4">Admission No</th>
                <th className="py-2 pr-4">ID Number</th>
                <th className="py-2 pr-4">Issued</th>
                <th className="py-2 pr-4">Valid Until</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Action</th>
              </tr>
            ) : (
              <tr className="border-b border-black/5">
                <th className="py-2 pr-4">Certificate No</th>
                <th className="py-2 pr-4">Institution</th>
                <th className="py-2 pr-4">Advocates</th>
                <th className="py-2 pr-4">Issued</th>
                <th className="py-2 pr-4">Valid Until</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Action</th>
              </tr>
            )}
          </thead>
          <tbody className="text-black/80">
            {pageRows.map((row) => (
              <tr
                key={row.certificateNo}
                className="border-b border-black/5 last:border-b-0"
              >
                <td className="py-3 pr-4 font-mono text-[12px] text-black/70">
                  {row.certificateNo}
                </td>
                {isIndividual ? (
                  <>
                    <td className="py-3 pr-4 font-medium text-black/80">
                      {row.advocateName || "—"}
                    </td>
                    <td className="py-3 pr-4 text-black/65">
                      {row.rollNumber || "—"}
                    </td>
                    <td className="py-3 pr-4 text-black/65">
                      {row.idNumber || "—"}
                    </td>
                    <td className="py-3 pr-4 text-black/55">{row.issuedOn}</td>
                    <td className="py-3 pr-4 text-black/55">
                      {row.validUntil}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 pr-4 font-medium text-black/80">
                      {getInstitutionLabel(row)}
                    </td>
                    <td className="py-3 pr-4 text-black/65">
                      <div className="whitespace-pre-line leading-5 text-black/65">
                        {getInstitutionAdvocates(row)}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-black/55">{row.issuedOn}</td>
                    <td className="py-3 pr-4 text-black/55">
                      {row.validUntil}
                    </td>
                  </>
                )}
                <td className="py-3">{statusPill(row.status)}</td>
                <td className="py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      href={`/dashboard/certificates/view/${row.certificateNo}`}
                      className="inline-block rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-medium text-white hover:bg-slate-800"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => onRemove(row.certificateNo)}
                      className="inline-block rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-100"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={isIndividual ? 8 : 7}
                  className="py-10 text-center text-[13px] text-black/50"
                >
                  {isIndividual
                    ? "No individual certificates match your filters."
                    : "No institution certificates match your filters."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-[12px] text-black/50">
          Page <span className="font-medium text-black/70">{safePage}</span> of{" "}
          <span className="font-medium text-black/70">{totalPages}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-disabled={safePage <= 1}
            onClick={() => onPageChange(Math.max(1, safePage - 1))}
            className={[
              "rounded-lg border px-3 py-1.5 text-[12px] transition-colors",
              safePage <= 1
                ? "pointer-events-none border-black/5 bg-black/5 text-black/30"
                : "border-black/10 bg-white text-black/70 hover:bg-black/2",
            ].join(" ")}
          >
            Prev
          </button>
          <button
            type="button"
            aria-disabled={safePage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
            className={[
              "rounded-lg border px-3 py-1.5 text-[12px] transition-colors",
              safePage >= totalPages
                ? "pointer-events-none border-black/5 bg-black/5 text-black/30"
                : "border-black/10 bg-white text-black/70 hover:bg-black/2",
            ].join(" ")}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

export default function IssuedLogPage() {
  const [rows, setRows] = useState<GoodStandingCertificate[]>(() => {
    try {
      const raw = localStorage.getItem("issuedCertificates");
      if (raw) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {}
    return [];
  });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<
    "All" | "Issued" | "Expired" | "Revoked"
  >("All");
  const [individualPage, setIndividualPage] = useState(1);
  const [institutionPage, setInstitutionPage] = useState(1);

  function removeIssuedLog(certificateNo: string) {
    const ok = window.confirm(
      `Remove certificate ${certificateNo} from issued logs? This cannot be undone.`,
    );
    if (!ok) return;

    const nextRows = rows.filter((row) => row.certificateNo !== certificateNo);
    setRows(nextRows);

    try {
      localStorage.setItem("issuedCertificates", JSON.stringify(nextRows));
      const bc = new BroadcastChannel("issued-certificates");
      bc.postMessage({ type: "update", data: nextRows });
      bc.close();
    } catch (e) {}
  }

  useEffect(() => {
    const bc = new BroadcastChannel("issued-certificates");
    bc.onmessage = (ev) => {
      if (ev.data?.type === "update" && Array.isArray(ev.data.data)) {
        setRows(ev.data.data);
        try {
          localStorage.setItem(
            "issuedCertificates",
            JSON.stringify(ev.data.data),
          );
        } catch (e) {}
      }
    };

    function onStorage(e: StorageEvent) {
      if (e.key === "issuedCertificates") {
        try {
          const parsed = JSON.parse(String(e.newValue));
          setRows(parsed);
        } catch (err) {}
      }
    }
    window.addEventListener("storage", onStorage);

    return () => {
      bc.close();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const filtered = useMemo(() => {
    const qn = q.toLowerCase().trim();
    return rows.filter((row) => {
      if (status !== "All" && row.status !== status) return false;
      if (!qn) return true;
      return buildSearchText(row).includes(qn);
    });
  }, [rows, q, status]);

  const individualRows = useMemo(
    () => filtered.filter((row) => !isInstitutionCertificate(row)),
    [filtered],
  );

  const institutionRows = useMemo(
    () => filtered.filter((row) => isInstitutionCertificate(row)),
    [filtered],
  );

  return (
    <div className="-m-6 min-h-[calc(100dvh-3rem)] bg-slate-50/80 p-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs text-black/50">Certificates</div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Issued Log
            </h1>
            <div className="mt-1 text-xs text-black/55">
              Trace, verify, and review all issued certificates of good
              standing.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-full border bg-white px-3 py-2">
              <input
                placeholder="Search certificate no, advocate, institution..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-[270px] bg-transparent text-[13px] outline-none placeholder:text-black/35"
              />
            </div>
            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as "All" | "Issued" | "Expired" | "Revoked",
                )
              }
              className="rounded-full border px-3 py-1 text-sm"
            >
              <option>All</option>
              <option>Issued</option>
              <option>Expired</option>
              <option>Revoked</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <div className="ml-auto text-[12px] text-black/50">
            {filtered.length} record{filtered.length === 1 ? "" : "s"} total
          </div>
        </div>

        <IssuedLogSection
          title="Individual certificates"
          description="Issued logs for advocates displayed with admission and ID details."
          rows={individualRows}
          page={individualPage}
          onPageChange={setIndividualPage}
          onRemove={removeIssuedLog}
          kind="individual"
        />

        <IssuedLogSection
          title="Institution certificates"
          description="Issued logs for law firms and institutions shown separately from individual advocates."
          rows={institutionRows}
          page={institutionPage}
          onPageChange={setInstitutionPage}
          onRemove={removeIssuedLog}
          kind="institution"
        />

        <div className="mt-4 flex justify-end">
          <Link
            href="/dashboard/certificates/good-standing"
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-[12px] text-white hover:bg-slate-800"
          >
            Issue new certificate
          </Link>
        </div>
      </div>
    </div>
  );
}
