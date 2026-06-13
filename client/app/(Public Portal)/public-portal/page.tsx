import Link from "next/link";

function FeatureCard({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
      <h3 className="text-lg font-semibold tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <Link
        href={href}
        className="mt-5 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        {cta}
      </Link>
    </div>
  );
}

export default function PublicPortalHomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10 md:py-14">
      <header className="overflow-hidden rounded-3xl border border-slate-200/70 bg-[linear-gradient(140deg,#0f172a_0%,#1e293b_55%,#334155_100%)] p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.35)] md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
          Advocates Complaints Commission
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Public Complaints Portal
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 md:text-base">
          Lodge complaints, track progress, and verify certificates through a
          dedicated public-facing service designed for clarity, speed, and
          trust.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/public-portal/lodge"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            Lodge a Complaint
          </Link>
          <Link
            href="/public-portal/track-verify"
            className="rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            Track and Verify
          </Link>
          <a
            href="https://www.acc.go.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            Visit ACC Website
          </a>
        </div>
      </header>

      <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <FeatureCard
          title="Lodge Complaints"
          description="Submit advocate complaints with your contact details, summary, and supporting case context in one intuitive workflow."
          href="/public-portal/lodge"
          cta="Start Complaint"
        />
        <FeatureCard
          title="Track Complaints"
          description="Use your complaint reference and contact details to view current status and timestamps without visiting the office."
          href="/public-portal/track-verify"
          cta="Track Status"
        />
        <FeatureCard
          title="Verify Certificates"
          description="Validate certificate authenticity instantly using certificate number or verification token shared on the document."
          href="/public-portal/track-verify"
          cta="Verify Certificate"
        />
      </section>
    </main>
  );
}
