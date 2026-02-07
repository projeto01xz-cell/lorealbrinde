import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const featured = getFeaturedProducts();

  return (
    <section className="py-6">
      <div className="px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Produtos em Destaque
            </h2>
            <p className="text-sm text-muted-foreground">
              Os mais vendidos da semana
            </p>
          </div>
          <Link 
            to="/produtos" 
            className="flex items-center gap-1 text-sm font-medium text-primary"
          >
            Ver todos
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products - Single Column on Mobile */}
        <div className="flex flex-col gap-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}