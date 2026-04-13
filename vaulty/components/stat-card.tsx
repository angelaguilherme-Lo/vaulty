import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  hint: string;
  tone: "cool" | "warm" | "pink" | "green";
};

const toneMap = {
  cool: "bg-[image:var(--gradient-cool)]",
  warm: "bg-[image:var(--gradient-warm)]",
  pink: "bg-[image:var(--gradient-pink)]",
  green: "bg-[image:var(--gradient-green)]",
};

export function StatCard({ label, value, hint, tone }: Props) {
  return (
    <div className="panel card-hover rounded-[28px] p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-[color:var(--text-muted)]">{label}</p>
        <span className={cn("h-3 w-16 rounded-full", toneMap[tone])} />
      </div>
      <div className="flex items-end justify-between gap-4">
        <h3 className="text-title text-[color:var(--text)]">{value}</h3>
        <span className="rounded-full border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-3 py-1 text-xs text-[color:var(--text-muted)]">
          {hint}
        </span>
      </div>
    </div>
  );
}