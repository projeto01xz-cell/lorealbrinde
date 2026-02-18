import ventilador01 from '@/assets/products/ventilador-turbo-01.png';
import ventilador02 from '@/assets/products/ventilador-turbo-02.png';
import ventilador03 from '@/assets/products/ventilador-turbo-03.png';
import ventilador04 from '@/assets/products/ventilador-turbo-04.png';
import ventilador05 from '@/assets/products/ventilador-turbo-05.png';
import ventilador06 from '@/assets/products/ventilador-turbo-06.png';
import ventilador07 from '@/assets/products/ventilador-turbo-07.png';

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
    name: 'Ventilador Turbo Force 50cm — O Mais Forte e Silencioso',
    description: `💨 Ventilador Turbo Force 50cm — Potência que Não se Ouve, se Sente!

Deixe os ambientes da sua casa muito mais agradáveis, refrescantes e silenciosos com o Ventilador Turbo Force de 50 cm. O MAIS FORTE E SILENCIOSO VENTILADOR JÁ FEITO!

Perfeito para qualquer tipo de ambiente, é até 4x mais silencioso e ainda mais forte que os demais disponíveis no mercado. Conta com design moderno, sofisticado e totalmente desmontável, o que possibilita o fácil armazenamento quando não estiver em uso.

🌬️ DIFERENCIAIS
• Power Zone — área concentrada que garante o máximo de vento direcionado
• Função Eco Fresh que economiza até 20% de energia
• Ultra silencioso mesmo na velocidade máxima
• Fácil de montar e desmontar com apenas um clique
• Design moderno e discreto para qualquer ambiente
• Oscilação automática para cobertura total do ambiente

📋 FICHA TÉCNICA
• Bivolt: 110V / 220V
• Velocidades: 2 níveis (turbo + eco)
• Hélices: 6 pás de Polipropileno
• Potência: 126 W
• Diâmetro: 50 cm
• Velocidade máxima: 1.500 rpm
• Nível de ruído: 55 dB
• Eficiência energética: Classe A
• Peso: 4,63 kg

🛡️ SEGURANÇA
• Certificado pelo INMETRO
• Grade removível para fácil limpeza
• Proteção térmica automática
• Base antiderrapante estável`,
    price: 37.82,
    originalPrice: 189.90,
    image: ventilador01,
    images: [ventilador01, ventilador02, ventilador03, ventilador04, ventilador05, ventilador06, ventilador07],
    category: 'ventiladores',
    rating: 4.8,
    reviews: 2800,
    inStock: true,
    featured: true,
    freeShipping: true,
    specs: {
      'Tensão': '110V / 220V Bivolt',
      'Velocidades': '2 níveis (Turbo + Eco)',
      'Hélices': '6 pás Polipropileno',
      'Diâmetro': '50 cm',
      'Potência': '126 W',
      'Nível de Ruído': '55 dB',
      'Eficiência': 'Classe A (INMETRO)',
      'Peso': '4,63 kg',
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
