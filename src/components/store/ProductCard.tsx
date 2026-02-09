import { ShoppingCart, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Product, formatPrice, calculateDiscount } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const discount = calculateDiscount(product.price, product.originalPrice);

  const handleBuy = () => {
    if (product.inStock) {
      navigate(`/checkout?produto=${product.id}&quantidade=1`);
    }
  };

  return (
    <article className="card-product flex flex-col bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
      {/* Image - Vertical layout for mobile grid */}
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
        
        {/* Badges */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-destructive text-destructive-foreground text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
              <svg className="h-2 w-2 sm:h-2.5 sm:w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              {discount}% OFF
            </span>
          )}
          
          {product.freeShipping && (
            <span className="bg-primary text-primary-foreground text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
              <Truck className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
              FRETE GRÁTIS
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-3">
        <Link to={`/produto/${product.id}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 text-xs sm:text-sm leading-tight mb-1.5">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-auto space-y-0.5">
          {product.originalPrice && (
            <span className="text-[10px] sm:text-xs text-muted-foreground line-through block">
              R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          )}
          
          <p className="text-base sm:text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
          
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            À vista no PIX
          </p>
          
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            ou <span className="text-primary font-medium">12x</span> de <span className="font-medium text-foreground">{formatPrice(product.price / 12)}</span>
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-2.5 pb-2.5 sm:px-3 sm:pb-3">
        <button 
          onClick={handleBuy}
          className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-xs sm:text-sm py-2.5 sm:py-3 rounded-lg
                   flex items-center justify-center gap-1.5 transition-colors"
          disabled={!product.inStock}
          aria-label={product.inStock ? 'Comprar produto' : 'Produto indisponível'}
        >
          <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          {product.inStock ? 'COMPRAR' : 'ESGOTADO'}
        </button>
      </div>
    </article>
  );
}
