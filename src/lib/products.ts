import produto01 from '@/assets/products/produto-01.png';
import produto02 from '@/assets/products/produto-02.png';
import produto03 from '@/assets/products/produto-03.png';
import produto04 from '@/assets/products/produto-04.png';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured?: boolean;
  freeShipping?: boolean;
  specs?: Record<string, string>;
}

export const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'ventiladores', name: 'Ventiladores' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Ventilador Turbo Potente 110/220V',
    description: `💨 Ventilador Turbo — Potência e Frescor para sua Casa

O Ventilador Turbo é a solução ideal para quem busca muito mais vento com economia de energia. Silencioso, potente e perfeito para qualquer ambiente da sua casa.

📋 FICHA TÉCNICA
• Bivolt: 110V / 220V automático
• Velocidades: 3 níveis (baixo, médio, alto)
• Hélices: 6 pás em ABS reforçado
• Altura: Ajustável até 1,30m
• Diâmetro: 40 cm
• Cabo: 1,5 metro
• Garantia: 90 dias

✅ DIFERENCIAIS
• Ultra silencioso mesmo na velocidade máxima
• Economiza até 40% de energia vs. ventiladores convencionais
• Fácil montagem, sem ferramentas
• Design moderno que combina com qualquer decoração
• Grade de proteção anti-dedos (seguro para crianças)
• Oscilação automática 90°

🛡️ SEGURANÇA
• Proteção térmica automática
• Grade de segurança resistente
• Base antiderrapante
• Certificado pelo INMETRO`,
    price: 37.80,
    originalPrice: 189.90,
    image: produto01,
    images: [produto01, produto02, produto03, produto04],
    category: 'ventiladores',
    rating: 4.9,
    reviews: 1847,
    inStock: true,
    featured: true,
    freeShipping: true,
    specs: {
      'Tensão': '110V / 220V Bivolt',
      'Velocidades': '3 níveis',
      'Hélices': '6 pás ABS',
      'Diâmetro': '40 cm',
      'Oscilação': '90° automática',
      'Garantia': '90 dias',
    },
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

export function calculateDiscount(price: number, originalPrice?: number): number {
  if (!originalPrice) return 0;
  return Math.round((1 - price / originalPrice) * 100);
}
