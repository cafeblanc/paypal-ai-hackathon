export const loadPayPalScript = async (clientId: string, currency: string = "USD"): Promise<void> => {
  if (document.getElementById("paypal-sdk")) return;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("PayPal SDK failed to load."));
    document.body.appendChild(script);
  });
};

export const createPayPalOrder = async (productId: string, amount: number): Promise<string> => {
  console.log(`[PayPal Sandbox] Creating order for product: ${productId}, Amount: ${amount}`);
  return `SANDBOX-ORDER-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};