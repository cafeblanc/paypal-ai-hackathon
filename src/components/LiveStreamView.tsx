import React, { useState } from "react";
import PayPalCheckoutButton from "./PayPalCheckoutButton";

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  icon: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestedProduct?: Product;
}

const MARKET_NAME = import.meta.env.VITE_MARKET_NAME || "Open Festival Live Market";

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "prod-001",
    name: "Premium Organic Honey (100% Natural)",
    price: 35000,
    currency: "KRW",
    icon: "🍯",
    description: "100% natural organic honey harvested from clean nature."
  },
  {
    id: "prod-002",
    name: "Handmade Traditional Herbal Tea Set",
    price: 48000,
    currency: "KRW",
    icon: "🍵",
    description: "Premium traditional herbal tea set for a warm and relaxing experience."
  }
];

const QUICK_PROMPTS = [
  "Recommend best honey 🍯",
  "Gift tea set 🍵",
  "Instant PayPal checkout 💳"
];

export const LiveStreamView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: "Welcome to PayPal AI Agentic Commerce! Tap a quick action below or ask anything to shop instantly.",
      timestamp: "Just now"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);
  const [selectedProductForCheckout, setSelectedProductForCheckout] = useState<Product | null>(null);

  const triggerAIResponse = (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    const query = text.toLowerCase();

    setTimeout(() => {
      let aiResponseText = "Here is our top AI-recommended product for you! You can check out instantly via PayPal.";
      let product: Product = SAMPLE_PRODUCTS[0];

      if (query.includes("tea") || query.includes("gift") || query.includes("차") || query.includes("선물")) {
        product = SAMPLE_PRODUCTS[1];
        aiResponseText = "I found the Handmade Traditional Herbal Tea Set! Perfect for a gift. PayPal instant checkout is ready below.";
      } else {
        product = SAMPLE_PRODUCTS[0];
        aiResponseText = "I found the Premium Organic Honey! Click the button below to pay securely with PayPal.";
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString(),
        suggestedProduct: product
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    triggerAIResponse(inputText);
    setInputText("");
  };

  const handlePaymentSuccess = (orderId: string, product: Product) => {
    setCheckoutStatus("Payment Completed! (Order ID: " + orderId + ")");
    alert("[PayPal Sandbox Payment Success]\nProduct: " + product.name + "\nOrder ID: " + orderId);
    setSelectedProductForCheckout(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 px-6 py-3 flex justify-between items-center bg-slate-900/50">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
          PayPal AI Agentic Commerce Live
        </h1>
        <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-medium">
          Sandbox Mode
        </span>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 p-4 max-w-7xl mx-auto w-full">
        <div className="md:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
            <div className="text-center z-20 p-6">
              <span className="inline-block bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-3 py-1 rounded-full mb-3">
                LIVE COMMERCE STREAMING
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">{MARKET_NAME}</h2>
              <p className="text-slate-400 text-xs mt-2">AI Agent Autonomous Shopping & Instant PayPal Settlement</p>
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-700 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
                  {SAMPLE_PRODUCTS[0].icon}
                </div>
                <div>
                  <p className="text-xs text-blue-400 font-semibold">AI Live Pick</p>
                  <p className="text-sm font-bold">{SAMPLE_PRODUCTS[0].name}</p>
                  <p className="text-xs text-slate-300">KRW {SAMPLE_PRODUCTS[0].price.toLocaleString()} (~$26 USD)</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProductForCheckout(SAMPLE_PRODUCTS[0])}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-lg cursor-pointer"
              >
                Pay with PayPal
              </button>
            </div>
          </div>

          {selectedProductForCheckout && (
            <div className="bg-slate-900 border-2 border-blue-500/60 p-4 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-blue-400">
                  PayPal Instant Checkout: {selectedProductForCheckout.icon} {selectedProductForCheckout.name}
                </h3>
                <button 
                  onClick={() => setSelectedProductForCheckout(null)}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Close
                </button>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                Total Amount: KRW {selectedProductForCheckout.price.toLocaleString()} (~${Math.round(selectedProductForCheckout.price / 1350)} USD)
              </p>
              <PayPalCheckoutButton 
                amount={Math.round(selectedProductForCheckout.price / 1350)} 
                currency="USD" 
                onSuccess={(orderId) => handlePaymentSuccess(orderId, selectedProductForCheckout)} 
              />
            </div>
          )}

          {checkoutStatus && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-sm text-emerald-300 font-semibold text-center">
              {checkoutStatus}
            </div>
          )}
        </div>

        <div className="md:col-span-5 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col h-[560px]">
          <div className="p-3 border-b border-slate-800 font-semibold text-sm flex justify-between items-center">
            <span>AI Shopping Agent & Live Chat</span>
            <span className="text-[11px] text-emerald-400">Online</span>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map(msg => (
              <div key={msg.id} className={msg.sender === "user" ? "flex flex-col items-end" : "flex flex-col items-start"}>
                <div className={msg.sender === "user" ? "max-w-[85%] p-3 rounded-xl text-sm bg-blue-600 text-white" : "max-w-[85%] p-3 rounded-xl text-sm bg-slate-800 text-slate-200"}>
                  {msg.text}
                </div>
                {msg.suggestedProduct && (
                  <div className="mt-2 w-full bg-slate-900 border border-slate-700 p-3 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl">
                        {msg.suggestedProduct.icon}
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-white">{msg.suggestedProduct.name}</p>
                        <p className="text-slate-400">KRW {msg.suggestedProduct.price.toLocaleString()} (~${Math.round(msg.suggestedProduct.price / 1350)} USD)</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProductForCheckout(msg.suggestedProduct!)}
                      className="w-full bg-[#0070BA] hover:bg-[#003087] text-white py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Open PayPal SDK Checkout</span>
                    </button>
                  </div>
                )}
                <span className="text-[10px] text-slate-500 mt-1">{msg.timestamp}</span>
              </div>
            ))}
          </div>

          <div className="px-3 pt-2 flex gap-1.5 flex-wrap border-t border-slate-800/80">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => triggerAIResponse(prompt)}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 px-2.5 py-1 rounded-full transition cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Tap a button above or type..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LiveStreamView;