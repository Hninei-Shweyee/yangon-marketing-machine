import type { Metadata } from "next";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteContent } from "@/data/siteContent";

export const metadata: Metadata = {
  title: "About",
  description: "About Yangon Marketing Machine and its approval-first AI marketing operating system approach."
};

export default function AboutPage() {
  return (
    <section className="section-pad bg-mesh">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading align="left" eyebrow="About" title={siteContent.about.title} subtitle={siteContent.about.text} />
          <div className="grid gap-5 sm:grid-cols-2">
            {siteContent.about.values.map((value) => (
              <FeatureCard key={value.title} {...value} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
