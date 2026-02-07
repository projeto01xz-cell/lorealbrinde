import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Star, 
  ShoppingCart, 
  Truck, 
  Shield, 
  RotateCcw, 
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Check,
  CreditCard,
  Barcode,
  Clock,
  Package
} from "lucide-react";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import { getProductById, formatPrice, calculateDiscount, getFeaturedProducts } from "@/lib/products";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function ProdutoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const relatedProducts = getFeaturedProducts().filter(p => p.id !== id).slice(0, 4);

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
  
  // Usa as imagens do produto ou apenas a imagem principal
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'ebikes': return 'Bicicleta Elétrica';
      case 'scooters': return 'Scooter';
      case 'parts': return 'Peças';
      case 'accessories': return 'Acessório';
      default: return cat;
    }
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="px-4 py-3 bg-card border-b border-border">
          <nav className="text-xs text-muted-foreground flex items-center gap-1 overflow-x-auto scrollbar-hide">
            <Link to="/" className="hover:text-primary transition-colors whitespace-nowrap">Home</Link>
            <span>/</span>
            <Link to="/produtos" className="hover:text-primary transition-colors whitespace-nowrap">Produtos</Link>
            <span>/</span>
            <Link 
              to={`/produtos?categoria=${product.category}`} 
              className="hover:text-primary transition-colors whitespace-nowrap"
            >
              {getCategoryLabel(product.category)}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[150px]">{product.name}</span>
          </nav>
        </div>

        {/* Main Product Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Product Image Gallery */}
          <div className="relative bg-card">
            {/* Main Image */}
            <div className="relative aspect-square">
              <img
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
              
              {/* Navigation Arrows */}
              <button 
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-foreground/10 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-foreground/20 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-foreground/10 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-foreground/20 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <span className="badge badge-offer px-3 py-1.5 text-sm">
                    -{discount}%
                  </span>
                )}
                {product.freeShipping && (
                  <span className="badge badge-free-shipping px-3 py-1.5 flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    Frete Grátis
                  </span>
                )}
              </div>

              {/* Action Icons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="w-9 h-9 bg-card rounded-full shadow-md flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="w-9 h-9 bg-card rounded-full shadow-md flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-foreground/60 text-card text-xs px-3 py-1 rounded-full">
                {selectedImageIndex + 1} / {productImages.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                    selectedImageIndex === index 
                      ? 'border-primary' 
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="px-4 py-5 space-y-4 bg-card mt-2">
            {/* Category Badge */}
            <span className="inline-block text-xs text-primary font-semibold uppercase tracking-wider bg-primary/10 px-2 py-1 rounded">
              {getCategoryLabel(product.category)}
            </span>

            {/* Product Name */}
            <h1 className="text-xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-muted text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews} avaliações)
              </span>
            </div>

            {/* Price Section */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
              {product.originalPrice && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground line-through">
                    De: {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded">
                    {discount}% OFF
                  </span>
                </div>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-primary">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-primary font-medium">à vista</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>ou <strong className="text-foreground">12x de {formatPrice(product.price / 12)}</strong> sem juros</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Barcode className="h-4 w-4" />
                <span><strong className="text-primary">{formatPrice(product.price * 0.95)}</strong> no PIX (5% off)</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Quantidade:</span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                >
                  -
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-foreground font-semibold bg-card">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <button 
                className="btn-cart text-base py-4 rounded-xl shadow-lg shadow-primary/20"
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5" />
                {product.inStock ? 'COMPRAR AGORA' : 'PRODUTO ESGOTADO'}
              </button>
              <button 
                className="w-full py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                disabled={!product.inStock}
              >
                <Heart className="h-5 w-5" />
                ADICIONAR AOS FAVORITOS
              </button>
            </div>
          </div>

          {/* Shipping & Benefits */}
          <div className="px-4 py-5 bg-card mt-2">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              INFORMAÇÕES DE ENTREGA
            </h3>
            
            <div className="space-y-4">
              {/* CEP Input */}
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Digite seu CEP"
                  maxLength={9}
                  className="flex-1 input-field text-sm"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity">
                  Calcular
                </button>
              </div>

              {/* Shipping Options Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Envio Padrão</p>
                      <p className="text-xs text-muted-foreground">Prazo de 5-8 dias úteis</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary">GRÁTIS</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Envio Expresso</p>
                      <p className="text-xs text-muted-foreground">Prazo de 2-3 dias úteis</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground">R$ 29,90</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="px-4 py-5 bg-card mt-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-secondary/50 rounded-xl">
                <div className="w-10 h-10 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs font-semibold text-foreground">Frete Grátis</p>
                <p className="text-[10px] text-muted-foreground">Acima R$299</p>
              </div>
              <div className="text-center p-3 bg-secondary/50 rounded-xl">
                <div className="w-10 h-10 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs font-semibold text-foreground">Garantia</p>
                <p className="text-[10px] text-muted-foreground">1 ano de fábrica</p>
              </div>
              <div className="text-center p-3 bg-secondary/50 rounded-xl">
                <div className="w-10 h-10 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs font-semibold text-foreground">Devolução</p>
                <p className="text-[10px] text-muted-foreground">30 dias grátis</p>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="px-4 py-5 bg-card mt-2">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full h-auto p-1 grid grid-cols-3 bg-secondary/50 rounded-xl">
                <TabsTrigger 
                  value="description"
                  className="text-xs font-semibold py-2.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  Descrição
                </TabsTrigger>
                <TabsTrigger 
                  value="specs"
                  className="text-xs font-semibold py-2.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  Especificações
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className="text-xs font-semibold py-2.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  Avaliações
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-4">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="leading-relaxed">{product.description}</p>
                  <p className="leading-relaxed mt-4">
                    Produto de alta qualidade com garantia de fábrica. Design moderno e ergonômico 
                    para maior conforto durante o uso. Fabricado com materiais resistentes e duráveis.
                  </p>
                  <h4 className="text-foreground font-semibold mt-4 mb-2">Diferenciais:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Tecnologia de última geração</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Alta durabilidade e resistência</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Design ergonômico e moderno</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Suporte técnico especializado</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="specs" className="mt-4">
                {product.specs ? (
                  <dl className="space-y-0">
                    {Object.entries(product.specs).map(([key, value], index) => (
                      <div 
                        key={key} 
                        className={`flex justify-between py-3 ${
                          index !== Object.entries(product.specs!).length - 1 ? 'border-b border-border' : ''
                        }`}
                      >
                        <dt className="text-sm text-muted-foreground">{key}</dt>
                        <dd className="text-sm font-semibold text-foreground">{value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Especificações técnicas não disponíveis para este produto.
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-4">
                  {/* Reviews Summary */}
                  <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-foreground">{product.rating}</p>
                      <div className="flex items-center gap-0.5 mt-1">
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
                      <p className="text-xs text-muted-foreground mt-1">{product.reviews} avaliações</p>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-3">{rating}</span>
                          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-400 rounded-full"
                              style={{ 
                                width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : 3}%` 
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample Reviews */}
                  <div className="space-y-4">
                    {[
                      { name: 'João S.', rating: 5, date: '10/01/2025', comment: 'Produto excelente! Superou minhas expectativas. Entrega rápida e embalagem segura.' },
                      { name: 'Maria L.', rating: 5, date: '08/01/2025', comment: 'Muito satisfeita com a compra. Qualidade premium e ótimo custo-benefício.' },
                      { name: 'Carlos M.', rating: 4, date: '05/01/2025', comment: 'Bom produto, mas a bateria poderia durar um pouco mais. No geral, recomendo!' },
                    ].map((review, index) => (
                      <div key={index} className="p-4 border border-border rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">{review.name[0]}</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{review.name}</p>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3 w-3 ${
                                      star <= review.rating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'fill-muted text-muted'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="px-4 py-6 bg-card mt-2">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Produtos Relacionados
              </h3>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
                {relatedProducts.map((relProduct) => (
                  <Link
                    key={relProduct.id}
                    to={`/produto/${relProduct.id}`}
                    className="flex-shrink-0 w-36 bg-secondary/30 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-card">
                      <img
                        src={relProduct.image}
                        alt={relProduct.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="p-2">
                      <h4 className="text-xs font-medium text-foreground line-clamp-2 leading-tight">
                        {relProduct.name}
                      </h4>
                      <p className="text-sm font-bold text-primary mt-1">
                        {formatPrice(relProduct.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
