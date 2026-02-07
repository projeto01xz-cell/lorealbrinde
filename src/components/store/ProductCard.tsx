import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Product, formatPrice } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <Link 
      to={`/produto/${product.id}`}
      className="group card-product flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="badge bg-primary text-primary-foreground">
              -{discount}%
            </span>
          )}
          {!product.inStock && (
            <span className="badge bg-muted text-muted-foreground">
              Esgotado
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category */}
        <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-foreground ml-1">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviews.toLocaleString('pt-BR')})
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <p className="text-lg font-semibold text-foreground">
            {formatPrice(product.price)}
          </p>
          <p className="text-xs text-muted-foreground">
            ou 12x de {formatPrice(product.price / 12)}
          </p>
        </div>
      </div>
    </Link>
  );
}
