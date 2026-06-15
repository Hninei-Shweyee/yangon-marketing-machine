import { CheckCircle2 } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";
import { cn } from "@/lib/utils";
import type { Package } from "@/data/siteContent";

export function PricingCard({ pkg }: { pkg: Package }) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-md border bg-white p-6 shadow-sm",
        pkg.recommended ? "border-blue shadow-soft" : "border-line"
      )}
    >
      {pkg.recommended ? (
        <span className="absolute right-4 top-4 rounded-md bg-brand px-3 py-1 text-xs font-semibold text-white">Recommended</span>
      ) : null}
      <h3 className="pr-28 text-xl font-bold text-ink">{pkg.name}</h3>
      <p className="mt-4 text-3xl font-bold text-ink">{pkg.price}</p>
      <p className="mt-4 text-sm leading-7 text-muted">{pkg.description}</p>
      <ul className="mt-6 flex-1 space-y-3">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm text-ink">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-cyan" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <GradientButton href="/contact" className="mt-7 w-full">
        {pkg.cta}
      </GradientButton>
    </article>
  );
}
