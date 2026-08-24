import { SearchX } from "lucide-react";

import type { RecipeVideo } from "@/lib/types";
import { RecipeCard } from "@/components/RecipeCard";

type RecipeGridProps = {
  videos: RecipeVideo[];
};

export function RecipeGrid({ videos }: RecipeGridProps) {
  if (videos.length === 0) {
    return (
      <div className="rounded-[30px] bg-white p-10 text-center shadow-sm ring-1 ring-stone-200">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-green-50 text-[#166534]">
          <SearchX className="h-7 w-7" />
        </div>
        <h3 className="text-2xl font-black text-stone-950">No recipes found</h3>
        <p className="mt-3 text-stone-600">Try another search term, category, or refresh your latest videos.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {videos.map((video, index) => (
        <RecipeCard index={index} key={video.id} video={video} />
      ))}
    </div>
  );
}
