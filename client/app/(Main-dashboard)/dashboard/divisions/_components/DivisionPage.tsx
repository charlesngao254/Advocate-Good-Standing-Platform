import Link from "next/link";
import type { CaseStatusKind } from "../../_lib/allCasesData";
import type {
  DivisionCode,
  DivisionQueryResult,
} from "../../_lib/divisionData";

type DivisionView = "All" | "SLA risk" | "Due this week" | "Escalated";

type Props = {
  title: string;
  division: DivisionCode;
  basePath: string;
  result: DivisionQueryResult;
};

function buildHref(base: string, params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && v !== "All") sp.set(k, v);
  }
  const s = sp.toString();
  return s ? `${base}?${s}` : base;
}

function toneBadge(tone: "info" | "warn" | "danger" | "ok") {
  const cls =
    tone === "danger"
      ? "bg-rose-50 text-rose-700 ring-rose-200"
      : tone === "warn"
        ? "bg-amber-50 text-amber-800 ring-amber-200"
        : tone === "ok"
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-sky-50 text-sky-700 ring-sky-200";
  return cls;
}

function statusPill(kind: string) {
  const map: Record<string, string> = {
    Open: "bg-sky-50 text-sky-700 ring-sky-200",
    "In IHADR": "bg-violet-50 text-violet-700 ring-violet-200",
    Prosecution: "bg-rose-50 text-rose-700 ring-rose-200",
    "Under review": "bg-amber-50 text-amber-800 ring-amber-200",
    Closed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };
  const cls = map[kind] ?? "bg-slate-50 text-slate-700 ring-slate-200";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ring-inset",
        cls,
      ].join(" ")}
    >
      {kind}
    </span>
  );
}

function riskPill(kind: "Critical" | "High" | "Normal" | "Low") {
  const map: Record<string, string> = {
    Critical: "bg-rose-50 text-rose-700 ring-rose-200",
    High: "bg-amber-50 text-amber-800 ring-amber-200",
    Normal: "bg-sky-50 text-sky-700 ring-sky-200",
    Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ring-inset",
        map[kind],
      ].join(" ")}
    >
      {kind}
    </span>
  );
}

