"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellRing, FileText, LayoutGrid, LockKeyhole, NotebookPen, Settings } from "lucide-react";
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
  return <nav className="mobile-nav mobile-only" aria-label="Main navigation">
    <div className="mobile-nav-items">
      {items.map(item => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}
          className={cn("mobile-nav-link", active ? "bg-[image:var(--gradient-main)] text-white" : "text-[color:var(--text-muted)]")}>
          <Icon className="h-5 w-5" aria-hidden="true" /><span>{item.label}</span>
        </Link>;
      })}
    </div>
  </nav>;
}
