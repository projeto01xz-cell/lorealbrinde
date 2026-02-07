import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, ArrowLeft, Truck, Shield, RotateCcw } from "lucide-react";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import { getProductById, formatPrice } from "@/lib/products";

export default function ProdutoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Produto não encontrado
            </h1>
            <Link 
              to="/produtos"
              className="btn-primary px-6 py-3 inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Ver Produtos
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
            <span>/</span>
            <Link to="/produtos" className="hover:text-foreground transition-colors">Produtos</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/30">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <span className="badge bg-primary text-primary-foreground px-3 py-1">
                    -{discount}% OFF
                  </span>
                )}
                {!product.inStock && (
                  <span className="badge bg-muted text-muted-foreground px-3 py-1">
                    Esgotado
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Category */}
              <span className="text-sm text-primary font-medium uppercase tracking-wide">
                {product.category}
              </span>

              {/* Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'fill-muted text-muted'
                      }`} 
                    />
                  ))}
                </div>
                <span className="font-medium text-foreground">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({product.reviews.toLocaleString('pt-BR')} avaliações)
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Price */}
              <div className="space-y-1">
                {product.originalPrice && (
                  <p className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </p>
                )}
                <p className="text-4xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </p>
                <p className="text-muted-foreground">
                  ou 12x de {formatPrice(product.price / 12)} sem juros
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button 
                  className="flex-1 btn-primary py-4 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {product.inStock ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
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
                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-4">
                    Especificações
                  </h3>
                  <dl className="space-y-3">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <dt className="text-muted-foreground">{key}</dt>
                        <dd className="font-medium text-foreground">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
