import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SystemCard } from "@/components/ui/SystemCard";
import { siteContent } from "@/data/siteContent";

export const metadata: Metadata = {
  title: "Systems / Services",
  description: "Explore the seven approval-first AI marketing systems installed by Yangon Marketing Machine."
};

export default function SystemsPage() {
  return (
    <section className="section-pad bg-cloud">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Systems / Services"
          title="Seven connected machines for monthly marketing execution"
          subtitle="Each system is configured around your brand context, team capacity, Myanmar language workflow, and approval process."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {siteContent.systems.map((system) => (
            <SystemCard key={system.name} {...system} />
          ))}
        </div>
      </div>
    </section>
  );
}
