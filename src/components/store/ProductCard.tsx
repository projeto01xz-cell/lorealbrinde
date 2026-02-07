import { ShoppingCart, Star, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Product, formatPrice, calculateDiscount } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = calculateDiscount(product.price, product.originalPrice);

  return (
    <article className="card-product flex flex-col bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image Container */}
      <Link 
        to={`/produto/${product.id}`}
        className="relative w-full aspect-square overflow-hidden bg-secondary/30"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-2"
          loading="lazy"
        />
        
        {/* Discount Badge - Top Left */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}

        {/* Free Shipping Badge - Top Right */}
        {product.freeShipping && (
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-1 rounded flex items-center gap-1">
            <Truck className="h-3 w-3" />
            FRETE GRÁTIS
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col p-3 flex-1">
        {/* Title */}
        <Link to={`/produto/${product.id}`}>
          <h3 className="font-medium text-foreground line-clamp-2 text-sm leading-tight mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`h-3 w-3 ${
                  star <= Math.round(product.rating) 
                    ? 'fill-amber-400 text-amber-400' 
                    : 'fill-muted text-muted'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Price Section */}
        <div className="mt-auto space-y-1">
          {product.originalPrice && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            </div>
          )}
          
          <p className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
          
          <p className="text-[11px] text-muted-foreground">
            ou 12x de <span className="font-medium">{formatPrice(product.price / 12)}</span>
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <button 
        className="w-full bg-primary text-primary-foreground font-bold text-sm py-3
                 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all"
        disabled={!product.inStock}
        aria-label={product.inStock ? 'Adicionar ao carrinho' : 'Produto indisponível'}
      >
        <ShoppingCart className="h-4 w-4" />
        {product.inStock ? 'COMPRAR' : 'ESGOTADO'}
      </button>
    </article>
  );
}
