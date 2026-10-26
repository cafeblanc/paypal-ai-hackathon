import React, { useEffect, useRef } from "react";
import { loadPayPalScript } from "../services/paypalService";

interface PayPalCheckoutButtonProps {
  amount: number;
  currency: string;
  onSuccess: (orderId: string) => void;
}

export const PayPalCheckoutButton: React.FC<PayPalCheckoutButtonProps> = ({ amount, currency, onSuccess }) => {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";
    
    loadPayPalScript(clientId, currency).then(() => {
      if ((window as any).paypal && paypalRef.current) {
        paypalRef.current.innerHTML = "";
        (window as any).paypal.Buttons({
          createOrder: (_data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: amount.toString()
                }
              }]
            });
          },
          onApprove: async (_data: any, actions: any) => {
            const order = await actions.order.capture();
            onSuccess(order.id);
          }
        }).render(paypalRef.current);
      }
    }).catch(err => console.error("PayPal SDK Load Error:", err));
  }, [amount, currency, onSuccess]);

  return <div ref={paypalRef} className="w-full mt-2"></div>;
};
export default PayPalCheckoutButton;