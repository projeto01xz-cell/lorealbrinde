import { ShoppingCart, Star, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Product, formatPrice, calculateDiscount } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = calculateDiscount(product.price, product.originalPrice);

  return (
    <article className="card-product flex flex-col bg-card overflow-visible mb-2">
      {/* Top Row: Image + Content */}
      <div className="flex flex-row">
        {/* Image Container - Left side */}
        <Link 
          to={`/produto/${product.id}`}
          className="relative w-28 h-28 flex-shrink-0 overflow-hidden bg-secondary/30"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-1 left-1 badge badge-offer text-[10px] px-1.5 py-0.5">
              -{discount}%
            </span>
          )}
        </Link>

        {/* Content - Right side */}
        <div className="flex flex-col flex-1 p-2.5 min-w-0">
          {/* Title - max 2 lines */}
          <Link to={`/produto/${product.id}`}>
            <h3 className="font-medium text-foreground line-clamp-2 text-sm leading-snug mb-1">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-medium text-foreground">
              {product.rating}
            </span>
            <span className="text-[11px] text-muted-foreground">
              ({product.reviews})
            </span>
          </div>

          {/* Price Section */}
          <div className="mt-auto">
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <p className="text-lg font-bold text-primary leading-tight">
              {formatPrice(product.price)}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-muted-foreground">
                12x {formatPrice(product.price / 12)}
              </p>
              {product.freeShipping && (
                <div className="flex items-center gap-0.5">
                  <Truck className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-medium text-primary">
                    Frete Grátis
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Width CTA Button - Extends outside card */}
      <button 
        className="w-[calc(100%+8px)] -mx-1 -mb-1 bg-primary text-primary-foreground font-bold text-sm py-3
                 flex items-center justify-center gap-2 active:scale-[0.99] transition-transform rounded-none"
        disabled={!product.inStock}
        aria-label={product.inStock ? 'Adicionar ao carrinho' : 'Produto indisponível'}
      >
        <ShoppingCart className="h-4 w-4" />
        {product.inStock ? 'COMPRAR' : 'ESGOTADO'}
      </button>
    </article>
  );
}