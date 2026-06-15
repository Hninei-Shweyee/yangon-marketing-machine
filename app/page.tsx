import { CheckCircle2, Cpu, Minus, Plus } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { PortfolioCard } from "@/components/ui/PortfolioCard";
import { PricingCard } from "@/components/ui/PricingCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SystemCard } from "@/components/ui/SystemCard";
import { siteContent } from "@/data/siteContent";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <MarketGap />
      <Challenges />
      <OperatingLoop />
      <SystemsPreview />
      <ToolStack />
      <PackagesPreview />
      <PortfolioPreview />
      <MainPitch />
    </>
  );
}

function TrustStrip() {
  return (
    <section className="border-y border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {siteContent.trustStrip.map((item) => (
          <div key={item} className="flex items-center gap-3 text-sm font-semibold text-ink">
            <CheckCircle2 className="h-4 w-4 flex-none text-cyan" aria-hidden />
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function MarketGap() {
  return (
    <section id="market-gap" className="section-pad bg-cloud">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={siteContent.marketGap.title} subtitle={siteContent.marketGap.subtitle} />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {siteContent.marketGap.columns.map((column, columnIndex) => (
            <article key={column.title} className="rounded-md border border-line bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-ink">{column.title}</h3>
              <ul className="mt-6 grid gap-4">
                {column.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-7 text-muted">
                    {columnIndex === 0 ? (
                      <Minus className="mt-1 h-4 w-4 flex-none text-slate-400" aria-hidden />
                    ) : (
                      <Plus className="mt-1 h-4 w-4 flex-none text-cyan" aria-hidden />
                    )}
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Challenges() {
  return (
    <section id="challenges" className="section-pad bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="5 challenges we solve" title="The hidden bottlenecks inside SME marketing teams" />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {siteContent.challenges.map((challenge) => (
            <FeatureCard key={challenge.title} {...challenge} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OperatingLoop() {
  return (
    <section id="loop" className="section-pad bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          theme="dark"
          eyebrow="Operating loop"
          title="A monthly machine, not random activity"
          subtitle="Every system supports the same rhythm: capture knowledge, create assets, approve work, publish calmly, and learn from the month."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-5">
          {siteContent.operatingLoop.map((step, index) => (
            <article key={step.title} className="rounded-md border border-white/10 bg-white/5 p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-sm font-bold text-blue">
                {index + 1}
              </span>
              <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SystemsPreview() {
  return (
    <section id="systems-preview" className="section-pad bg-cloud">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="7 systems" title="The machines we install inside your workflow" />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {siteContent.systems.slice(0, 6).map((system) => (
            <SystemCard key={system.name} {...system} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <GradientButton href="/systems">View All Systems</GradientButton>
        </div>
      </div>
    </section>
  );
}

function ToolStack() {
  return (
    <section id="tool-stack" className="section-pad bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <SectionHeading
            align="left"
            eyebrow="Final tool stack"
            title="Modern tools, configured for practical team control"
            subtitle="We choose tools for speed, clarity, Myanmar language handling, and approval gates."
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {siteContent.finalToolStack.map((tool) => (
              <div key={tool} className="flex items-center gap-3 rounded-md border border-line bg-cloud px-4 py-4 text-sm font-bold text-ink">
                <Cpu className="h-4 w-4 flex-none text-blue" aria-hidden />
                {tool}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PackagesPreview() {
  return (
    <section id="packages" className="section-pad bg-cloud">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Packages" title="Setup options for different SME stages" />
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {siteContent.packages.map((pkg) => (
            <PricingCard key={pkg.name} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioPreview() {
  return (
    <section id="proof" className="section-pad bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Portfolio / Growth Partners" title="Proof of system thinking" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {siteContent.portfolio.map((item) => (
            <PortfolioCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MainPitch() {
  return (
    <section className="section-pad bg-mesh">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue">Main pitch</p>
        <h2 className="mt-4 text-balance text-3xl font-bold tracking-normal text-ink md:text-5xl">
          We build the workflow layer your marketing team has been missing.
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-muted">{siteContent.hero.pitch}</p>
        <GradientButton href="/contact" className="mt-8">
          Book AI Audit
        </GradientButton>
      </div>
    </section>
  );
}
