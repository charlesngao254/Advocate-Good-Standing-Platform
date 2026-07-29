import type { FormVisibility } from '../_lib/complaintForm';

interface ComplaintFormFieldsProps {
  visibility: FormVisibility;
  submissionDate: string;
}

export function ComplaintFormFields({ visibility, submissionDate }: ComplaintFormFieldsProps) {
  return (
    <>
      <section id="section-1" className="card section-card rounded-xl p-7">
        <h2 className="font-serif-display text-xl text-navy-deep mb-1">Section One — Personal Details</h2>
        <p className="text-navy-deep/50 text-xs mb-6">Your details as the person making this complaint.</p>
        <div className="grid sm:grid-cols-3 gap-5 field-group">
          <div>
            <label className="field-label">
              <span className="q-num">Q1a</span>
              Surname *
            </label>
            <input type="text" id="sec1_surname" required className="input-field w-full px-3.5 py-2.5 text-sm" name="sec1_surname" />
          </div>
          <div>
            <label className="field-label">First name *</label>
            <input type="text" id="sec1_first_name" required className="input-field w-full px-3.5 py-2.5 text-sm" name="sec1_first_name" />
          </div>
          <div>
            <label className="field-label">Other name</label>
            <input type="text" id="sec1_other_name" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec1_other_name" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5 field-group">
          <div>
            <label className="field-label">
              <span className="q-num">Q1b</span>
              Title
            </label>
            <select id="sec1_title" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec1_title">
              <option value="">Select…</option>
              <option>Mr</option>
              <option>Mrs</option>
              <option>Miss</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="field-label">
              <span className="q-num">Q1c</span>
              Personal ID number (ID / passport / driving licence)
            </label>
            <input type="text" id="sec1_id_number" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec1_id_number" />
          </div>
        </div>
        <div className="field-group">
          <label className="field-label">
            <span className="q-num">Q2</span>
            Postal address
          </label>
          <input type="text" id="sec1_postal_address" className="input-field w-full px-3.5 py-2.5 text-sm" placeholder="P.O. Box …" name="sec1_postal_address" />
        </div>
        <div className="grid sm:grid-cols-3 gap-5 field-group">
          <div>
            <label className="field-label">
              <span className="q-num">Q3</span>
              Physical address
            </label>
            <input type="text" id="sec1_physical_address" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec1_physical_address" />
          </div>
          <div>
            <label className="field-label">Town</label>
            <input type="text" id="sec1_town" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec1_town" />
          </div>
          <div>
            <label className="field-label">County</label>
            <input type="text" id="sec1_county" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec1_county" />
          </div>
          <div>
            <label className="field-label">Sub-County</label>
            <input type="text" id="sec1_subcounty" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec1_subcounty" />
          </div>
          <div>
            <label className="field-label">Division</label>
            <input type="text" id="sec1_division" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec1_division" />
          </div>
          <div>
            <label className="field-label">Location / Sub-location</label>
            <input type="text" id="sec1_location" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec1_location" />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-5 field-group">
          <div>
            <label className="field-label">
              <span className="q-num">Q4</span>
              Mobile number
            </label>
            <input type="tel" id="sec1_mobile" className="input-field w-full px-3.5 py-2.5 text-sm" placeholder="07XXXXXXXX" name="sec1_mobile" />
          </div>
          <div>
            <label className="field-label">Office number</label>
            <input type="tel" id="sec1_office_phone" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec1_office_phone" />
          </div>
          <div>
            <label className="field-label">Home number</label>
            <input type="tel" id="sec1_home_phone" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec1_home_phone" />
          </div>
        </div>
        <div className="field-group">
          <label className="field-label">
            <span className="q-num">Q5</span>
            Email address *
          </label>
          <input type="email" id="sec1_email" required className="input-field w-full px-3.5 py-2.5 text-sm" name="sec1_email" />
        </div>
        <div className="field-group">
          <label className="field-label">
            <span className="q-num">Q6</span>
            Are you making this complaint on behalf of another person, such as a client or relative?
          </label>
          <div className="yn-group">
            <label className="yn-option">
              <input type="radio" name="sec1_on_behalf" value="yes" />
              Yes
            </label>
            <label className="yn-option">
              <input type="radio" name="sec1_on_behalf" value="no" defaultChecked />
              No
            </label>
          </div>
        </div>
        <div id="sec1-behalf-block" className={`${visibility.onBehalf ? 'block' : 'hidden'} border-l-2 border-brass/40 pl-5`}>
          <div className="field-group">
            <label className="field-label">
              <span className="q-num">Q7a</span>
              Complainant's full name and postal address
            </label>
            <textarea id="sec1_behalf_name_address" rows={2} className="input-field w-full px-3.5 py-2.5 text-sm" name="sec1_behalf_name_address" />
          </div>
          <div className="field-group">
            <label className="field-label">
              <span className="q-num">Q7b</span>
              Reason for complaining on behalf of someone else
            </label>
            <textarea id="sec1_behalf_reason" rows={2} className="input-field w-full px-3.5 py-2.5 text-sm" name="sec1_behalf_reason" />
          </div>
          <div className="field-group">
            <label className="field-label">
              <span className="q-num">Q7c</span>
              Are you authorised to make this complaint on behalf of this person?
            </label>
            <div className="yn-group">
              <label className="yn-option">
                <input type="radio" name="sec1_authorised" value="yes" />
                Yes — I will attach written authorisation
              </label>
              <label className="yn-option">
                <input type="radio" name="sec1_authorised" value="no" />
                No — I will seek written authorisation
              </label>
            </div>
          </div>
        </div>
      </section>
      <section id="section-2" className="card section-card rounded-xl p-7">
        <h2 className="font-serif-display text-xl text-navy-deep mb-1">Section Two — The Advocate About Whom You Are Complaining</h2>
        <p className="text-navy-deep/50 text-xs mb-6">Details of the advocate and, if relevant, your dealings with them.</p>
        <div className="grid sm:grid-cols-3 gap-5 field-group">
          <div>
            <label className="field-label">
              <span className="q-num">Q8</span>
              Advocate's surname *
            </label>
            <input type="text" id="sec2_surname" required className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_surname" />
          </div>
          <div>
            <label className="field-label">First name</label>
            <input type="text" id="sec2_first_name" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_first_name" />
          </div>
          <div>
            <label className="field-label">Other name</label>
            <input type="text" id="sec2_other_name" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_other_name" />
          </div>
        </div>
        <div className="field-group">
          <label className="field-label">Name of the advocate's firm, if applicable</label>
          <input type="text" id="sec2_firm_name" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_firm_name" />
        </div>
        <div className="field-group">
          <label className="field-label">Number of advocates in the law firm</label>
          <select id="sec2_firm_size" className="input-field w-full sm:w-64 px-3.5 py-2.5 text-sm" name="sec2_firm_size">
            <option value="">Select…</option>
            <option value="sole_practitioner">Sole Practitioner</option>
            <option value="2-10">2–10</option>
            <option value="above_11">Above 11</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        <div className="grid sm:grid-cols-2 gap-5 field-group">
          <div>
            <label className="field-label">Advocate's postal address</label>
            <input type="text" id="sec2_postal_address" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_postal_address" />
          </div>
          <div>
            <label className="field-label">Postcode</label>
            <input type="text" id="sec2_postcode" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_postcode" />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-5 field-group">
          <div>
            <label className="field-label">Physical address — Building</label>
            <input type="text" id="sec2_building" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_building" />
          </div>
          <div>
            <label className="field-label">Street</label>
            <input type="text" id="sec2_street" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_street" />
          </div>
          <div>
            <label className="field-label">Town</label>
            <input type="text" id="sec2_physical_town" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_physical_town" />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-5 field-group">
          <div>
            <label className="field-label">Office telephone</label>
            <input type="tel" id="sec2_office_phone" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_office_phone" />
          </div>
          <div>
            <label className="field-label">Mobile</label>
            <input type="tel" id="sec2_mobile" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_mobile" />
          </div>
          <div>
            <label className="field-label">Email address</label>
            <input type="email" id="sec2_email" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_email" />
          </div>
        </div>
        <div className="field-group">
          <label className="field-label">
            <span className="q-num">Q9</span>
            Your relationship to the advocate
          </label>
          <div className="grid sm:grid-cols-2 gap-2">
            <label className="yn-option">
              <input type="radio" name="sec2_relationship" value="client" />
              I am a client
            </label>
            <label className="yn-option">
              <input type="radio" name="sec2_relationship" value="opposing_advocate" />
              I am an opposing advocate
            </label>
            <label className="yn-option">
              <input type="radio" name="sec2_relationship" value="former_client" />
              I am a former client
            </label>
            <label className="yn-option">
              <input type="radio" name="sec2_relationship" value="opposing_party" />
              I am an opposing party
            </label>
            <label className="yn-option">
              <input type="radio" name="sec2_relationship" value="other" />
              Other
            </label>
          </div>
          <input type="text" id="sec2_relationship_other" placeholder="Please specify" className={`${visibility.relationshipOther ? 'block' : 'hidden'} input-field w-full px-3.5 py-2.5 text-sm mt-2`} name="sec2_relationship_other" />
        </div>
        <div id="sec2-client-block" className={`${visibility.clientRelationship ? 'block' : 'hidden'} border-l-2 border-brass/40 pl-5 mb-2`}>
          <div className="grid sm:grid-cols-2 gap-5 field-group">
            <div>
              <label className="field-label">
                <span className="q-num">Q10</span>
                Date of first contact with advocate
              </label>
              <input type="date" id="sec2_client_first_contact" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_client_first_contact" />
            </div>
            <div>
              <label className="field-label">Date of last contact with advocate</label>
              <input type="date" id="sec2_client_last_contact" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_client_last_contact" />
            </div>
          </div>
          <p className="text-sm text-navy-deep/70 mb-3 mt-2">
            <span className="q-num">Q11</span>
            If the advocate you are complaining about is acting for you, please answer the following:
          </p>
          <div className="field-group">
            <label className="field-label">
              Have you already raised your complaint in writing, either with the advocate or a senior partner in the firm?
            </label>
            <div className="yn-group">
              <label className="yn-option">
                <input type="radio" name="sec2_raised_writing" value="yes" />
                Yes
              </label>
              <label className="yn-option">
                <input type="radio" name="sec2_raised_writing" value="no" />
                No
              </label>
            </div>
          </div>
          <div id="sec2-raised-yes-block" className={`${visibility.raisedInWritingYes ? 'block' : 'hidden'} `}>
            <div className="field-group">
              <label className="field-label">If so, who?</label>
              <input type="text" id="sec2_raised_with_who" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_raised_with_who" />
            </div>
            <div className="field-group">
              <label className="field-label">Correspondence copies</label>
              <div className="yn-group">
                <label className="yn-option">
                  <input type="radio" name="sec2_correspondence" value="enclosed" />
                  Enclosed
                </label>
                <label className="yn-option">
                  <input type="radio" name="sec2_correspondence" value="not_enclosed" />
                  Not enclosed
                </label>
              </div>
            </div>
          </div>
          <div id="sec2-raised-no-block" className={`${visibility.raisedInWritingNo ? 'block' : 'hidden'} field-group`}>
            <label className="field-label">If no, please briefly explain why you have not raised the matter in writing</label>
            <textarea id="sec2_reason_not_raised" rows={2} className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_reason_not_raised" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5 field-group">
            <div>
              <label className="field-label">Advocate's file reference number</label>
              <input type="text" id="sec2_file_ref" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_file_ref" />
            </div>
            <div>
              <label className="field-label">When did you first raise your complaint with your advocate(s)?</label>
              <input type="date" id="sec2_first_raised_date" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_first_raised_date" />
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">Have the advocates told you they will no longer act for you?</label>
            <div className="yn-group">
              <label className="yn-option">
                <input type="radio" name="sec2_advocate_declined" value="yes" />
                Yes
              </label>
              <label className="yn-option">
                <input type="radio" name="sec2_advocate_declined" value="no" />
                No
              </label>
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">When was the last time you were in contact with the advocate, and what occurred?</label>
            <textarea id="sec2_last_contact_details" rows={3} className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_last_contact_details" />
          </div>
          <div className="field-group">
            <label className="field-label">
              If finalised, have you received a fee note / invoice / bill of costs?
              <span className="text-navy-deep/40">(attach copy if available)</span>
            </label>
            <div className="yn-group">
              <label className="yn-option">
                <input type="radio" name="sec2_fee_note_received" value="yes" />
                Yes
              </label>
              <label className="yn-option">
                <input type="radio" name="sec2_fee_note_received" value="no" />
                No
              </label>
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">
              Did you have a written fee agreement duly executed with your advocate(s)?
              <span className="text-navy-deep/40">(attach copy)</span>
            </label>
            <div className="yn-group">
              <label className="yn-option">
                <input type="radio" name="sec2_written_fee_agreement" value="yes" />
                Yes
              </label>
              <label className="yn-option">
                <input type="radio" name="sec2_written_fee_agreement" value="no" />
                No
              </label>
            </div>
          </div>
          <div id="sec2-no-fee-agreement-block" className={`${visibility.noWrittenFeeAgreement ? 'block' : 'hidden'} field-group`}>
            <label className="field-label">
              If no written fee agreement, please explain your understanding regarding payment of fees, expenses, costs, etc.
            </label>
            <textarea id="sec2_fee_understanding" rows={3} className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_fee_understanding" />
          </div>
          <div className="field-group">
            <label className="field-label">Have you paid any fee to your advocate(s)?</label>
            <div className="yn-group">
              <label className="yn-option">
                <input type="radio" name="sec2_fee_paid" value="yes" />
                Yes
              </label>
              <label className="yn-option">
                <input type="radio" name="sec2_fee_paid" value="no" />
                No
              </label>
            </div>
          </div>
          <div id="sec2-fee-paid-block" className={`${visibility.feePaid ? 'block' : 'hidden'} `}>
            <div className="grid sm:grid-cols-2 gap-5 field-group">
              <div>
                <label className="field-label">If so, how much?</label>
                <input type="text" id="sec2_fee_paid_amount" placeholder="Kshs." className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_fee_paid_amount" />
              </div>
              <div>
                <label className="field-label">
                  Were you issued with receipts?
                  <span className="text-navy-deep/40">(attach copy)</span>
                </label>
                <div className="yn-group">
                  <label className="yn-option">
                    <input type="radio" name="sec2_receipts_issued" value="yes" />
                    Yes
                  </label>
                  <label className="yn-option">
                    <input type="radio" name="sec2_receipts_issued" value="no" />
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">Has the advocate taken you to court for unpaid legal fees?</label>
            <div className="yn-group">
              <label className="yn-option">
                <input type="radio" name="sec2_sued_for_fees" value="yes" />
                Yes
              </label>
              <label className="yn-option">
                <input type="radio" name="sec2_sued_for_fees" value="no" />
                No
              </label>
              <label className="yn-option">
                <input type="radio" name="sec2_sued_for_fees" value="dont_know" />
                I do not know
              </label>
            </div>
            <p className="text-xs text-navy-deep/40 mt-1.5">
              Note: generally the ACC cannot handle a complaint if the advocate has commenced legal proceedings to recover unpaid costs.
            </p>
          </div>
          <div id="sec2-sued-block" className={`${visibility.suedForFees ? 'block' : 'hidden'} field-group`}>
            <label className="field-label">If yes, when did the advocate commence legal proceedings?</label>
            <input type="date" id="sec2_legal_proceedings_date" className="input-field w-full sm:w-64 px-3.5 py-2.5 text-sm" name="sec2_legal_proceedings_date" />
          </div>
        </div>
        <div className="field-group">
          <label className="field-label">
            <span className="q-num">Q12</span>
            Have you instructed a new advocate to act for you in the same matter?
          </label>
          <div className="yn-group">
            <label className="yn-option">
              <input type="radio" name="sec2_new_advocate_instructed" value="yes" />
              Yes
            </label>
            <label className="yn-option">
              <input type="radio" name="sec2_new_advocate_instructed" value="no" defaultChecked />
              No
            </label>
          </div>
        </div>
        <div id="sec2-new-advocate-block" className={`${visibility.newAdvocate ? 'block' : 'hidden'} border-l-2 border-brass/40 pl-5`}>
          <div className="grid sm:grid-cols-3 gap-5 field-group">
            <div>
              <label className="field-label">Surname</label>
              <input type="text" id="sec2_new_surname" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_new_surname" />
            </div>
            <div>
              <label className="field-label">Middle name</label>
              <input type="text" id="sec2_new_middle" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_new_middle" />
            </div>
            <div>
              <label className="field-label">Other name</label>
              <input type="text" id="sec2_new_other" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_new_other" />
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">Law firm name</label>
            <input type="text" id="sec2_new_firm_name" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_new_firm_name" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5 field-group">
            <div>
              <label className="field-label">Postal address</label>
              <input type="text" id="sec2_new_postal_address" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_new_postal_address" />
            </div>
            <div>
              <label className="field-label">Postcode</label>
              <input type="text" id="sec2_new_postcode" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_new_postcode" />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 field-group">
            <div>
              <label className="field-label">Building</label>
              <input type="text" id="sec2_new_building" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_new_building" />
            </div>
            <div>
              <label className="field-label">Street</label>
              <input type="text" id="sec2_new_street" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_new_street" />
            </div>
            <div>
              <label className="field-label">Town</label>
              <input type="text" id="sec2_new_town" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_new_town" />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 field-group">
            <div>
              <label className="field-label">Office phone</label>
              <input type="tel" id="sec2_new_office_phone" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_new_office_phone" />
            </div>
            <div>
              <label className="field-label">Mobile</label>
              <input type="tel" id="sec2_new_mobile" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_new_mobile" />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input type="email" id="sec2_new_email" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_new_email" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 field-group">
            <div>
              <label className="field-label">
                <span className="q-num">Q13</span>
                When did you instruct your new advocate(s)?
              </label>
              <input type="date" id="sec2_new_instructed_date" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec2_new_instructed_date" />
            </div>
            <div>
              <label className="field-label">
                <span className="q-num">Q14</span>
                Can we contact your new advocate(s) to discuss your complaint?
              </label>
              <div className="yn-group pt-2">
                <label className="yn-option">
                  <input type="radio" name="sec2_new_can_contact" value="yes" />
                  Yes
                </label>
                <label className="yn-option">
                  <input type="radio" name="sec2_new_can_contact" value="no" />
                  No
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="section-3" className="card section-card rounded-xl p-7">
        <h2 className="font-serif-display text-xl text-navy-deep mb-1">Section Three — The Kind of Work Involved</h2>
        <p className="text-navy-deep/50 text-xs mb-6">You must complete this section.</p>
        <div className="field-group">
          <label className="field-label">
            <span className="q-num">Q15a</span>
            Briefly state what kind of legal work you instructed your advocate(s) to do *
          </label>
          <textarea id="sec3_work_instructed" required rows={4} className="input-field w-full px-3.5 py-2.5 text-sm" name="sec3_work_instructed" />
        </div>
        <div className="field-group">
          <label className="field-label">
            <span className="q-num">Q15b</span>
            What is the status of the legal work done so far?
          </label>
          <textarea id="sec3_work_status" rows={3} className="input-field w-full px-3.5 py-2.5 text-sm" name="sec3_work_status" />
        </div>
        <div className="field-group">
          <label className="field-label">
            <span className="q-num">Q15c</span>
            Has a suit been filed in relation to this matter?
          </label>
          <div className="yn-group">
            <label className="yn-option">
              <input type="radio" name="sec3_suit_filed" value="yes" />
              Yes
            </label>
            <label className="yn-option">
              <input type="radio" name="sec3_suit_filed" value="no" defaultChecked />
              No
            </label>
          </div>
        </div>
        <div id="sec3-suit-block" className={`${visibility.suitFiled ? 'block' : 'hidden'} field-group border-l-2 border-brass/40 pl-5`}>
          <label className="field-label">
            Please give particulars of the suit — suit number, court, parties involved, stage reached, etc. Also attach copies of any relevant court documents.
          </label>
          <textarea id="sec3_suit_particulars" rows={4} className="input-field w-full px-3.5 py-2.5 text-sm" name="sec3_suit_particulars" />
        </div>
      </section>
      <section id="section-4" className="card section-card rounded-xl p-7">
        <h2 className="font-serif-display text-xl text-navy-deep mb-1">Section Four — Further Information About the Work Involved</h2>
        <p className="text-navy-deep/50 text-xs mb-6">Only complete the parts that apply to your matter.</p>
        <div className="field-group">
          <label className="field-label">Does your complaint relate to the administration of a deceased person's estate?</label>
          <div className="yn-group">
            <label className="yn-option">
              <input type="radio" name="sec4_relates_to_death" value="yes" />
              Yes
            </label>
            <label className="yn-option">
              <input type="radio" name="sec4_relates_to_death" value="no" defaultChecked />
              No
            </label>
          </div>
        </div>
        <div id="sec4-death-block" className={`${visibility.deathMatter ? 'block' : 'hidden'} border-l-2 border-brass/40 pl-5 mb-2`}>
          <div className="grid sm:grid-cols-2 gap-5 field-group">
            <div>
              <label className="field-label">
                <span className="q-num">Q16</span>
                Name of the deceased
              </label>
              <input type="text" id="sec4_deceased_name" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec4_deceased_name" />
            </div>
            <div>
              <label className="field-label">
                <span className="q-num">Q17</span>
                Date of death
              </label>
              <input type="date" id="sec4_date_of_death" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec4_date_of_death" />
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">
              <span className="q-num">Q18</span>
              Name(s) and address(es) of those dealing with the deceased's affairs (executor, administrator)
            </label>
            <textarea id="sec4_estate_admin_details" rows={2} className="input-field w-full px-3.5 py-2.5 text-sm" name="sec4_estate_admin_details" />
          </div>
          <div className="field-group">
            <label className="field-label">
              <span className="q-num">Q19</span>
              Are you a beneficiary of the estate?
            </label>
            <div className="yn-group">
              <label className="yn-option">
                <input type="radio" name="sec4_beneficiary" value="yes" />
                Yes
              </label>
              <label className="yn-option">
                <input type="radio" name="sec4_beneficiary" value="no" />
                No
              </label>
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">
              <span className="q-num">Q20</span>
              Names and addresses of other beneficiaries
            </label>
            <textarea id="sec4_other_beneficiaries" rows={2} className="input-field w-full px-3.5 py-2.5 text-sm" name="sec4_other_beneficiaries" />
          </div>
        </div>
        <div className="field-group pt-2 border-t border-line">
          <label className="field-label pt-4 block">
            <span className="q-num">Q21</span>
            Does your complaint relate to a road accident?
            <span className="text-navy-deep/40 normal-case">(attach photocopy of police abstract)</span>
          </label>
          <div className="yn-group">
            <label className="yn-option">
              <input type="radio" name="sec4_relates_to_accident" value="yes" />
              Yes
            </label>
            <label className="yn-option">
              <input type="radio" name="sec4_relates_to_accident" value="no" defaultChecked />
              No
            </label>
          </div>
        </div>
        <div id="sec4-accident-block" className={`${visibility.accidentMatter ? 'block' : 'hidden'} border-l-2 border-brass/40 pl-5`}>
          <div className="field-group">
            <label className="field-label">Name(s) and address(es) of the person(s) injured or killed</label>
            <textarea id="sec4_injured_killed_details" rows={2} className="input-field w-full px-3.5 py-2.5 text-sm" name="sec4_injured_killed_details" />
          </div>
          <div className="field-group">
            <label className="field-label">Names and address(es) of insured / defendant, if any</label>
            <textarea id="sec4_insured_defendant_details" rows={2} className="input-field w-full px-3.5 py-2.5 text-sm" name="sec4_insured_defendant_details" />
          </div>
          <div className="field-group">
            <label className="field-label">Name and address(es) of insurer(s)</label>
            <textarea id="sec4_insurer_details" rows={2} className="input-field w-full px-3.5 py-2.5 text-sm" name="sec4_insurer_details" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5 field-group">
            <div>
              <label className="field-label">Insurance policy number</label>
              <input type="text" id="sec4_policy_number" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec4_policy_number" />
            </div>
            <div>
              <label className="field-label">Insurance claim number</label>
              <input type="text" id="sec4_claim_number" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec4_claim_number" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 field-group">
            <div>
              <label className="field-label">Amount of compensation awarded / settlement (Kshs.)</label>
              <input type="text" id="sec4_compensation_amount" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec4_compensation_amount" />
            </div>
            <div>
              <label className="field-label">Amount paid to you or beneficiary (Kshs.)</label>
              <input type="text" id="sec4_amount_paid" className="input-field w-full px-3.5 py-2.5 text-sm" name="sec4_amount_paid" />
            </div>
          </div>
        </div>
        <p className="text-xs text-navy-deep/40 mt-2">
          Note: please attach copies of all relevant documents to support your complaint, and a list of these documents, when you send this form in.
        </p>
      </section>
      <section id="section-5" className="card section-card rounded-xl p-7">
        <h2 className="font-serif-display text-xl text-navy-deep mb-1">Section Five — What Exactly Is Your Complaint?</h2>
        <p className="text-navy-deep/50 text-xs mb-6">
          <span className="q-num">Q22</span>
          Please say briefly what you are dissatisfied with and why, and/or what you think the advocate did wrong or failed to do.
        </p>
        <div className="field-group">
          <textarea id="sec5_complaint_details" required rows={8} className="input-field w-full px-3.5 py-2.5 text-sm" placeholder="Describe your complaint in full…" name="sec5_complaint_details" />
        </div>
      </section>
      <section id="section-6" className="card section-card rounded-xl p-7">
        <h2 className="font-serif-display text-xl text-navy-deep mb-1">Section Six — Setting Your Complaint Right</h2>
        <p className="text-navy-deep/50 text-xs mb-6">
          <span className="q-num">Q23</span>
          Please say what you would like done to put things right. Select all that apply.
        </p>
        <div className="space-y-3 field-group">
          <label className="yn-option">
            <input type="checkbox" id="sec6_return_documents" name="sec6_return_documents" />
            Have my documents / file returned to me
          </label>
          <div id="sec6-return-docs-block" className={`${visibility.returnDocuments ? 'block' : 'hidden'} pl-6`}>
            <label className="field-label">Please specify the documents you want returned</label>
            <textarea id="sec6_documents_to_return" rows={2} className="input-field w-full px-3.5 py-2.5 text-sm" name="sec6_documents_to_return" />
          </div>
          <label className="yn-option">
            <input type="checkbox" id="sec6_improve_communication" name="sec6_improve_communication" />
            Improve communication with the advocate
          </label>
          <label className="yn-option">
            <input type="checkbox" id="sec6_improve_service" name="sec6_improve_service" />
            Improve the service provided by the advocate
          </label>
          <label className="yn-option">
            <input type="checkbox" id="sec6_receive_apology" name="sec6_receive_apology" />
            Receive an apology
          </label>
          <label className="yn-option">
            <input type="checkbox" id="sec6_resolve_fee_dispute" name="sec6_resolve_fee_dispute" />
            Resolve my dispute about fees
          </label>
          <label className="yn-option">
            <input type="checkbox" id="sec6_resolve_dispute" name="sec6_resolve_dispute" />
            Resolve my dispute with the advocate
          </label>
          <label className="yn-option">
            <input type="checkbox" id="sec6_other" name="sec6_other" />
            Other
          </label>
          <div id="sec6-other-block" className={`${visibility.otherRemedy ? 'block' : 'hidden'} pl-6`}>
            <textarea id="sec6_other_details" rows={2} className="input-field w-full px-3.5 py-2.5 text-sm" placeholder="Please specify" name="sec6_other_details" />
          </div>
        </div>
        <div className="border-t border-line pt-5 mt-5">
          <div className="field-group">
            <label className="yn-option items-start">
              <input type="checkbox" id="sec6_declaration" required className="mt-0.5" name="sec6_declaration" />
              <span>
                <strong>Declaration:</strong>
                I declare that the information I have provided above is true and accurate to the best of my knowledge. I understand that all information I submit can be disclosed to the advocate. *
              </span>
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="field-label">Signed (type your full name) *</label>
              <input type="text" id="sec6_signed_name" required className="input-field w-full px-3.5 py-2.5 text-sm" name="sec6_signed_name" />
            </div>
            <div>
              <label className="field-label">Date</label>
              <input type="text" id="sec6_date" readOnly className="input-field w-full px-3.5 py-2.5 text-sm bg-navy/5 text-navy-deep/60" name="sec6_date" value={submissionDate} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
