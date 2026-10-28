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

const loadProductsFromStorage = (): ProductEntity[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to load products from localStorage", e);
  }
  // 하드코딩된 더미 상품 완전 삭제: 오로지 관리자화면에서 등록한 상품만 사용
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
  }
};
