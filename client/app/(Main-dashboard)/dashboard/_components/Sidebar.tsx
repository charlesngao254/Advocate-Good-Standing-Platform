import type { ReactNode } from "react";
import { NavLink } from "./NavLink";
import {
  IconBadgeCheck,
  IconBuilding,
  IconFolder,
  IconGavel,
  IconGlobe,
  IconGrid,
  IconInbox,
  IconScroll,
  IconSearchCheck,
  IconSettings,
  IconUser,
} from "./icons";

type NavItem = {
  href: string;
  label: string;
  icon?: ReactNode;
  openInNewTab?: boolean;
};
type NavGroup = { title: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    title: "Dashboard",
    items: [
      { href: "/dashboard", label: "Overview", icon: <IconGrid /> },
      {
        href: "/dashboard/cases/all",
        label: "All cases",
        icon: <IconFolder />,
      },
      { href: "/dashboard/cases/mine", label: "My cases", icon: <IconUser /> },
    ],
  },
  {
    title: "Divisions",
    items: [
      {
        href: "/dashboard/divisions/rdi",
        label: "R&I Division",
        icon: <IconBuilding />,
      },
      {
        href: "/dashboard/divisions/ihadr",
        label: "IHADR Division",
        icon: <IconBuilding />,
      },
      {
        href: "/dashboard/divisions/prosecution",
        label: "Prosecution",
        icon: <IconGavel />,
      },
    ],
  },
  {
    title: "Certificates",
    items: [
      {
        href: "/dashboard/certificates/good-standing",
        label: "Good Standing",
        icon: <IconBadgeCheck />,
      },
      {
        href: "/dashboard/certificates/issued-log",
        label: "Issued log",
        icon: <IconScroll />,
      },
    ],
  },
  {
    title: "Public",
    items: [
      {
        href: "/public-portal",
        label: "Public portal",
        icon: <IconGlobe />,
        openInNewTab: true,
      },
      {
        href: "/public-portal/track-verify",
        label: "Track & Verify",
        icon: <IconSearchCheck />,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        href: "/dashboard/system/new-intake",
        label: "New intake",
        icon: <IconInbox />,
      },
      {
        href: "/dashboard/system/user-management",
        label: "User management",
        icon: <IconSettings />,
      },
    ],
  },
];

export function Sidebar({ className }: { className?: string } = {}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 h-dvh w-[280px] border-r border-white/10 bg-[linear-gradient(180deg,#0B1F3A_0%,#07162B_100%)] text-white ${className || ""}`}
    >
      <div className="flex h-full flex-col">
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center text-white">
              <img
                src="/coat-of-arms.svg"
                alt="Kenya coat of arms"
                className="h-full w-full scale-[1.06] object-contain"
                draggable={false}
              />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="text-sm font-semibold">Case Management</div>
              <div className="text-xs text-white/70">
                Advocates Complaints Commission, Office of the Attorney General
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {NAV.map((group, idx) => (
            <div key={group.title}>
              <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    openInNewTab={item.openInNewTab}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
              {idx !== NAV.length - 1 ? (
                <div className="my-4 border-t border-white/10" />
              ) : null}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xs font-semibold">
              CS
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">
                Commission Secretary
              </div>
              <div className="truncate text-xs text-white/70">
                Full access · All divisions
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
