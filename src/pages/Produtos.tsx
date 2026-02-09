import { useState, useMemo } from "react";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import ProductCard from "@/components/store/ProductCard";
import CategoryFilter from "@/components/store/CategoryFilter";
import { products } from "@/lib/products";

export default function Produtos() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");

  // Apenas os 6 primeiros produtos (mesmos do home)
  const allProducts = products.slice(0, 6);
  
  const filteredProducts = useMemo(() => {
    let result = selectedCategory === "all" 
      ? allProducts 
      : allProducts.filter(p => p.category === selectedCategory);

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, sortBy, allProducts]);

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
        <div className="px-4 py-3">
          {/* Results count */}
          <p className="text-xs text-muted-foreground mb-3">
            {filteredProducts.length} produtos
          </p>

          {/* Products Grid - 2 columns on mobile */}
          <div className="flex flex-col gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">
                Nenhum produto encontrado.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}