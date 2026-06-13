import type { ReactNode } from "react";
import { Sidebar } from "./_components/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-dvh overflow-hidden bg-white text-black">
      <Sidebar className="print:hidden" />
      <main className="h-dvh min-w-0 overflow-y-auto pl-[280px] print:pl-0 print:w-full">
        <div className="mx-auto w-full max-w-6xl p-6 print:max-w-full print:p-0">
          {children}
        </div>
      </main>
    </div>
  );
}
