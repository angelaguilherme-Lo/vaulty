import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function SectionCard({ title, subtitle, children }: Props) {
  return (
    <section className="panel rounded-[30px] p-5 md:p-6">
      <div className="mb-5">
        <h2 className="text-section text-[color:var(--text)]">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-[color:var(--text-muted)]">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}