export function DivisionPage({ title, division, basePath, result }: Props) {
  const { data, rows, query, total, totalPages } = result;
  const views: DivisionView[] = [
    "All",
    "SLA risk",
    "Due this week",
    "Escalated",
  ];
  const statuses: (CaseStatusKind | "All")[] = [
    "All",
    "Open",
    "Under review",
    "In IHADR",
    "Prosecution",
    "Closed",
  ];

  return (
    <div className="-m-6 min-h-[calc(100dvh-3rem)] bg-slate-50/70 p-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs text-black/50">Divisions</div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <div className="mt-1 text-xs text-black/45">{data.mission}</div>
            <div className="mt-1 text-xs text-black/40">
              As of {data.asOfLabel}
            </div>
          </div>

          <form
            action={basePath}
            method="get"
            className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-sm shadow-sm"
          >
            <span className="text-black/40" aria-hidden="true">
              ⌕
            </span>
            <input
              defaultValue={query.q}
              className="w-[260px] bg-transparent text-[13px] outline-none placeholder:text-black/35"
              placeholder="Search reference, advocate, assignee…"
              name="q"
            />
            <input type="hidden" name="view" value={query.view} />
            <input type="hidden" name="status" value={query.status} />
            <button
              type="submit"
              className="rounded-full border border-black/10 px-3 py-1 text-[12px] text-black/70 hover:bg-black/2"
            >
              Search
            </button>
          </form>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="text-xs text-black/50">Active queue</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight">
              {data.kpis.active}
            </div>
          </div>
          <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="text-xs text-black/50">Escalations</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-rose-700">
              {data.kpis.escalations}
            </div>
          </div>
          <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="text-xs text-black/50">Overdue SLA</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-amber-700">
              {data.kpis.overdueSla}
            </div>
          </div>
          <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="text-xs text-black/50">Due this week</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-sky-700">
              {data.kpis.dueThisWeek}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
            Workflow status
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {data.workflow.map((step) => (
              <div
                key={step.name}
                className="rounded-lg border border-black/5 bg-slate-50/70 p-3"
              >
                <div className="text-[12px] text-black/60">{step.name}</div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="text-xl font-semibold tracking-tight">
                    {step.count}
                  </div>
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ring-1 ring-inset",
                      toneBadge(step.tone),
                    ].join(" ")}
                  >
                    {step.tone === "danger"
                      ? "Attention"
                      : step.tone === "warn"
                        ? "Watch"
                        : "Stable"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
            View
          </div>
          {views.map((view) => (
            <Link
              key={view}
              href={buildHref(basePath, {
                q: query.q,
                view,
                status: query.status,
                page: "1",
              })}
              className={[
                "rounded-full px-3 py-1.5 text-[12px] ring-1 ring-inset transition-colors",
                query.view === view
                  ? "bg-slate-900 text-white ring-slate-900"
                  : "bg-white text-black/70 ring-black/10 hover:bg-black/2",
              ].join(" ")}
            >
              {view}
            </Link>
          ))}

          <div className="ml-2 text-[11px] font-semibold uppercase tracking-wider text-black/45">
            Status
          </div>
          {statuses.map((status) => (
            <Link
              key={status}
              href={buildHref(basePath, {
                q: query.q,
                view: query.view,
                status,
                page: "1",
              })}
              className={[
                "rounded-full px-3 py-1.5 text-[12px] ring-1 ring-inset transition-colors",
                query.status === status
                  ? "bg-slate-900 text-white ring-slate-900"
                  : "bg-white text-black/70 ring-black/10 hover:bg-black/2",
              ].join(" ")}
            >
              {status}
            </Link>
          ))}

          <div className="ml-auto text-[12px] text-black/50">
            {total.toLocaleString()} result{total === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] text-left text-[13px]">
              <thead className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
                <tr className="border-b border-black/5">
                  <th className="py-2 pr-4">Reference</th>
                  <th className="py-2 pr-4">Advocate</th>
                  <th className="py-2 pr-4">Assignee</th>
                  <th className="py-2 pr-4">Stage</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Risk</th>
                  <th className="py-2 pr-4">Intake age</th>
                  <th className="py-2 pr-4">Next action</th>
                  <th className="py-2">Updated</th>
                </tr>
              </thead>
              <tbody className="text-black/80">
                {rows.map((row) => (
                  <tr
                    key={row.reference}
                    className="border-b border-black/5 last:border-b-0"
                  >
                    <td className="py-3 pr-4 font-mono text-[12px] text-black/70">
                      {row.reference}
                    </td>
                    <td className="py-3 pr-4 font-medium text-black/80">
                      {row.advocate}
                    </td>
                    <td className="py-3 pr-4 text-black/70">{row.assignee}</td>
                    <td className="py-3 pr-4 text-black/70">{row.stage}</td>
                    <td className="py-3 pr-4">{statusPill(row.status)}</td>
                    <td className="py-3 pr-4">{riskPill(row.risk)}</td>
                    <td className="py-3 pr-4 text-black/60">
                      {row.intakeAgeDays}d / SLA {row.slaDays}d
                    </td>
                    <td className="py-3 pr-4 text-black/70">
                      {row.nextAction}
                    </td>
                    <td className="py-3 text-black/55">{row.updated}</td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-10 text-center text-[13px] text-black/50"
                    >
                      No queue items match this filter set.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-[12px] text-black/50">
              Page{" "}
              <span className="font-medium text-black/70">{query.page}</span> of{" "}
              <span className="font-medium text-black/70">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                aria-disabled={query.page <= 1}
                href={buildHref(basePath, {
                  q: query.q,
                  view: query.view,
                  status: query.status,
                  page: String(Math.max(1, query.page - 1)),
                })}
                className={[
                  "rounded-lg border px-3 py-1.5 text-[12px] transition-colors",
                  query.page <= 1
                    ? "pointer-events-none border-black/5 bg-black/5 text-black/30"
                    : "border-black/10 bg-white text-black/70 hover:bg-black/2",
                ].join(" ")}
              >
                Prev
              </Link>
              <Link
                aria-disabled={query.page >= totalPages}
                href={buildHref(basePath, {
                  q: query.q,
                  view: query.view,
                  status: query.status,
                  page: String(Math.min(totalPages, query.page + 1)),
                })}
                className={[
                  "rounded-lg border px-3 py-1.5 text-[12px] transition-colors",
                  query.page >= totalPages
                    ? "pointer-events-none border-black/5 bg-black/5 text-black/30"
                    : "border-black/10 bg-white text-black/70 hover:bg-black/2",
                ].join(" ")}
              >
                Next
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Link
            href="/dashboard/cases/mine"
            className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[12px] text-black/70 hover:bg-black/2"
          >
            Open My Cases
          </Link>
          <Link
            href="/dashboard/cases/all"
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-[12px] text-white hover:bg-slate-800"
          >
            Open All Cases
          </Link>
        </div>
      </div>
    </div>
  );
}
