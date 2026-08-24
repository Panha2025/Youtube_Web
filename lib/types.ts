export type RecipeCategory =
  | "All"
  | "Khmer Food"
  | "Chicken"
  | "Beef"
  | "Pork"
  | "Seafood"
  | "Rice"
  | "Noodles"
  | "Soup"
  | "Dessert"
  | "Drinks"
  | "Snacks"
  | "Other";

export type RecipeVideo = {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  publishedAt: string;
  youtubeUrl: string;
  category: RecipeCategory;
  viewCount: number;
  duration: string | null;
};

export type VideoPage = {
  videos: RecipeVideo[];
  nextPageToken: string | null;
};
