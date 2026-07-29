import Link from "next/link";
import { getOverviewData } from "./_lib/overviewData";
export const dynamic = "force-dynamic";

type DotTone = "danger" | "warning" | "info" | "neutral";

function toneDot(tone: DotTone) {
  const cls =
    tone === "danger"
      ? "bg-rose-500"
      : tone === "warning"
        ? "bg-amber-400"
        : tone === "info"
          ? "bg-sky-500"
          : "bg-slate-300";
  return (
    <span
      className={["inline-block h-2 w-2 rounded-full", cls].join(" ")}
      aria-hidden="true"
    />
  );
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

function Card({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="text-xs font-medium text-black/50">{title}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-black/50">{subtitle}</div>
    </div>
  );
}

export default function DashboardHomePage() {
  const data = getOverviewData();
  return (
    <div className="-m-6 min-h-[calc(100dvh-3rem)] bg-slate-50/70 p-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-sm shadow-sm">
              <span className="text-black/40" aria-hidden="true">
                ⌕
              </span>
              <input
                className="w-[240px] bg-transparent text-[13px] outline-none placeholder:text-black/35"
                placeholder="Search cases, advocates, ref"
              />
            </div>
            <div className="hidden text-xs text-black/50 sm:block">
              {data.asOfLabel}
            </div>
            <button
              className="relative grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-black/70 shadow-sm hover:bg-black/2"
              aria-label="Notifications"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="h-5 w-5"
              >
                <path
                  d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.5 18a2.5 2.5 0 0 0 5 0"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
              <span
                className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"
                aria-hidden="true"
              />
            </button>
           <Link
   href="/public-portal/lodge"
  className="rounded-full bg-slate-900 px-4 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-slate-800"
>
  + New complaint
</Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            title="Open cases"
            value={data.kpis.openCases}
            subtitle="Across all divisions"
          />
          <Card
            title="Awaiting my review"
            value={data.kpis.awaitingReview}
            subtitle="New complaints"
          />
          <Card
            title="IHADR sessions"
            value={data.kpis.ihadrSessions}
            subtitle="Scheduled this week"
          />
          <Card
            title="Certificates issued"
            value={data.kpis.certificatesIssued}
            subtitle="This month"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
                  Recent cases
                </div>
              </div>
              <button className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[12px] text-black/70 hover:bg-black/2">
                View all →
              </button>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-[13px]">
                <thead className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
                  <tr className="border-b border-black/5">
                    <th className="py-2 pr-4">Reference</th>
                    <th className="py-2 pr-4">Advocate</th>
                    <th className="py-2 pr-4">Division</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2">Lodged</th>
                  </tr>
                </thead>
                <tbody className="text-black/80">
                  {data.recentCases.map((row) => (
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
                      <td className="py-3 pr-4 text-black/65">
                        {row.division}
                      </td>
                      <td className="py-3 pr-4">
                        {statusPill(row.status.kind)}
                      </td>
                      <td className="py-3 text-black/55">{row.lodged}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
              Requires action
            </div>
            <div className="mt-3 space-y-3">
              {data.requiresAction.map((item, idx) => (
                <div
                  key={idx}
                  className={[
                    "rounded-xl border p-3",
                    item.tone === "danger"
                      ? "border-rose-100 bg-rose-50/60"
                      : item.tone === "warning"
                        ? "border-amber-100 bg-amber-50/60"
                        : "border-sky-100 bg-sky-50/60",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-1">{toneDot(item.tone)}</div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-black/80">
                        {item.title}
                      </div>
                      <div className="mt-0.5 text-[12px] text-black/55">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
              Division workload
            </div>
            <div className="mt-3 space-y-3">
              {data.divisionWorkload.map((row) => (
                <div
                  key={row.division}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="text-[13px] text-black/70">
                    {row.division}
                  </div>
                  <div
                    className={[
                      "rounded-full px-2 py-0.5 text-[12px] ring-1 ring-inset",
                      row.tone === "danger"
                        ? "bg-rose-50 text-rose-700 ring-rose-200"
                        : row.tone === "warn"
                          ? "bg-amber-50 text-amber-800 ring-amber-200"
                          : "bg-sky-50 text-sky-700 ring-sky-200",
                    ].join(" ")}
                  >
                    {row.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
              Certificates this month
            </div>
            <div className="mt-3 space-y-3">
              {data.certificatesThisMonth.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="text-[13px] text-black/70">{row.label}</div>
                  <div
                    className={[
                      "text-[13px] font-semibold",
                      row.tone === "danger"
                        ? "text-rose-700"
                        : row.tone === "warn"
                          ? "text-amber-700"
                          : "text-emerald-700",
                    ].join(" ")}
                  >
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
              Recent activity
            </div>
            <div className="mt-3 space-y-3">
              {data.recentActivity.map((row, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1">
                    {toneDot(row.tone === "warn" ? "danger" : row.tone)}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium text-black/80">
                      {row.label}
                    </div>
                    <div className="text-[12px] text-black/50">{row.when}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
