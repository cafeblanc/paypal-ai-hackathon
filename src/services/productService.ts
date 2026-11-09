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

export const INITIAL_DEFAULT_PRODUCTS: ProductEntity[] = [];

const loadProductsFromStorage = (): ProductEntity[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // 사용자가 삭제한 이전 비디오(honey_demo, tea_demo, /videos/ 등)는 완전 제거하고 실제 등록된 비디오만 유지
        const filtered = parsed.filter(p => 
          p && p.videoUrl && 
          !p.videoUrl.includes("honey_demo") && 
          !p.videoUrl.includes("tea_demo") &&
          !p.videoUrl.startsWith("/videos/")
        );
        // 클린업된 데이터를 localStorage에 즉시 반영하여 잔여 찌꺼기 제거
        saveProductsToStorage(filtered);
        return filtered;
      }
    }
  } catch (e) {
    console.error("Failed to load products from localStorage", e);
  }
  return [];
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
    if (!Array.isArray(demoFiles) || demoFiles.length === 0) {
      return this.getProducts();
    }

    let list = await this.getProducts();
    let hasChanges = false;

    // 1. 기존 상품 중 blob: URL이거나 유효하지 않은 경로인 경우 실제 서버의 동영상 경로로 자동 복구
    list = list.map((p, idx) => {
      const isInvalid = !p.videoUrl || p.videoUrl.startsWith("blob:") || p.videoUrl.includes("honey_demo") || p.videoUrl.includes("tea_demo");
      if (isInvalid) {
        hasChanges = true;
        const matched = demoFiles.find(f => p.name?.ko && (p.name.ko.includes(f.name.replace(/\.[^/.]+$/, "")) || f.name.includes(p.name.ko))) || demoFiles[idx % demoFiles.length];
        return {
          ...p,
          videoUrl: matched.path
        };
      }
      return p;
    });

    // 2. 만약 등록된 상품이 아예 없다면 서버의 실제 데모 비디오들로 기본 상품 자동 로드 및 등록
    if (list.length === 0) {
      list = demoFiles.map((file, idx) => {
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        return {
          id: "prod-" + Date.now() + "-" + idx,
          name: {
            ko: baseName,
            en: baseName,
            ja: baseName,
            zh: baseName,
            es: baseName,
            fr: baseName
          },
          price: 35000 + (idx * 15000),
          currency: "KRW",
          stock: 10 + (idx * 5),
          icon: idx === 0 ? "🍇" : "🧶",
          videoUrl: file.path,
          fallbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          description: {
            ko: `${baseName} 라이브 특별 상품`,
            en: `${baseName} Live Special Item`,
            ja: `${baseName} ライブ限定商品`,
            zh: `${baseName} 直播精选特产`,
            es: `${baseName} Producto especial en vivo`,
            fr: `${baseName} Produit exclusif en direct`
          },
          createdAt: new Date().toISOString()
        };
      });
      hasChanges = true;
    }

    if (hasChanges) {
      cachedProducts = list;
      saveProductsToStorage(list);
      const curDef = await this.getDefaultProductId();
      if (!curDef || !list.some(p => p.id === curDef)) {
        await this.setDefaultProductId(list[0].id);
      }
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
