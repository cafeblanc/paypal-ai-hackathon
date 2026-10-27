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
    description: { ko: "실제 유기농 꿀을 들고 촬영한 실전 라이브 시연 영상 매핑 상품", en: "Live demonstration video product filmed with actual organic honey", ja: "実際の有機ハチミツを持って撮影したライブ実演動画マッピング製品", zh: "手持实际有机蜂蜜拍摄的直播演示视频商品", es: "Producto con video de demostración real con miel orgánica", fr: "Produit de démonstration filmé avec du vrai miel bio" },
    createdAt: (new Date()).toISOString()
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
    description: { ko: "실제 전통차 세트를 들고 촬영한 실전 라이브 시연 영상 매핑 상품", en: "Live demonstration video product filmed with actual traditional tea set", ja: "実際の伝統茶セットを持って撮影したライブ実演動画マッピング製品", zh: "手持实际传统茶具拍摄的直播演示视频商品", es: "Producto con video de demostración real con set de té", fr: "Produit de démonstration filmé avec du vrai thé" },
    createdAt: (new Date()).toISOString()
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
      createdAt: (new Date()).toISOString()
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
  }
};
