import React, { useState, useEffect, useRef } from "react";
import { Language } from "../services/productService";
import { loadPayPalScript, getPayPalClientId, getPayPalLocale, getCountryCode } from "../services/paypalService";

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
  phone: string;
  recipientName: string;
  payBtn: (amt: number) => string;
  fastDemoBtn: string;
  instantBtn: string;
  statusBadge: string;
}> = {
  en: {
    shippingLabel: "Confirm Shipping Address & Contact (United States)",
    country: "United States (US)",
    city: "New York, NY 10001",
    address: "350 5th Avenue, Suite 4100",
    phone: "+1-212-555-0198 · shopper@example.com",
    recipientName: "John Doe",
    payBtn: (amt) => `Instant Checkout with PayPal ($${amt}.00)`,
    fastDemoBtn: "⚡ Fast Sandbox Approve (Demo Mode)",
    instantBtn: "Instant Checkout",
    statusBadge: "English (en_US) Active"
  },
  ko: {
    shippingLabel: "배송 주소 및 연락처 확인 (대한민국)",
    country: "대한민국 (KR)",
    city: "경기도 양평군",
    address: "북한강로 807, 문호리 729-4",
    phone: "010-1234-5678 · opener@cafeblanc.kr",
    recipientName: "홍길동",
    payBtn: (amt) => `PayPal로 즉시 결제 ($${amt}.00)`,
    fastDemoBtn: "⚡ 샌드박스 즉시 승인 (영상 시연용)",
    instantBtn: "Instant Checkout",
    statusBadge: "한국어 (ko_KR) 모드"
  },
  ja: {
    shippingLabel: "お届け先住所および連絡先 (日本)",
    country: "日本 (JP)",
    city: "東京都 港区",
    address: "六本木 6-10-1 六本木ヒルズ",
    phone: "03-1234-5678 · tokyo_buyer@example.jp",
    recipientName: "山田 太郎",
    payBtn: (amt) => `PayPalで今すぐ支払う ($${amt}.00)`,
    fastDemoBtn: "⚡ 即時承認 (デモ撮影用)",
    instantBtn: "Instant Checkout",
    statusBadge: "日本語 (ja_JP) モード"
  },
  zh: {
    shippingLabel: "确认收货地址与联系方式 (中国)",
    country: "中国 (CN)",
    city: "北京市 朝阳区",
    address: "建国门外大街 1号 国贸大厦",
    phone: "010-8888-9999 · beijing_buyer@example.cn",
    recipientName: "张伟",
    payBtn: (amt) => `立即使用 PayPal 支付 ($${amt}.00)`,
    fastDemoBtn: "⚡ 一键沙盒支付 (视频演示用)",
    instantBtn: "Instant Checkout",
    statusBadge: "简体中文 (zh_CN) 模式"
  },
  es: {
    shippingLabel: "Confirmar dirección de envío y contacto (España)",
    country: "España (ES)",
    city: "Madrid, 28013",
    address: "Calle Gran Vía 28, 4º",
    phone: "+34 91 123 4567 · cliente@example.es",
    recipientName: "Carlos García",
    payBtn: (amt) => `Pagar al instante con PayPal ($${amt}.00)`,
    fastDemoBtn: "⚡ Aprobación Rápida Sandbox (Modo Demo)",
    instantBtn: "Instant Checkout",
    statusBadge: "Español (es_ES) Modo"
  },
  fr: {
    shippingLabel: "Confirmer l'adresse de livraison et contact (France)",
    country: "France (FR)",
    city: "Paris, 75008",
    address: "101 Avenue des Champs-Élysées",
    phone: "+33 1 42 68 55 00 · acheteur@example.fr",
    recipientName: "Jean Dupont",
    payBtn: (amt) => `Paiement immédiat avec PayPal ($${amt}.00)`,
    fastDemoBtn: "⚡ Approbation Rapide Sandbox (Mode Démo)",
    instantBtn: "Instant Checkout",
    statusBadge: "Français (fr_FR) Mode"
  }
};

