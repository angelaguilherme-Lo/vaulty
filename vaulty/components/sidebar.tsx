"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellRing,
  FileText,
  LayoutGrid,
  LockKeyhole,
  NotebookPen,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Workspace", icon: LayoutGrid, color: "from-blue-500 to-cyan-400" },
  { href: "/notes", label: "Notes", icon: NotebookPen, color: "from-violet-500 to-fuchsia-400" },
  { href: "/reminders", label: "Reminders", icon: BellRing, color: "from-orange-500 to-yellow-400" },
  { href: "/documents", label: "Documents", icon: FileText, color: "from-emerald-500 to-teal-400" },
  { href: "/vault", label: "Vault", icon: LockKeyhole, color: "from-pink-500 to-violet-500" },
  { href: "/settings", label: "Settings", icon: Settings, color: "from-slate-500 to-slate-300" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass desktop-only min-h-screen border-r border-[color:var(--line)] px-4 py-5">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[image:var(--gradient-main)] shadow-[0_12px_30px_rgba(91,108,255,0.25)]">
          <LockKeyhole className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-title text-[color:var(--text)]">Vaulty</p>
          <p className="text-xs text-[color:var(--text-muted)]">Private workspace</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-all duration-200",
                active
                  ? "bg-[color:var(--panel-strong)] text-[color:var(--text)] border border-[color:var(--line)]"
                  : "text-[color:var(--text-muted)] hover:bg-[color:var(--panel)] hover:text-[color:var(--text)]"
              )}
            >
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br text-white", item.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-[28px] border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-4">
        <p className="text-section text-gradient-main">Premium privacy</p>
        <p className="mt-2 text-xs leading-5 text-[color:var(--text-muted)]">
          Save passwords, notes, reminders, email access, and documents in a colorful but refined workspace.
        </p>
      </div>
    </aside>
  );
}