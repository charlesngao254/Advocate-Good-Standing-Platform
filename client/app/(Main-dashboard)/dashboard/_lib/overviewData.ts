export type Division = "R&I" | "IHADR" | "Prosecution";

export type CaseStatus =
  | { kind: "Open" }
  | { kind: "In IHADR" }
  | { kind: "Prosecution" }
  | { kind: "Under review" }
  | { kind: "Closed" };

export type RecentCaseRow = {
  reference: string;
  advocate: string;
  division: Division | "—";
  status: CaseStatus;
  lodged: string; // human-friendly date
};

export type RequiresActionItem = {
  title: string;
  subtitle: string;
  tone: "danger" | "warning" | "info";
};

export type OverviewData = {
  asOfLabel: string;
  kpis: {
    openCases: number;
    awaitingReview: number;
    ihadrSessions: number;
    certificatesIssued: number;
  };
  recentCases: RecentCaseRow[];
  requiresAction: RequiresActionItem[];
  divisionWorkload: { division: string; label: string; tone: "info" | "warn" | "danger" }[];
  certificatesThisMonth: { label: string; value: number; tone: "info" | "warn" | "danger" }[];
  recentActivity: { label: string; when: string; tone: "neutral" | "info" | "warn" | "danger" }[];
};

// Deterministic, lightweight PRNG for "dynamic but stable" demo data.
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(seed: number) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function pick<T>(r: () => number, items: readonly T[]) {
  return items[Math.floor(r() * items.length)]!;
}

function randInt(r: () => number, min: number, max: number) {
  return Math.floor(r() * (max - min + 1)) + min;
}

function formatDay(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatAsOf(d: Date) {
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const ADVOCATES = [
  "J. K. Mwangi",
  "A. Otieno",
  "M. Njoroge",
  "R. Wambui",
  "P. Ochieng",
  "S. Kimani",
  "N. Wekesa",
  "L. Achieng",
  "H. Mutiso",
  "E. Kariuki",
] as const;

const DIVISIONS: Division[] = ["R&I", "IHADR", "Prosecution"];

const STATUS: CaseStatus[] = [
  { kind: "Open" },
  { kind: "In IHADR" },
  { kind: "Prosecution" },
  { kind: "Under review" },
  { kind: "Closed" },
];

function makeReference(r: () => number) {
  const year = 2026;
  const seq = randInt(r, 6000, 9999);
  return `ACC/${year}/${seq}`;
}

export function getOverviewData(now = new Date()): OverviewData {
  const daySeed = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const seed = xmur3(`acc-dashboard:${daySeed}`)();
  const r = mulberry32(seed);

  const openCases = clampInt(140 + r() * 40, 120, 220);
  const awaitingReview = clampInt(5 + r() * 8, 2, 18);
  const ihadrSessions = clampInt(1 + r() * 4, 0, 9);
  const certificatesIssued = clampInt(16 + r() * 18, 6, 60);

  const recentCases: RecentCaseRow[] = Array.from({ length: 6 }).map((_, i) => {
    const lodged = new Date(now);
    lodged.setDate(now.getDate() - randInt(r, 1 + i, 12 + i * 3));
    const division = r() < 0.08 ? "—" : pick(r, [...DIVISIONS, ...DIVISIONS, ...DIVISIONS]);
    const status = pick(r, STATUS);
    return {
      reference: makeReference(r),
      advocate: pick(r, ADVOCATES),
      division,
      status,
      lodged: formatDay(lodged),
    };
  });

  const requiresAction: RequiresActionItem[] = [
    {
      title: `${clampInt(awaitingReview + randInt(r, 0, 4), 1, 25)} new complaints need your directions`,
      subtitle: "Lodged in last 48 hrs — review and forward to R&I",
      tone: "danger",
    },
    {
      title: `${clampInt(randInt(r, 1, 6), 1, 12)} certificate requests flagged`,
      subtitle: "Pending matters found — manual approval needed",
      tone: "warning",
    },
    {
      title: `${clampInt(randInt(r, 1, 4), 1, 10)} IHADR compliance deadlines overdue`,
      subtitle: `${makeReference(r)} · ${makeReference(r)}`,
      tone: "warning",
    },
    {
      title: "Tribunal session tomorrow",
      subtitle: `${makeReference(r)} · 9:00 AM · Plea taking`,
      tone: "info",
    },
  ];

  const divisionWorkload = [
    { division: "R&I Division", label: `${clampInt(20 + r() * 20, 5, 99)} open`, tone: "info" as const },
    { division: "IHADR Division", label: `${clampInt(10 + r() * 14, 1, 60)} active`, tone: "warn" as const },
    {
      division: "Prosecution",
      label: `${clampInt(2 + r() * 8, 0, 30)} matters`,
      tone: "danger" as const,
    },
    { division: "Awaiting allocation", label: `${clampInt(4 + r() * 7, 0, 30)} new`, tone: "warn" as const },
  ];

  const certificatesThisMonth = [
    { label: "Auto-generated", value: clampInt(10 + r() * 16, 0, 90), tone: "info" as const },
    { label: "Manually approved", value: clampInt(2 + r() * 8, 0, 40), tone: "warn" as const },
    { label: "Rejected", value: clampInt(r() * 4, 0, 20), tone: "danger" as const },
    { label: "Pending review", value: clampInt(1 + r() * 6, 0, 30), tone: "warn" as const },
  ];

  const recentActivity = [
    { label: `${makeReference(r)} registered`, when: `${randInt(r, 4, 55)} min ago`, tone: "info" as const },
    {
      label: `Certificate ACC-CGS-${now.getFullYear()}-${randInt(r, 2000, 3999)} issued`,
      when: "1 hr ago",
      tone: "neutral" as const,
    },
    { label: `${makeReference(r)} compliance overdue`, when: "2 hr ago", tone: "warn" as const },
    { label: `${makeReference(r)} session scheduled`, when: "Yesterday", tone: "neutral" as const },
  ];

  return {
    asOfLabel: formatAsOf(now),
    kpis: { openCases, awaitingReview, ihadrSessions, certificatesIssued },
    recentCases,
    requiresAction,
    divisionWorkload,
    certificatesThisMonth,
    recentActivity,
  };
}

