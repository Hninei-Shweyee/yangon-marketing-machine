import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type GradientButtonProps = {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "outline";
  type?: "button" | "submit";
};

export function GradientButton({ href, children, className, variant = "solid", type = "button" }: GradientButtonProps) {
  const classes = cn(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-4 focus:ring-blue/20",
    variant === "solid"
      ? "bg-brand text-white shadow-soft hover:-translate-y-0.5 hover:shadow-premium"
      : "border border-line bg-white text-ink hover:border-blue hover:text-blue",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </button>
  );
}
