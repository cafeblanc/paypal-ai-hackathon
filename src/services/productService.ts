export type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr";

export interface ProductEntity {
  id: string;
  name: Record<Language, string>;
  price: number;
  currency: string;
  stock: number;
  icon: string;
  videoUrl: string;
  fallbackVideoUrl: string;
  description: Record<Language, string>;
  createdAt: string;
}

let mockProductDatabase: ProductEntity[] = [
  {
    id: "prod-001",
    name: {
      ko: "프리미엄 유기농 꿀 (100% 천연)",
      en: "Premium Organic Honey (100% Natural)",
      ja: "プレミアム有機ハチミツ (100%天然)",
      zh: "优质有机蜂蜜 (100%天然)",
      es: "Miel Orgánica Premium (100% Natural)",
      fr: "Miel Bio Premium (100% Naturel)"
    },
    price: 35000,
    currency: "KRW",
    stock: 4,
    icon: "🍯",
    videoUrl: "/videos/honey_demo.mp4",
    fallbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: {
      ko: "청정 자연에서 채취한 100% 순수 천연 유기농 꿀 제품입니다.",
      en: "100% pure natural organic honey harvested from clean nature.",
      ja: "清らかな自然で採取した100%純粋な有機ハチミツ製品です。",
      zh: "在纯净自然中采集的100%纯天然有机蜂蜜产品。",
      es: "Miel orgánica 100% pura y natural cosechada en la naturaleza.",
      fr: "Miel bio 100% pur et naturel récolté dans une nature pure."
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-002",
    name: {
      ko: "핸드메이드 전통차 선물 세트",
      en: "Handmade Traditional Herbal Tea Set",
      ja: "ハンドメイド伝統茶ギフトセット",
      zh: "手工传统茶礼盒",
      es: "Set de Té Herbal Tradicional Hecho a Mano",
      fr: "Coffret de Thé Traditionnel Fait Main"
    },
    price: 48000,
    currency: "KRW",
    stock: 15,
    icon: "🍵",
    videoUrl: "/videos/tea_demo.mp4",
    fallbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: {
      ko: "엄선된 전통 원료를 정성껏 덖아 만든 수제 전통차 선물 세트입니다.",
      en: "Handmade traditional herbal tea set crafted with carefully selected ingredients.",
      ja: "厳選された伝統原料を丁寧に焙煎して作った手作り伝統茶ギフトセットです。",
      zh: "精选传统原料精心烘焙的手工传统茶礼盒。",
      es: "Set de té tradicional hecho a mano con ingredientes seleccionados.",
      fr: "Coffret de thé traditionnel fait main préparé avec soin."
    },
    createdAt: new Date().toISOString()
  }
];

export const productService = {
  async getProducts(): Promise<ProductEntity[]> {
    return mockProductDatabase;
  },
  async addProduct(newProd: Omit<ProductEntity, "id" | "createdAt">): Promise<ProductEntity[]> {
    const created: ProductEntity = {
      ...newProd,
      id: "prod-" + Date.now(),
      createdAt: new Date().toISOString()
    };
    mockProductDatabase = [created, ...mockProductDatabase];
    return mockProductDatabase;
  },
  async updateStock(id: string, stock: number): Promise<ProductEntity[]> {
    mockProductDatabase = mockProductDatabase.map(p => p.id === id ? { ...p, stock: Math.max(0, stock) } : p);
    return mockProductDatabase;
  },
  async updateVideoMapping(id: string, videoUrl: string): Promise<ProductEntity[]> {
    mockProductDatabase = mockProductDatabase.map(p => p.id === id ? { ...p, videoUrl } : p);
    return mockProductDatabase;
  },
  async deleteProduct(id: string): Promise<ProductEntity[]> {
    mockProductDatabase = mockProductDatabase.filter(p => p.id !== id);
    return mockProductDatabase;
  }
};