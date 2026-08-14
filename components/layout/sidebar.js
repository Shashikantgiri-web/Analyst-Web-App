"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Info,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/actions/logout";

const NAV_BY_ROLE = {
  CEO: [{ href: "/ceo", label: "Overview", icon: LayoutDashboard }],
  Manager: [{ href: "/manage", label: "My Department", icon: Building2 }],
  Employee: [{ href: "/employee", label: "My Performance", icon: Users }],
  Tester: [
    { href: "/test/ceo", label: "Test: CEO", icon: LayoutDashboard },
    { href: "/test/manager", label: "Test: Manager", icon: Building2 },
    { href: "/test/employee", label: "Test: Employee", icon: Users },
  ],
};

export function Sidebar({ role }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role] ?? [];

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col bg-navy-dark text-white">
      <div className="flex h-16 items-center gap-2 px-6">
        <Image
          src="/brand/logo-icon.png"
          alt="Performance Analytics logo"
          width={32}
          height={32}
        />
        <span className="text-[16px] font-bold">Performance Analytics</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium
                transition border-l-2 ${
                  isActive
                    ? "border-orange bg-white/10 text-white"
                    : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}

        <Link
          href="/about"
          className="mt-2 flex items-center gap-3 rounded-lg border-l-2 border-transparent
            px-3 py-2.5 text-[14px] font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <Info size={18} />
          About
        </Link>
      </nav>

      <div className="border-t border-white/10 p-3">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px]
              font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
