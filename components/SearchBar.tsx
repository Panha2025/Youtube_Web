import { Search } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
      <input
        className="h-14 w-full rounded-full border border-stone-200 bg-white pl-12 pr-5 text-base font-semibold text-stone-900 outline-none transition placeholder:font-medium placeholder:text-stone-400 focus:border-[#f8b62d] focus:ring-4 focus:ring-yellow-100"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search recipes..."
        type="search"
        value={value}
      />
    </label>
  );
}
