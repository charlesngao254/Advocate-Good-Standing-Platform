import Link from "next/link";
import {
  getAllCasesData,
  type CaseRow,
  type CaseStatusKind,
  type Division,
} from "../../_lib/allCasesData";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type MineView = "Needs action" | "All mine" | "Overdue" | "Due in 7 days";
type Priority = "Critical" | "High" | "Normal" | "Low";

type MyCaseRow = CaseRow & {
  owner: "Commission Secretary";
  nextAction: string;
  dueLabel: string;
  dueInDays: number;
  priority: Priority;
};

function getParam(
  sp: Record<string, string | string[] | undefined>,
  key: string,
) {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

function hashRef(ref: string) {
  let h = 2166136261;
  for (let i = 0; i < ref.length; i++) {
    h ^= ref.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function dueLabel(days: number) {
  if (days < 0)
    return `Overdue ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

function priorityFor(status: CaseStatusKind, days: number): Priority {
  if (days < 0) return "Critical";
  if (days <= 2 || status === "Under review") return "High";
  if (days <= 7 || status === "Open") return "Normal";
  return "Low";
}

function actionFor(status: CaseStatusKind, days: number) {
  if (days < 0) return "Escalate and issue direction";
  if (status === "Under review") return "Approve review outcome";
  if (status === "In IHADR") return "Confirm session readiness";
  if (status === "Prosecution") return "Validate prosecution brief";
  if (status === "Closed") return "Archive and issue closure note";
  return "Assign investigator";
}

function mapMineRows(rows: CaseRow[]) {
  return rows
    .filter((row) => hashRef(row.reference) % 2 === 0)
    .map((row) => {
      const h = hashRef(row.reference);
      const dueInDays = (h % 16) - 3;
      return {
        ...row,
        owner: "Commission Secretary" as const,
        dueInDays,
        dueLabel: dueLabel(dueInDays),
        priority: priorityFor(row.status, dueInDays),
        nextAction: actionFor(row.status, dueInDays),
      };
    });
}

function priorityPill(priority: Priority) {
  const map: Record<Priority, string> = {
    Critical: "bg-rose-50 text-rose-700 ring-rose-200",
    High: "bg-amber-50 text-amber-800 ring-amber-200",
    Normal: "bg-sky-50 text-sky-700 ring-sky-200",
    Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ring-inset",
        map[priority],
      ].join(" ")}
    >
      {priority}
    </span>
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

function buildHref(base: string, params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && v !== "All" && v !== "All mine") sp.set(k, v);
  }
  const s = sp.toString();
  return s ? `${base}?${s}` : base;
}

export default async function MyCasesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = getParam(sp, "q") ?? "";
  const division = (getParam(sp, "division") ?? "All") as Division | "All";
  const status = (getParam(sp, "status") ?? "All") as CaseStatusKind | "All";
  const view = (getParam(sp, "view") ?? "Needs action") as MineView;
  const page = Number(getParam(sp, "page") ?? "1") || 1;
  const pageSize = 10;

  const allCases = getAllCasesData(new Date(), { page: 1, pageSize: 260 }).rows;
  const mine = mapMineRows(allCases);

  const qn = q.trim().toLowerCase();
  const filtered = mine.filter((row) => {
    if (division !== "All" && row.division !== division) return false;
    if (status !== "All" && row.status !== status) return false;
    if (view === "Needs action" && row.priority === "Low") return false;
    if (view === "Overdue" && row.dueInDays >= 0) return false;
    if (view === "Due in 7 days" && (row.dueInDays < 0 || row.dueInDays > 7))
      return false;
    if (!qn) return true;
    return `${row.reference} ${row.advocate} ${row.status} ${row.nextAction}`
      .toLowerCase()
      .includes(qn);
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  const overdue = mine.filter((c) => c.dueInDays < 0).length;
  const dueSoon = mine.filter(
    (c) => c.dueInDays >= 0 && c.dueInDays <= 7,
  ).length;
  const highPriority = mine.filter(
    (c) => c.priority === "Critical" || c.priority === "High",
  ).length;

  return (
    <div className="-m-6 min-h-[calc(100dvh-3rem)] bg-slate-50/70 p-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs text-black/50">Cases</div>
            <h1 className="text-2xl font-semibold tracking-tight">My cases</h1>
            <div className="mt-1 text-xs text-black/45">
              Your active workload and next actions as Commission Secretary
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <form
              action="/dashboard/cases/mine"
              method="get"
              className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-sm shadow-sm"
            >
              <span className="text-black/40" aria-hidden="true">
                ⌕
              </span>
              <input
                defaultValue={q}
                className="w-[250px] bg-transparent text-[13px] outline-none placeholder:text-black/35"
                placeholder="Search reference, advocate, next action…"
                name="q"
              />
              <input type="hidden" name="view" value={view} />
              <input type="hidden" name="division" value={division} />
              <input type="hidden" name="status" value={status} />
              <button
                type="submit"
                className="rounded-full border border-black/10 px-3 py-1 text-[12px] text-black/70 hover:bg-black/2"
              >
                Search
              </button>
            </form>
            <Link
              href="/dashboard/cases/all"
              className="rounded-full bg-slate-900 px-4 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-slate-800"
            >
              + Open all cases
            </Link>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="text-xs text-black/50">Assigned to me</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight">
              {mine.length}
            </div>
          </div>
          <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="text-xs text-black/50">High priority</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-amber-700">
              {highPriority}
            </div>
          </div>
          <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="text-xs text-black/50">Overdue</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-rose-700">
              {overdue}
            </div>
          </div>
          <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="text-xs text-black/50">Due in 7 days</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-sky-700">
              {dueSoon}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
            View
          </div>
          {(
            ["Needs action", "All mine", "Overdue", "Due in 7 days"] as const
          ).map((v) => (
            <Link
              key={v}
              href={buildHref("/dashboard/cases/mine", {
                q,
                division,
                status,
                view: v,
                page: "1",
              })}
              className={[
                "rounded-full px-3 py-1.5 text-[12px] ring-1 ring-inset transition-colors",
                view === v
                  ? "bg-slate-900 text-white ring-slate-900"
                  : "bg-white text-black/70 ring-black/10 hover:bg-black/2",
              ].join(" ")}
            >
              {v}
            </Link>
          ))}

          <div className="ml-2 text-[11px] font-semibold uppercase tracking-wider text-black/45">
            Division
          </div>
          {(["All", "R&I", "IHADR", "Prosecution"] as const).map((d) => (
            <Link
              key={d}
              href={buildHref("/dashboard/cases/mine", {
                q,
                division: d,
                status,
                view,
                page: "1",
              })}
              className={[
                "rounded-full px-3 py-1.5 text-[12px] ring-1 ring-inset transition-colors",
                division === d
                  ? "bg-slate-900 text-white ring-slate-900"
                  : "bg-white text-black/70 ring-black/10 hover:bg-black/2",
              ].join(" ")}
            >
              {d}
            </Link>
          ))}

          <div className="ml-2 text-[11px] font-semibold uppercase tracking-wider text-black/45">
            Status
          </div>
          {(
            [
              "All",
              "Open",
              "Under review",
              "In IHADR",
              "Prosecution",
              "Closed",
            ] as const
          ).map((s) => (
            <Link
              key={s}
              href={buildHref("/dashboard/cases/mine", {
                q,
                division,
                status: s,
                view,
                page: "1",
              })}
              className={[
                "rounded-full px-3 py-1.5 text-[12px] ring-1 ring-inset transition-colors",
                status === s
                  ? "bg-slate-900 text-white ring-slate-900"
                  : "bg-white text-black/70 ring-black/10 hover:bg-black/2",
              ].join(" ")}
            >
              {s}
            </Link>
          ))}

          <div className="ml-auto text-[12px] text-black/50">
            {total.toLocaleString()} result{total === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-[13px]">
              <thead className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
                <tr className="border-b border-black/5">
                  <th className="py-2 pr-4">Reference</th>
                  <th className="py-2 pr-4">Advocate</th>
                  <th className="py-2 pr-4">Division</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Priority</th>
                  <th className="py-2 pr-4">Due</th>
                  <th className="py-2 pr-4">Next action</th>
                  <th className="py-2">Last updated</th>
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
                    <td className="py-3 pr-4 text-black/65">{row.division}</td>
                    <td className="py-3 pr-4">{statusPill(row.status)}</td>
                    <td className="py-3 pr-4">{priorityPill(row.priority)}</td>
                    <td
                      className={[
                        "py-3 pr-4 font-medium",
                        row.dueInDays < 0
                          ? "text-rose-700"
                          : row.dueInDays <= 2
                            ? "text-amber-700"
                            : "text-black/60",
                      ].join(" ")}
                    >
                      {row.dueLabel}
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
                      colSpan={8}
                      className="py-10 text-center text-[13px] text-black/50"
                    >
                      No cases matched your filters. Try resetting the view to
                      &quot;All mine&quot;.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-[12px] text-black/50">
              Page <span className="font-medium text-black/70">{safePage}</span>{" "}
              of <span className="font-medium text-black/70">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                aria-disabled={safePage <= 1}
                href={buildHref("/dashboard/cases/mine", {
                  q,
                  division,
                  status,
                  view,
                  page: String(Math.max(1, safePage - 1)),
                })}
                className={[
                  "rounded-lg border px-3 py-1.5 text-[12px] transition-colors",
                  safePage <= 1
                    ? "pointer-events-none border-black/5 bg-black/5 text-black/30"
                    : "border-black/10 bg-white text-black/70 hover:bg-black/2",
                ].join(" ")}
              >
                Prev
              </Link>
              <Link
                aria-disabled={safePage >= totalPages}
                href={buildHref("/dashboard/cases/mine", {
                  q,
                  division,
                  status,
                  view,
                  page: String(Math.min(totalPages, safePage + 1)),
                })}
                className={[
                  "rounded-lg border px-3 py-1.5 text-[12px] transition-colors",
                  safePage >= totalPages
                    ? "pointer-events-none border-black/5 bg-black/5 text-black/30"
                    : "border-black/10 bg-white text-black/70 hover:bg-black/2",
                ].join(" ")}
              >
                Next
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
