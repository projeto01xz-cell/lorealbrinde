import { categories } from "@/lib/products";

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
            ${selected === category.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }
          `}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
