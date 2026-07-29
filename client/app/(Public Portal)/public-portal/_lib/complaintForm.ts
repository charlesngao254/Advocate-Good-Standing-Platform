export interface PublicComplaintDraft {
  complainantName: string;
  complainantEmail: string;
  complainantPhone: string;
  respondentName: string;
  respondentFirm: string;
  complaintCategory: string;
  complaintSummary: string;
  incidentDate: string;
  county: string;
  priority: "Low" | "Normal" | "High" | "Urgent";
  formDetails: Record<string, unknown>;
}

const FIELD_MAP: ReadonlyArray<readonly [string, string]> = [
  ['sec1_surname', 'section_one.surname'],
  ['sec1_first_name', 'section_one.first_name'],
  ['sec1_other_name', 'section_one.other_name'],
  ['sec1_title', 'section_one.title'],
  ['sec1_id_number', 'section_one.id_number'],
  ['sec1_postal_address', 'section_one.postal_address'],
  ['sec1_physical_address', 'section_one.physical_address.address'],
  ['sec1_town', 'section_one.physical_address.town'],
  ['sec1_county', 'section_one.physical_address.county'],
  ['sec1_subcounty', 'section_one.physical_address.sub_county'],
  ['sec1_division', 'section_one.physical_address.division'],
  ['sec1_location', 'section_one.physical_address.location'],
  ['sec1_mobile', 'section_one.phone.mobile'],
  ['sec1_office_phone', 'section_one.phone.office'],
  ['sec1_home_phone', 'section_one.phone.home'],
  ['sec1_email', 'section_one.email'],
  ['sec1_behalf_name_address', 'section_one.behalf.complainant_name_address'],
  ['sec1_behalf_reason', 'section_one.behalf.reason'],
  ['sec2_surname', 'section_two.surname'],
  ['sec2_first_name', 'section_two.first_name'],
  ['sec2_other_name', 'section_two.other_name'],
  ['sec2_firm_name', 'section_two.firm_name'],
  ['sec2_firm_size', 'section_two.firm_size'],
  ['sec2_postal_address', 'section_two.postal_address'],
  ['sec2_postcode', 'section_two.postcode'],
  ['sec2_building', 'section_two.physical_address.building'],
  ['sec2_street', 'section_two.physical_address.street'],
  ['sec2_physical_town', 'section_two.physical_address.town'],
  ['sec2_office_phone', 'section_two.phone.office'],
  ['sec2_mobile', 'section_two.phone.mobile'],
  ['sec2_email', 'section_two.email'],
  ['sec2_relationship_other', 'section_two.relationship_other'],
  ['sec2_client_first_contact', 'section_two.client_dates.first_contact'],
  ['sec2_client_last_contact', 'section_two.client_dates.last_contact'],
  ['sec2_raised_with_who', 'section_two.acting_for_you.raised_with_who'],
  ['sec2_reason_not_raised', 'section_two.acting_for_you.reason_not_raised'],
  ['sec2_file_ref', 'section_two.acting_for_you.advocate_file_ref'],
  ['sec2_first_raised_date', 'section_two.acting_for_you.first_raised_date'],
  ['sec2_last_contact_details', 'section_two.acting_for_you.last_contact_details'],
  ['sec2_fee_understanding', 'section_two.acting_for_you.fee_understanding'],
  ['sec2_fee_paid_amount', 'section_two.acting_for_you.fee_paid_amount'],
  ['sec2_legal_proceedings_date', 'section_two.acting_for_you.legal_proceedings_date'],
  ['sec2_new_surname', 'section_two.new_advocate.surname'],
  ['sec2_new_middle', 'section_two.new_advocate.middle_name'],
  ['sec2_new_other', 'section_two.new_advocate.other_name'],
  ['sec2_new_firm_name', 'section_two.new_advocate.firm_name'],
  ['sec2_new_postal_address', 'section_two.new_advocate.postal_address'],
  ['sec2_new_postcode', 'section_two.new_advocate.postcode'],
  ['sec2_new_building', 'section_two.new_advocate.physical_address.building'],
  ['sec2_new_street', 'section_two.new_advocate.physical_address.street'],
  ['sec2_new_town', 'section_two.new_advocate.physical_address.town'],
  ['sec2_new_office_phone', 'section_two.new_advocate.phone.office'],
  ['sec2_new_mobile', 'section_two.new_advocate.phone.mobile'],
  ['sec2_new_email', 'section_two.new_advocate.email'],
  ['sec2_new_instructed_date', 'section_two.new_advocate.instructed_date'],
  ['sec3_work_instructed', 'section_three.work_instructed'],
  ['sec3_work_status', 'section_three.work_status'],
  ['sec3_suit_particulars', 'section_three.suit_particulars'],
  ['sec4_deceased_name', 'section_four.deceased.name'],
  ['sec4_date_of_death', 'section_four.deceased.date_of_death'],
  ['sec4_estate_admin_details', 'section_four.deceased.estate_admin_details'],
  ['sec4_other_beneficiaries', 'section_four.deceased.other_beneficiaries'],
  ['sec4_injured_killed_details', 'section_four.accident.injured_killed_details'],
  ['sec4_insured_defendant_details', 'section_four.accident.insured_defendant_details'],
  ['sec4_insurer_details', 'section_four.accident.insurer_details'],
  ['sec4_policy_number', 'section_four.accident.policy_number'],
  ['sec4_claim_number', 'section_four.accident.claim_number'],
  ['sec4_compensation_amount', 'section_four.accident.compensation_amount'],
  ['sec4_amount_paid', 'section_four.accident.amount_paid'],
  ['sec5_complaint_details', 'section_five.complaint_details'],
  ['sec6_documents_to_return', 'section_six.remedies.documents_to_return'],
  ['sec6_other_details', 'section_six.remedies.other_details'],
  ['sec6_signed_name', 'section_six.signed_name'],
  ['sec6_date', 'section_six.date'],
];

