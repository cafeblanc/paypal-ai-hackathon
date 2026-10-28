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

const STORAGE_KEY_PRODUCTS = "paypal_live_custom_products_v1";
const STORAGE_KEY_DEFAULT_PROD = "paypal_live_default_product_id_v1";

export const INITIAL_DEFAULT_PRODUCTS: ProductEntity[] = [
  {
    id: "prod-honey",
    name: {
      ko: "양평 친환경 아카시아 벌꿀 (500g)",
      en: "Yangpyeong Organic Acacia Honey (500g)",
      ja: "楊平 有機栽培アカシア蜂蜜 (500g)",
      zh: "杨平有机洋槐蜂蜜 (500g)",
      es: "Miel Orgánica de Acacia de Yangpyeong (500g)",
      fr: "Miel d'Acacia Biologique de Yangpyeong (500g)"
    },
    price: 32000,
    currency: "KRW",
    stock: 24,
    icon: "🍯",
    videoUrl: "/videos/honey_demo.mp4",
    fallbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: {
      ko: "맑은 물 양평 청정 자연에서 채밀한 100% 순수 천연 아카시아 벌꿀입니다.",
      en: "100% Pure natural organic acacia honey harvested from Yangpyeong pristine mountains.",
      ja: "楊平の清らかな自然の中で採取された100%純粋な天然アカシア蜂蜜です。",
      zh: "采自杨平纯净山野的100%纯天然洋槐蜂蜜。",
      es: "Miel de acacia 100% pura y natural recolectada en las montañas vírgenes de Yangpyeong.",
      fr: "Miel d'acacia 100% pur et naturel récolté dans la nature préservée de Yangpyeong."
    },
    createdAt: new Date("2026-10-27T00:00:00Z").toISOString()
  },
  {
    id: "prod-tea",
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
    createdAt: new Date("2026-10-27T00:00:00Z").toISOString()
  }
];

const loadProductsFromStorage = (): ProductEntity[] => {
  if (typeof window === "undefined") return INITIAL_DEFAULT_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to load products from localStorage", e);
  }
  // 신규 접속 또는 모바일 접속 시 기본 라이브 데모 상품을 자동 시딩하여 비디오 재생을 즉시 보장
  saveProductsToStorage(INITIAL_DEFAULT_PRODUCTS);
  if (!localStorage.getItem(STORAGE_KEY_DEFAULT_PROD)) {
    localStorage.setItem(STORAGE_KEY_DEFAULT_PROD, INITIAL_DEFAULT_PRODUCTS[0].id);
  }
  return INITIAL_DEFAULT_PRODUCTS;
};

const saveProductsToStorage = (products: ProductEntity[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error("Failed to save products to localStorage", e);
  }
};

let cachedProducts: ProductEntity[] = loadProductsFromStorage();

export const productService = {
  async getProducts(): Promise<ProductEntity[]> {
    cachedProducts = loadProductsFromStorage();
    return cachedProducts;
  },

  async getDefaultProductId(): Promise<string | null> {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY_DEFAULT_PROD);
  },

  async setDefaultProductId(id: string): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY_DEFAULT_PROD, id);
  },

  async addProduct(newProd: Omit<ProductEntity, "id" | "createdAt">, isDefault: boolean = false): Promise<ProductEntity[]> {
    const created: ProductEntity = {
      ...newProd,
      id: "prod-" + Date.now(),
      createdAt: new Date().toISOString()
    };
    cachedProducts = [created, ...cachedProducts];
    saveProductsToStorage(cachedProducts);
    
    // 만약 첫 상품이거나 시작 동영상으로 지정된 경우 기본 상품으로 설정
    if (isDefault || cachedProducts.length === 1) {
      await this.setDefaultProductId(created.id);
    }
    return cachedProducts;
  },

  async updateStock(id: string, stock: number): Promise<ProductEntity[]> {
    cachedProducts = cachedProducts.map(p => p.id === id ? { ...p, stock: Math.max(0, stock) } : p);
    saveProductsToStorage(cachedProducts);
    return cachedProducts;
  },

  async updateVideoMapping(id: string, videoUrl: string): Promise<ProductEntity[]> {
    cachedProducts = cachedProducts.map(p => p.id === id ? { ...p, videoUrl } : p);
    saveProductsToStorage(cachedProducts);
    return cachedProducts;
  },

  async deleteProduct(id: string): Promise<ProductEntity[]> {
    cachedProducts = cachedProducts.filter(p => p.id !== id);
    saveProductsToStorage(cachedProducts);
    const defId = await this.getDefaultProductId();
    if (defId === id) {
      const nextDef = cachedProducts[0]?.id || "";
      if (nextDef) {
        await this.setDefaultProductId(nextDef);
      } else {
        localStorage.removeItem(STORAGE_KEY_DEFAULT_PROD);
      }
    }
    return cachedProducts;
  },

  async resetToDefaultProducts(): Promise<ProductEntity[]> {
    cachedProducts = [...INITIAL_DEFAULT_PRODUCTS];
    saveProductsToStorage(cachedProducts);
    await this.setDefaultProductId(cachedProducts[0].id);
    return cachedProducts;
  }
};
