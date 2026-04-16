"use client";

import { Bell, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

type Props = {
  title: string;
  subtitle: string;
};

export function Header({ title, subtitle }: Props) {
  return (
    <div className="gradient-border mb-6">
      <div className="glass rounded-[30px] p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-[color:var(--text-muted)]">{subtitle}</p>
            <h1 className="text-hero text-[color:var(--text)]">{title}</h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 sm:min-w-[250px]">
              <Input placeholder="Search Vaulty..." />
            </div>
            <ThemeToggle />
            <Button variant="secondary" className="w-11 px-0">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}