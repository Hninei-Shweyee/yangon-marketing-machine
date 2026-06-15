import type { Metadata } from "next";
import { PortfolioCard } from "@/components/ui/PortfolioCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteContent } from "@/data/siteContent";

export const metadata: Metadata = {
  title: "Portfolio / Proof",
  description: "Examples of AI marketing operating systems and growth partner workflows."
};

export default function PortfolioPage() {
  return (
    <section className="section-pad bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Portfolio / Proof"
          title="Growth partner examples built around workflows"
          subtitle="Proof is shown as operating improvements, system assets, and repeatable team processes. No guaranteed-sales claims."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {siteContent.portfolio.map((item) => (
            <PortfolioCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
