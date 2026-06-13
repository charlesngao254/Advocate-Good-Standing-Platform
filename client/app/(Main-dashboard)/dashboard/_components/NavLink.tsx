"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  openInNewTab?: boolean;
};

export function NavLink({ href, children, icon, openInNewTab }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(href + "/"));

  return (
    <Link
      href={href}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      aria-current={isActive ? "page" : undefined}
      className={[
        "group flex items-center gap-2 rounded-md px-3 py-2 text-[13px] leading-5 transition-colors",
        isActive
          ? "bg-white/10 text-white"
          : "text-white/80 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      <span className="shrink-0 opacity-90">{icon}</span>
      <span className="truncate">{children}</span>
    </Link>
  );
}
