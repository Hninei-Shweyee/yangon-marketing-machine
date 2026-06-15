import Image from "next/image";
import { ExternalLink, TrendingUp } from "lucide-react";

type PortfolioCardProps = {
  title: string;
  category: string;
  result: string;
  metrics: readonly string[];
  facebook?: string;
  image?: string;
};

export function PortfolioCard({ title, category, result, metrics, facebook, image }: PortfolioCardProps) {
  return (
    <article className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
      {image ? (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">{category}</p>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
        </div>
      ) : (
        <div className="bg-brand p-6 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white/15">
            <TrendingUp className="h-5 w-5" aria-hidden />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-white/75">{category}</p>
          <h3 className="mt-2 text-xl font-bold">{title}</h3>
        </div>
      )}
      <div className="p-6">
        <p className="text-sm leading-7 text-muted">{result}</p>
        <div className="mt-5 grid gap-2">
          {metrics.map((metric) => (
            <span key={metric} className="rounded-md border border-line bg-cloud px-3 py-2 text-sm font-semibold text-ink">
              {metric}
            </span>
          ))}
        </div>
        {facebook && (
          <a
            href={facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue hover:text-cyan transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View Facebook Page
          </a>
        )}
      </div>
    </article>
  );
}
