import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: Props) {
  const styles = {
    primary:
      "border border-transparent text-white shadow-[0_16px_40px_rgba(91,108,255,0.25)] bg-[image:var(--gradient-main)] hover:opacity-95",
    secondary:
      "border border-[color:var(--line)] bg-[color:var(--panel-strong)] text-[color:var(--text)] hover:bg-[color:var(--panel)]",
    ghost:
      "border border-[color:var(--line)] bg-transparent text-[color:var(--text)] hover:bg-[color:var(--panel)]",
    danger:
      "border border-rose-400/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500/15",
  };

  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}