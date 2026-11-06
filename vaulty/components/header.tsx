"use client";
import { AiHelper } from "@/components/ai-helper";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAppStore } from "@/store/app-store";

type Props = { title: string; subtitle: string };
export function Header({ title, subtitle }: Props) {
  const lock = useAppStore(s => s.lockVault);
  return <div className="gradient-border mb-6"><div className="glass rounded-[30px] p-4 md:p-5">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div><p className="text-sm font-medium text-[color:var(--text-muted)]">{subtitle}</p><h1 className="text-hero">{title}</h1></div>
      <div className="flex gap-3"><ThemeToggle /><AiHelper /><Button variant="secondary" onClick={lock} className="gap-2"><LockKeyhole className="h-4 w-4" />Lock</Button></div>
    </div>
  </div></div>;
}
