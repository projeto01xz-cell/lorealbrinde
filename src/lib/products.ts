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
  specs?: Record<string, string>;
}

export const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'smartphones', name: 'Smartphones' },
  { id: 'laptops', name: 'Notebooks' },
  { id: 'tablets', name: 'Tablets' },
  { id: 'audio', name: 'Áudio' },
  { id: 'accessories', name: 'Acessórios' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'O iPhone mais poderoso. Chip A17 Pro, câmera de 48MP e design em titânio.',
    price: 9499,
    originalPrice: 10999,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop',
    category: 'smartphones',
    rating: 4.9,
    reviews: 2847,
    inStock: true,
    featured: true,
    specs: {
      'Tela': '6.7" Super Retina XDR',
      'Chip': 'A17 Pro',
      'Câmera': '48MP + 12MP + 12MP',
      'Bateria': 'Até 29h de reprodução de vídeo',
    },
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy AI integrada. S Pen inclusa, câmera de 200MP e tela Dynamic AMOLED 2X.',
    price: 8999,
    originalPrice: 9999,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop',
    category: 'smartphones',
    rating: 4.8,
    reviews: 1923,
    inStock: true,
    featured: true,
    specs: {
      'Tela': '6.8" Dynamic AMOLED 2X',
      'Chip': 'Snapdragon 8 Gen 3',
      'Câmera': '200MP + 50MP + 12MP + 10MP',
      'Bateria': '5000mAh',
    },
  },
  {
    id: '3',
    name: 'MacBook Pro 14"',
    description: 'Chip M3 Pro para desempenho profissional. Tela Liquid Retina XDR.',
    price: 18999,
    originalPrice: 21999,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    category: 'laptops',
    rating: 4.9,
    reviews: 892,
    inStock: true,
    featured: true,
    specs: {
      'Tela': '14.2" Liquid Retina XDR',
      'Chip': 'Apple M3 Pro',
      'Memória': '18GB RAM',
      'Armazenamento': '512GB SSD',
    },
  },
  {
    id: '4',
    name: 'Dell XPS 15',
    description: 'Design ultracompacto com tela OLED 3.5K e processador Intel Core Ultra.',
    price: 14999,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&h=500&fit=crop',
    category: 'laptops',
    rating: 4.7,
    reviews: 654,
    inStock: true,
    specs: {
      'Tela': '15.6" OLED 3.5K',
      'Processador': 'Intel Core Ultra 7',
      'Memória': '16GB RAM',
      'Armazenamento': '512GB SSD',
    },
  },
  {
    id: '5',
    name: 'iPad Pro 12.9"',
    description: 'Chip M2, tela Liquid Retina XDR e compatível com Apple Pencil Pro.',
    price: 12499,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
    category: 'tablets',
    rating: 4.8,
    reviews: 1234,
    inStock: true,
    specs: {
      'Tela': '12.9" Liquid Retina XDR',
      'Chip': 'Apple M2',
      'Armazenamento': '256GB',
      'Conectividade': 'Wi-Fi 6E',
    },
  },
  {
    id: '6',
    name: 'Samsung Galaxy Tab S9 Ultra',
    description: 'Tela Dynamic AMOLED 2X de 14.6" e S Pen inclusa para produtividade.',
    price: 9999,
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop',
    category: 'tablets',
    rating: 4.6,
    reviews: 567,
    inStock: true,
    specs: {
      'Tela': '14.6" Dynamic AMOLED 2X',
      'Processador': 'Snapdragon 8 Gen 2',
      'Memória': '12GB RAM',
      'Armazenamento': '256GB',
    },
  },
  {
    id: '7',
    name: 'AirPods Pro 2ª Geração',
    description: 'Cancelamento de ruído ativo, áudio espacial e estojo com carregamento USB-C.',
    price: 1899,
    originalPrice: 2299,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&h=500&fit=crop',
    category: 'audio',
    rating: 4.8,
    reviews: 4521,
    inStock: true,
    featured: true,
    specs: {
      'Driver': 'Apple H2',
      'ANC': 'Cancelamento de ruído ativo',
      'Bateria': 'Até 6h (30h com estojo)',
      'Conectividade': 'Bluetooth 5.3',
    },
  },
  {
    id: '8',
    name: 'Sony WH-1000XM5',
    description: 'O melhor em cancelamento de ruído. 30 horas de bateria e som Hi-Res.',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop',
    category: 'audio',
    rating: 4.9,
    reviews: 2134,
    inStock: true,
    specs: {
      'Driver': '30mm',
      'ANC': 'Líder do mercado',
      'Bateria': 'Até 30h',
      'Conectividade': 'Bluetooth 5.2, LDAC',
    },
  },
  {
    id: '9',
    name: 'Apple Watch Ultra 2',
    description: 'O Apple Watch mais resistente. GPS de precisão, mergulho até 40m.',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&h=500&fit=crop',
    category: 'accessories',
    rating: 4.7,
    reviews: 876,
    inStock: true,
    specs: {
      'Tela': '49mm Always-On',
      'Chip': 'S9 SiP',
      'Resistência': '100m água, MIL-STD-810H',
      'Bateria': 'Até 36h',
    },
  },
  {
    id: '10',
    name: 'MagSafe Charger',
    description: 'Carregador magnético sem fio para iPhone. Carregamento rápido de até 15W.',
    price: 449,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop',
    category: 'accessories',
    rating: 4.5,
    reviews: 3421,
    inStock: true,
    specs: {
      'Potência': 'Até 15W',
      'Compatibilidade': 'iPhone 12 ou superior',
      'Cabo': 'USB-C (1m)',
    },
  },
  {
    id: '11',
    name: 'JBL Flip 6',
    description: 'Caixa de som Bluetooth portátil à prova d\'água. 12 horas de bateria.',
    price: 799,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
    category: 'audio',
    rating: 4.6,
    reviews: 2567,
    inStock: true,
    specs: {
      'Potência': '30W',
      'Resistência': 'IP67',
      'Bateria': '12h',
      'Conectividade': 'Bluetooth 5.1',
    },
  },
  {
    id: '12',
    name: 'Xiaomi 14 Ultra',
    description: 'Câmera Leica profissional com sensor de 1". O melhor em fotografia mobile.',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
    category: 'smartphones',
    rating: 4.7,
    reviews: 432,
    inStock: false,
    specs: {
      'Tela': '6.73" LTPO AMOLED',
      'Chip': 'Snapdragon 8 Gen 3',
      'Câmera': 'Leica 50MP x4',
      'Bateria': '5000mAh, 90W',
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
