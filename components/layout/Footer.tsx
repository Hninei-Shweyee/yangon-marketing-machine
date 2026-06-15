import Link from "next/link";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";
import { siteContent } from "@/data/siteContent";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-white">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_0.8fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan">{siteContent.brand.tagline}</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-normal md:text-5xl">{siteContent.footerCta.title}</h2>
          <p className="mt-5 max-w-xl leading-8 text-slate-300">{siteContent.footerCta.text}</p>
          <GradientButton href="/contact" className="mt-7">
            {siteContent.footerCta.cta}
          </GradientButton>
        </div>
        <div className="grid gap-6 lg:justify-end">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand text-sm font-bold text-white">
                {siteContent.brand.shortName}
              </span>
              <span className="text-sm font-bold leading-tight">{siteContent.brand.name}</span>
            </Link>
          </div>
          <div className="grid gap-3 text-sm text-slate-300">
            <span className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-cyan" aria-hidden />
              {siteContent.brand.location}
            </span>
            <span className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-cyan" aria-hidden />
              {siteContent.brand.email}
            </span>
            <span className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-cyan" aria-hidden />
              {siteContent.brand.phone}
            </span>
            <span className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-cyan" aria-hidden />
              Viber: {siteContent.brand.phone}
            </span>
            <a
              href="https://www.facebook.com/profile.php?id=61589593583907"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-cyan transition-colors"
            >
              <svg className="h-4 w-4 text-cyan" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Follow us on Facebook
            </a>
          </div>
        </div>
      </section>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {siteContent.brand.name}. Approval-first AI marketing systems for Myanmar SMEs.
      </div>
    </footer>
  );
}
