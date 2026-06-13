export type GoodStandingReason =
  | "Practicing certificate renewal"
  | "Employment / appointment"
  | "Visa / immigration"
  | "Foreign bar registration"
  | "Tender / procurement"
  | "Other";

export type CertificateType = "individual" | "law-firm";

export type AdvocateInLawFirm = {
  advocateName: string;
  rollNumber: string;
  idNumber: string;
};

export type GoodStandingCertificate = {
  certificateNo: string;
  type: CertificateType;
  advocateName: string;
  rollNumber: string;
  advocateAddress: string;
  advocateEmail: string;
  idNumber: string;
  issuedOn: string;
  validUntil: string;
  purpose: GoodStandingReason;
  reference: string;
  signerName: string;
  signerTitle: string;
  signerDepartment: string;
  signerSignature?: string; // data URL or path to signature image
  qrToken: string;
  status: "Issued" | "Revoked" | "Expired";
  // For law firm certificates
  firmName?: string;
  advocatesInFirm?: AdvocateInLawFirm[];
};

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDisplayDate(input: string) {
  const d = new Date(input + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function pad(value: number, size = 4) {
  return String(value).padStart(size, "0");
}

export function generateCertificateNo(now = new Date(), sequence = 1) {
  const year = now.getFullYear();
  return `ACC-CGS-${year}-${pad(sequence)}`;
}

export function generateReferenceNo(now = new Date(), sequence = 1) {
  const year = now.getFullYear();
  return `ACC/GS/${year}/${pad(sequence)}`;
}

export function referenceFromCertificateNo(certificateNo: string) {
  const match = /^ACC-CGS-(\d{4})-(\d+)$/.exec(certificateNo.trim());
  if (!match) return generateReferenceNo(new Date(), 1);
  const year = Number(match[1]);
  const sequence = Number(match[2]);
  const date = new Date(year, 0, 1);
  return generateReferenceNo(date, Number.isFinite(sequence) ? sequence : 1);
}

export function buildQrToken(certificateNo: string, rollNumber: string) {
  return `verify|${certificateNo}|${rollNumber}`;
}

export function makeDefaultDraft(now = new Date()): GoodStandingCertificate {
  const issuedOn = formatDateInput(now);
  const validDate = new Date(now);
  validDate.setMonth(validDate.getMonth() + 6);
  const validUntil = formatDateInput(validDate);

  const certificateNo = generateCertificateNo(now, 1);
  const rollNumber = "";
  const reference = referenceFromCertificateNo(certificateNo);

  return {
    certificateNo,
    type: "individual",
    advocateName: "",
    rollNumber,
    advocateAddress: "",
    advocateEmail: "",
    idNumber: "",
    issuedOn,
    validUntil,
    purpose: "Practicing certificate renewal",
    reference,
    signerName: "GEORGE NYAKUNDI",
    signerTitle: "SECRETARY,",
    signerDepartment: "Advocates Complaints Commission",
    signerSignature: undefined,
    qrToken: buildQrToken(certificateNo, rollNumber),
    status: "Issued",
    firmName: "",
    advocatesInFirm: [],
  };
}

export function toPrintableDate(input: string) {
  return formatDisplayDate(input);
}

export function getIssuedCertificates(
  now = new Date(),
): GoodStandingCertificate[] {
  const base = now.getFullYear();
  return [
    {
      certificateNo: `ACC-CGS-${base}-0123`,
      advocateName: "",
      rollNumber: "P.105/1453/82",
      advocateAddress:
        "Njoroge Kuguwa & Co.\nWande Hse 2nd Floor, Uhuru Street\nP.O Box 1190-01000\nTHIKA",
      advocateEmail: "info@nkadvocates.co.ke",
      idNumber: "24567890",
      issuedOn: formatDateInput(new Date(base, 0, 14)),
      validUntil: formatDateInput(new Date(base, 6, 14)),
      purpose: "Employment / appointment",
      reference: generateReferenceNo(new Date(base, 0, 1), 123),
      signerName: "GEORGE NYAKUNDI",
      signerTitle: "SECRETARY,",
      signerDepartment: "Advocates Complaints Commission",
      qrToken: buildQrToken(`ACC-CGS-${base}-0123`, "P.J05/1453/82"),
      status: "Issued",
    },
    {
      certificateNo: `ACC-CGS-${base}-0211`,
      advocateName: "Samuel Otieno Ouma",
      rollNumber: "P.J03/0942/79",
      advocateAddress: "Suite 22, Legal Plaza\nP.O Box 2345-00100\nNAIROBI",
      advocateEmail: "samuel.ouma@example.com",
      idNumber: "22445566",
      issuedOn: formatDateInput(new Date(base, 1, 7)),
      validUntil: formatDateInput(new Date(base, 7, 7)),
      purpose: "Foreign bar registration",
      reference: generateReferenceNo(new Date(base, 0, 1), 211),
      signerName: "GEORGE NYAKUNDI",
      signerTitle: "SECRETARY,",
      signerDepartment: "Advocates Complaints Commission",
      qrToken: buildQrToken(`ACC-CGS-${base}-0211`, "P.J03/0942/79"),
      status: "Issued",
    },
    {
      certificateNo: `ACC-CGS-${base - 1}-1888`,
      advocateName: "Peter Kariuki Mugo",
      rollNumber: "P.J02/0811/75",
      advocateAddress: "12 Legal Street\nP.O Box 777-00100\nEMBU",
      advocateEmail: "peter.mugo@example.com",
      idNumber: "19887766",
      issuedOn: formatDateInput(new Date(base - 1, 10, 22)),
      validUntil: formatDateInput(new Date(base, 4, 22)),
      purpose: "Tender / procurement",
      reference: generateReferenceNo(new Date(base - 1, 0, 1), 1888),
      signerName: "Commission Secretary",
      signerTitle: "Commission Secretary",
      signerDepartment: "Advocates Complaints Commission",
      qrToken: buildQrToken(`ACC-CGS-${base - 1}-1888`, "P.J02/0811/75"),
      status: "Expired",
    },
  ];
}
