export type ComplaintPriority = "Low" | "Normal" | "High" | "Urgent";

export type ComplaintStatus =
  | "Received"
  | "Under Review"
  | "Assigned"
  | "In Progress"
  | "Closed";

export type PublicComplaint = {
  complaintRef: string;
  complainantName: string;
  complainantEmail: string;
  complainantPhone: string;
  respondentName: string;
  respondentFirm: string;
  complaintCategory: string;
  complaintSummary: string;
  incidentDate: string;
  county: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  lodgedOn: string;
  lastUpdatedOn: string;
};

export type PublicCertificateRecord = {
  certificateNo: string;
  advocateName: string;
  status: "Issued" | "Revoked" | "Expired";
  issuedOn: string;
  validUntil: string;
  qrToken: string;
};

const STORAGE_KEY = "publicComplaints";

function readAll(): PublicComplaint[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(complaints: PublicComplaint[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

function pad(value: number, size = 4) {
  return String(value).padStart(size, "0");
}

export function generateComplaintRef(
  now = new Date(),
  current: PublicComplaint[] = [],
) {
  const year = now.getFullYear();
  const maxSequence = current.reduce((max, item) => {
    const match = /^ACC-CMP-(\d{4})-(\d{4})$/.exec(item.complaintRef);
    if (!match) return max;
    const itemYear = Number(match[1]);
    const seq = Number(match[2]);
    if (itemYear !== year || !Number.isFinite(seq)) return max;
    return Math.max(max, seq);
  }, 0);

  return `ACC-CMP-${year}-${pad(maxSequence + 1)}`;
}

export function listPublicComplaints() {
  return readAll();
}

export function savePublicComplaint(
  payload: Omit<
    PublicComplaint,
    "complaintRef" | "lodgedOn" | "lastUpdatedOn" | "status"
  >,
) {
  const current = readAll();
  const nowIso = new Date().toISOString();
  const complaint: PublicComplaint = {
    ...payload,
    complaintRef: generateComplaintRef(new Date(), current),
    status: "Received",
    lodgedOn: nowIso,
    lastUpdatedOn: nowIso,
  };

  const next = [complaint, ...current];
  writeAll(next);
  return complaint;
}

export function findComplaint(query: {
  complaintRef?: string;
  email?: string;
  phone?: string;
}) {
  const ref = (query.complaintRef || "").trim().toLowerCase();
  const email = (query.email || "").trim().toLowerCase();
  const phone = (query.phone || "").replace(/\s+/g, "");

  return readAll().find((item) => {
    const itemRef = item.complaintRef.toLowerCase();
    const itemEmail = item.complainantEmail.toLowerCase();
    const itemPhone = item.complainantPhone.replace(/\s+/g, "");

    if (ref && itemRef === ref) return true;
    if (!ref && email && phone)
      return itemEmail === email && itemPhone === phone;
    return false;
  });
}

export function verifyCertificate(query: {
  certificateNo?: string;
  token?: string;
}): PublicCertificateRecord | null {
  if (typeof window === "undefined") return null;

  const certNo = (query.certificateNo || "").trim();
  const token = (query.token || "").trim();

  try {
    const raw = localStorage.getItem("issuedCertificates");
    if (!raw) return null;
    const certificates = JSON.parse(raw) as unknown;
    if (!Array.isArray(certificates)) return null;

    const found = certificates.find((item): item is PublicCertificateRecord => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Record<string, unknown>;
      if (typeof candidate.certificateNo !== "string") return false;
      if (typeof candidate.qrToken !== "string") return false;

      if (certNo && candidate.certificateNo === certNo) return true;
      if (token && candidate.qrToken === token) return true;
      return false;
    });

    return found ?? null;
  } catch {
    return null;
  }
}
