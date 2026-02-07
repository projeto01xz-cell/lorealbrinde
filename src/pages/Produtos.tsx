import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import ProductCard from "@/components/store/ProductCard";
import CategoryFilter from "@/components/store/CategoryFilter";
import { products, getProductsByCategory } from "@/lib/products";

export default function Produtos() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"relevance" | "price-asc" | "price-desc">("relevance");

  const filteredProducts = useMemo(() => {
    let result = getProductsByCategory(selectedCategory);

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Todos os Produtos
            </h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} produtos encontrados
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <CategoryFilter
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="relevance">Relevância</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
