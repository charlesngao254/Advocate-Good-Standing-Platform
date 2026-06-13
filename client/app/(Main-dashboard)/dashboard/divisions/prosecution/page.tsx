import { DivisionPage } from "../_components/DivisionPage";
import { getDivisionData } from "../../_lib/divisionData";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getParam(
  sp: Record<string, string | string[] | undefined>,
  key: string,
) {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function ProsecutionDivisionPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = getParam(sp, "q") ?? "";
  const view = (getParam(sp, "view") ?? "All") as
    | "All"
    | "SLA risk"
    | "Due this week"
    | "Escalated";
  const status = (getParam(sp, "status") ?? "All") as
    | "All"
    | "Open"
    | "In IHADR"
    | "Prosecution"
    | "Under review"
    | "Closed";
  const page = Number(getParam(sp, "page") ?? "1") || 1;

  const result = getDivisionData("Prosecution", new Date(), {
    q,
    view,
    status,
    page,
  });

  return (
    <DivisionPage
      title="Prosecution Division"
      division="Prosecution"
      basePath="/dashboard/divisions/prosecution"
      result={result}
    />
  );
}
