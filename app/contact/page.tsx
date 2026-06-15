import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteContent } from "@/data/siteContent";

export const metadata: Metadata = {
  title: "Contact / Book Audit",
  description: "Book an AI Marketing Machine audit for your Myanmar SME business."
};

export default function ContactPage() {
  return (
    <section className="section-pad bg-cloud">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <SectionHeading align="left" eyebrow="Contact / Book Audit" title={siteContent.contact.title} subtitle={siteContent.contact.subtitle} />
        <ContactForm />
      </div>
    </section>
  );
}
