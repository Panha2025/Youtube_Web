import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, MoreVertical, Play } from "lucide-react";

import { createRecipeSlug, formatDate } from "@/lib/format";
import type { RecipeVideo } from "@/lib/types";

type RecipeCardProps = {
  video: RecipeVideo;
  compact?: boolean;
  index?: number;
};

export function RecipeCard({ video, compact = false, index = 0 }: RecipeCardProps) {
  return (
    <article
      className={clsx(
        "smooth-motion animate-rise-in group relative overflow-hidden rounded-[24px] border border-stone-100 bg-white p-4 shadow-sm transition hover:-translate-y-1.5 hover:shadow-xl hover:shadow-stone-200/70",
        compact && "text-sm"
      )}
      style={{ animationDelay: `${Math.min(index * 55, 420)}ms` }}
    >
      <Link href={`/recipe/${createRecipeSlug(video.id, video.title)}`}>
        <div className="relative aspect-video overflow-hidden rounded-xl bg-stone-100 shadow-sm">
          <Image
            alt={video.title}
            className="smooth-motion object-cover transition group-hover:scale-[1.045]"
            fill
            sizes={compact ? "320px" : "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"}
            src={video.thumbnail}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-80" />
          <span className="smooth-motion absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-[#f04b23] shadow-sm transition group-hover:-translate-y-0.5">
            {video.category}
          </span>
          <span className="smooth-motion absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/70 text-white shadow-lg backdrop-blur transition group-hover:scale-110">
            <Play className="h-5 w-5 fill-current" />
          </span>
        </div>
      </Link>
      <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
        <div>
          <h3 className={clsx("font-black leading-snug text-black", compact ? "text-base" : "text-lg")}>
            <Link className="hover:text-[#f04b23]" href={`/recipe/${createRecipeSlug(video.id, video.title)}`}>
              {video.title}
            </Link>
          </h3>
          {!compact && <p className="mt-2 line-clamp-1 text-sm text-stone-500">{formatDate(video.publishedAt)}</p>}
          {!compact && <p className="mt-3 line-clamp-2 min-h-[48px] text-sm leading-6 text-stone-600">{video.shortDescription}</p>}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Link
              className="smooth-motion inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#f04b23] px-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-black"
              href={`/recipe/${createRecipeSlug(video.id, video.title)}`}
            >
              Description
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              className="smooth-motion inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-stone-200 px-4 text-sm font-black text-black transition hover:-translate-y-0.5 hover:border-black"
              href={video.youtubeUrl}
              rel="noreferrer"
              target="_blank"
            >
              YouTube
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
        <MoreVertical className="mt-1 h-5 w-5 text-stone-700" />
      </div>
    </article>
  );
}
