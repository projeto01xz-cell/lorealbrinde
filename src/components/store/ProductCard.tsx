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
    <article className="card-product flex flex-col bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Main Content - Horizontal Layout */}
      <div className="flex p-3 gap-3">
        {/* Image Container - Left Side */}
        <Link 
          to={`/produto/${product.id}`}
          className="relative flex-shrink-0 w-[140px] h-[140px] overflow-hidden bg-secondary/30 rounded-lg"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-1"
            loading="lazy"
          />
          
          {/* Badges Container - Top of Image */}
          <div className="absolute top-1 left-1 flex flex-col gap-0.5">
            {discount > 0 && (
              <span className="bg-destructive text-destructive-foreground text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <svg className="h-2 w-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                {discount}%
              </span>
            )}
            {product.freeShipping && (
              <span className="bg-primary text-primary-foreground text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Truck className="h-2 w-2" />
                FRETE GRÁTIS
              </span>
            )}
          </div>
        </Link>

        {/* Info Container - Right Side */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Title */}
          <Link to={`/produto/${product.id}`}>
            <h3 className="font-semibold text-foreground line-clamp-3 text-sm leading-tight mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Price Section */}
          <div className="mt-auto space-y-0.5">
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through block">
                R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
            
            <p className="text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>
            
            <p className="text-xs text-muted-foreground">
              À vista no PIX
            </p>
            
            <p className="text-xs text-muted-foreground">
              ou <span className="text-primary font-medium">12x</span> de <span className="font-medium text-foreground">{formatPrice(product.price / 12)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button - Full Width */}
      <div className="px-3 pb-3">
        <button 
          onClick={handleBuy}
          className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-sm py-3 rounded-lg
                   flex items-center justify-center gap-2 transition-colors"
          disabled={!product.inStock}
          aria-label={product.inStock ? 'Comprar produto' : 'Produto indisponível'}
        >
          <ShoppingCart className="h-4 w-4" />
          {product.inStock ? 'COMPRAR' : 'ESGOTADO'}
        </button>
      </div>

    </article>
  );
}
