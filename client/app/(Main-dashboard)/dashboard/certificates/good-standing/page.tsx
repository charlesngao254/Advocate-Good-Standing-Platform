import { makeDefaultDraft } from "../../_lib/certificateData";
import { CertificateBuilder } from "../_components/CertificateBuilder";

export const dynamic = "force-dynamic";

export default function GoodStandingPage() {
  return <CertificateBuilder initial={makeDefaultDraft(new Date())} />;
}
