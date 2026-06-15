"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQAccordion({ items }: { items: readonly { question: string; answer: string }[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-line rounded-md border border-line bg-white">
      {items.map((item, index) => (
        <div key={item.question}>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-base font-semibold text-ink"
            onClick={() => setOpen(open === index ? -1 : index)}
            aria-expanded={open === index}
          >
            <span>{item.question}</span>
            <ChevronDown className={cn("h-5 w-5 flex-none text-blue transition", open === index && "rotate-180")} aria-hidden />
          </button>
          {open === index ? <p className="px-5 pb-5 text-sm leading-7 text-muted">{item.answer}</p> : null}
        </div>
      ))}
    </div>
  );
}
