"use client";

import Link from "next/link";
import {
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { ComplaintFormFields } from "../-components/ComplaintFormFields";
import {
  buildPublicComplaintPayload,
  defaultFormVisibility,
  readFormVisibility,
} from "../_lib/complaintForm";
import { savePublicComplaint } from "../_lib/publicPortalStorage";

const SECTION_LINKS = [
  ["section-1", "1. Personal Details"],
  ["section-2", "2. The Advocate"],
  ["section-3", "3. Kind of Work"],
  ["section-4", "4. Further Information"],
  ["section-5", "5. Your Complaint"],
  ["section-6", "6. Setting It Right"],
] as const;

export default function LodgeComplaintPage() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const errorRef = useRef<HTMLDivElement | null>(null);
  const [visibility, setVisibility] = useState(defaultFormVisibility);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submissionDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    [],
  );

  function handleChange() {
    if (formRef.current) {
      setVisibility(readFormVisibility(formRef.current));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const payload = buildPublicComplaintPayload(form);
      const complaint = savePublicComplaint(payload);
      setSubmittedRef(complaint.complaintRef);
      setVisibility(defaultFormVisibility);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(
        "Something went wrong while submitting your complaint. Please review the form and try again.",
      );
      requestAnimationFrame(() =>
        errorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-ivory text-navy-deep">
      <header className="sticky top-0 z-30 border-b border-navy-mid/30 bg-navy/95 text-ivory shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 md:px-10">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ivory/55">
              Advocates Complaints Commission
            </p>
            <p className="font-serif-display text-lg text-white">
              Public Complaints Portal
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/public-portal"
              className="rounded-md border border-white/20 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Portal Home
            </Link>
            <Link
              href="/public-portal/track-verify"
              className="rounded-md bg-brass px-3 py-2 text-xs font-semibold text-navy-deep transition hover:bg-brass-light"
            >
              Track Complaint
            </Link>
          </div>
        </div>

        {!submittedRef ? <SectionNavigation /> : null}
      </header>

      <main className="mx-auto w-full max-w-4xl px-6 py-10 md:px-10 md:py-14">
        {!submittedRef ? (
          <>
            <div className="mb-8">
              <p className="docket-stamp dark mb-4 text-xs">
                Help Form — Summary of a Complaint Against an Advocate
              </p>
              <h1 className="mb-3 font-serif-display text-3xl text-navy-deep md:text-4xl">
                Lodge a Complaint
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-navy-deep/65">
                Complete every section that applies to your situation as fully
                and accurately as possible. The form captures the details
                required to assess a complaint against an advocate. After
                submission, keep the tracking reference shown on screen.
              </p>
              <div className="mt-5 rounded-lg border border-brass/25 bg-brass/5 px-4 py-3 text-xs leading-5 text-navy-deep/70">
                Fields marked with an asterisk (*) are required. Additional
                questions will appear automatically when you select answers
                that need more information.
              </div>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              onChange={handleChange}
              className="space-y-8"
            >
              <ComplaintFormFields
                visibility={visibility}
                submissionDate={submissionDate}
              />

              {error ? (
                <div
                  ref={errorRef}
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:items-center sm:justify-end">
                <Link
                  href="/public-portal"
                  className="rounded-md border border-line bg-paper px-5 py-3 text-center text-sm font-semibold text-navy-deep transition hover:border-navy/30 hover:bg-white"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-brass rounded-md px-8 py-3 text-sm"
                >
                  {isSubmitting ? "Submitting…" : "Submit Complaint"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <section
            className="card rounded-xl p-8 text-center shadow-[0_18px_45px_rgba(11,28,48,0.08)] md:p-12"
            aria-live="polite"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-navy font-serif-display text-xl text-brass-light">
              ✓
            </div>
            <p className="docket-stamp dark mb-4 text-xs">Submission Received</p>
            <h1 className="mb-3 font-serif-display text-2xl text-navy-deep md:text-3xl">
              Complaint lodged successfully
            </h1>
            <p className="mx-auto max-w-xl text-sm leading-7 text-navy-deep/65">
              Your complaint has been saved. Use the reference below to track
              its progress through the public portal.
            </p>
            <div className="mx-auto my-6 max-w-md rounded-lg border border-brass/30 bg-brass/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-deep/50">
                Tracking Reference
              </p>
              <p className="mt-2 font-mono-case text-lg font-semibold text-navy-deep">
                {submittedRef}
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/public-portal/track-verify"
                className="btn-primary rounded-md px-6 py-3 text-sm"
              >
                Track My Complaint
              </Link>
              <button
                type="button"
                onClick={() => setSubmittedRef(null)}
                className="rounded-md border border-line bg-paper px-6 py-3 text-sm font-semibold text-navy-deep transition hover:bg-white"
              >
                Lodge Another Complaint
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function SectionNavigation() {
  return (
    <nav
      className="mx-auto hidden max-w-5xl gap-5 overflow-x-auto px-6 pb-3 text-xs text-ivory/60 md:flex md:px-10"
      aria-label="Complaint form sections"
    >
      {SECTION_LINKS.map(([id, label]) => (
        <a
          key={id}
          href={`#${id}`}
          className="whitespace-nowrap transition hover:text-brass-light"
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
