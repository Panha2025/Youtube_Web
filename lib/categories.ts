import type { RecipeCategory } from "@/lib/types";

export const categories: RecipeCategory[] = [
  "All",
  "Chicken",
  "Pork",
  "Beef",
  "Seafood",
  "Soup",
  "Rice",
  "Noodles",
  "Dessert",
  "Drinks",
  "Snacks",
  "Khmer Food",
  "Other"
];

export const categoryKeywordMap: Record<Exclude<RecipeCategory, "All" | "Other">, string[]> = {
  Chicken: ["chicken", "hen", "wings", "drumstick"],
  Pork: ["pork", "bacon", "rib", "ham"],
  Beef: ["beef", "steak", "oxtail"],
  Seafood: ["fish", "shrimp", "crab", "seafood", "prawn", "squid", "salmon", "tuna"],
  Soup: ["soup", "broth", "stew", "curry"],
  Rice: ["rice", "fried rice", "porridge", "congee"],
  Noodles: ["noodle", "noodles", "pasta", "mee", "ramen"],
  Dessert: ["cake", "dessert", "sweet", "cookie", "pudding", "ice cream"],
  Drinks: ["coffee", "juice", "drink", "tea", "smoothie", "milk"],
  Snacks: ["snack", "chips", "fries", "spring roll", "appetizer"],
  "Khmer Food": ["khmer", "cambodian", "cambodia", "ប្រហុក", "អាម៉ុក", "ខ្មែរ"]
};

export function categorizeVideo(title: string, description = ""): RecipeCategory {
  const searchableText = `${title} ${description}`.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywordMap)) {
    if (keywords.some((keyword) => searchableText.includes(keyword.toLowerCase()))) {
      return category as RecipeCategory;
    }
  }

  return "Other";
}
