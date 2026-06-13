"use client";

import Link from "next/link";
import { useState } from "react";
import {
  findComplaint,
  verifyCertificate,
  type PublicCertificateRecord,
  type PublicComplaint,
} from "../_lib/publicPortalStorage";

export default function TrackVerifyPage() {
  const [complaintRef, setComplaintRef] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [complaintResult, setComplaintResult] =
    useState<PublicComplaint | null>(null);
  const [complaintSearched, setComplaintSearched] = useState(false);

  const [certificateNo, setCertificateNo] = useState("");
  const [token, setToken] = useState("");
  const [certificateResult, setCertificateResult] =
    useState<PublicCertificateRecord | null>(null);
  const [certificateSearched, setCertificateSearched] = useState(false);

  function onTrackComplaint(e: React.FormEvent) {
    e.preventDefault();
    const found = findComplaint({ complaintRef, email, phone });
    setComplaintResult(found || null);
    setComplaintSearched(true);
  }

  function onVerifyCertificate(e: React.FormEvent) {
    e.preventDefault();
    const found = verifyCertificate({ certificateNo, token });
    setCertificateResult(found || null);
    setCertificateSearched(true);
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10 md:py-14">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Public Portal
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Track and Verify
          </h1>
        </div>
        <Link
          href="/public-portal/lodge"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Lodge Complaint
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_15px_40px_rgba(15,23,42,0.08)]">
          <h2 className="text-lg font-semibold text-slate-900">
            Track Complaint
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Use complaint reference or email and phone combination.
          </p>

          <form onSubmit={onTrackComplaint} className="mt-4 space-y-3">
            <label className="block space-y-1">
              <span className="text-sm text-slate-700">
                Complaint Reference
              </span>
              <input
                value={complaintRef}
                onChange={(e) => setComplaintRef(e.target.value)}
                placeholder="ACC-CMP-2026-0001"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </label>
            <div className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              or
            </div>
            <label className="block space-y-1">
              <span className="text-sm text-slate-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm text-slate-700">Phone</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Track Complaint
            </button>
          </form>

          {complaintSearched ? (
            complaintResult ? (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <div>
                  <span className="font-semibold">Reference:</span>{" "}
                  {complaintResult.complaintRef}
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{" "}
                  {complaintResult.status}
                </div>
                <div>
                  <span className="font-semibold">Priority:</span>{" "}
                  {complaintResult.priority}
                </div>
                <div>
                  <span className="font-semibold">Last Updated:</span>{" "}
                  {new Date(complaintResult.lastUpdatedOn).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                No complaint found for the details provided.
              </div>
            )
          ) : null}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_15px_40px_rgba(15,23,42,0.08)]">
          <h2 className="text-lg font-semibold text-slate-900">
            Verify Certificate
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Enter certificate number or verification token.
          </p>

          <form onSubmit={onVerifyCertificate} className="mt-4 space-y-3">
            <label className="block space-y-1">
              <span className="text-sm text-slate-700">Certificate Number</span>
              <input
                value={certificateNo}
                onChange={(e) => setCertificateNo(e.target.value)}
                placeholder="ACC-CGS-2026-0007"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </label>
            <div className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              or
            </div>
            <label className="block space-y-1">
              <span className="text-sm text-slate-700">Verification Token</span>
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Verify Certificate
            </button>
          </form>

          {certificateSearched ? (
            certificateResult ? (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <div>
                  <span className="font-semibold">Certificate:</span>{" "}
                  {certificateResult.certificateNo}
                </div>
                <div>
                  <span className="font-semibold">Advocate:</span>{" "}
                  {certificateResult.advocateName}
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{" "}
                  {certificateResult.status}
                </div>
                <div>
                  <span className="font-semibold">Issued On:</span>{" "}
                  {certificateResult.issuedOn}
                </div>
                <div>
                  <span className="font-semibold">Valid Until:</span>{" "}
                  {certificateResult.validUntil}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                Certificate could not be verified. Check the number/token and
                try again.
              </div>
            )
          ) : null}
        </section>
      </div>
    </main>
  );
}
