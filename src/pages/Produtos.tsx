import { useState, useMemo } from "react";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import ProductCard from "@/components/store/ProductCard";
import CategoryFilter from "@/components/store/CategoryFilter";
import { getProductsByCategory } from "@/lib/products";

export default function Produtos() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");

  const filteredProducts = useMemo(() => {
    let result = getProductsByCategory(selectedCategory);

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Filters */}
      <CategoryFilter
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      
      <main className="flex-1">
        <div className="px-4 py-4">
          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-4">
            {filteredProducts.length} produtos encontrados
          </p>

          {/* Products - Single column on mobile for max readability */}
          <div className="flex flex-col gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                Nenhum produto encontrado nesta categoria.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}