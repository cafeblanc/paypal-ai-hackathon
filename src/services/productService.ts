import { productTranslationService } from "./productTranslationService";

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

export const STATIC_DEMO_VIDEOS = [
  { name: "가평-친환경-포도즙.mp4", path: "/demo_video/gapyeong-grape.mp4" },
  { name: "문호리-뜨개질공방.mp4", path: "/demo_video/munhori-knitting.mp4" }
];

export const DEFAULT_FALLBACK_VIDEO = "/demo_video/gapyeong-grape.mp4";

export const createDefaultProducts = (): ProductEntity[] => {
  return [
    {
      id: "prod-gapyeong-grape",
      name: {
        en: "Gapyeong Eco-friendly Grape Juice (100% Pure Squeezed)",
        ko: "Gapyeong Eco-friendly Grape Juice (100% Pure Squeezed)",
        ja: "Gapyeong Eco-friendly Grape Juice (100% Pure Squeezed)",
        zh: "Gapyeong Eco-friendly Grape Juice (100% Pure Squeezed)",
        es: "Gapyeong Eco-friendly Grape Juice (100% Pure Squeezed)",
        fr: "Gapyeong Eco-friendly Grape Juice (100% Pure Squeezed)"
      },
      price: 25,
      currency: "USD",
      stock: 1000,
      icon: "🍇",
      videoUrl: "/demo_video/gapyeong-grape.mp4",
      fallbackVideoUrl: "/demo_video/gapyeong-grape.mp4",
      description: {
        en: "100% pure squeezed eco-friendly grape juice grown in pristine Mt. Unaksan. Healthy beverage with no added sugar, artificial colors, or preservatives.",
        ko: "100% pure squeezed eco-friendly grape juice grown in pristine Mt. Unaksan. Healthy beverage with no added sugar, artificial colors, or preservatives.",
        ja: "100% pure squeezed eco-friendly grape juice grown in pristine Mt. Unaksan. Healthy beverage with no added sugar, artificial colors, or preservatives.",
        zh: "100% pure squeezed eco-friendly grape juice grown in pristine Mt. Unaksan. Healthy beverage with no added sugar, artificial colors, or preservatives.",
        es: "100% pure squeezed eco-friendly grape juice grown in pristine Mt. Unaksan. Healthy beverage with no added sugar, artificial colors, or preservatives.",
        fr: "100% pure squeezed eco-friendly grape juice grown in pristine Mt. Unaksan. Healthy beverage with no added sugar, artificial colors, or preservatives."
      },
      createdAt: new Date().toISOString()
    },
    {
      id: "prod-munhori-knitting",
      name: {
        en: "Munhori River Market Handmade Knitting Studio Crafts",
        ko: "Munhori River Market Handmade Knitting Studio Crafts",
        ja: "Munhori River Market Handmade Knitting Studio Crafts",
        zh: "Munhori River Market Handmade Knitting Studio Crafts",
        es: "Munhori River Market Handmade Knitting Studio Crafts",
        fr: "Munhori River Market Handmade Knitting Studio Crafts"
      },
      price: 32,
      currency: "USD",
      stock: 50,
      icon: "🧶",
      videoUrl: "/demo_video/munhori-knitting.mp4",
      fallbackVideoUrl: "/demo_video/munhori-knitting.mp4",
      description: {
        en: "Handmade eco-friendly knitted crafts collection carefully crafted stitch by stitch by Munhori River Market artisans in Yangpyeong.",
        ko: "Handmade eco-friendly knitted crafts collection carefully crafted stitch by stitch by Munhori River Market artisans in Yangpyeong.",
        ja: "Handmade eco-friendly knitted crafts collection carefully crafted stitch by stitch by Munhori River Market artisans in Yangpyeong.",
        zh: "Handmade eco-friendly knitted crafts collection carefully crafted stitch by stitch by Munhori River Market artisans in Yangpyeong.",
        es: "Handmade eco-friendly knitted crafts collection carefully crafted stitch by stitch by Munhori River Market artisans in Yangpyeong.",
        fr: "Handmade eco-friendly knitted crafts collection carefully crafted stitch by stitch by Munhori River Market artisans in Yangpyeong."
      },
      createdAt: new Date().toISOString()
    }
  ];
};

export const INITIAL_DEFAULT_PRODUCTS: ProductEntity[] = createDefaultProducts();

function saveProductsToStorage(products: ProductEntity[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error("Failed to save products to localStorage", e);
  }
}

