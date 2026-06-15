"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";
import { siteContent } from "@/data/siteContent";
import { cn } from "@/lib/utils";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-white/88 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Yangon Marketing Machine home">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand text-sm font-bold text-white">
            {siteContent.brand.shortName}
          </span>
          <span className="hidden text-sm font-bold leading-tight text-ink sm:block">
            Yangon
            <br />
            Marketing Machine
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {siteContent.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-semibold text-muted transition hover:bg-cloud hover:text-ink",
                pathname === item.href && "bg-cloud text-ink"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <GradientButton href="/contact" className="min-h-11 px-4">
            Book Audit
          </GradientButton>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line text-ink lg:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-line bg-white px-4 py-4 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2" aria-label="Mobile navigation">
            {siteContent.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-3 text-sm font-semibold text-ink hover:bg-cloud"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <GradientButton href="/contact" className="mt-2 w-full">
              Book Audit
            </GradientButton>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
