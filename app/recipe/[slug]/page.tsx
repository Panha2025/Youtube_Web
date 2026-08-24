import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ExternalLink, Tag } from "lucide-react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { RecipeCard } from "@/components/RecipeCard";
import { fetchAllVideos, fetchVideoById } from "@/lib/api";
import { formatDate, getVideoIdFromSlug } from "@/lib/format";

type RecipePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = await fetchVideoById(getVideoIdFromSlug(slug));

  if (!video) {
    return {
      title: "Recipe Not Found"
    };
  }

  return {
    title: video.title,
    description: video.shortDescription,
    openGraph: {
      title: video.title,
      description: video.shortDescription,
      images: [video.thumbnail],
      type: "video.other",
      url: `/recipe/${slug}`
    }
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const video = await fetchVideoById(getVideoIdFromSlug(slug));

  if (!video) {
    notFound();
  }

  const allVideos = await fetchAllVideos();
  const relatedVideos = allVideos
    .filter((item) => item.id !== video.id && item.category === video.category)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#fbf7ef]">
      <Navbar />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8 lg:py-12">
        <div className="animate-rise-in">
          <Link className="mb-6 inline-flex text-sm font-black text-[#166534] hover:text-[#14532d]" href="/">
            Back to recipes
          </Link>
          <div className="shine-panel relative overflow-hidden rounded-[30px] bg-black shadow-2xl shadow-stone-950/20 ring-1 ring-stone-200">
            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap gap-3 text-sm text-stone-600">
              <span className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 font-bold shadow-sm ring-1 ring-stone-200">
                <Tag className="h-4 w-4 text-[#166534]" />
                {video.category}
              </span>
              <span className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 font-bold shadow-sm ring-1 ring-stone-200">
                <CalendarDays className="h-4 w-4 text-[#166534]" />
                {formatDate(video.publishedAt)}
              </span>
            </div>
            <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight tracking-normal text-stone-950 sm:text-5xl">
              {video.title}
            </h1>
            <div className="mt-6 whitespace-pre-wrap rounded-[26px] bg-white p-6 leading-7 text-stone-700 shadow-sm ring-1 ring-stone-200">
              {video.description || "This YouTube video does not include a written description yet."}
            </div>
            <a
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#f97316] px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-600/20 transition hover:-translate-y-0.5 hover:bg-[#ea580c]"
              href={video.youtubeUrl}
              rel="noreferrer"
              target="_blank"
            >
              Watch on YouTube
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <aside className="animate-rise-in lg:sticky lg:top-6 lg:self-start [animation-delay:180ms]">
          <div className="rounded-[30px] bg-white p-4 shadow-xl shadow-stone-950/5 ring-1 ring-stone-200">
            <Image
              alt=""
              className="aspect-video rounded-[22px] object-cover"
              height={203}
              src={video.thumbnail}
              width={360}
            />
            <h2 className="mt-5 text-xl font-black text-stone-950">Related recipes</h2>
            <div className="mt-4 grid gap-4">
              {relatedVideos.length > 0 ? (
                relatedVideos.map((relatedVideo) => (
                  <RecipeCard compact key={relatedVideo.id} video={relatedVideo} />
                ))
              ) : (
                <p className="rounded-2xl bg-green-50 p-4 text-sm text-stone-600">
                  More related videos will appear here as your channel grows.
                </p>
              )}
            </div>
          </div>
        </aside>
      </section>
      <Footer />
    </main>
  );
}
