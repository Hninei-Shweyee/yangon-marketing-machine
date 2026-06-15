import type { Metadata } from "next";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { PricingCard } from "@/components/ui/PricingCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteContent } from "@/data/siteContent";

export const metadata: Metadata = {
  title: "Pricing",
  description: "AI Marketing Machine setup packages for Myanmar SME businesses."
};

export default function PricingPage() {
  return (
    <>
      <section className="section-pad bg-cloud">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Pricing"
            title="Choose the machine your team can operate now"
            subtitle="Packages are setup-focused. The monthly retainer keeps the system improving after installation."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {siteContent.packages.map((pkg) => (
              <PricingCard key={pkg.name} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <SectionHeading eyebrow="FAQ" title="Clear expectations before setup" />
        <div className="mt-10">
          <FAQAccordion items={siteContent.faqs} />
        </div>
      </section>
    </>
  );
}
