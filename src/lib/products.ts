import produto01 from '@/assets/products/produto-01.png';
import produto02 from '@/assets/products/produto-02.png';
import produto03 from '@/assets/products/produto-03.png';
import produto04 from '@/assets/products/produto-04.png';
import produto05 from '@/assets/products/produto-05.png';
import produto06 from '@/assets/products/produto-06.png';
import scooterDemarche01 from '@/assets/products/scooter-demarche-01.png';
import scooterDemarche02 from '@/assets/products/scooter-demarche-02.png';
import scooterDemarche03 from '@/assets/products/scooter-demarche-03.png';
import scooterDemarche04 from '@/assets/products/scooter-demarche-04.png';
import ebikeKonnan01 from '@/assets/products/ebike-konnan-01.png';
import ebikeKonnan02 from '@/assets/products/ebike-konnan-02.png';
import ebikeKonnan03 from '@/assets/products/ebike-konnan-03.png';
import ebikeKonnan04 from '@/assets/products/ebike-konnan-04.png';
import scooterGts01 from '@/assets/products/scooter-gts-01.png';
import scooterGts02 from '@/assets/products/scooter-gts-02.png';
import scooterGts03 from '@/assets/products/scooter-gts-03.png';
import scooterGts04 from '@/assets/products/scooter-gts-04.png';
import ebikeMountain01 from '@/assets/products/ebike-mountain-01.png';
import ebikeMountain02 from '@/assets/products/ebike-mountain-02.png';
import ebikeMountain03 from '@/assets/products/ebike-mountain-03.png';
import ebikeMountain04 from '@/assets/products/ebike-mountain-04.png';
import scooterPro01 from '@/assets/products/scooter-pro-01.png';
import scooterPro02 from '@/assets/products/scooter-pro-02.png';
import scooterPro03 from '@/assets/products/scooter-pro-03.png';
import scooterPro04 from '@/assets/products/scooter-pro-04.png';
import capaceteSmart01 from '@/assets/products/capacete-smart-01.png';
import capaceteSmart02 from '@/assets/products/capacete-smart-02.png';
import capaceteSmart03 from '@/assets/products/capacete-smart-03.png';
import capaceteSmart04 from '@/assets/products/capacete-smart-04.png';

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
  { id: 'ebikes', name: 'Bicicletas Elétricas' },
  { id: 'scooters', name: 'Scooters' },
  { id: 'parts', name: 'Peças' },
  { id: 'accessories', name: 'Acessórios' },
];

