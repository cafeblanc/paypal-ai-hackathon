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
        ko: "가평 운악산 친환경 포도즙",
        en: "Gapyeong Unaksan Eco-friendly Grape Juice",
        ja: "加平 雲岳山 エコブドウジュース",
        zh: "加平云岳山环保葡萄汁",
        es: "Jugo de Uva Ecológico Gapyeong Unaksan",
        fr: "Jus de Raisin Écologique Gapyeong Unaksan"
      },
      price: 35000,
      currency: "KRW",
      stock: 1000,
      icon: "🍇",
      videoUrl: "/demo_video/gapyeong-grape.mp4",
      fallbackVideoUrl: "/demo_video/gapyeong-grape.mp4",
      description: {
        ko: "가평 운악산 청정 지역에서 재배한 고당도 100% 순수 착즙 포도즙입니다. 무설탕, 무색소, 무방부제 건강 음료.",
        en: "100% pure squeezed grape juice grown in the pristine region of Mt. Unaksan, Gapyeong. Healthy beverage with no added sugar, artificial colors, or preservatives.",
        ja: "加平の雲岳山清浄地域で栽培された高糖度100%純粋搾りブドウジュースです。無加糖・無着色・保存料不使用の健康飲料。",
        zh: "产自加平云岳山纯净地区的高糖度100%纯压榨葡萄汁。无添加糖、无色素、无防腐剂的健康饮品。",
        es: "Jugo de uva 100% puro exprimido cultivado en la región prístina del Monte Unaksan, Gapyeong. Bebida saludable sin azúcar añadida, colorantes ni conservantes.",
        fr: "Jus de raisin 100% pur pressé cultivé dans la région préservée du mont Unaksan à Gapyeong. Boisson saine sans sucre ajouté, colorants ni conservateurs."
      },
      createdAt: new Date().toISOString()
    },
    {
      id: "prod-munhori-knitting",
      name: {
        ko: "문호리 리버마켓 핸드메이드 뜨개질 공방",
        en: "Munhori River Market Handmade Knitting Studio",
        ja: "文湖里 リバーマーケット ハンドメイド手編み工房",
        zh: "汶湖里河边市集手工编织工坊",
        es: "Taller de Tejido Hecho a Mano Munhori River Market",
        fr: "Atelier de Tricot Fait Main Munhori River Market"
      },
      price: 45000,
      currency: "KRW",
      stock: 50,
      icon: "🧶",
      videoUrl: "/demo_video/munhori-knitting.mp4",
      fallbackVideoUrl: "/demo_video/munhori-knitting.mp4",
      description: {
        ko: "양평 문호리 리버마켓 장인이 한 땀 한 땀 정성스럽게 뜬 친환경 수제 뜨개 소품 컬렉션입니다.",
        en: "Handmade eco-friendly knitted crafts collection carefully crafted stitch by stitch by Munhori River Market artisans in Yangpyeong.",
        ja: "楊平文湖里リバーマーケットの職人が一目一目丁寧に編み上げた、環境に優しい手編み小物コレクションです。",
        zh: "由杨平汶湖里河边市集的工匠一针一线悉心编织的环保手工针织配饰系列。",
        es: "Colección de artesanías tejidas a mano ecológicas elaboradas puntada a puntada por artesanos de Munhori River Market en Yangpyeong.",
        fr: "Collection d'artisanat tricoté main écologique soigneusement confectionné maille après maille par les artisans du River Market de Munhori à Yangpyeong."
      },
      createdAt: new Date().toISOString()
    }
  ];
};

export const INITIAL_DEFAULT_PRODUCTS: ProductEntity[] = createDefaultProducts();

const loadProductsFromStorage = (): ProductEntity[] => {
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

      return {
        ...p,
        name: finalName,
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
