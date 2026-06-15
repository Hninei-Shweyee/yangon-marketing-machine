import type { Metadata } from "next";
import { ProcessStep } from "@/components/ui/ProcessStep";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteContent } from "@/data/siteContent";

export const metadata: Metadata = {
  title: "Process",
  description: "The Yangon Marketing Machine setup process from audit to first monthly AI marketing cycle."
};

export default function ProcessPage() {
  return (
    <section className="section-pad bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Process"
          title="From messy marketing workflow to installed operating system"
          subtitle="The process is designed to get your team using the machine, not just admiring a strategy document."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {siteContent.process.map((step, index) => (
            <ProcessStep key={step.title} index={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