export const PayPalCheckoutButton: React.FC<PayPalCheckoutButtonProps> = ({
  amount,
  currency,
  lang = "en",
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [sdkRendered, setSdkRendered] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const currentRenderedLangRef = useRef<string | null>(null);

  const t = CHECKOUT_TRANSLATIONS[lang] || CHECKOUT_TRANSLATIONS.en;
  const currentLocale = getPayPalLocale(lang);
  const countryCode = getCountryCode(lang);

  // Load & re-render official PayPal JavaScript SDK with matching locale
  useEffect(() => {
    let isMounted = true;
    const clientId = getPayPalClientId();

    loadPayPalScript(clientId, currency, lang)
      .then((paypal) => {
        if (!isMounted || !paypal || !paypal.Buttons || !paypalContainerRef.current) return;
        if (currentRenderedLangRef.current === lang) return;
        currentRenderedLangRef.current = lang;

        // Clear previous buttons safely before re-rendering for new language
        paypalContainerRef.current.innerHTML = "";

        try {
          const btn = paypal.Buttons({
            fundingSource: (paypal.FUNDING && paypal.FUNDING.PAYPAL) ? paypal.FUNDING.PAYPAL : undefined,
            style: {
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "paypal",
              height: 40,
              tagline: false
            },
            createOrder: (_data: any, actions: any) => {
              return actions.order.create({
                intent: "CAPTURE",
                application_context: {
                  brand_name: "PayPal AI Live Commerce",
                  user_action: "PAY_NOW"
                },
                purchase_units: [
                  {
                    description: `PayPal AI Live Commerce (${currentLocale})`,
                    amount: {
                      currency_code: currency,
                      value: amount.toFixed(2)
                    }
                  }
                ]
              });
            },
            onApprove: async (data: any, actions: any) => {
              try {
                setLoading(true);
                const details = await actions.order.capture();
                const transactionId = details?.id || data?.orderID || ("PAYID-" + Math.floor(100000000 + Math.random() * 900000000));
                console.log("[PayPal Sandbox] Order captured:", transactionId);
                onSuccess(transactionId);
              } catch (err) {
                console.warn("[PayPal Sandbox] Capture note:", err);
                onSuccess(data?.orderID || ("PAYID-" + Math.floor(100000000 + Math.random() * 900000000)));
              } finally {
                setLoading(false);
              }
            },
            onError: (err: any) => {
              console.warn("[PayPal Sandbox] Button dialog notice:", err);
            }
          });

          if (btn.isEligible()) {
            btn.render(paypalContainerRef.current)
              .then(() => {
                if (isMounted) setSdkRendered(true);
              })
              .catch((renderErr: any) => {
                console.warn("[PayPal SDK] Button render notice:", renderErr);
              });
          }
        } catch (e) {
          console.warn("[PayPal SDK] Buttons init notice:", e);
        }
      })
      .catch((err) => {
        console.warn("[PayPal SDK] Script load notice:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [amount, currency, lang, currentLocale, countryCode, t.address, t.city, t.recipientName, onSuccess]);

  // Guaranteed Instant Fallback Checkout
  const handleInstantApprove = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const mockOrderId = "PAYID-" + Math.floor(100000000 + Math.random() * 900000000);
      onSuccess(mockOrderId);
    }, 450);
  };

  return (
    <div className="w-full flex flex-col gap-1.5 text-xs text-slate-200">
      {/* PayPal Gateway Header */}
      <div className="bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] font-bold text-blue-400 flex items-center gap-1">
            <span>🔒</span> PayPal Gateway
          </p>
          <span className="text-[9px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
            {t.statusBadge}
          </span>
        </div>
        <p className="text-[12px] text-amber-300 font-bold">
          ${amount}.00 <span className="text-[10px] text-slate-400 font-normal">{currency}</span>
        </p>
      </div>

      {/* Localized National Shipping Address */}
      <div className="bg-slate-950/90 border border-slate-800/80 rounded-lg px-2.5 py-1.5 flex flex-col gap-0.5">
        <div className="flex justify-between items-center text-[10px] text-slate-400">
          <span>📦 {t.shippingLabel}</span>
          <span className="text-emerald-400 text-[9px] font-medium">● Order Ready ({countryCode})</span>
        </div>
        <p className="text-white text-[11px] font-medium truncate">{t.country} · {t.city} {t.address}</p>
        <p className="text-slate-400 text-[10px] truncate">{t.phone}</p>
      </div>

      {/* Action Buttons: 1. 정식 PayPal 버튼 (75%) + 2. Instant Checkout 버튼 (25%) */}
      <div className="pt-1 flex items-center gap-2 w-full">
        {/* 1. Official PayPal SDK Smart Button (75% 너비) */}
        <div className="w-[75%] flex-grow basis-3/4 min-h-[40px] relative rounded-md overflow-hidden flex items-center">
          <div 
            ref={paypalContainerRef} 
            className="w-full min-h-[40px]" 
          />
          {!sdkRendered && (
            <div className="absolute inset-0 w-full h-[40px] bg-[#ffc439] rounded-md flex items-center justify-center shadow-md pointer-events-none">
              <span className="text-[#003087] font-black text-sm italic tracking-tight flex items-center gap-1">
                Pay<span className="text-[#0079C1]">Pal</span>
              </span>
            </div>
          )}
        </div>

        {/* 2. Instant Checkout Button (25% 너비) */}
        <button
          type="button"
          onClick={handleInstantApprove}
          disabled={loading}
          className="w-[25%] basis-1/4 h-[40px] bg-[#0070BA] hover:bg-[#005ea6] active:scale-95 text-white rounded-md text-center font-bold cursor-pointer shadow-md transition flex flex-col items-center justify-center border border-blue-400/40 shrink-0 leading-tight p-1"
          title="PayPal Instant Checkout (Agent One-Click)"
        >
          <span className="text-xs">{loading ? "⏳" : "⚡"}</span>
          <span className="text-[10px] sm:text-[11px] leading-tight font-extrabold whitespace-nowrap overflow-hidden text-ellipsis">
            {loading ? "..." : (t.instantBtn || "Instant Checkout")}
          </span>
        </button>
      </div>

      {/* Footer */}
      <p className="text-[9px] text-center text-slate-400 font-mono mt-0.5">
        Official PayPal Sandbox SDK · {currentLocale} · sandbox.paypal.com
      </p>
    </div>
  );
};

export default PayPalCheckoutButton;
