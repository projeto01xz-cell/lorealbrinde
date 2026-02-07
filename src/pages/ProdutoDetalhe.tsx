import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import { getProductById, formatPrice, calculateDiscount } from "@/lib/products";

export default function ProdutoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground mb-4">
              Produto não encontrado
            </h1>
            <Link 
              to="/produtos"
              className="btn-primary px-6 py-3"
            >
              Ver Produtos
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.originalPrice);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'ebikes': return 'Bicicleta Elétrica';
      case 'scooters': return 'Scooter';
      case 'parts': return 'Peças';
      case 'accessories': return 'Acessório';
      default: return cat;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Product Image */}
        <div className="relative aspect-square bg-secondary/30">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {discount > 0 && (
              <span className="badge badge-offer px-3 py-1">
                -{discount}% OFF
              </span>
            )}
            {product.freeShipping && (
              <span className="badge badge-free-shipping px-3 py-1 flex items-center gap-1">
                <Truck className="h-3 w-3" />
                Frete Grátis
              </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="px-4 py-6 space-y-4">
          {/* Category */}
          <span className="text-sm text-primary font-medium uppercase tracking-wide">
            {getCategoryLabel(product.category)}
          </span>

          {/* Name */}
          <h1 className="text-2xl font-bold text-foreground">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{product.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviews} avaliações)
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground">
            {product.description}
          </p>

          {/* Price */}
          <div className="space-y-1 py-4 border-y border-border">
            {product.originalPrice && (
              <p className="price-original">
                {formatPrice(product.originalPrice)}
              </p>
            )}
            <p className="text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>
            <p className="text-sm text-muted-foreground">
              ou 12x de {formatPrice(product.price / 12)} sem juros
            </p>
          </div>

          {/* CTA */}
          <button 
            className="btn-cart text-base py-4"
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-5 w-5" />
            {product.inStock ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
          </button>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 py-6">
            <div className="text-center">
              <Truck className="h-6 w-6 mx-auto text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Frete Grátis</p>
            </div>
            <div className="text-center">
              <Shield className="h-6 w-6 mx-auto text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Garantia 1 ano</p>
            </div>
            <div className="text-center">
              <RotateCcw className="h-6 w-6 mx-auto text-primary mb-2" />
              <p className="text-xs text-muted-foreground">30 dias troca</p>
            </div>
          </div>

          {/* Specs */}
          {product.specs && (
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold text-foreground mb-4">
                Especificações
              </h3>
              <dl className="space-y-3">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm py-2 border-b border-border">
                    <dt className="text-muted-foreground">{key}</dt>
                    <dd className="font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}