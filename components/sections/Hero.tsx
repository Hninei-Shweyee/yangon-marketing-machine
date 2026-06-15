"use client";

import { motion } from "framer-motion";
import { Activity, CalendarCheck, MessageSquareText, Sparkles } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";
import { siteContent } from "@/data/siteContent";

const rows = [
  { label: "Content Machine", value: "12 drafts ready", icon: Sparkles },
  { label: "Design QA", value: "Myanmar text review", icon: Activity },
  { label: "Schedule Queue", value: "18 approved posts", icon: CalendarCheck },
  { label: "Reply Assist", value: "Human approval on", icon: MessageSquareText }
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/hero-bg.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan">{siteContent.hero.eyebrow}</p>
          <h1 className="mt-5 text-balance text-5xl font-bold tracking-normal text-white md:text-7xl">
            Build Your AI Marketing Machine
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-9 text-slate-200">{siteContent.hero.pitch}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <GradientButton href="/contact">{siteContent.hero.primaryCta}</GradientButton>
            <GradientButton href="/systems" variant="outline">
              {siteContent.hero.secondaryCta}
            </GradientButton>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {siteContent.hero.stats.map((stat) => (
              <div key={stat.label} className="rounded-md border border-line bg-white/75 p-4">
                <p className="text-xl font-bold text-ink">{stat.value}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glass-panel rounded-md p-4 sm:p-6"
        >
          <div className="rounded-md border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <p className="text-sm font-bold text-ink">YMM Command Center</p>
                <p className="text-xs text-muted">June marketing cycle</p>
              </div>
              <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Approval active</span>
            </div>
            <div className="grid gap-4 p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                {["Plan", "Create", "Approve"].map((item, index) => (
                  <div key={item} className="rounded-md bg-cloud p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Step {index + 1}</p>
                    <p className="mt-2 font-bold text-ink">{item}</p>
                    <div className="mt-4 h-2 rounded-full bg-white">
                      <div className="h-2 rounded-full bg-brand" style={{ width: `${86 - index * 18}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid gap-3">
                {rows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4 rounded-md border border-line p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-cloud text-blue">
                        <row.icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-ink">{row.label}</p>
                        <p className="text-xs text-muted">{row.value}</p>
                      </div>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-cyan" />
                  </div>
                ))}
              </div>
              <div className="rounded-md bg-ink p-5 text-white">
                <p className="text-sm font-semibold text-cyan">Monthly learning loop</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Campaign notes, customer questions, and performance signals feed the next cycle.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
