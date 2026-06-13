type PageProps = {
  // Next.js 16 dynamic APIs: `params` is a Promise in server components.
  params: Promise<{ slug?: string[] }>;
};

function titleCase(input: string) {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default async function DashboardCatchAllPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const heading = slug.length ? titleCase(slug[slug.length - 1] ?? "Page") : "Dashboard";
  const path = "/dashboard/" + slug.join("/");

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-black/60">{path}</div>
      <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
      <p className="text-sm text-black/70">
        This is a placeholder screen for <span className="font-mono">{path}</span>.
      </p>
    </div>
  );
}

