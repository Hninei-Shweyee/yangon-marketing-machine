import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

type SystemCardProps = {
  icon: LucideIcon;
  name: string;
  tool: string;
  description: string;
  deliverables: readonly string[];
};

export function SystemCard({ icon: Icon, name, tool, description, deliverables }: SystemCardProps) {
  return (
    <article className="flex h-full flex-col rounded-md border border-line bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand text-white">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <span className="rounded-md border border-line bg-cloud px-3 py-1 text-xs font-semibold text-muted">{tool}</span>
      </div>
      <h3 className="mt-6 text-xl font-bold text-ink">{name}</h3>
      <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
      <ul className="mt-5 space-y-3">
        {deliverables.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-ink">
            <Check className="mt-0.5 h-4 w-4 flex-none text-cyan" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