const RADIO_MAP: ReadonlyArray<readonly [string, string]> = [
  ['sec1_on_behalf', 'section_one.on_behalf_of_another'],
  ['sec1_authorised', 'section_one.behalf.authorised'],
  ['sec2_relationship', 'section_two.relationship'],
  ['sec2_raised_writing', 'section_two.acting_for_you.raised_in_writing'],
  ['sec2_correspondence', 'section_two.acting_for_you.correspondence'],
  ['sec2_advocate_declined', 'section_two.acting_for_you.advocate_declined'],
  ['sec2_fee_note_received', 'section_two.acting_for_you.fee_note_received'],
  ['sec2_written_fee_agreement', 'section_two.acting_for_you.written_fee_agreement'],
  ['sec2_fee_paid', 'section_two.acting_for_you.fee_paid'],
  ['sec2_receipts_issued', 'section_two.acting_for_you.receipts_issued'],
  ['sec2_sued_for_fees', 'section_two.acting_for_you.sued_for_fees'],
  ['sec2_new_advocate_instructed', 'section_two.new_advocate.instructed'],
  ['sec2_new_can_contact', 'section_two.new_advocate.can_contact'],
  ['sec3_suit_filed', 'section_three.suit_filed'],
  ['sec4_relates_to_death', 'section_four.relates_to_death'],
  ['sec4_beneficiary', 'section_four.deceased.beneficiary'],
  ['sec4_relates_to_accident', 'section_four.relates_to_accident'],
];

const CHECKBOX_MAP: ReadonlyArray<readonly [string, string]> = [
  ['sec6_return_documents', 'section_six.remedies.return_documents'],
  ['sec6_improve_communication', 'section_six.remedies.improve_communication'],
  ['sec6_improve_service', 'section_six.remedies.improve_service'],
  ['sec6_receive_apology', 'section_six.remedies.receive_apology'],
  ['sec6_resolve_fee_dispute', 'section_six.remedies.resolve_fee_dispute'],
  ['sec6_resolve_dispute', 'section_six.remedies.resolve_dispute'],
  ['sec6_other', 'section_six.remedies.other'],
  ['sec6_declaration', 'section_six.declaration_accepted'],
];

function setPath(target: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.');
  let cursor = target;

  keys.slice(0, -1).forEach((key) => {
    const current = cursor[key];
    if (!current || typeof current !== 'object' || Array.isArray(current)) {
      cursor[key] = {};
    }
    cursor = cursor[key] as Record<string, unknown>;
  });

  cursor[keys[keys.length - 1]] = value;
}

function getField(form: HTMLFormElement, id: string): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
  return form.querySelector(`#${CSS.escape(id)}`);
}

export function getRadioValue(form: HTMLFormElement, name: string): string | null {
  const checked = form.querySelector<HTMLInputElement>(
    `input[name="${CSS.escape(name)}"]:checked`,
  );
  return checked?.value ?? null;
}

