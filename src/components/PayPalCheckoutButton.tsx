import React, { useState } from "react";

interface PayPalCheckoutButtonProps {
  amount: number;
  currency: string;
  onSuccess: (orderId: string) => void;
}

export const PayPalCheckoutButton: React.FC<PayPalCheckoutButtonProps> = ({ amount, currency, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleApprove = (details: any) => {
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
        <label className="text-[11px] text-slate-400 font-medium">배송 주소 및 연락처 확인</label>
        <div className="grid grid-cols-2 gap-2">
          <input type="text" defaultValue="대한민국 (KR)" className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100" readOnly />
          <input type="text" defaultValue="경기도 양평군" className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100" readOnly />
        </div>
        <input type="text" defaultValue="북한강로 807, 문호리 729-4" className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100" readOnly />
        <input type="text" defaultValue="010-1234-5678 / opener@cafeblanc.kr" className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100" readOnly />
      </div>

      <div className="pt-2 border-t border-slate-800">
        <div className="bg-[#0070BA] hover:bg-[#003087] text-white p-3 rounded-xl text-center font-bold text-sm cursor-pointer shadow-lg transition flex items-center justify-center gap-2"
             onClick={() => handleApprove({ id: 'SIMULATED' })}>
          <span>PayPal로 즉시 결제 (${amount}.00)</span>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          Powered by PayPal Sandbox Simulated API v2.0
        </p>
      </div>
    </div>
  );
};

export default PayPalCheckoutButton;