function loadProductsFromStorage(): ProductEntity[] {
  if (typeof window === "undefined") return createDefaultProducts();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    let list: ProductEntity[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }

    if (list.length === 0) {
      const defaults = createDefaultProducts();
      saveProductsToStorage(defaults);
      return defaults;
    }

    // 사용자가 삭제한 이전 비디오(honey_demo, tea_demo, /videos/ 등)는 완전 제거
    let filtered = list.filter(p => 
      p && p.videoUrl && 
      !p.videoUrl.includes("honey_demo") && 
      !p.videoUrl.includes("tea_demo") &&
      !p.videoUrl.startsWith("/videos/")
    );

    if (filtered.length === 0) {
      filtered = createDefaultProducts();
    }

    // 새로고침 시 무효화되는 blob: URL 및 깨진 비디오 경로 자동 복구 & 다국어 번역 보강
    const upgraded = filtered.map((p, idx) => {
      let finalVideo = p.videoUrl;
      const isDeadBlob = !finalVideo || finalVideo.startsWith("blob:");
      if (isDeadBlob) {
        const matched = STATIC_DEMO_VIDEOS.find(f => 
          p.name?.ko && (p.name.ko.includes(f.name.replace(/\.[^/.]+$/, "")) || f.name.includes(p.name.ko))
        ) || STATIC_DEMO_VIDEOS[idx % STATIC_DEMO_VIDEOS.length];
        finalVideo = matched.path;
      }

      const needsTranslation = !p.name.en || p.name.en === p.name.ko || !p.name.ja || p.name.ja === p.name.ko;
      let finalName = p.name;
      let finalDesc = p.description;
      if (needsTranslation && p.name && p.name.ko) {
        const trans = productTranslationService.translateProduct(p.name.ko, p.description?.ko);
        finalName = { ...trans.name, ko: p.name.ko };
        finalDesc = { ...trans.description, ko: p.description?.ko || trans.description.ko };
      }

      let finalPrice = p.price;
      let finalCurrency = p.currency || "USD";
      if (finalPrice > 1000) {
        finalPrice = Math.round(finalPrice / 1350);
        finalCurrency = "USD";
      }

      return {
        ...p,
        name: finalName,
        price: finalPrice,
        currency: finalCurrency,
        description: finalDesc,
        videoUrl: finalVideo,
        fallbackVideoUrl: DEFAULT_FALLBACK_VIDEO
      };
    });

    saveProductsToStorage(upgraded);
    return upgraded;
  } catch (e) {
    console.error("Failed to load products from localStorage", e);
    return createDefaultProducts();
  }
}

let cachedProducts: ProductEntity[] = loadProductsFromStorage();

export const productService = {
  async getProducts(): Promise<ProductEntity[]> {
    cachedProducts = loadProductsFromStorage();
    return cachedProducts;
  },

  async syncWithServerVideos(demoFiles: { name: string; path: string }[]): Promise<ProductEntity[]> {
    const files = (Array.isArray(demoFiles) && demoFiles.length > 0) ? demoFiles : STATIC_DEMO_VIDEOS;

    let list = await this.getProducts();
    let hasChanges = false;

    // 1. 기존 상품 중 blob: URL이거나 유효하지 않은 경로인 경우 실제 서버의 동영상 경로로 자동 복구
    list = list.map((p, idx) => {
      const isInvalid = !p.videoUrl || p.videoUrl.startsWith("blob:") || p.videoUrl.includes("honey_demo") || p.videoUrl.includes("tea_demo");
      if (isInvalid) {
        hasChanges = true;
        const matched = files.find(f => p.name?.ko && (p.name.ko.includes(f.name.replace(/\.[^/.]+$/, "")) || f.name.includes(p.name.ko))) || files[idx % files.length];
        return {
          ...p,
          videoUrl: matched.path,
          fallbackVideoUrl: DEFAULT_FALLBACK_VIDEO
        };
      }
      return p;
    });

    // 2. 만약 등록된 상품이 아예 없다면 기본 상품 자동 로드 및 등록
    if (list.length === 0) {
      list = createDefaultProducts();
      hasChanges = true;
    }

    if (hasChanges) {
      cachedProducts = list;
      saveProductsToStorage(list);
    }
    const curDef = await this.getDefaultProductId();
    if (!curDef || !list.some(p => p.id === curDef)) {
      await this.setDefaultProductId(list[0].id);
    }

    return list;
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
    let finalName = newProd.name;
    let finalDesc = newProd.description;
    
    // 다국어 번역이 동일한 한국어로 들어온 경우 자동 다국어 번역(EN, JA, ZH, ES, FR) 생성
    if (finalName.en === finalName.ko || !finalName.en) {
      const trans = productTranslationService.translateProduct(finalName.ko, finalDesc.ko);
      finalName = { ...trans.name, ko: finalName.ko };
      finalDesc = { ...trans.description, ko: finalDesc.ko || trans.description.ko };
    }

    const created: ProductEntity = {
      ...newProd,
      name: finalName,
      description: finalDesc,
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

  async updateProduct(id: string, updatedData: Partial<Omit<ProductEntity, "id" | "createdAt">>): Promise<ProductEntity[]> {
    cachedProducts = cachedProducts.map(p => {
      if (p.id !== id) return p;
      return {
        ...p,
        ...updatedData,
        name: updatedData.name ? { ...p.name, ...updatedData.name } : p.name,
        description: updatedData.description ? { ...p.description, ...updatedData.description } : p.description
      };
    });
    saveProductsToStorage(cachedProducts);
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
