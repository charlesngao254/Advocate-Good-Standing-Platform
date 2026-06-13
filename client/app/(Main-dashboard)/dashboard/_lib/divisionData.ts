import {
  getAllCasesData,
  type CaseRow,
  type CaseStatusKind,
  type Division,
} from "./allCasesData";

export type DivisionCode = "R&I" | "IHADR" | "Prosecution";

export type WorkflowStage = {
  name: string;
  count: number;
  tone: "info" | "warn" | "danger" | "ok";
};

export type DivisionCaseRow = CaseRow & {
  assignee: string;
  intakeAgeDays: number;
  slaDays: number;
  stage: string;
  nextAction: string;
  risk: "Critical" | "High" | "Normal" | "Low";
};

export type DivisionOpsData = {
  asOfLabel: string;
  division: DivisionCode;
  mission: string;
  kpis: {
    active: number;
    escalations: number;
    overdueSla: number;
    dueThisWeek: number;
  };
  workflow: WorkflowStage[];
  queue: DivisionCaseRow[];
};

export type DivisionQuery = {
  q?: string;
  view?: "All" | "SLA risk" | "Due this week" | "Escalated";
  status?: CaseStatusKind | "All";
  page?: number;
  pageSize?: number;
};

export type DivisionQueryResult = {
  data: DivisionOpsData;
  query: Required<
    Pick<DivisionQuery, "q" | "view" | "status" | "page" | "pageSize">
  >;
  total: number;
  totalPages: number;
  rows: DivisionCaseRow[];
};

