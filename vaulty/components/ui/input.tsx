import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-4 text-sm text-[color:var(--text)] outline-none placeholder:text-[color:var(--text-soft)] focus:border-[color:var(--primary)]",
        className
      )}
      {...props}
    />
  );
}