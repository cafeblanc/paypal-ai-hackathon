
import React, { useState } from "react";
import { Product, ChatMessage } from "../types";
import { createPayPalOrder } from "../services/paypalService";

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "prod-001",
    name: "양평 두물머리 특산물 유기농 꿀",
    price: 35000,
    currency: "KRW",
    imageUrl: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=500&q=80",
    description: "청정 지역 양평에서 채밀한 100% 천연 유기농 꿀입니다."
  },
  {
    id: "prod-002",
    name: "수제 전통 한방차 세트",
    price: 48000,
    currency: "KRW",
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80",
    description: "몸과 마음을 따뜻하게 해주는 프리미엄 전통 한방차."
  }
];

export const LiveStreamView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: "안녕하세요! PayPal AI 에이전트 커머스에 오신 것을 환영합니다. 방송을 보시면서 궁금한 점이나 상품 구매를 말씀해 주세요!",
      timestamp: "방금 전"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    const query = inputText;
    setInputText("");

    setTimeout(() => {
      let aiResponseText = "죄송합니다. 해당 요청을 처리하지 못했습니다.";
      let product: Product | undefined = undefined;

      if (query.includes("꿀") || query.includes("추천") || query.includes("구매")) {
        product = SAMPLE_PRODUCTS[0];
        aiResponseText = `고객님, 말씀하신 \x27${product.name}\x27 상품을 찾았습니다! 아래 버튼을 통해 PayPal로 즉시 안전하게 결제하실 수 있습니다.`;
      } else if (query.includes("차") || query.includes("선물")) {
        product = SAMPLE_PRODUCTS[1];
        aiResponseText = `선물용으로 좋은 \x27${product.name}\x27입니다. PayPal 간편결제를 지원합니다.`;
      } else {
        aiResponseText = `말씀하신 "${query}"에 대한 실시간 AI 쇼핑 답변입니다. 언제든 PayPal로 원클릭 주문이 가능합니다.`;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString(),
        suggestedProduct: product
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 800);
  };

  const handlePayPalCheckout = async (product: Product) => {
    try {
      setCheckoutStatus("PayPal 주문 생성 중...");
      const orderId = await createPayPalOrder(product.id, product.price);
      setCheckoutStatus(`결제 성공! (Order ID: ${orderId})`);
      alert(`[PayPal Sandbox 결제 완료]\n상품: ${product.name}\n금액: ${product.price} ${product.currency}\n주문번호: ${orderId}`);
    } catch (error) {
      setCheckoutStatus("결제 실패");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 p-4 flex justify-between items-center bg-slate-900/50">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
          PayPal AI Agentic Commerce Live
        </h1>
        <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-medium">
          Sandbox Mode
        </span>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 max-w-7xl mx-auto w-full">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10"></div>
            <div className="text-center z-20">
              <p className="text-slate-400 text-sm mb-2">🔴 LIVE Commerce Broadcasting</p>
              <h2 className="text-2xl font-bold tracking-tight">양평 두물머리 라이브 쇼핑 페스티벌</h2>
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={SAMPLE_PRODUCTS[0].imageUrl} alt="" className="w-12 h-12 rounded object-cover" />
                <div>
                  <p className="text-xs text-blue-400 font-semibold">AI 실시간 추천</p>
                  <p className="text-sm font-bold">{SAMPLE_PRODUCTS[0].name}</p>
                  <p className="text-xs text-slate-300">₩{SAMPLE_PRODUCTS[0].price.toLocaleString()}</p>
                </div>
              </div>
              <button 
                onClick={() => handlePayPalCheckout(SAMPLE_PRODUCTS[0])}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-lg"
              >
                PayPal 즉시 결제
              </button>
            </div>
          </div>
          {checkoutStatus && (
            <div className="p-3 bg-slate-900 border border-blue-500/30 rounded-lg text-sm text-blue-400 text-center">
              {checkoutStatus}
            </div>
          )}
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col h-[600px] lg:h-auto">
          <div className="p-4 border-b border-slate-800 font-semibold text-sm">
            🤖 AI 쇼핑 에이전트 & 실시간 채팅
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-200"}`}>
                  {msg.text}
                </div>
                {msg.suggestedProduct && (
                  <div className="mt-2 w-full bg-slate-900 border border-slate-700 p-3 rounded-lg flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <img src={msg.suggestedProduct.imageUrl} alt="" className="w-10 h-10 rounded object-cover" />
                      <div className="text-xs">
                        <p className="font-bold">{msg.suggestedProduct.name}</p>
                        <p className="text-slate-400">₩{msg.suggestedProduct.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePayPalCheckout(msg.suggestedProduct!)}
                      className="w-full bg-[#0070BA] hover:bg-[#003087] text-white py-2 rounded text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <span>🅿️ PayPal로 결제하기</span>
                    </button>
                  </div>
                )}
                <span className="text-[10px] text-slate-500 mt-1">{msg.timestamp}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="상품에 대해 물어보거나 구매를 요청하세요..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-semibold transition">
              전송
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LiveStreamView;