function hashValue(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function formatAsOf(d: Date) {
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function divisionMission(division: DivisionCode) {
  if (division === "R&I") {
    return "Receive complaints, triage admissibility, assign investigators, and prepare review-ready files.";
  }
  if (division === "IHADR") {
    return "Run mediation sessions, track consent outcomes, and enforce post-settlement compliance timelines.";
  }
  return "Build hearing-ready files, manage witness and exhibit readiness, and monitor court-direction compliance.";
}

function stageFor(division: DivisionCode, status: CaseStatusKind, age: number) {
  if (division === "R&I") {
    if (age <= 3) return "Intake screening";
    if (status === "Under review") return "Directions review";
    return "Investigation drafting";
  }
  if (division === "IHADR") {
    if (status === "In IHADR") return "Session scheduling";
    if (age <= 5) return "Party notifications";
    return "Compliance monitoring";
  }
  if (status === "Prosecution") return "Hearing preparation";
  if (age <= 6) return "Charge review";
  return "Trial management";
}

function actionFor(division: DivisionCode, stage: string, slaBreach: boolean) {
  if (slaBreach) return "Escalate to division lead";
  if (division === "R&I" && stage === "Intake screening")
    return "Confirm admissibility";
  if (division === "R&I") return "Issue investigation direction";
  if (division === "IHADR" && stage === "Session scheduling")
    return "Confirm mediator and session date";
  if (division === "IHADR") return "Record settlement compliance";
  if (stage === "Hearing preparation") return "Finalize witness bundle";
  return "Update prosecution progress note";
}

function riskFor(
  age: number,
  slaDays: number,
  status: CaseStatusKind,
): DivisionCaseRow["risk"] {
  const gap = slaDays - age;
  if (gap < 0) return "Critical";
  if (gap <= 2 || status === "Under review") return "High";
  if (gap <= 7) return "Normal";
  return "Low";
}

const ASSIGNEES = [
  "J. K. Mwangi",
  "A. Otieno",
  "M. Njoroge",
  "R. Wambui",
  "P. Ochieng",
  "S. Kimani",
  "N. Wekesa",
  "L. Achieng",
] as const;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function getDivisionData(
  division: DivisionCode,
  now = new Date(),
  query: DivisionQuery = {},
): DivisionQueryResult {
  const q = query.q ?? "";
  const view = query.view ?? "All";
  const status = query.status ?? "All";
  const page = Math.max(1, query.page ?? 1);
  const pageSize = query.pageSize ?? 10;

  const all = getAllCasesData(now, { page: 1, pageSize: 300 }).rows;
  const fromDivision = all.filter((c) => c.division === (division as Division));

  const queue: DivisionCaseRow[] = fromDivision.map((row) => {
    const h = hashValue(`${division}:${row.reference}`);
    const intakeAgeDays = (h % 28) + 1;
    const slaDays = division === "R&I" ? 14 : division === "IHADR" ? 21 : 30;
    const stage = stageFor(division, row.status, intakeAgeDays);
    const risk = riskFor(intakeAgeDays, slaDays, row.status);
    return {
      ...row,
      assignee: ASSIGNEES[h % ASSIGNEES.length],
      intakeAgeDays,
      slaDays,
      stage,
      risk,
      nextAction: actionFor(division, stage, intakeAgeDays > slaDays),
    };
  });

  const qn = normalize(q);
  const filtered = queue.filter((row) => {
    if (status !== "All" && row.status !== status) return false;
    if (
      view === "SLA risk" &&
      !(row.risk === "Critical" || row.risk === "High")
    )
      return false;
    if (
      view === "Due this week" &&
      !(
        row.slaDays - row.intakeAgeDays >= 0 &&
        row.slaDays - row.intakeAgeDays <= 7
      )
    )
      return false;
    if (view === "Escalated" && row.risk !== "Critical") return false;
    if (!qn) return true;
    return normalize(
      `${row.reference} ${row.advocate} ${row.assignee} ${row.stage} ${row.nextAction}`,
    ).includes(qn);
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  const data: DivisionOpsData = {
    asOfLabel: formatAsOf(now),
    division,
    mission: divisionMission(division),
    kpis: {
      active: queue.length,
      escalations: queue.filter((r) => r.risk === "Critical").length,
      overdueSla: queue.filter((r) => r.intakeAgeDays > r.slaDays).length,
      dueThisWeek: queue.filter(
        (r) =>
          r.slaDays - r.intakeAgeDays >= 0 && r.slaDays - r.intakeAgeDays <= 7,
      ).length,
    },
    workflow:
      division === "R&I"
        ? [
            {
              name: "Intake screening",
              count: queue.filter((qRow) => qRow.stage === "Intake screening")
                .length,
              tone: "info",
            },
            {
              name: "Investigation drafting",
              count: queue.filter(
                (qRow) => qRow.stage === "Investigation drafting",
              ).length,
              tone: "warn",
            },
            {
              name: "Directions review",
              count: queue.filter((qRow) => qRow.stage === "Directions review")
                .length,
              tone: "danger",
            },
          ]
        : division === "IHADR"
          ? [
              {
                name: "Session scheduling",
                count: queue.filter(
                  (qRow) => qRow.stage === "Session scheduling",
                ).length,
                tone: "warn",
              },
              {
                name: "Party notifications",
                count: queue.filter(
                  (qRow) => qRow.stage === "Party notifications",
                ).length,
                tone: "info",
              },
              {
                name: "Compliance monitoring",
                count: queue.filter(
                  (qRow) => qRow.stage === "Compliance monitoring",
                ).length,
                tone: "danger",
              },
            ]
          : [
              {
                name: "Charge review",
                count: queue.filter((qRow) => qRow.stage === "Charge review")
                  .length,
                tone: "warn",
              },
              {
                name: "Hearing preparation",
                count: queue.filter(
                  (qRow) => qRow.stage === "Hearing preparation",
                ).length,
                tone: "danger",
              },
              {
                name: "Trial management",
                count: queue.filter((qRow) => qRow.stage === "Trial management")
                  .length,
                tone: "info",
              },
            ],
    queue,
  };

  return {
    data,
    query: { q, view, status, page: safePage, pageSize },
    total,
    totalPages,
    rows: filtered.slice(start, start + pageSize),
  };
}
