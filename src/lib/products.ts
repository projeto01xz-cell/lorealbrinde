import produto01 from '@/assets/products/produto-01.png';
import produto02 from '@/assets/products/produto-02.png';
import produto03 from '@/assets/products/produto-03.png';
import produto04 from '@/assets/products/produto-04.png';
import produto05 from '@/assets/products/produto-05.png';
import produto06 from '@/assets/products/produto-06.png';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
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
  { id: 'ebikes', name: 'Bicicletas Elétricas' },
  { id: 'scooters', name: 'Scooters' },
  { id: 'parts', name: 'Peças' },
  { id: 'accessories', name: 'Acessórios' },
];

export const products: Product[] = [
  // Produtos em destaque da imagem
  {
    id: '16',
    name: 'Scooter Elétrica Demarche 400W 48V 12AH',
    description: 'Scooter elétrica compacta com cesto frontal, ideal para deslocamentos urbanos. Motor 400W e bateria 48V 12Ah.',
    price: 387.00,
    originalPrice: 500,
    image: produto01,
    category: 'scooters',
    rating: 4.7,
    reviews: 189,
    inStock: true,
    featured: true,
    freeShipping: true,
    specs: {
      'Motor': '400W',
      'Bateria': '48V 12Ah',
      'Autonomia': 'Até 35km',
      'Velocidade': '25 km/h',
    },
  },
  {
    id: '17',
    name: 'Bicicleta Elétrica 750W Konnan Conquest 48V 18,2Ah',
    description: 'E-bike estilo fat bike com motor 750W, pneus largos e design agressivo. Perfeita para trilhas e cidade.',
    price: 387.00,
    originalPrice: 500,
    image: produto02,
    category: 'ebikes',
    rating: 4.9,
    reviews: 312,
    inStock: true,
    featured: true,
    freeShipping: true,
    specs: {
      'Motor': '750W Brushless',
      'Bateria': '48V 18,2Ah Lítio',
      'Autonomia': 'Até 70km',
      'Pneus': 'Fat Tire 20x4.0',
    },
  },
  {
    id: '18',
    name: 'Scooter Elétrica GTS 500W 48V 20Ah JD-06',
    description: 'Scooter elétrica retrô com design elegante, banco confortável e excelente autonomia. Não precisa de CNH.',
    price: 387.00,
    originalPrice: 500,
    image: produto03,
    category: 'scooters',
    rating: 4.8,
    reviews: 245,
    inStock: true,
    featured: true,
    freeShipping: true,
    specs: {
      'Motor': '500W',
      'Bateria': '48V 20Ah',
      'Autonomia': 'Até 60km',
      'Velocidade': '35 km/h',
    },
  },
  // E-Bikes
  {
    id: '1',
    name: 'E-Bike Urbana 350W',
    description: 'Bicicleta elétrica urbana com motor 350W, bateria de lítio 36V 10Ah e autonomia de até 40km.',
    price: 387.00,
    originalPrice: 500,
    image: produto04,
    category: 'ebikes',
    rating: 4.8,
    reviews: 234,
    inStock: true,
    freeShipping: true,
    specs: {
      'Motor': '350W Brushless',
      'Bateria': '36V 10Ah Lítio',
      'Autonomia': 'Até 40km',
      'Velocidade': '25 km/h',
    },
  },
  {
    id: '2',
    name: 'E-Bike Mountain 500W',
    description: 'Bicicleta elétrica para trilhas com motor 500W, suspensão dianteira e pneus off-road.',
    price: 387.00,
    originalPrice: 500,
    image: produto05,
    category: 'ebikes',
    rating: 4.9,
    reviews: 156,
    inStock: true,
    featured: true,
    freeShipping: true,
    specs: {
      'Motor': '500W Brushless',
      'Bateria': '48V 13Ah Lítio',
      'Autonomia': 'Até 60km',
      'Suspensão': 'Dianteira 100mm',
    },
  },
  {
    id: '3',
    name: 'E-Bike Dobrável Compacta',
    description: 'Bicicleta elétrica dobrável, perfeita para transporte público. Motor 250W e peso de apenas 18kg.',
    price: 387.00,
    originalPrice: 500,
    image: produto06,
    category: 'ebikes',
    rating: 4.6,
    reviews: 89,
    inStock: true,
    freeShipping: true,
    specs: {
      'Motor': '250W Brushless',
      'Bateria': '36V 7.8Ah Lítio',
      'Autonomia': 'Até 30km',
      'Peso': '18kg',
    },
  },
  {
    id: '4',
    name: 'E-Bike Cargo 750W',
    description: 'Bicicleta elétrica de carga com capacidade para 150kg. Ideal para entregas e transporte pesado.',
    price: 387.00,
    image: 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=500&h=500&fit=crop',
    category: 'ebikes',
    rating: 4.7,
    reviews: 67,
    inStock: true,
    freeShipping: true,
    specs: {
      'Motor': '750W Brushless',
      'Bateria': '48V 20Ah Lítio',
      'Capacidade': 'Até 150kg',
      'Autonomia': 'Até 80km',
    },
  },

  // Scooters
  {
    id: '5',
    name: 'Scooter Elétrica Pro 800W',
    description: 'Scooter elétrica de alta performance com motor 800W, freio a disco e autonomia de 45km.',
    price: 387.00,
    originalPrice: 500,
    image: produto04,
    category: 'scooters',
    rating: 4.7,
    reviews: 312,
    inStock: true,
    featured: true,
    freeShipping: true,
    specs: {
      'Motor': '800W',
      'Bateria': '48V 12.5Ah',
      'Autonomia': 'Até 45km',
      'Velocidade': '35 km/h',
    },
  },
  {
    id: '6',
    name: 'Scooter Urbana 350W',
    description: 'Scooter compacta e leve para deslocamentos urbanos. Dobrável e fácil de transportar.',
    price: 387.00,
    originalPrice: 500,
    image: 'https://images.unsplash.com/photo-1604868189265-219ba7ffc595?w=500&h=500&fit=crop',
    category: 'scooters',
    rating: 4.5,
    reviews: 456,
    inStock: true,
    freeShipping: true,
    specs: {
      'Motor': '350W',
      'Bateria': '36V 7.8Ah',
      'Autonomia': 'Até 25km',
      'Peso': '12.5kg',
    },
  },
  {
    id: '7',
    name: 'Scooter Off-Road 1200W',
    description: 'Scooter elétrica para terrenos irregulares com pneus largos e suspensão dupla.',
    price: 387.00,
    image: 'https://images.unsplash.com/photo-1565536420726-7c90fd8c7336?w=500&h=500&fit=crop',
    category: 'scooters',
    rating: 4.8,
    reviews: 98,
    inStock: true,
    freeShipping: true,
    specs: {
      'Motor': '1200W Dual',
      'Bateria': '52V 18Ah',
      'Autonomia': 'Até 60km',
      'Suspensão': 'Dupla Hidráulica',
    },
  },

  // Peças
  {
    id: '8',
    name: 'Bateria Lítio 48V 13Ah',
    description: 'Bateria de reposição de alta capacidade para e-bikes. Compatível com a maioria dos modelos.',
    price: 387.00,
    originalPrice: 500,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&h=500&fit=crop',
    category: 'parts',
    rating: 4.6,
    reviews: 189,
    inStock: true,
    specs: {
      'Voltagem': '48V',
      'Capacidade': '13Ah',
      'Células': 'Samsung/LG',
      'Ciclos': '800+',
    },
  },
  {
    id: '9',
    name: 'Motor Hub 500W',
    description: 'Motor de cubo traseiro 500W para conversão de bicicleta comum em elétrica.',
    price: 387.00,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    category: 'parts',
    rating: 4.7,
    reviews: 234,
    inStock: true,
    specs: {
      'Potência': '500W',
      'Tipo': 'Hub Traseiro',
      'Voltagem': '36V/48V',
      'Torque': '45Nm',
    },
  },
  {
    id: '10',
    name: 'Controlador 48V 25A',
    description: 'Controlador programável para e-bikes com display LCD e funções avançadas.',
    price: 387.00,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=500&fit=crop',
    category: 'parts',
    rating: 4.4,
    reviews: 156,
    inStock: true,
    specs: {
      'Voltagem': '48V',
      'Corrente': '25A',
      'Display': 'LCD Colorido',
      'Funções': 'Regen, Cruise',
    },
  },
  {
    id: '11',
    name: 'Kit Conversão E-Bike 1000W',
    description: 'Kit completo para converter sua bicicleta em elétrica. Inclui motor, bateria e controlador.',
    price: 387.00,
    originalPrice: 500,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    category: 'parts',
    rating: 4.8,
    reviews: 78,
    inStock: true,
    freeShipping: true,
    specs: {
      'Motor': '1000W Hub',
      'Bateria': '48V 17.5Ah',
      'Autonomia': 'Até 70km',
      'Velocidade': '45 km/h',
    },
  },

  // Acessórios
  {
    id: '12',
    name: 'Capacete Smart com LED',
    description: 'Capacete inteligente com luz LED integrada, seta direcional e conectividade Bluetooth.',
    price: 387.00,
    originalPrice: 500,
    image: produto06,
    category: 'accessories',
    rating: 4.5,
    reviews: 267,
    inStock: true,
    featured: true,
    specs: {
      'Material': 'ABS + EPS',
      'LED': 'Frontal + Traseiro',
      'Bateria': '800mAh',
      'Bluetooth': '5.0',
    },
  },
  {
    id: '13',
    name: 'Cadeado U-Lock Premium',
    description: 'Cadeado de alta segurança em aço temperado. Resistente a corte e arrombamento.',
    price: 387.00,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    category: 'accessories',
    rating: 4.8,
    reviews: 445,
    inStock: true,
    specs: {
      'Material': 'Aço Temperado 16mm',
      'Nível': 'Segurança Máxima',
      'Chaves': '3 incluídas',
      'Peso': '1.8kg',
    },
  },
  {
    id: '14',
    name: 'Bolsa para Guidão Impermeável',
    description: 'Bolsa de guidão com suporte para celular e material impermeável. Capacidade de 3L.',
    price: 387.00,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    category: 'accessories',
    rating: 4.3,
    reviews: 189,
    inStock: true,
    specs: {
      'Capacidade': '3 Litros',
      'Material': 'TPU Impermeável',
      'Suporte': 'Celular até 6.5"',
      'Instalação': 'Velcro',
    },
  },
  {
    id: '15',
    name: 'Carregador Rápido 48V 5A',
    description: 'Carregador de alta potência para baterias de e-bike. Carrega 80% em 2 horas.',
    price: 387.00,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    category: 'accessories',
    rating: 4.6,
    reviews: 312,
    inStock: true,
    specs: {
      'Saída': '48V 5A',
      'Potência': '240W',
      'Tempo': '2h para 80%',
      'Proteções': 'Curto, Sobre',
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