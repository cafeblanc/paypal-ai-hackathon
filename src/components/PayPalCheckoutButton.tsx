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
    <div className="max-h-[480px] overflow-y-auto pr-1.5 flex flex-col gap-3 text-xs text-slate-200 custom-scrollbar">
      <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex flex-col gap-2">
        <p className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
          <span>🔒</span> PayPal Sandbox Secure Gateway
        </p>
        <p className="text-[11px] text-slate-300">
          Selected Amount: <strong className="text-white">${amount}.00 {currency}</strong>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] text-slate-400 font-medium">{t.shippingLabel}</label>
        <div className="grid grid-cols-2 gap-2">
          <input type="text" value={t.country} className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100" readOnly />
          <input type="text" value={t.city} className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100" readOnly />
        </div>
        <input type="text" value={t.address} className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100" readOnly />
        <input type="text" defaultValue="010-1234-5678 / opener@cafeblanc.kr" className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100" readOnly />
      </div>

      <div className="pt-2 border-t border-slate-800">
        <div className="bg-[#0070BA] hover:bg-[#003087] text-white p-3 rounded-xl text-center font-bold text-sm cursor-pointer shadow-lg transition flex items-center justify-center gap-2"
             onClick={() => handleApprove({ id: 'SIMULATED' })}>
          <span>{t.payBtn(amount)}</span>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          Powered by PayPal Sandbox Simulated API v2.0
        </p>
      </div>
    </div>
  );
};

export default PayPalCheckoutButton;
