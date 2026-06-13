import Link from "next/link";
import { getAllCasesData, type AllCasesQuery } from "../../_lib/allCasesData";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getParam(
  sp: Record<string, string | string[] | undefined>,
  key: string,
) {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
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
    if (v && v !== "All") sp.set(k, v);
  }
  const s = sp.toString();
  return s ? `${base}?${s}` : base;
}

export default async function AllCasesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = getParam(sp, "q") ?? "";
  const division = getParam(sp, "division") ?? "All";
  const status = getParam(sp, "status") ?? "All";
  const page = Number(getParam(sp, "page") ?? "1") || 1;

  const data = getAllCasesData(new Date(), {
    q,
    division: division as AllCasesQuery["division"],
    status: status as AllCasesQuery["status"],
    page,
  });

  return (
    <div className="-m-6 min-h-[calc(100dvh-3rem)] bg-slate-50/70 p-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs text-black/50">Cases</div>
            <h1 className="text-2xl font-semibold tracking-tight">All cases</h1>
            <div className="mt-1 text-xs text-black/45">{data.asOfLabel}</div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-sm shadow-sm">
              <span className="text-black/40" aria-hidden="true">
                ⌕
              </span>
              <input
                defaultValue={q}
                className="w-[260px] bg-transparent text-[13px] outline-none placeholder:text-black/35"
                placeholder="Search reference, advocate, status…"
                name="q"
                // Server component: keep input visual; use links below for filtering
                readOnly
              />
            </div>
            <button className="rounded-full bg-slate-900 px-4 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-slate-800">
              + New case
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
            Division
          </div>
          {(["All", "R&I", "IHADR", "Prosecution"] as const).map((d) => (
            <Link
              key={d}
              href={buildHref("/dashboard/cases/all", {
                q,
                division: d,
                status,
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
              href={buildHref("/dashboard/cases/all", {
                q,
                division,
                status: s,
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
            {data.total.toLocaleString()} result{data.total === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-[13px]">
              <thead className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
                <tr className="border-b border-black/5">
                  <th className="py-2 pr-4">Reference</th>
                  <th className="py-2 pr-4">Advocate</th>
                  <th className="py-2 pr-4">Division</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Lodged</th>
                  <th className="py-2">Last updated</th>
                </tr>
              </thead>
              <tbody className="text-black/80">
                {data.rows.map((row) => (
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
                    <td className="py-3 pr-4 text-black/55">{row.lodged}</td>
                    <td className="py-3 text-black/55">{row.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-[12px] text-black/50">
              Page{" "}
              <span className="font-medium text-black/70">
                {data.query.page}
              </span>{" "}
              of{" "}
              <span className="font-medium text-black/70">
                {data.totalPages}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                aria-disabled={data.query.page <= 1}
                href={buildHref("/dashboard/cases/all", {
                  q,
                  division,
                  status,
                  page: String(Math.max(1, data.query.page - 1)),
                })}
                className={[
                  "rounded-lg border px-3 py-1.5 text-[12px] transition-colors",
                  data.query.page <= 1
                    ? "pointer-events-none border-black/5 bg-black/5 text-black/30"
                    : "border-black/10 bg-white text-black/70 hover:bg-black/2",
                ].join(" ")}
              >
                Prev
              </Link>
              <Link
                aria-disabled={data.query.page >= data.totalPages}
                href={buildHref("/dashboard/cases/all", {
                  q,
                  division,
                  status,
                  page: String(Math.min(data.totalPages, data.query.page + 1)),
                })}
                className={[
                  "rounded-lg border px-3 py-1.5 text-[12px] transition-colors",
                  data.query.page >= data.totalPages
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
