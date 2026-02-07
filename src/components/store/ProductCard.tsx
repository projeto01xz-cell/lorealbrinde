import { ShoppingCart, Star, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Product, formatPrice, calculateDiscount } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = calculateDiscount(product.price, product.originalPrice);

  return (
    <article className="card-product flex flex-col">
      {/* Image Container */}
      <Link 
        to={`/produto/${product.id}`}
        className="relative aspect-square overflow-hidden bg-secondary/30"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="badge badge-offer">
              -{discount}%
            </span>
          )}
          {!product.inStock && (
            <span className="badge bg-muted text-muted-foreground">
              Esgotado
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3">
        {/* Category */}
        <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {product.category === 'ebikes' && 'Bicicleta Elétrica'}
          {product.category === 'scooters' && 'Scooter'}
          {product.category === 'parts' && 'Peças'}
          {product.category === 'accessories' && 'Acessório'}
        </span>

        {/* Name */}
        <Link to={`/produto/${product.id}`}>
          <h3 className="font-medium text-foreground line-clamp-2 mb-2 text-sm leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-foreground">
            {product.rating}
          </span>
          <span className="text-xs text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Free Shipping */}
        {product.freeShipping && (
          <div className="flex items-center gap-1 mb-2">
            <Truck className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">
              Frete Grátis
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto space-y-0.5">
          {product.originalPrice && (
            <span className="price-original block">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <p className="price-current">
            {formatPrice(product.price)}
          </p>
          <p className="price-installments">
            12x de {formatPrice(product.price / 12)} sem juros
          </p>
        </div>

        {/* Add to Cart Button */}
        <button 
          className="btn-cart mt-3"
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4" />
          {product.inStock ? 'Adicionar' : 'Indisponível'}
        </button>
      </div>
    </article>
  );
}