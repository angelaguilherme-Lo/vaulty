"use client";

import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)]">
        <SunMoon className="h-4 w-4" />
      </button>
    );
  }

  const current = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] text-[color:var(--text)] transition hover:scale-[1.02]"
      aria-label="Toggle theme"
    >
      {current === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}