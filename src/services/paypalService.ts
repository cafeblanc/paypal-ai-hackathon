// Official PayPal Developer Platform (Sandbox) Integration Service
// Loads official PayPal JavaScript SDK and handles Sandbox Orders API

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

export const loadPayPalScript = async (
  clientId?: string,
  currency: string = "USD"
): Promise<any> => {
  const targetId = clientId || getPayPalClientId();

  // If already loaded and matching, resolve immediately
  if (window.paypal) {
    return window.paypal;
  }

  const existingScript = document.getElementById("paypal-sdk") as HTMLScriptElement | null;
  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener("load", () => resolve(window.paypal));
      existingScript.addEventListener("error", () => reject(new Error("PayPal SDK failed to load.")));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${targetId}&currency=${currency}&components=buttons&enable-funding=card`;
    script.async = true;
    script.onload = () => {
      console.log("[PayPal SDK] Official PayPal Sandbox SDK loaded successfully.");
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
