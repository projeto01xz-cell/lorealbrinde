import { SlidersHorizontal, ArrowUpDown, LayoutGrid, List } from "lucide-react";
import { categories } from "@/lib/products";

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function CategoryFilter({ 
  selected, 
  onSelect,
  sortBy,
  onSortChange 
}: CategoryFilterProps) {
  return (
    <div className="bg-card border-b border-border sticky top-[104px] z-30">
      {/* Filter Bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <button className="chip chip-inactive flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filtrar
        </button>
        
        <div className="relative">
          <select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="chip chip-inactive appearance-none pr-8 cursor-pointer"
          >
            <option value="relevance">Relevância</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="rating">Avaliação</option>
          </select>
          <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        <div className="ml-auto flex gap-1">
          <button className="p-2 rounded-lg bg-secondary text-foreground touch-target" aria-label="Grade">
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-lg text-muted-foreground touch-target" aria-label="Lista">
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`chip ${
              selected === category.id ? 'chip-active' : 'chip-inactive'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}