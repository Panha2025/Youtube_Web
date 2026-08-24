"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  AlertCircle,
  ExternalLink,
  MoreVertical,
  RefreshCcw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CategoryFilter } from "@/components/CategoryFilter";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { RecipeGrid } from "@/components/RecipeGrid";
import { SearchBar } from "@/components/SearchBar";
import { fetchVideosPage } from "@/lib/api";
import { createRecipeSlug, formatDate, formatViewCount } from "@/lib/format";
import type { RecipeCategory, RecipeVideo, VideoPage } from "@/lib/types";

const VIDEO_CACHE_KEY = "polika-videos-cache-v1";

export function RecipeBrowser() {
  const [videos, setVideos] = useState<RecipeVideo[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<RecipeCategory>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialVideos() {
      const cachedVideos = readCachedVideos();

      if (cachedVideos.length > 0) {
        setVideos(cachedVideos);
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const firstPage = await fetchVideosPage();

        if (isMounted) {
          setVideos((currentVideos) => mergeVideos(firstPage.videos, currentVideos));
          setNextPageToken(firstPage.nextPageToken);
          setIsLoading(false);
          setIsSyncingAll(true);
        }

        const allVideos = await fetchVideosPage(null, false, true);

        if (isMounted) {
          setVideos(allVideos.videos);
          setNextPageToken(allVideos.nextPageToken);
          writeCachedVideos(allVideos.videos);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof TypeError
              ? "Laravel backend is not ready. Run npm run dev and wait for Chrome to open."
              : loadError instanceof Error
                ? loadError.message
                : "Unable to load videos."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsSyncingAll(false);
        }
      }
    }

    loadInitialVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  async function loadMoreVideos() {
    if (!nextPageToken || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    setError(null);

    try {
      const data = await fetchVideosPage(nextPageToken);
      setVideos((currentVideos) => {
        const existingIds = new Set(currentVideos.map((video) => video.id));
        const newVideos = data.videos.filter((video) => !existingIds.has(video.id));

        return [...currentVideos, ...newVideos];
      });
      setNextPageToken(data.nextPageToken);
    } catch (loadError) {
      setError(
        loadError instanceof TypeError
          ? "Laravel backend is not ready. Run npm run dev and wait for Chrome to open."
          : loadError instanceof Error
            ? loadError.message
            : "Unable to load more videos."
      );
    } finally {
      setIsLoadingMore(false);
    }
  }

  async function refreshLatestVideos() {
    setIsRefreshing(true);
    setIsSyncingAll(true);
    setError(null);

    try {
      const data = await fetchVideosPage(null, true, true);
      setVideos(data.videos);
      setNextPageToken(data.nextPageToken);
      writeCachedVideos(data.videos);
    } catch (loadError) {
      setError(
        loadError instanceof TypeError
          ? "Laravel backend is not ready. Run npm run dev and wait for Chrome to open."
          : loadError instanceof Error
            ? loadError.message
            : "Unable to refresh videos."
      );
    } finally {
      setIsRefreshing(false);
      setIsSyncingAll(false);
    }
  }

  const filteredVideos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return videos.filter((video) => {
      const matchesCategory = activeCategory === "All" || video.category === activeCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${video.title} ${video.description}`.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, videos]);

  const latestVideos = videos.slice(0, 5);
  const popularVideos = [...videos].sort((first, second) => second.viewCount - first.viewCount).slice(0, 10);

  return (
    <section className="bg-[#fbfaf8] px-6 pb-20 pt-8 lg:px-12" id="recipes">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-black text-black">Latest Videos</h2>
            <div className="mt-3 h-0.5 w-10 bg-[#f04b23]" />
          </div>
          <button
            className="smooth-motion inline-flex items-center gap-2 text-sm font-black text-[#f04b23] transition hover:translate-x-1"
            disabled={isLoading || isRefreshing}
            onClick={refreshLatestVideos}
            type="button"
          >
            {isRefreshing ? "Refreshing" : "Refresh"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-[20px] bg-red-50 p-4 text-sm text-red-800 ring-1 ring-red-100">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">Could not load YouTube videos</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

        {isLoading ? (
          <LoadingSkeleton />
        ) : latestVideos.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {latestVideos.map((video, index) => (
              <article
                className="smooth-motion animate-rise-in group block rounded-[24px] border border-stone-100 bg-white p-4 shadow-sm transition hover:-translate-y-1.5 hover:shadow-xl hover:shadow-stone-200/70"
                key={video.id}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <Link href={`/recipe/${createRecipeSlug(video.id, video.title)}`}>
                  <div className="smooth-motion relative aspect-video overflow-hidden rounded-xl bg-stone-100 shadow-sm transition group-hover:-translate-y-1">
                    <Image
                      alt={video.title}
                      className="smooth-motion object-cover transition group-hover:scale-[1.04]"
                      fill
                      sizes="(min-width: 1024px) 20vw, 50vw"
                      src={video.thumbnail}
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white backdrop-blur">
                      <PlayIcon />
                    </div>
                  </div>
                </Link>
                <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
                  <div>
                    <h3 className="line-clamp-2 min-h-[44px] text-lg font-black leading-snug text-black">{video.title}</h3>
                    <p className="mt-2 text-sm text-stone-500">
                      {formatViewCount(video.viewCount)} - {formatDate(video.publishedAt)}
                    </p>
                    <VideoActions video={video} />
                  </div>
                  <MoreVertical className="mt-1 h-5 w-5 text-stone-700" />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-200 p-8 text-center text-stone-500">No videos yet.</div>
        )}

        <div className="mb-8 mt-16 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-black text-black">Popular Videos</h2>
            <div className="mt-3 h-0.5 w-10 bg-[#f04b23]" />
          </div>
          <span className="text-sm font-black text-stone-500">Top 10 by views</span>
          {isSyncingAll && <span className="text-sm font-black text-[#f04b23]">Syncing full library...</span>}
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {popularVideos.map((video, index) => (
              <article
                className="smooth-motion animate-rise-in group block rounded-[24px] border border-stone-100 bg-white p-4 shadow-sm transition hover:-translate-y-1.5 hover:shadow-xl hover:shadow-stone-200/70"
                key={video.id}
                style={{ animationDelay: `${index * 55}ms` }}
              >
                <Link href={`/recipe/${createRecipeSlug(video.id, video.title)}`}>
                  <div className="smooth-motion relative aspect-video overflow-hidden rounded-xl bg-stone-100 shadow-sm transition group-hover:-translate-y-1">
                    <Image
                      alt={video.title}
                      className="smooth-motion object-cover transition group-hover:scale-[1.04]"
                      fill
                      sizes="(min-width: 1024px) 20vw, 50vw"
                      src={video.thumbnail}
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-black text-white backdrop-blur">
                      #{index + 1}
                    </div>
                    <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white backdrop-blur">
                      <PlayIcon />
                    </div>
                  </div>
                </Link>
                <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
                  <div>
                    <h3 className="line-clamp-2 min-h-[44px] text-lg font-black leading-snug text-black">{video.title}</h3>
                    <p className="mt-2 text-sm text-stone-500">{formatViewCount(video.viewCount)}</p>
                    <VideoActions video={video} />
                  </div>
                  <MoreVertical className="mt-1 h-5 w-5 text-stone-700" />
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-16 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-100 sm:p-7" id="all-recipes">
          <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <SearchBar onChange={setQuery} value={query} />
            <button
              className="smooth-motion inline-flex h-14 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#f04b23] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!nextPageToken || isLoadingMore}
              onClick={loadMoreVideos}
              type="button"
            >
              <RefreshCcw className={isLoadingMore ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
              {isLoadingMore ? "Loading" : nextPageToken ? "Load More" : "All Loaded"}
            </button>
          </div>
          <div className="mb-10">
            <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />
          </div>
          {isLoading ? <LoadingSkeleton /> : <RecipeGrid videos={filteredVideos} />}
        </div>

      </div>
    </section>
  );
}

function mergeVideos(primaryVideos: RecipeVideo[], secondaryVideos: RecipeVideo[]) {
  const videoMap = new Map<string, RecipeVideo>();

  for (const video of [...primaryVideos, ...secondaryVideos]) {
    videoMap.set(video.id, video);
  }

  return Array.from(videoMap.values());
}

function readCachedVideos() {
  try {
    const cachedValue = window.localStorage.getItem(VIDEO_CACHE_KEY);
    return cachedValue ? (JSON.parse(cachedValue) as RecipeVideo[]) : [];
  } catch {
    return [];
  }
}

function writeCachedVideos(videos: RecipeVideo[]) {
  try {
    window.localStorage.setItem(VIDEO_CACHE_KEY, JSON.stringify(videos));
  } catch {
    // Ignore storage limits; Laravel cache still keeps future loads fast.
  }
}

function VideoActions({ video }: { video: RecipeVideo }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-2">
      <Link
        className="smooth-motion inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#f04b23] px-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-black"
        href={`/recipe/${createRecipeSlug(video.id, video.title)}`}
      >
        Description
        <ArrowRight className="h-4 w-4" />
      </Link>
      <a
        className="smooth-motion inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-4 text-sm font-black text-black transition hover:-translate-y-0.5 hover:border-black"
        href={video.youtubeUrl}
        rel="noreferrer"
        target="_blank"
      >
        YouTube
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
