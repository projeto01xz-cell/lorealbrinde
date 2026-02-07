import { SlidersHorizontal, ChevronDown } from "lucide-react";
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
      {/* Filter & Sort Bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border overflow-x-auto scrollbar-hide">
        <button className="flex items-center gap-1.5 px-3 py-2 bg-secondary rounded-lg text-xs font-medium text-foreground whitespace-nowrap min-h-[36px]">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filtrar
        </button>
        
        <div className="relative">
          <select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none px-3 py-2 pr-7 bg-secondary rounded-lg text-xs font-medium text-foreground cursor-pointer min-h-[36px]"
          >
            <option value="relevance">Relevância</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="rating">Avaliação</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`
              px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all min-h-[32px]
              ${selected === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground'
              }
            `}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}