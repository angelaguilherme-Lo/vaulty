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

const items = [
  { href: "/", icon: LayoutGrid, label: "Home" },
  { href: "/notes", icon: NotebookPen, label: "Notes" },
  { href: "/reminders", icon: BellRing, label: "Alerts" },
  { href: "/vault", icon: LockKeyhole, label: "Vault" },
  { href: "/documents", icon: FileText, label: "Docs" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="mobile-only fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-xl -translate-x-1/2 rounded-[28px] border border-[color:var(--line)] bg-[color:var(--panel)] p-2 backdrop-blur-2xl">
      <div className="grid grid-cols-6 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition",
                active
                  ? "bg-[image:var(--gradient-main)] text-white"
                  : "text-[color:var(--text-muted)] hover:bg-[color:var(--panel-strong)]"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}