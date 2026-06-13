"use client";

import { useMemo, useState } from "react";

type IntakePriority = "Low" | "Normal" | "High" | "Urgent";
type IntakeChannel = "Walk-in" | "Email" | "Phone" | "Referral";

type IntakeDraft = {
  complainantName: string;
  email: string;
  phone: string;
  respondentName: string;
  respondentFirm: string;
  complaintSummary: string;
  county: string;
  channel: IntakeChannel;
  priority: IntakePriority;
};

type IntakeItem = IntakeDraft & {
  refNo: string;
  receivedOn: string;
  status: "Received" | "Assigned";
};

const INITIAL_DRAFT: IntakeDraft = {
  complainantName: "",
  email: "",
  phone: "",
  respondentName: "",
  respondentFirm: "",
  complaintSummary: "",
  county: "",
  channel: "Walk-in",
  priority: "Normal",
};

function makeRef(sequence: number) {
  const year = new Date().getFullYear();
  return `ACC-INT-${year}-${String(sequence).padStart(4, "0")}`;
}

export default function NewIntakePage() {
  const [draft, setDraft] = useState<IntakeDraft>(INITIAL_DRAFT);
  const [items, setItems] = useState<IntakeItem[]>([]);

  const isValid = useMemo(() => {
    return Boolean(
      draft.complainantName.trim() &&
      draft.phone.trim() &&
      draft.respondentName.trim() &&
      draft.complaintSummary.trim() &&
      draft.county.trim(),
    );
  }, [draft]);

  function patch<K extends keyof IntakeDraft>(key: K, value: IntakeDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function submitIntake(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    const next: IntakeItem = {
      ...draft,
      refNo: makeRef(items.length + 1),
      receivedOn: new Date().toISOString().slice(0, 10),
      status: "Received",
    };

    setItems((prev) => [next, ...prev]);
    setDraft(INITIAL_DRAFT);
  }

  return (
    <div className="-m-6 min-h-[calc(100dvh-3rem)] bg-slate-50/70 p-6">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 xl:grid-cols-[440px_minmax(0,1fr)]">
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            System
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            New Intake
          </h1>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Capture complaint details quickly and route to division review.
          </p>

          <form
            onSubmit={submitIntake}
            className="mt-4 space-y-3"
            aria-label="New intake form"
          >
            <label className="block space-y-1">
              <span className="text-sm text-slate-700">Complainant Name</span>
              <input
                value={draft.complainantName}
                onChange={(e) => patch("complainantName", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-sm text-slate-700">Email</span>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => patch("email", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-sm text-slate-700">Phone</span>
                <input
                  value={draft.phone}
                  onChange={(e) => patch("phone", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </label>
            </div>

            <label className="block space-y-1">
              <span className="text-sm text-slate-700">Respondent Name</span>
              <input
                value={draft.respondentName}
                onChange={(e) => patch("respondentName", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm text-slate-700">Respondent Firm</span>
              <input
                value={draft.respondentFirm}
                onChange={(e) => patch("respondentFirm", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="block space-y-1 sm:col-span-1">
                <span className="text-sm text-slate-700">County</span>
                <input
                  value={draft.county}
                  onChange={(e) => patch("county", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </label>

              <label className="block space-y-1 sm:col-span-1">
                <span className="text-sm text-slate-700">Channel</span>
                <select
                  value={draft.channel}
                  onChange={(e) =>
                    patch("channel", e.target.value as IntakeChannel)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                >
                  <option>Walk-in</option>
                  <option>Email</option>
                  <option>Phone</option>
                  <option>Referral</option>
                </select>
              </label>

              <label className="block space-y-1 sm:col-span-1">
                <span className="text-sm text-slate-700">Priority</span>
                <select
                  value={draft.priority}
                  onChange={(e) =>
                    patch("priority", e.target.value as IntakePriority)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                >
                  <option>Low</option>
                  <option>Normal</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </label>
            </div>

            <label className="block space-y-1">
              <span className="text-sm text-slate-700">Complaint Summary</span>
              <textarea
                rows={5}
                value={draft.complaintSummary}
                onChange={(e) => patch("complaintSummary", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                placeholder="Describe the complaint briefly and clearly."
              />
            </label>

            <button
              type="submit"
              disabled={!isValid}
              className={[
                "w-full rounded-lg px-4 py-2 text-sm font-semibold text-white",
                isValid
                  ? "bg-slate-900 hover:bg-slate-800"
                  : "cursor-not-allowed bg-slate-300",
              ].join(" ")}
            >
              Submit Intake
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Today’s Intake Queue
            </h2>
            <span className="text-xs text-slate-500">
              {items.length} record{items.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[13px]">
              <thead className="text-[11px] uppercase tracking-wide text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-2 pr-3">Reference</th>
                  <th className="py-2 pr-3">Complainant</th>
                  <th className="py-2 pr-3">Respondent</th>
                  <th className="py-2 pr-3">Channel</th>
                  <th className="py-2 pr-3">Priority</th>
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.refNo}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-3 pr-3 font-mono text-[12px] text-slate-700">
                      {item.refNo}
                    </td>
                    <td className="py-3 pr-3 text-slate-800">
                      {item.complainantName}
                    </td>
                    <td className="py-3 pr-3 text-slate-700">
                      {item.respondentName}
                    </td>
                    <td className="py-3 pr-3 text-slate-700">{item.channel}</td>
                    <td className="py-3 pr-3">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-slate-600">
                      {item.receivedOn}
                    </td>
                    <td className="py-3 text-slate-700">{item.status}</td>
                  </tr>
                ))}
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-slate-500"
                    >
                      No intake records yet. Submit a complaint intake to
                      populate this queue.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