export const products: Product[] = [
  // Produtos em destaque da imagem
  {
    id: '16',
    name: 'Scooter Elétrica Demarche 400w 48V 12AH',
    description: `🛴 Scooter Elétrica Demarche 400W Aro 14 Urbana

A Scooter Elétrica Demarche possui design moderno e alta praticidade, sendo ideal para deslocamentos urbanos rápidos e econômicos. Desenvolvida para o dia a dia, ela entrega conforto, segurança e ótimo desempenho para trajetos curtos e médios.

Equipada com motor elétrico de 400W, a scooter atinge velocidade máxima de até 32 km/h, regulada por normas de segurança, garantindo uma condução estável e confiável no uso urbano.

⚡ Autonomia e Desempenho Urbano

A bateria 48V / 12Ah de chumbo-ácido oferece carregamento eficiente e autonomia média de até 30 km, variando conforme peso do condutor, tipo de terreno e uso em subidas. Ideal para deslocamentos diários como trabalho, estudos e tarefas do cotidiano.

🔐 Sistema Antifurto Integrado

Conta com sistema antifurto mecânico acionado por chave. Ao girar a chave localizada próxima ao eixo da roda, um mecanismo interno bloqueia fisicamente a rotação, dificultando o deslocamento da scooter quando estacionada.

🛞 Conforto, Segurança e Praticidade

Seu conjunto de aro 14" com pneus urbanos semi slick garante boa estabilidade e rodagem suave. O sistema de freio a tambor proporciona frenagens seguras e progressivas, enquanto a iluminação dianteira e traseira aumenta a segurança em trajetos noturnos.

O display digital colorido permite acompanhar velocidade, nível de bateria e informações de desempenho em tempo real. Além disso, a scooter conta com entrada USB para recarga de dispositivos e cesta dianteira aramada para transporte de objetos.

📋 Ficha Técnica

Motor: 400W com limitador eletrônico de velocidade
Velocidade Máxima: Até 32 km/h
Bateria: Chumbo-ácido 48V / 12Ah
Autonomia Média: Até 30 km*
Pneus: Aro 14" urbano semi slick
Freios: Sistema de freio a tambor
Display: Digital colorido
Iluminação: Dianteira e traseira
Capacidade Máxima: 120 kg
Altura recomendada: 1,50m a 1,75m
Peso Aproximado: 34 kg
Extras: Sistema antifurto com chave, cesta dianteira e entrada USB

*A autonomia pode variar conforme peso do condutor, tipo de terreno e uso em subidas.`,
    price: 387.00,
    originalPrice: 5500,
    image: scooterDemarche01,
    images: [scooterDemarche01, scooterDemarche02, scooterDemarche03, scooterDemarche04],
    category: 'scooters',
    rating: 4.7,
    reviews: 189,
    inStock: true,
    featured: true,
    freeShipping: true,
    specs: {
      'Motor': '400W',
      'Bateria': '48V 12Ah Chumbo-ácido',
      'Autonomia': 'Até 30km',
      'Velocidade': '32 km/h',
      'Pneus': 'Aro 14" semi slick',
      'Freios': 'Tambor',
      'Display': 'Digital colorido',
      'Capacidade': '120 kg',
    },
  },
  {
    id: '17',
    name: 'Bicicleta Elétrica 750w Konnan Conquest 48V 18,2Ah',
    description: `⚡ Bicicleta Elétrica Aro 20 Fat 4.0 750W 48V — Conforto, Estilo e Mobilidade
Esta bicicleta elétrica aro 20 com pneus fat 4.0 foi desenvolvida para quem busca mobilidade elétrica com equilíbrio entre potência, conforto e controle. O quadro em aço reforçado e os pneus largos garantem excelente estabilidade, trazendo mais segurança no uso urbano e em pisos irregulares.

Equipada com motor traseiro de 750W e sistema elétrico 48V, oferece ótimo desempenho em arrancadas e subidas, com velocidade limitada em até 32 km/h, conforme a legislação. A bateria 48V com 18,2Ah proporciona autonomia adequada para deslocamentos diários, trabalho e lazer.

O conforto é garantido pela suspensão dianteira com coroa dupla, enquanto os freios a disco nas duas rodas asseguram frenagens confiáveis. A transmissão de 7 velocidades indexadas permite ajustar a pedalada conforme o trajeto, e o display facilita o acompanhamento de velocidade, bateria e percurso durante a pilotagem.

🛡️ Estrutura e Conforto
Quadro em aço aro 20
Garfo com suspensão em aço e coroa dupla
Pneus fat 20" x 4.0 para maior estabilidade
Guidão largo com posição de pilotagem confortável
Selim confortável

⚙️ Sistema Elétrico
Motor: Traseiro 750W – 48V
Bateria: 48V 18,2Ah
Velocidade máxima: Limitada a 32 km/h
Autonomia aproximadamente: 30km a 40km.
Acelerador integrado à manopla (fiação à prova d'água)
Manetes com corte de energia do motor
Carregador 54.6V 2A

🛑 Segurança
Freio a disco dianteiro
Freio a disco traseiro
Discos Ø160 mm
Iluminação dianteira e traseira

🔧 Transmissão e Componentes
Transmissão com 7 velocidades indexadas
Catraca 14–28 dentes
Câmbio traseiro de fixação direta
Pedivela em alumínio com coroa 42 dentes e braço 170 mm
Corrente 1/2 x 3/32 com 114 elos

📊 Painel e Recursos
Display 48V com suporte (Ø31.8)
Indicação de velocidade
Nível de carga da bateria
Distância/viagem (trip)
Controle de luz

📦 Peso e Capacidade
Referência de mercado: e-bike 20x4" 48V 750W 40 kg com bateria (o peso real pode variar conforme quadro, componentes e tipo de bateria).
Referência de mercado: há anúncios indicando até 150 kg de carga máxima (pode variar conforme estrutura e fabricante).

📋 Especificações Técnicas
Quadro: Aço, aro 20", compatível com pneus 4.0. Indicado para ciclista de 1,60 cm a 1,85 cm
Garfo: Suspensão aro 20", aço, coroa dupla, pernas ED Ø38, threadless
Amortecedor: 1200 lbs x 150 l (f/r: 24/31)
Caixa de direção: 1-1/8", Ø28.6/44/30, sem rosca
Espaçadores: 1-1/8" x 10 mm (2 pcs) + 1-1/8" x 5 mm (1 pc)
Guidão: 22.2 x 2.0 x 640 mm, Ø31.8, altura 220 mm
Mesa: Ø22.2 x Ø28.6
Manoplas: 130 mm, duas cores
Movimento central: Rolamento selado, 120/175 mm
Pedais: Liga de alumínio com refletor, rosca 9/16", com esferas
Cubo dianteiro: M3/8 x 135 x 175, 36 furos, com rolamentos
Aros: Alumínio aro 20", largura 4.0, 36 furos
Raios: 13G (F: 171/172 | R: 128/129), niple UCP, raios com tratamento ED
Pneus: 20" x 4.0 com logo KONNAN
Câmaras: 20" x 4.0, válvula AV, butil
Fita de aro: 20 x 70 mm
Freios: Disco dianteiro e traseiro (BK alloy), discos Ø160 mm
Motor: Traseiro 48V 750W (freio a disco)
Transmissão: 7v indexada, catraca 14–28T
Controlador: 9 tubos, 48V 750W, 115 mm
Iluminação: Farol dianteiro e lanterna traseira
Paralamas: Aro 20", tipo redondo 110 mm + suportes
Descanso: Traseiro ajustável
Interruptor: Farol/buzina, fiação à prova d'água
Sensor: 12 ímãs

⚠️ Aviso Importante
Recomendamos sempre o uso de equipamentos de segurança (capacete e itens de proteção). Respeite as leis de trânsito e utilize o produto de forma responsável.`,
    price: 387.00,
    originalPrice: 11190,
    image: ebikeKonnan01,
    images: [ebikeKonnan01, ebikeKonnan02, ebikeKonnan03, ebikeKonnan04],
    category: 'ebikes',
    rating: 4.9,
    reviews: 312,
    inStock: true,
    featured: true,
    freeShipping: true,
    specs: {
      'Motor': '750W Traseiro',
      'Bateria': '48V 18,2Ah',
      'Autonomia': '30km a 40km',
      'Velocidade': '32 km/h',
      'Pneus': 'Fat 20" x 4.0',
      'Freios': 'Disco Ø160mm',
      'Transmissão': '7 velocidades',
      'Capacidade': 'Até 150kg',
    },
  },
  {
    id: '18',
    name: 'Scooter Elétrica GTS 500W 48V 20Ah JD-06',
    description: 'Scooter elétrica retrô com design elegante, banco confortável e excelente autonomia. Não precisa de CNH.',
    price: 387.00,
    originalPrice: 8300,
    image: scooterGts01,
    images: [scooterGts01, scooterGts02, scooterGts03, scooterGts04],
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
    originalPrice: 5499,
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
    originalPrice: 8499,
    image: ebikeMountain01,
    images: [ebikeMountain01, ebikeMountain02, ebikeMountain03, ebikeMountain04],
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
    originalPrice: 3999,
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
    originalPrice: 3999,
    image: scooterPro01,
    images: [scooterPro01, scooterPro02, scooterPro03, scooterPro04],
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
    originalPrice: 2499,
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
    originalPrice: 1599,
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
    originalPrice: 2999,
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
    name: 'Triciclo Elétrico Raphynus 650W 48V 20Ah',
    description: `🛵 Triciclo Elétrico Raphynus 650W 48V 20Ah — Conforto e Estabilidade

O Triciclo Elétrico Raphynus foi desenvolvido para quem busca mobilidade com segurança, conforto e praticidade. Seu design de três rodas proporciona excelente estabilidade, sendo ideal para pessoas de todas as idades, incluindo idosos e pessoas com dificuldades de equilíbrio.

Equipado com motor elétrico de 650W e sistema 48V, oferece potência suficiente para deslocamentos urbanos e pequenas subidas, com velocidade máxima de até 25 km/h. A bateria de 20Ah proporciona autonomia de aproximadamente 40 a 50 km, variando conforme peso do condutor e tipo de terreno.

⚡ Sistema Elétrico
Motor: 650W – 48V
Bateria: 48V 20Ah (removível para recarga)
Velocidade máxima: Até 25 km/h
Autonomia: 40 a 50 km aproximadamente
Tempo de recarga: 6 a 8 horas

🛡️ Conforto e Segurança
Assento acolchoado com encosto
Cesto traseiro para transporte de compras
Freios a disco nas rodas traseiras
Iluminação dianteira e traseira
Espelhos retrovisores
Buzina elétrica

📋 Especificações
Estrutura em aço reforçado
Rodas aro 16"
Capacidade de carga: até 150 kg
Peso aproximado: 55 kg
Painel digital com velocímetro e indicador de bateria

⚠️ Aviso Importante
Recomendamos sempre o uso de equipamentos de segurança. Respeite as leis de trânsito e utilize o produto de forma responsável.`,
    price: 387.00,
    originalPrice: 6789,
    image: capaceteSmart01,
    images: [capaceteSmart01, capaceteSmart02, capaceteSmart03, capaceteSmart04],
    category: 'scooters',
    rating: 4.5,
    reviews: 267,
    inStock: true,
    featured: true,
    specs: {
      'Motor': '650W',
      'Bateria': '48V 20Ah',
      'Autonomia': '40 a 50km',
      'Velocidade': '25 km/h',
      'Capacidade': '150 kg',
      'Rodas': 'Aro 16"',
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