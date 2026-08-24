import { format } from "date-fns";

export function formatDate(date: string) {
  return format(new Date(date), "MMM d, yyyy");
}

export function truncateText(text: string, maxLength = 150) {
  const cleanText = text.replace(/\s+/g, " ").trim();

  if (!cleanText) {
    return "Watch this recipe video for the full ingredients, cooking steps, and serving ideas.";
  }

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  return `${cleanText.slice(0, maxLength).trim()}...`;
}

export function createRecipeSlug(videoId: string, title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);

  return slug ? `${videoId}-${slug}` : videoId;
}

export function getVideoIdFromSlug(slug: string) {
  return slug.split("-")[0];
}

export function formatViewCount(views: number) {
  if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(views >= 10_000_000 ? 0 : 1)}M views`;
  }

  if (views >= 1_000) {
    return `${(views / 1_000).toFixed(views >= 10_000 ? 0 : 1)}K views`;
  }

  return `${views} views`;
}
