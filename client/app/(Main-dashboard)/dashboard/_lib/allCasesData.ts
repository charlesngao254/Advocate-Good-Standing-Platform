export type Division = "R&I" | "IHADR" | "Prosecution";

export type CaseStatusKind = "Open" | "In IHADR" | "Prosecution" | "Under review" | "Closed";

export type CaseRow = {
  reference: string;
  advocate: string;
  division: Division;
  status: CaseStatusKind;
  lodged: string;
  updated: string;
};

export type AllCasesQuery = {
  q?: string;
  division?: Division | "All";
  status?: CaseStatusKind | "All";
  page?: number;
  pageSize?: number;
};

export type AllCasesResult = {
  asOfLabel: string;
  query: Required<Pick<AllCasesQuery, "q" | "division" | "status" | "page" | "pageSize">>;
  total: number;
  totalPages: number;
  rows: CaseRow[];
};

// Deterministic PRNG (same style as overview) so data feels live but stable per day.
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
  "B. Cheruiyot",
  "C. Wanjala",
  "D. Muthoni",
  "F. Nyambura",
  "G. Kiptoo",
] as const;

const DIVISIONS: Division[] = ["R&I", "IHADR", "Prosecution"];

const STATUS: CaseStatusKind[] = ["Open", "In IHADR", "Prosecution", "Under review", "Closed"];

function makeReference(r: () => number) {
  const year = 2026;
  const seq = randInt(r, 1000, 9999);
  return `ACC/${year}/${seq}`;
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function getAllCasesData(now = new Date(), query: AllCasesQuery = {}): AllCasesResult {
  const daySeed = now.toISOString().slice(0, 10);
  const seed = xmur3(`acc-all-cases:${daySeed}`)();
  const r = mulberry32(seed);

  const q = (query.q ?? "").trim();
  const division = (query.division ?? "All") as Division | "All";
  const status = (query.status ?? "All") as CaseStatusKind | "All";
  const pageSize = query.pageSize ?? 12;
  const page = Math.max(1, query.page ?? 1);

  // Generate a realistic list size (stable per day).
  const totalGenerated = 120 + randInt(r, 0, 60);
  const all: CaseRow[] = Array.from({ length: totalGenerated }).map((_, i) => {
    const lodged = new Date(now);
    lodged.setDate(now.getDate() - randInt(r, 1 + i % 4, 240));
    const updated = new Date(lodged);
    updated.setDate(lodged.getDate() + randInt(r, 0, Math.min(45, Math.max(1, i % 20))));
    const divisionPick = pick(r, DIVISIONS);
    const statusPick = pick(r, STATUS);
    return {
      reference: makeReference(r),
      advocate: pick(r, ADVOCATES),
      division: divisionPick,
      status: statusPick,
      lodged: formatDay(lodged),
      updated: formatDay(updated),
    };
  });

  const qn = normalize(q);
  const filtered = all.filter((row) => {
    if (division !== "All" && row.division !== division) return false;
    if (status !== "All" && row.status !== status) return false;
    if (!qn) return true;
    const hay = normalize(`${row.reference} ${row.advocate} ${row.division} ${row.status}`);
    return hay.includes(qn);
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  return {
    asOfLabel: formatAsOf(now),
    query: { q, division, status, page: safePage, pageSize },
    total,
    totalPages,
    rows,
  };
}

