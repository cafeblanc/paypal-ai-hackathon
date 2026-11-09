// Official PayPal Developer Platform (Sandbox) Integration Service
// Loads official PayPal JavaScript SDK with dynamic international locale matching

export type SupportedLanguage = "en" | "ko" | "ja" | "zh" | "es" | "fr";

declare global {
  interface Window {
    paypal?: any;
  }
}

export const getPayPalClientId = (): string => {
  return (
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_PAYPAL_CLIENT_ID) ||
    (typeof window !== "undefined" && localStorage.getItem("paypal_sandbox_client_id")) ||
    "test"
  );
};

export const getPayPalLocale = (lang: string = "en"): string => {
  const map: Record<string, string> = {
    en: "en_US",
    ko: "ko_KR",
    ja: "ja_JP",
    zh: "zh_CN",
    es: "es_ES",
    fr: "fr_FR"
  };
  return map[lang] || "en_US";
};

export const getCountryCode = (lang: string = "en"): string => {
  const map: Record<string, string> = {
    en: "US",
    ko: "KR",
    ja: "JP",
    zh: "CN",
    es: "ES",
    fr: "FR"
  };
  return map[lang] || "US";
};

export const loadPayPalScript = async (
  clientId?: string,
  currency: string = "USD",
  lang: string = "en"
): Promise<any> => {
  const targetId = clientId || getPayPalClientId();
  const locale = getPayPalLocale(lang);
  const country = getCountryCode(lang);

  const existingScript = document.getElementById("paypal-sdk") as HTMLScriptElement | null;
  if (existingScript) {
    if (existingScript.dataset.locale === locale && window.paypal) {
      return window.paypal;
    }
    // If locale changed, remove old script to reload in selected language
    existingScript.remove();
    delete (window as any).paypal;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.dataset.locale = locale;
    script.dataset.country = country;
    script.src = `https://www.paypal.com/sdk/js?client-id=${targetId}&currency=${currency}&locale=${locale}&buyer-country=${country}&disable-funding=paylater,venmo,card&components=buttons`;
    script.async = true;
    script.onload = () => {
      console.log(`[PayPal SDK] Official PayPal Sandbox SDK (${locale}, country: ${country}) loaded.`);
      resolve(window.paypal);
    };
    script.onerror = () => {
      console.warn("[PayPal SDK] Failed to load PayPal SDK, fallback active.");
      reject(new Error("PayPal SDK failed to load."));
    };
    document.body.appendChild(script);
  });
};

export const createPayPalOrder = async (productId: string, amount: number): Promise<string> => {
  console.log(`[PayPal Sandbox] Creating order for product: ${productId}, Amount: ${amount}`);
  return "SANDBOX-ORDER-" + Math.random().toString(36).substring(2, 9).toUpperCase();
};
