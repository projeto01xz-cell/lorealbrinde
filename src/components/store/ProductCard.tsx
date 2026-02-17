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
    <article className="card-product flex flex-col bg-card rounded-xl overflow-hidden border border-border">
      <div className="flex p-3 gap-3">
        {/* Image */}
        <Link 
          to={`/produto/${product.id}`}
          className="relative flex-shrink-0 w-[130px] h-[130px] overflow-hidden bg-secondary/30 rounded-lg"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-1"
            loading="lazy"
          />
          {discount > 0 && (
            <span className="absolute top-1.5 left-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
              -{discount}%
            </span>
          )}
        </Link>

        {/* Info */}
        <div className="flex flex-col flex-1 min-w-0">
          <Link to={`/produto/${product.id}`}>
            <h3 className="font-semibold text-foreground line-clamp-3 text-sm leading-tight mb-2">
              {product.name}
            </h3>
          </Link>

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
            {product.freeShipping && (
              <p className="text-xs text-primary font-medium flex items-center gap-1">
                <Truck className="h-3 w-3" />
                Frete grátis
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-3 pb-3">
        <button 
          onClick={handleBuy}
          className="btn-cart rounded-lg text-sm py-3"
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