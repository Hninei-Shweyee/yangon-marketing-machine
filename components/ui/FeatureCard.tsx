import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export function FeatureCard({ icon: Icon, title, text }: FeatureCardProps) {
  return (
    <article className="rounded-md border border-line bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-soft">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-cloud text-blue">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
    </article>
  );
}
