import type { RecipeVideo, VideoPage } from "@/lib/types";

const LARAVEL_API_BASE_URL =
  process.env.LARAVEL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

function getApiBaseUrl() {
  return typeof window === "undefined" ? LARAVEL_API_BASE_URL : "";
}

async function fetchJsonWithRetry(url: string, attempts = 3) {
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      return { response, data };
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 650 * (attempt + 1)));
    }
  }

  throw lastError;
}

export async function fetchVideosPage(pageToken?: string | null, refresh = false, loadAll = false): Promise<VideoPage> {
  const params = new URLSearchParams();

  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  if (refresh) {
    params.set("refresh", "1");
  }

  if (loadAll) {
    params.set("all", "1");
  }

  const { response, data } = (await fetchJsonWithRetry(
    `${getApiBaseUrl()}/api/videos${params.toString() ? `?${params.toString()}` : ""}`
  )) as { response: Response; data: VideoPage & { error?: string } };

  if (!response.ok) {
    throw new Error(data.error || "Unable to load videos from Laravel.");
  }

  return data;
}

export async function fetchAllVideos(refresh = false): Promise<RecipeVideo[]> {
  const data = await fetchVideosPage(null, refresh, true);
  return data.videos;
}

export async function fetchVideoById(videoId: string): Promise<RecipeVideo | null> {
  const response = await fetch(`${getApiBaseUrl()}/api/videos/${videoId}`);

  if (response.status === 404) {
    return null;
  }

  const data = (await response.json()) as { video?: RecipeVideo; error?: string };

  if (!response.ok) {
    throw new Error(data.error || "Unable to load this recipe from Laravel.");
  }

  return data.video || null;
}
