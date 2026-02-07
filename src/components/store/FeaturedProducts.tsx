import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const featured = getFeaturedProducts();

  return (
    <section className="py-4">
      <div className="px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">
            Destaques
          </h2>
          <Link 
            to="/produtos" 
            className="flex items-center gap-0.5 text-sm font-medium text-primary"
          >
            Ver todos
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products List */}
        <div className="flex flex-col gap-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}