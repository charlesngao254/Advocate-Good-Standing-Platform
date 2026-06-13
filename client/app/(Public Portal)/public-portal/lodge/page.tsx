"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  savePublicComplaint,
  type ComplaintPriority,
} from "../_lib/publicPortalStorage";

type FormState = {
  complainantName: string;
  complainantEmail: string;
  complainantPhone: string;
  respondentName: string;
  respondentFirm: string;
  complaintCategory: string;
  complaintSummary: string;
  incidentDate: string;
  county: string;
  priority: ComplaintPriority;
};

const INITIAL_FORM: FormState = {
  complainantName: "",
  complainantEmail: "",
  complainantPhone: "",
  respondentName: "",
  respondentFirm: "",
  complaintCategory: "Professional misconduct",
  complaintSummary: "",
  incidentDate: "",
  county: "",
  priority: "Normal",
};

export default function LodgeComplaintPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const isValid = useMemo(() => {
    return Boolean(
      form.complainantName.trim() &&
      form.complainantEmail.trim() &&
      form.complainantPhone.trim() &&
      form.respondentName.trim() &&
      form.complaintSummary.trim() &&
      form.incidentDate.trim() &&
      form.county.trim(),
    );
  }, [form]);

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    const complaint = savePublicComplaint(form);
    setSubmittedRef(complaint.complaintRef);
    setForm(INITIAL_FORM);
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10 md:py-14">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Public Portal
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Lodge Complaint
          </h1>
        </div>
        <Link
          href="/public-portal/track-verify"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Track Complaint
        </Link>
      </div>

      {submittedRef ? (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          Complaint lodged successfully. Your tracking reference is{" "}
          <span className="font-mono font-semibold">{submittedRef}</span>. Keep
          this reference for status checks.
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm text-slate-700">Your Full Name</span>
            <input
              value={form.complainantName}
              onChange={(e) => patch("complainantName", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-slate-700">Email Address</span>
            <input
              type="email"
              value={form.complainantEmail}
              onChange={(e) => patch("complainantEmail", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-slate-700">Phone Number</span>
            <input
              value={form.complainantPhone}
              onChange={(e) => patch("complainantPhone", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-slate-700">County</span>
            <input
              value={form.county}
              onChange={(e) => patch("county", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-slate-700">
              Advocate/Respondent Name
            </span>
            <input
              value={form.respondentName}
              onChange={(e) => patch("respondentName", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-slate-700">Firm/Organization</span>
            <input
              value={form.respondentFirm}
              onChange={(e) => patch("respondentFirm", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-slate-700">Complaint Category</span>
            <select
              value={form.complaintCategory}
              onChange={(e) => patch("complaintCategory", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option>Professional misconduct</option>
              <option>Delayed communication</option>
              <option>Misappropriation of funds</option>
              <option>Unethical conduct</option>
              <option>Other</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sm text-slate-700">Priority</span>
            <select
              value={form.priority}
              onChange={(e) =>
                patch("priority", e.target.value as ComplaintPriority)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option>Low</option>
              <option>Normal</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-sm text-slate-700">Incident Date</span>
            <input
              type="date"
              value={form.incidentDate}
              onChange={(e) => patch("incidentDate", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-sm text-slate-700">Complaint Summary</span>
            <textarea
              rows={6}
              value={form.complaintSummary}
              onChange={(e) => patch("complaintSummary", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              placeholder="Provide a clear summary of what happened, when it happened, and what resolution you seek."
            />
          </label>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <Link
            href="/public-portal"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!isValid}
            className={[
              "rounded-lg px-5 py-2 text-sm font-semibold text-white",
              isValid
                ? "bg-slate-900 hover:bg-slate-800"
                : "cursor-not-allowed bg-slate-300",
            ].join(" ")}
          >
            Submit Complaint
          </button>
        </div>
      </form>
    </main>
  );
}
