"use client";

import { useMemo, useState } from "react";

type Role = "Admin" | "Commission Secretary" | "Investigator" | "Clerk";

type UserStatus = "Active" | "Invited" | "Suspended";

type UserRecord = {
  id: string;
  fullName: string;
  email: string;
  division: string;
  role: Role;
  status: UserStatus;
  lastSeen: string;
};

const SEED_USERS: UserRecord[] = [
  {
    id: "usr-001",
    fullName: "Commission Secretary",
    email: "secretary@acc.go.ke",
    division: "All",
    role: "Admin",
    status: "Active",
    lastSeen: "Today, 09:41",
  },
  {
    id: "usr-002",
    fullName: "Miriam Njeri",
    email: "m.njeri@acc.go.ke",
    division: "R&I Division",
    role: "Investigator",
    status: "Active",
    lastSeen: "Today, 08:13",
  },
  {
    id: "usr-003",
    fullName: "James Otieno",
    email: "j.otieno@acc.go.ke",
    division: "IHADR Division",
    role: "Clerk",
    status: "Invited",
    lastSeen: "Never",
  },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRecord[]>(SEED_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | Role>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | UserStatus>("All");

  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteDivision, setInviteDivision] = useState("R&I Division");
  const [inviteRole, setInviteRole] = useState<Role>("Investigator");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((user) => {
      if (roleFilter !== "All" && user.role !== roleFilter) return false;
      if (statusFilter !== "All" && user.status !== statusFilter) return false;
      if (!q) return true;
      return `${user.fullName} ${user.email} ${user.division}`
        .toLowerCase()
        .includes(q);
    });
  }, [users, search, roleFilter, statusFilter]);

  function inviteUser(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const next: UserRecord = {
      id: `usr-${String(users.length + 1).padStart(3, "0")}`,
      fullName: inviteName.trim(),
      email: inviteEmail.trim(),
      division: inviteDivision,
      role: inviteRole,
      status: "Invited",
      lastSeen: "Never",
    };

    setUsers((prev) => [next, ...prev]);
    setInviteName("");
    setInviteEmail("");
  }

  function toggleStatus(userId: string) {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) return user;
        if (user.status === "Suspended") return { ...user, status: "Active" };
        if (user.status === "Active") return { ...user, status: "Suspended" };
        return user;
      }),
    );
  }

  return (
    <div className="-m-6 min-h-[calc(100dvh-3rem)] bg-slate-50/70 p-6">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            System
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            User Management
          </h1>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Invite staff, assign roles, and manage access safely.
          </p>

          <form
            onSubmit={inviteUser}
            className="mt-4 space-y-3"
            aria-label="Invite new user"
          >
            <label className="block space-y-1">
              <span className="text-sm text-slate-700">Full Name</span>
              <input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm text-slate-700">Email Address</span>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-sm text-slate-700">Division</span>
                <select
                  value={inviteDivision}
                  onChange={(e) => setInviteDivision(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                >
                  <option>All</option>
                  <option>R&I Division</option>
                  <option>IHADR Division</option>
                  <option>Prosecution</option>
                </select>
              </label>

              <label className="block space-y-1">
                <span className="text-sm text-slate-700">Role</span>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as Role)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                >
                  <option>Admin</option>
                  <option>Commission Secretary</option>
                  <option>Investigator</option>
                  <option>Clerk</option>
                </select>
              </label>
            </div>

            <button
              type="submit"
              disabled={!inviteName.trim() || !inviteEmail.trim()}
              className={[
                "w-full rounded-lg px-4 py-2 text-sm font-semibold text-white",
                inviteName.trim() && inviteEmail.trim()
                  ? "bg-slate-900 hover:bg-slate-800"
                  : "cursor-not-allowed bg-slate-300",
              ].join(" ")}
            >
              Invite User
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Access Directory
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user, email, division"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                aria-label="Search users"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as "All" | Role)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                aria-label="Filter by role"
              >
                <option>All</option>
                <option>Admin</option>
                <option>Commission Secretary</option>
                <option>Investigator</option>
                <option>Clerk</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "All" | UserStatus)
                }
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                aria-label="Filter by status"
              >
                <option>All</option>
                <option>Active</option>
                <option>Invited</option>
                <option>Suspended</option>
              </select>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-[13px]">
              <thead className="text-[11px] uppercase tracking-wide text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Email</th>
                  <th className="py-2 pr-3">Division</th>
                  <th className="py-2 pr-3">Role</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Last Seen</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-3 pr-3 font-medium text-slate-800">
                      {user.fullName}
                    </td>
                    <td className="py-3 pr-3 text-slate-700">{user.email}</td>
                    <td className="py-3 pr-3 text-slate-700">
                      {user.division}
                    </td>
                    <td className="py-3 pr-3 text-slate-700">{user.role}</td>
                    <td className="py-3 pr-3">
                      <span
                        className={[
                          "inline-flex rounded-full px-2 py-0.5 text-xs",
                          user.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : user.status === "Invited"
                              ? "bg-sky-50 text-sky-700"
                              : "bg-rose-50 text-rose-700",
                        ].join(" ")}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-slate-600">
                      {user.lastSeen}
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => toggleStatus(user.id)}
                        className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        {user.status === "Suspended" ? "Activate" : "Suspend"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-slate-500"
                    >
                      No users match your filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
