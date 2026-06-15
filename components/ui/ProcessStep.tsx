import type { LucideIcon } from "lucide-react";

type ProcessStepProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  index: number;
};

export function ProcessStep({ icon: Icon, title, text, index }: ProcessStepProps) {
  return (
    <article className="relative rounded-md border border-line bg-white p-6 shadow-sm">
      <span className="absolute right-5 top-5 text-sm font-bold text-blue">{String(index + 1).padStart(2, "0")}</span>
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-cloud text-blue">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
    </article>
  );
}
