import Link from "next/link";
import { getDivisionData } from "../_lib/divisionData";

export const dynamic = "force-dynamic";

const DIVISIONS = [
  {
    title: "R&I Division",
    code: "R&I" as const,
    href: "/dashboard/divisions/rdi",
    purpose:
      "Intake, admissibility, investigation assignments, and review forwarding.",
  },
  {
    title: "IHADR Division",
    code: "IHADR" as const,
    href: "/dashboard/divisions/ihadr",
    purpose:
      "Mediation sessions, consent management, and compliance follow-up.",
  },
  {
    title: "Prosecution",
    code: "Prosecution" as const,
    href: "/dashboard/divisions/prosecution",
    purpose:
      "Charge preparation, hearings, witness/exhibit readiness, and trial tracking.",
  },
];

export default function DivisionsIndexPage() {
  const summaries = DIVISIONS.map((d) => ({
    ...d,
    data: getDivisionData(d.code).data,
  }));

  return (
    <div className="-m-6 min-h-[calc(100dvh-3rem)] bg-slate-50/70 p-6">
      <div className="mx-auto w-full max-w-6xl">
        <div>
          <div className="text-xs text-black/50">Divisions</div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Division Operations
          </h1>
          <div className="mt-1 text-xs text-black/45">
            Choose a division to manage queue, risk, workflow stages, and SLA
            commitments.
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {summaries.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
                {item.title}
              </div>
              <div className="mt-2 text-[13px] text-black/65">
                {item.purpose}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
                <div className="rounded-lg bg-slate-50 p-2">
                  <div className="text-black/50">Active</div>
                  <div className="text-lg font-semibold text-black/80">
                    {item.data.kpis.active}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <div className="text-black/50">Escalations</div>
                  <div className="text-lg font-semibold text-rose-700">
                    {item.data.kpis.escalations}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <div className="text-black/50">Overdue SLA</div>
                  <div className="text-lg font-semibold text-amber-700">
                    {item.data.kpis.overdueSla}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <div className="text-black/50">Due this week</div>
                  <div className="text-lg font-semibold text-sky-700">
                    {item.data.kpis.dueThisWeek}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-[12px] font-medium text-slate-900">
                Open division dashboard →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