function getCheckboxValue(form: HTMLFormElement, id: string): boolean {
  return Boolean(form.querySelector<HTMLInputElement>(`#${CSS.escape(id)}`)?.checked);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function joinName(values: unknown[]): string {
  return values
    .map(asString)
    .map((value) => value.trim())
    .filter(Boolean)
    .join(' ');
}

export function buildPublicComplaintPayload(form: HTMLFormElement): PublicComplaintDraft {
  const formDetails: Record<string, unknown> = {};

  FIELD_MAP.forEach(([id, path]) => {
    const field = getField(form, id);
    if (field?.value) setPath(formDetails, path, field.value);
  });

  RADIO_MAP.forEach(([name, path]) => {
    const value = getRadioValue(form, name);
    if (value) setPath(formDetails, path, value);
  });

  CHECKBOX_MAP.forEach(([id, path]) => {
    setPath(formDetails, path, getCheckboxValue(form, id));
  });

  const sectionOne = asRecord(formDetails.section_one);
  const sectionTwo = asRecord(formDetails.section_two);
  const sectionThree = asRecord(formDetails.section_three);
  const sectionFour = asRecord(formDetails.section_four);
  const sectionFive = asRecord(formDetails.section_five);
  const phone = asRecord(sectionOne.phone);
  const physicalAddress = asRecord(sectionOne.physical_address);
  const clientDates = asRecord(sectionTwo.client_dates);

  const complainantName = joinName([
    sectionOne.first_name,
    sectionOne.other_name,
    sectionOne.surname,
  ]);
  const respondentName = joinName([
    sectionTwo.first_name,
    sectionTwo.other_name,
    sectionTwo.surname,
  ]);

  const relatesToDeath = asString(sectionFour.relates_to_death) === 'yes';
  const relatesToAccident = asString(sectionFour.relates_to_accident) === 'yes';
  const complaintCategory = relatesToAccident
    ? 'Road accident matter'
    : relatesToDeath
      ? 'Estate administration matter'
      : 'Professional misconduct';

  return {
    complainantName,
    complainantEmail: asString(sectionOne.email),
    complainantPhone:
      asString(phone.mobile) || asString(phone.office) || asString(phone.home),
    respondentName,
    respondentFirm: asString(sectionTwo.firm_name),
    complaintCategory,
    complaintSummary: asString(sectionFive.complaint_details),
    incidentDate: asString(clientDates.first_contact),
    county: asString(physicalAddress.county),
    priority: 'Normal',
    formDetails: {
      ...formDetails,
      intake_summary: {
        legal_work: asString(sectionThree.work_instructed),
        work_status: asString(sectionThree.work_status),
      },
    },
  };
}

export interface FormVisibility {
  onBehalf: boolean;
  relationshipOther: boolean;
  clientRelationship: boolean;
  raisedInWritingYes: boolean;
  raisedInWritingNo: boolean;
  noWrittenFeeAgreement: boolean;
  feePaid: boolean;
  suedForFees: boolean;
  newAdvocate: boolean;
  suitFiled: boolean;
  deathMatter: boolean;
  accidentMatter: boolean;
  returnDocuments: boolean;
  otherRemedy: boolean;
}

export const defaultFormVisibility: FormVisibility = {
  onBehalf: false,
  relationshipOther: false,
  clientRelationship: false,
  raisedInWritingYes: false,
  raisedInWritingNo: false,
  noWrittenFeeAgreement: false,
  feePaid: false,
  suedForFees: false,
  newAdvocate: false,
  suitFiled: false,
  deathMatter: false,
  accidentMatter: false,
  returnDocuments: false,
  otherRemedy: false,
};

export function readFormVisibility(form: HTMLFormElement): FormVisibility {
  const relationship = getRadioValue(form, 'sec2_relationship');

  return {
    onBehalf: getRadioValue(form, 'sec1_on_behalf') === 'yes',
    relationshipOther: relationship === 'other',
    clientRelationship: relationship === 'client' || relationship === 'former_client',
    raisedInWritingYes: getRadioValue(form, 'sec2_raised_writing') === 'yes',
    raisedInWritingNo: getRadioValue(form, 'sec2_raised_writing') === 'no',
    noWrittenFeeAgreement: getRadioValue(form, 'sec2_written_fee_agreement') === 'no',
    feePaid: getRadioValue(form, 'sec2_fee_paid') === 'yes',
    suedForFees: getRadioValue(form, 'sec2_sued_for_fees') === 'yes',
    newAdvocate: getRadioValue(form, 'sec2_new_advocate_instructed') === 'yes',
    suitFiled: getRadioValue(form, 'sec3_suit_filed') === 'yes',
    deathMatter: getRadioValue(form, 'sec4_relates_to_death') === 'yes',
    accidentMatter: getRadioValue(form, 'sec4_relates_to_accident') === 'yes',
    returnDocuments: getCheckboxValue(form, 'sec6_return_documents'),
    otherRemedy: getCheckboxValue(form, 'sec6_other'),
  };
}
