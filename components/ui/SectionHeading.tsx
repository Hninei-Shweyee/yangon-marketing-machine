import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
};

export function SectionHeading({ eyebrow, title, subtitle, align = "center", theme = "light", className }: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto max-w-3xl", align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow ? <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue">{eyebrow}</p> : null}
      <h2 className={cn("text-balance text-3xl font-bold tracking-normal md:text-5xl", theme === "dark" ? "text-white" : "text-ink")}>
        {title}
      </h2>
      {subtitle ? (
        <p className={cn("mt-5 text-pretty text-base leading-8 md:text-lg", theme === "dark" ? "text-slate-300" : "text-muted")}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
