export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  imageUrl: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestedProduct?: Product;
}

export interface PayPalOrderResponse {
  orderId: string;
  status: string;
}
