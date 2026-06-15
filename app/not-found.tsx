import Link from "next/link";
import { GradientButton } from "@/components/ui/GradientButton";

export default function NotFound() {
  return (
    <section className="section-pad bg-white">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-normal text-ink md:text-5xl">
          Page not found
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <GradientButton href="/">Back to Home</GradientButton>
          <GradientButton href="/contact" variant="outline">
            Contact Us
          </GradientButton>
        </div>
      </div>
    </section>
  );
}
