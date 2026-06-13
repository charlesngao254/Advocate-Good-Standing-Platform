import type { ReactNode } from "react";

export default function PublicPortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f4f7fb_0%,#eef3f9_40%,#e6edf5_100%)] text-slate-900">
      {children}
    </div>
  );
}
