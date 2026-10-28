import React, { useState } from "react";
import { Language } from "../services/productService";

interface PayPalCheckoutButtonProps {
  amount: number;
  currency: string;
  lang?: Language;
  onSuccess: (orderId: string) => void;
}

const CHECKOUT_TRANSLATIONS: Record<Language, {
  shippingLabel: string;
  country: string;
  city: string;
  address: string;
  payBtn: (amt: number) => string;
}> = {
  ko: {
    shippingLabel: "배송 주소 및 연락처 확인",
    country: "대한민국 (KR)",
    city: "경기도 양평군",
    address: "북한강로 807, 문호리 729-4",
    payBtn: (amt) => `PayPal로 즉시 결제 ($${amt}.00)`
  },
  en: {
    shippingLabel: "Confirm Shipping Address & Contact",
    country: "South Korea (KR)",
    city: "Yangpyeong-gun, Gyeonggi-do",
    address: "807 Bukhangang-ro, Munho-ri 729-4",
    payBtn: (amt) => `Instant Checkout with PayPal ($${amt}.00)`
  },
  ja: {
    shippingLabel: "お届け先住所および連絡先の確認",
    country: "韓国 (KR)",
    city: "京畿道 楊平郡",
    address: "北漢江路 807, 汶湖里 729-4",
    payBtn: (amt) => `PayPalで今すぐ支払う ($${amt}.00)`
  },
  zh: {
    shippingLabel: "确认收货地址与联系方式",
    country: "韩国 (KR)",
    city: "京畿道 杨平郡",
    address: "北汉江路 807, 汶湖里 729-4",
    payBtn: (amt) => `立即使用 PayPal 支付 ($${amt}.00)`
  },
  es: {
    shippingLabel: "Confirmar dirección de envío y contacto",
    country: "Corea del Sur (KR)",
    city: "Yangpyeong, Gyeonggi-do",
    address: "807 Bukhangang-ro, Munho-ri 729-4",
    payBtn: (amt) => `Pagar al instante con PayPal ($${amt}.00)`
  },
  fr: {
    shippingLabel: "Confirmer l'adresse de livraison et contact",
    country: "Corée du Sud (KR)",
    city: "Yangpyeong, Gyeonggi-do",
    address: "807 Bukhangang-ro, Munho-ri 729-4",
    payBtn: (amt) => `Paiement immédiat avec PayPal ($${amt}.00)`
  }
};

export const PayPalCheckoutButton: React.FC<PayPalCheckoutButtonProps> = ({ amount, currency, lang = "ko", onSuccess }) => {
  const [, setLoading] = useState(false);
  const t = CHECKOUT_TRANSLATIONS[lang] || CHECKOUT_TRANSLATIONS.ko;

  const handleApprove = (_details: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const mockOrderId = "PAYID-" + Math.floor(100000000 + Math.random() * 900000000);
      onSuccess(mockOrderId);
    }, 500);
  };

  return (
    <div className="w-full flex flex-col gap-1.5 text-xs text-slate-200">
      <div className="bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg flex items-center justify-between">
        <p className="text-[11px] font-bold text-blue-400 flex items-center gap-1">
          <span>🔒</span> PayPal Gateway
        </p>
        <p className="text-[12px] text-amber-300 font-bold">
          ${amount}.00 <span className="text-[10px] text-slate-400 font-normal">{currency}</span>
        </p>
      </div>

      <div className="bg-slate-950/90 border border-slate-800/80 rounded-lg px-2.5 py-1.5 flex flex-col gap-0.5">
        <div className="flex justify-between items-center text-[10px] text-slate-400">
          <span>📦 {t.shippingLabel}</span>
          <span className="text-emerald-400 text-[9px] font-medium">● 배송 준비</span>
        </div>
        <p className="text-white text-[11px] font-medium truncate">{t.country} {t.city} {t.address}</p>
        <p className="text-slate-400 text-[10px] truncate">010-1234-5678 · opener@cafeblanc.kr</p>
      </div>

      <div className="pt-1">
        <button
          type="button"
          onClick={() => handleApprove({ id: 'SIMULATED' })}
          className="w-full bg-[#0070BA] hover:bg-[#003087] active:scale-[0.99] text-white py-2.5 px-3 rounded-lg text-center font-bold text-xs sm:text-sm cursor-pointer shadow-xl transition flex items-center justify-center gap-1.5 border border-blue-400/30"
        >
          <span>💳</span>
          <span>{t.payBtn(amount)}</span>
        </button>
      </div>
    </div>
  );
};

export default PayPalCheckoutButton;
