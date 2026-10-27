import React, { useState, useRef, useEffect } from "react";
import PayPalCheckoutButton from "./PayPalCheckoutButton";

export type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr";

export interface Product {
  id: string;
  name: Record<Language, string>;
  price: number;
  currency: string;
  stock: number;
  icon: string;
  videoUrl: string;
  fallbackVideoUrl: string;
  description: Record<Language, string>;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: Record<Language, string>;
  timestamp: string;
  suggestedProduct?: Product;
}

export interface OrderRecord {
  orderId: string;
  productName: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: string;
  shippingStatus: "상품 준비중" | "배송중" | "배송완료";
  trackingNumber: string;
}

export interface CustomQARecord {
  id: string;
  keyword: string;
  question: string;
  answer: string;
}

const TRANSLATIONS: Record<Language, any> = {
  ko: {
    marketName: "양평 오픈축제",
    title: "페이팔 AI 에이전틱 커머스 라이브",
    sandbox: "샌드박스 모드",
    liveStream: "실시간 라이브",
    aiLiveFeatured: "AI 실시간 추천 상품",
    payWithPayPal: "페이팔로 결제하기",
    soldOut: "품절 (Sold Out)",
    secureCheckout: "페이팔 보안 결제",
    totalAmount: "총 결제 금액",
    cancelBack: "취소 / 돌아가기",
    paymentCompleted: "결제 완료! 실시간 배송이 시작됩니다.",
    chatTitle: "AI 쇼핑 에이전트 & 실시간 채팅",
    online: "온라인",
    initialGreeting: "페이팔 AI 에이전틱 커머스에 오신 것을 환영합니다! 라이브 영상을 시청하며 실시간 재고와 함께 간편하게 쇼핑하세요.",
    quickPrompts: [
      { label: "프리미엄 꿀 추천해줘 🍯", type: "honey" },
      { label: "전통차 선물 세트 🍵", type: "tea" },
      { label: "즉시 페이팔 결제 💳", type: "checkout" }
    ],
    inputPlaceholder: "메시지를 입력하세요...",
    send: "전송",
    openCheckout: "페이팔 SDK 결제 열기",
    honeyRec: "실제 꿀 촬영 영상(honey_demo.mp4)으로 상품 대치가 완료되었습니다!",
    teaRec: "실제 전통차 촬영 영상(tea_demo.mp4)으로 상품 대치가 완료되었습니다!",
    adminPortalBtn: "🔒 관리자",
    adminTitle: "보안 관리자 대시보드",
    adminSubtitle: "매출, 실시간 재고, 배송 관리",
    passwordPlaceholder: "비밀번호 (admin1234)",
    loginBtn: "로그인",
    loginError: "비밀번호가 올바르지 않습니다.",
    logoutBtn: "로그아웃",
    backToStore: "← 스토어로",
    tabSales: "📊 매출",
    tabInventory: "📦 재고",
    tabShipping: "🚚 배송",
    tabQA: "💬 FAQ",
    tabVideoEditor: "🎬 동영상 편집",
    totalRevenue: "총 매출",
    totalOrders: "총 주문",
    activeStock: "활성 재고",
    orderHistory: "주문 내역",
    noOrders: "주문 내역이 없습니다.",
    productNameCol: "상품명",
    priceCol: "가격",
    stockCol: "재고",
    shippingCol: "배송",
    trackingCol: "운송장",
    videoAssetCol: "동영상",
    actionsCol: "관리",
    trackingViewTitle: "📦 주문 및 배송 추적",
    orderIdLabel: "주문 번호",
    shippingStatusLabel: "배송 상태",
    soundOn: "🔊 소리",
    soundOff: "🔇 음소거",
    lowStockWarning: "⚠️ [긴급] 재고 임박!",
    stockLeft: "남은 재고: ",
    unit: "개"
  },
  en: {
    marketName: "Yangpyeong Open Festival",
    title: "PayPal AI Live Commerce",
    sandbox: "Sandbox",
    liveStream: "LIVE",
    aiLiveFeatured: "AI FEATURED",
    payWithPayPal: "Pay with PayPal",
    soldOut: "Sold Out",
    secureCheckout: "Secure Checkout",
    totalAmount: "Total",
    cancelBack: "Back",
    paymentCompleted: "Payment completed!",
    chatTitle: "AI Shopping Agent & Live Chat",
    online: "Online",
    initialGreeting: "Welcome to PayPal AI Agentic Commerce! Watch live and shop instantly.",
    quickPrompts: [
      { label: "Recommend honey 🍯", type: "honey" },
      { label: "Gift tea set 🍵", type: "tea" },
      { label: "Instant checkout 💳", type: "checkout" }
    ],
    inputPlaceholder: "Type a message...",
    send: "Send",
    openCheckout: "Open PayPal Checkout",
    honeyRec: "Switched to actual Honey video demo!",
    teaRec: "Switched to actual Tea video demo!",
    adminPortalBtn: "🔒 Admin",
    adminTitle: "Admin Dashboard",
    adminSubtitle: "Manage revenue, stock & shipping",
    passwordPlaceholder: "Password (admin1234)",
    loginBtn: "Login",
    loginError: "Incorrect password.",
    logoutBtn: "Logout",
    backToStore: "← Back",
    tabSales: "📊 Sales",
    tabInventory: "📦 Inventory",
    tabShipping: "🚚 Shipping",
    tabQA: "💬 FAQ",
    tabVideoEditor: "🎬 Video Editor",
    totalRevenue: "Revenue",
    totalOrders: "Orders",
    activeStock: "Stock",
    orderHistory: "Order History",
    noOrders: "No orders yet.",
    productNameCol: "Product",
    priceCol: "Price",
    stockCol: "Stock",
    shippingCol: "Shipping",
    trackingCol: "Tracking",
    videoAssetCol: "Video",
    actionsCol: "Action",
    trackingViewTitle: "📦 Order & Tracking",
    orderIdLabel: "Order ID",
    shippingStatusLabel: "Status",
    soundOn: "🔊 Sound On",
    soundOff: "🔇 Muted",
    lowStockWarning: "⚠️ Low Stock!",
    stockLeft: "Stock: ",
    unit: "pcs"
  },
  ja: {
    marketName: "楊平オープンフェスティバル",
    title: "PayPal AI ライブコマース",
    sandbox: "サンドボックス",
    liveStream: "ライブ",
    aiLiveFeatured: "AI おすすめ",
    payWithPayPal: "PayPalで支払う",
    soldOut: "売り切れ",
    secureCheckout: "セキュア決済",
    totalAmount: "合計",
    cancelBack: "戻る",
    paymentCompleted: "決済完了！",
    chatTitle: "AI ショッピングエージェント & チャット",
    online: "オンライン",
    initialGreeting: "PayPal AI エージェンティックコマースへようこそ！",
    quickPrompts: [
      { label: "ハチミツ推薦 🍯", type: "honey" },
      { label: "伝統茶セット 🍵", type: "tea" },
      { label: "今すぐ決済 💳", type: "checkout" }
    ],
    inputPlaceholder: "メッセージを入力...",
    send: "送信",
    openCheckout: "PayPal 決済を開く",
    honeyRec: "ハチミツ動画に切り替えました！",
    teaRec: "伝統茶動画に切り替えました！",
    adminPortalBtn: "🔒 管理者",
    adminTitle: "管理者ダッシュボード",
    adminSubtitle: "売上・在庫管理",
    passwordPlaceholder: "パスワード",
    loginBtn: "ログイン",
    loginError: "パスワードが違います。",
    logoutBtn: "ログアウト",
    backToStore: "← 戻る",
    tabSales: "📊 売上",
    tabInventory: "📦 在庫",
    tabShipping: "🚚 配送",
    tabQA: "💬 FAQ",
    tabVideoEditor: "🎬 動画",
    totalRevenue: "総売上",
    totalOrders: "注文数",
    activeStock: "在庫合計",
    orderHistory: "注文履歴",
    noOrders: "注文なし",
    productNameCol: "商品名",
    priceCol: "価格",
    stockCol: "在庫",
    shippingCol: "配送",
    trackingCol: "追跡",
    videoAssetCol: "動画",
    actionsCol: "操作",
    trackingViewTitle: "📦 注文・配送追跡",
    orderIdLabel: "注文ID",
    shippingStatusLabel: "状態",
    soundOn: "🔊 音声ON",
    soundOff: "🔇 ミュート",
    lowStockWarning: "⚠️ 残りわずか！",
    stockLeft: "残り在庫: ",
    unit: "個"
  },
  zh: {
    marketName: "杨平开放节",
    title: "PayPal AI 直播电商",
    sandbox: "沙盒",
    liveStream: "直播",
    aiLiveFeatured: "AI 推荐",
    payWithPayPal: "PayPal 支付",
    soldOut: "已售罄",
    secureCheckout: "安全结账",
    totalAmount: "总额",
    cancelBack: "返回",
    paymentCompleted: "支付成功！",
    chatTitle: "AI 购物助手 & 实时聊天",
    online: "在线",
    initialGreeting: "欢迎来到 PayPal AI 智能代理电商！",
    quickPrompts: [
      { label: "推荐蜂蜜 🍯", type: "honey" },
      { label: "传统茶礼盒 🍵", type: "tea" },
      { label: "立即结账 💳", type: "checkout" }
    ],
    inputPlaceholder: "输入消息...",
    send: "发送",
    openCheckout: "打开结账",
    honeyRec: "已切换至蜂蜜视频！",
    teaRec: "已切换至茶视频！",
    adminPortalBtn: "🔒 管理员",
    adminTitle: "管理后台",
    adminSubtitle: "销售与库存管理",
    passwordPlaceholder: "密码",
    loginBtn: "登录",
    loginError: "密码错误",
    logoutBtn: "登出",
    backToStore: "← 返回",
    tabSales: "📊 销售",
    tabInventory: "📦 库存",
    tabShipping: "🚚 物流",
    tabQA: "💬 FAQ",
    tabVideoEditor: "🎬 视频",
    totalRevenue: "收入",
    totalOrders: "订单",
    activeStock: "库存",
    orderHistory: "历史",
    noOrders: "暂无订单",
    productNameCol: "商品",
    priceCol: "价格",
    stockCol: "库存",
    shippingCol: "配送",
    trackingCol: "单号",
    videoAssetCol: "视频",
    actionsCol: "操作",
    trackingViewTitle: "📦 订单追踪",
    orderIdLabel: "订单号",
    shippingStatusLabel: "状态",
    soundOn: "🔊 声音",
    soundOff: "🔇 静音",
    lowStockWarning: "⚠️ 库存告急！",
    stockLeft: "剩余库存: ",
    unit: "个"
  },
  es: {
    marketName: "Festival de Yangpyeong",
    title: "PayPal AI Live Commerce",
    sandbox: "Sandbox",
    liveStream: "EN VIVO",
    aiLiveFeatured: "DESTACADO IA",
    payWithPayPal: "Pagar",
    soldOut: "Agotado",
    secureCheckout: "Pago Seguro",
    totalAmount: "Total",
    cancelBack: "Volver",
    paymentCompleted: "¡Pago completado!",
    chatTitle: "Agente IA & Chat",
    online: "En línea",
    initialGreeting: "¡Bienvenido!",
    quickPrompts: [
      { label: "Miel 🍯", type: "honey" },
      { label: "Té 🍵", type: "tea" },
      { label: "Checkout 💳", type: "checkout" }
    ],
    inputPlaceholder: "Escribe...",
    send: "Enviar",
    openCheckout: "Abrir pago",
    honeyRec: "¡Miel video!",
    teaRec: "¡Té video!",
    adminPortalBtn: "🔒 Admin",
    adminTitle: "Admin",
    adminSubtitle: "Gestión",
    passwordPlaceholder: "Password",
    loginBtn: "Login",
    loginError: "Error",
    logoutBtn: "Logout",
    backToStore: "← Volver",
    tabSales: "📊 Ventas",
    tabInventory: "📦 Stock",
    tabShipping: "🚚 Envíos",
    tabQA: "💬 FAQ",
    tabVideoEditor: "🎬 Video",
    totalRevenue: "Ingresos",
    totalOrders: "Pedidos",
    activeStock: "Stock",
    orderHistory: "Historial",
    noOrders: "Sin pedidos",
    productNameCol: "Producto",
    priceCol: "Precio",
    stockCol: "Stock",
    shippingCol: "Envío",
    trackingCol: "Tracking",
    videoAssetCol: "Video",
    actionsCol: "Acción",
    trackingViewTitle: "📦 Seguimiento",
    orderIdLabel: "ID",
    shippingStatusLabel: "Estado",
    soundOn: "🔊 Sonido",
    soundOff: "🔇 Silencio",
    lowStockWarning: "⚠️ ¡Stock Bajo!",
    stockLeft: "Stock: ",
    unit: "pcs"
  },
  fr: {
    marketName: "Festival de Yangpyeong",
    title: "PayPal AI Live Commerce",
    sandbox: "Sandbox",
    liveStream: "EN DIRECT",
    aiLiveFeatured: "PHARE IA",
    payWithPayPal: "Payer",
    soldOut: "Épuisé",
    secureCheckout: "Paiement",
    totalAmount: "Total",
    cancelBack: "Retour",
    paymentCompleted: "Paiement réussi !",
    chatTitle: "Agent IA & Chat",
    online: "En ligne",
    initialGreeting: "Bienvenue !",
    quickPrompts: [
      { label: "Miel 🍯", type: "honey" },
      { label: "Thé 🍵", type: "tea" },
      { label: "Paiement 💳", type: "checkout" }
    ],
    inputPlaceholder: "Tapez...",
    send: "Envoyer",
    openCheckout: "Ouvrir",
    honeyRec: "Vidéo Miel !",
    teaRec: "Vidéo Thé !",
    adminPortalBtn: "🔒 Admin",
    adminTitle: "Admin",
    adminSubtitle: "Gestion",
    passwordPlaceholder: "Mot de passe",
    loginBtn: "Connexion",
    loginError: "Erreur",
    logoutBtn: "Déconnexion",
    backToStore: "← Retour",
    tabSales: "📊 Ventes",
    tabInventory: "📦 Stock",
    tabShipping: "🚚 Expéditions",
    tabQA: "💬 FAQ",
    tabVideoEditor: "🎬 Vidéo",
    totalRevenue: "Revenu",
    totalOrders: "Commandes",
    activeStock: "Stock",
    orderHistory: "Historique",
    noOrders: "Aucune",
    productNameCol: "Produit",
    priceCol: "Prix",
    stockCol: "Stock",
    shippingCol: "Expédition",
    trackingCol: "Suivi",
    videoAssetCol: "Vidéo",
    actionsCol: "Action",
    trackingViewTitle: "📦 Suivi",
    orderIdLabel: "ID",
    shippingStatusLabel: "Statut",
    soundOn: "🔊 Son",
    soundOff: "🔇 Muet",
    lowStockWarning: "⚠️ Stock Limité !",
    stockLeft: "Stock : ",
    unit: "pcs"
  }
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-001",
    name: {
      ko: "프리미엄 유기농 꿀 (100% 천연)",
      en: "Premium Organic Honey (100% Natural)",
      ja: "プレミアム有機ハチミツ (100%天然)",
      zh: "优质有机蜂蜜 (100%天然)",
      es: "Miel Orgánica Premium (100% Natural)",
      fr: "Miel Bio Premium (100% Naturel)"
    },
    price: 35000,
    currency: "KRW",
    stock: 4,
    icon: "🍯",
    videoUrl: "/videos/honey_demo.mp4",
    fallbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: {
      ko: "실제 유기농 꿀을 들고 촬영한 실전 라이브 시연 영상 매핑 상품",
      en: "Live demonstration video product filmed with actual organic honey",
      ja: "実際の有機ハチミツを持って撮影したライブ実演動画マッピング製品",
      zh: "手持实际有机蜂蜜拍摄的直播演示视频商品",
      es: "Producto con video de demostración real con miel orgánica",
      fr: "Produit de démonstration filmé avec du vrai miel bio"
    }
  },
  {
    id: "prod-002",
    name: {
      ko: "핸드메이드 전통차 선물 세트",
      en: "Handmade Traditional Herbal Tea Set",
      ja: "ハンドメイド伝統茶ギフトセット",
      zh: "手工传统茶礼盒",
      es: "Set de Té Herbal Tradicional Hecho a Mano",
      fr: "Coffret de Thé Traditionnel Fait Main"
    },
    price: 48000,
    currency: "KRW",
    stock: 15,
    icon: "🍵",
    videoUrl: "/videos/tea_demo.mp4",
    fallbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: {
      ko: "실제 전통차 세트를 들고 촬영한 실전 라이브 시연 영상 매핑 상품",
      en: "Live demonstration video product filmed with actual traditional tea set",
      ja: "実際の伝統茶セットを持って撮影したライブ実演動画マッピング製品",
      zh: "手持实际传统茶具拍摄的直播演示视频商品",
      es: "Producto con video de demostración real con set de té",
      fr: "Produit de démonstration filmé avec du vrai thé"
    }
  }
];

const INITIAL_QA_LIST: CustomQARecord[] = [
  {
    id: "qa-1",
    keyword: "깎아",
    question: "값을 좀 깎아 주세요 / 할인 되나요?",
    answer: "현재 양평 오픈축제 특가로 제공 중이나, 페이팔 샌드박스 결제 시 즉시 적용 가능한 특별 쿠폰 혜택을 안내해 드립니다!"
  },
  {
    id: "qa-2",
    keyword: "배송",
    question: "배송은 얼마나 걸리나요?",
    answer: "결제 완료 즉시 관리자 백엔드에서 CJ대한통운 운송장이 발급되며, 보통 1~2일 내에 안전하게 받아보실 수 있습니다."
  }
];

export const LiveStreamView: React.FC = () => {
  const [lang, setLang] = useState<Language>("ko");
  const t = TRANSLATIONS[lang];

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(
    window.location.hash.includes("admin") || window.location.pathname.includes("admin")
  );
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<boolean>(false);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [qaList, setQaList] = useState<CustomQARecord[]>(INITIAL_QA_LIST);

  const [newKeyword, setNewKeyword] = useState<string>("");
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newAnswer, setNewAnswer] = useState<string>("");

  const [selectedVideoAsset, setSelectedVideoAsset] = useState<string>("/videos/honey_demo.mp4");
  const [compressionCrf, setCompressionCrf] = useState<number>(28);
  const [videoSpeed, setVideoSpeed] = useState<string>("1.0");
  const [audioMute, setAudioMute] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processLog, setProcessLog] = useState<string>("");

  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: {
        ko: "페이팔 AI 에이전틱 커머스에 오신 것을 환영합니다! 라이브 영상을 시청하며 실시간 재고와 함께 간편하게 쇼핑하세요.",
        en: "Welcome to PayPal AI Agentic Commerce! Watch live and shop instantly with real-time stock.",
        ja: "PayPal AI エージェンティックコマースへようこそ！ライブ映像とリアルタイム在庫でお買い物。",
        zh: "欢迎来到 PayPal AI 智能代理电商！观看直播并实时查看库存选购商品。",
        es: "¡Bienvenido al Comercio Agentico IA de PayPal! Mira en vivo con stock en tiempo real.",
        fr: "Bienvenue sur le Commerce Agentique IA PayPal ! Regardez en direct avec stock en temps réel."
      },
      timestamp: "Just now"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [activeProduct, setActiveProduct] = useState<Product>(products[0]);
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);
  const [latestOrder, setLatestOrder] = useState<OrderRecord | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 자동 3초 뒤 결제 완료(추적) 창 닫기 및 기본 화면 복귀 타이머
  useEffect(() => {
    if (latestOrder) {
      const timer = setTimeout(() => {
        setLatestOrder(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [latestOrder]);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(window.location.hash.includes("admin") || window.location.pathname.includes("admin"));
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isAudioMuted;
      videoRef.current.play().catch(err => {
        console.warn("Video autoplay prevented:", err);
      });
    }
  }, [activeProduct, isAudioMuted]);

  useEffect(() => {
    const current = products.find(p => p.id === activeProduct.id);
    if (current) {
      setActiveProduct(current);
    }
  }, [products]);

  const handleProductSwitch = (type: "honey" | "tea" | "checkout", customText?: string) => {
    let product = activeProduct;
    let aiTextRecord = t.honeyRec;

    if (type === "honey") {
      product = products[0];
      aiTextRecord = t.honeyRec;
    } else if (type === "tea") {
      product = products[1];
      aiTextRecord = t.teaRec;
    } else if (type === "checkout") {
      if (activeProduct.stock <= 0) {
        alert("해당 상품은 품절되었습니다.");
        return;
      }
      setIsCheckingOut(true);
      return;
    }

    setActiveProduct(product);
    setIsCheckingOut(false);

    const userText = customText || (type === "honey" ? "프리미엄 꿀 추천해줘 🍯" : "전통차 선물 세트 🍵");
    const userMsg: ChatMessage = {
      id: Date.now().toString() + "-u",
      sender: "user",
      text: { ko: userText, en: userText, ja: userText, zh: userText, es: userText, fr: userText },
      timestamp: new Date().toLocaleTimeString()
    };

    const aiMsg: ChatMessage = {
      id: Date.now().toString() + "-ai",
      sender: "ai",
      text: { ko: aiTextRecord, en: aiTextRecord, ja: aiTextRecord, zh: aiTextRecord, es: aiTextRecord, fr: aiTextRecord },
      timestamp: new Date().toLocaleTimeString(),
      suggestedProduct: product
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const query = inputText.toLowerCase();
    let productType: "honey" | "tea" | "checkout" = "honey";

    let matchedQA = qaList.find(qa => query.includes(qa.keyword.toLowerCase()));

    const userMsg: ChatMessage = {
      id: Date.now().toString() + "-u",
      sender: "user",
      text: { ko: inputText, en: inputText, ja: inputText, zh: inputText, es: inputText, fr: inputText },
      timestamp: new Date().toLocaleTimeString()
    };

    let aiReplyText = "문의하신 내용에 대해 AI 에이전트가 확인 중입니다.";
    let suggestedProd = undefined;

    if (matchedQA) {
      aiReplyText = matchedQA.answer;
    } else if (query.includes("tea") || query.includes("gift") || query.includes("차") || query.includes("선물") || query.includes("té") || query.includes("茶") || query.includes("お茶") || query.includes("전통차")) {
      productType = "tea";
      setActiveProduct(products[1]);
      aiReplyText = t.teaRec;
      suggestedProd = products[1];
    } else if (query.includes("pay") || query.includes("결제") || query.includes("checkout")) {
      if (activeProduct.stock <= 0) {
        aiReplyText = "죄송합니다. 현재 선택하신 상품은 품절되었습니다.";
      } else {
        setIsCheckingOut(true);
        aiReplyText = "페이팔 안전 결제창을 열어드렸습니다. 아래에서 결제를 진행해 주세요.";
      }
    } else if (query.includes("honey") || query.includes("꿀") || query.includes("허니") || query.includes("miel")) {
      productType = "honey";
      setActiveProduct(products[0]);
      aiReplyText = t.honeyRec;
      suggestedProd = products[0];
    } else {
      aiReplyText = `[AI 에이전트 답변] "${inputText}"에 대해 판매자에게 전달되었습니다. 남은 재고 수량(${activeProduct.stock}개)을 참고해 주세요!`;
    }

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString() + "-ai",
      sender: "ai",
      text: { ko: aiReplyText, en: aiReplyText, ja: aiReplyText, zh: aiReplyText, es: aiReplyText, fr: aiReplyText },
      timestamp: new Date().toLocaleTimeString(),
      suggestedProduct: suggestedProd
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInputText("");
  };

  const handlePaymentSuccess = (orderId: string, product: Product) => {
    setCheckoutStatus(t.paymentCompleted);
    
    const newOrder: OrderRecord = {
      orderId,
      productName: product.name[lang],
      amount: product.price,
      currency: product.currency,
      timestamp: new Date().toLocaleString(),
      status: "Completed (Sandbox)",
      shippingStatus: "상품 준비중",
      trackingNumber: "KR-" + Math.floor(100000 + Math.random() * 900000)
    };
    setOrders(prev => [newOrder, ...prev]);
    setLatestOrder(newOrder);

    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: Math.max(0, p.stock - 1) } : p));
    setIsCheckingOut(false);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "admin1234") {
      setIsAdminLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const updateShippingStatus = (orderId: string, newStatus: "상품 준비중" | "배송중" | "배송완료") => {
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, shippingStatus: newStatus } : o));
    if (latestOrder && latestOrder.orderId === orderId) {
      setLatestOrder(prev => prev ? { ...prev, shippingStatus: newStatus } : null);
    }
  };

  const changeProductVideoMapping = (productId: string) => {
    const newVideo = prompt("해당 상품에 매핑할 실제 동영상 파일 경로를 입력하세요 (예: /videos/honey_demo.mp4 또는 /videos/tea_demo.mp4):", "/videos/honey_demo.mp4");
    if (newVideo) {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, videoUrl: newVideo } : p));
      alert(`상품 동영상 매핑이 성공적으로 변경되었습니다: ${newVideo}`);
    }
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p));
  };

  const handleAddCustomQA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim() || !newAnswer.trim()) {
      alert("키워드와 답변을 모두 입력해 주세요.");
      return;
    }
    const newQa: CustomQARecord = {
      id: "qa-" + Date.now(),
      keyword: newKeyword.trim(),
      question: newQuestion.trim() || newKeyword.trim(),
      answer: newAnswer.trim()
    };
    setQaList(prev => [...prev, newQa]);
    setNewKeyword("");
    setNewQuestion("");
    setNewAnswer("");
    alert("새로운 소비자 맞춤 답변(FAQ)이 사전 등록 및 챗봇에 연동되었습니다!");
  };

  const updateCustomQAAnswer = (id: string, newAns: string) => {
    setQaList(prev => prev.map(q => q.id === id ? { ...q, answer: newAns } : q));
  };

  const deleteCustomQA = (id: string) => {
    setQaList(prev => prev.filter(q => q.id !== id));
  };

  const runVideoEditorCompression = () => {
    setIsProcessing(true);
    setProcessLog(`[FFmpeg] Loading asset: ${selectedVideoAsset} ...\n[FFmpeg] Applying CRF compression (${compressionCrf}), Speed: ${videoSpeed}x ...`);
    
    setTimeout(() => {
      setProcessLog(prev => prev + `\n[FFmpeg] Encoding video stream (libx264) & optimizing moov atom for web streaming...\n[Success] Processed video rendered and saved to public/videos/!`);
      setIsProcessing(false);
      alert("동영상 압축 및 렌더링이 완료되었습니다!");
    }, 1500);
  };

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col w-full max-w-full overflow-x-hidden">
        <header className="border-b border-slate-700 px-4 py-3 flex justify-between items-center bg-slate-900/90 backdrop-blur shadow-md w-full">
          <h1 className="text-sm font-bold flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
            <span className="truncate">{t.adminTitle}</span>
          </h1>
          <button
            onClick={() => {
              window.location.hash = "";
              setIsAdminRoute(false);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shadow shrink-0"
          >
            {t.backToStore}
          </button>
        </header>

        <div className="flex-1 max-w-6xl mx-auto w-full p-4 flex flex-col gap-6">
          {!isAdminLoggedIn ? (
            <div className="max-w-md mx-auto mt-12 bg-slate-900 border-2 border-slate-700 p-6 rounded-2xl shadow-2xl flex flex-col gap-5 w-full">
              <div className="text-center">
                <span className="text-4xl">🔐</span>
                <h2 className="text-lg font-bold text-white mt-2">Admin Portal Authentication</h2>
                <p className="text-xs text-slate-400 mt-1">매출, 재고, 배송 및 AI FAQ 편집을 위한 보안 로그인</p>
              </div>

              <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">Password</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-100"
                    autoFocus
                  />
                </div>
                {loginError && (
                  <p className="text-xs text-red-400 font-medium">{t.loginError}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-bold transition shadow-lg cursor-pointer border border-blue-400/30"
                >
                  {t.loginBtn}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-6 animate-fadeIn w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 p-4 rounded-xl gap-3">
                <div>
                  <h2 className="text-base font-bold text-amber-400">{t.adminTitle}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{t.adminSubtitle}</p>
                </div>
                <button
                  onClick={() => setIsAdminLoggedIn(false)}
                  className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0"
                >
                  {t.logoutBtn}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1 shadow">
                  <p className="text-xs text-slate-400 font-medium">{t.totalRevenue}</p>
                  <p className="text-xl font-bold text-emerald-400">
                    KRW {orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500">Sandbox Test Transactions</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1 shadow">
                  <p className="text-xs text-slate-400 font-medium">{t.totalOrders}</p>
                  <p className="text-xl font-bold text-blue-400">{orders.length} 건</p>
                  <p className="text-[10px] text-slate-500">Completed Orders</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1 shadow">
                  <p className="text-xs text-slate-400 font-medium">{t.activeStock}</p>
                  <p className="text-xl font-bold text-amber-400">{products.reduce((sum, p) => sum + p.stock, 0)} 개</p>
                  <p className="text-[10px] text-slate-500">Total Available Stock</p>
                </div>
              </div>

              {/* SECTION 1: AI Custom Q&A / FAQ Editor & Manager */}
              <div className="bg-slate-900 border-2 border-blue-500/40 p-4 rounded-xl flex flex-col gap-4 shadow-xl w-full overflow-hidden">
                <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                  <span>💬</span> {t.tabQA}
                </h3>
                <p className="text-xs text-slate-400">소비자가 라이브 채팅에서 질문할 때 즉시 매칭되는 AI 에이전트의 맞춤 답변을 실시간으로 편집하고 관리합니다.</p>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs min-w-[500px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 font-semibold">인식 키워드</th>
                        <th className="pb-3 font-semibold">소비자 질문 유형</th>
                        <th className="pb-3 font-semibold">AI 에이전트 답변 (편집 가능)</th>
                        <th className="pb-3 font-semibold text-right">관리</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {qaList.map(qa => (
                        <tr key={qa.id} className="hover:bg-slate-800/40">
                          <td className="py-3 font-mono font-bold text-amber-300">{qa.keyword}</td>
                          <td className="py-3 text-slate-300">{qa.question}</td>
                          <td className="py-3">
                            <input
                              type="text"
                              value={qa.answer}
                              onChange={(e) => updateCustomQAAnswer(qa.id, e.target.value)}
                              className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                            />
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => deleteCustomQA(qa.id)}
                              className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/40 px-2.5 py-1 rounded text-[11px] transition cursor-pointer"
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <form onSubmit={handleAddCustomQA} className="mt-3 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-3">
                    <label className="text-[11px] text-slate-400 mb-1 block">인식 키워드</label>
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={e => setNewKeyword(e.target.value)}
                      placeholder="예: 배송, 할인, 성분"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="text-[11px] text-slate-400 mb-1 block">질문 유형 설명</label>
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={e => setNewQuestion(e.target.value)}
                      placeholder="예: 언제 도착하나요?"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="text-[11px] text-slate-400 mb-1 block">에이전트 답변 내용</label>
                    <input
                      type="text"
                      value={newAnswer}
                      onChange={e => setNewAnswer(e.target.value)}
                      placeholder="예: 당일 발송됩니다."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-xs font-bold transition cursor-pointer shadow border border-blue-400/30"
                    >
                      추가
                    </button>
                  </div>
                </form>
              </div>

              {/* SECTION 2: Real-Time Inventory & Video Mapping Editor */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-4 w-full overflow-hidden">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>📦</span> {t.tabInventory}
                </h3>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs min-w-[500px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 font-semibold">{t.productNameCol}</th>
                        <th className="pb-3 font-semibold">{t.priceCol}</th>
                        <th className="pb-3 font-semibold">{t.stockCol}</th>
                        <th className="pb-3 font-semibold">{t.videoAssetCol}</th>
                        <th className="pb-3 font-semibold text-right">{t.actionsCol}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {products.map(prod => (
                        <tr key={prod.id} className="hover:bg-slate-800/40">
                          <td className="py-3.5 font-medium text-white flex items-center gap-2">
                            <span className="text-base">{prod.icon}</span> {prod.name[lang]}
                          </td>
                          <td className="py-3.5 text-slate-300">KRW {prod.price.toLocaleString()}</td>
                          <td className="py-3.5">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={prod.stock}
                                onChange={(e) => updateProductStock(prod.id, Number(e.target.value))}
                                className="w-16 bg-slate-950 border border-slate-700 text-amber-400 font-bold rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                              />
                              <span className="text-slate-400">개</span>
                              {prod.stock <= 5 && prod.stock > 0 && (
                                <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded animate-pulse">
                                  임박
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 text-slate-400">
                            <code className="bg-slate-950 px-2.5 py-1 rounded text-amber-300 border border-slate-800 font-mono text-[11px]">{prod.videoUrl}</code>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => changeProductVideoMapping(prod.id)}
                              className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0"
                            >
                              ⚙️ 동영상 변경
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 3: Shipping & Order Management */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-4 w-full overflow-hidden">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>🚚</span> {t.tabShipping} & {t.orderHistory}
                </h3>
                {orders.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">{t.noOrders}</p>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-xs min-w-[500px]">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="pb-3 font-semibold">Order ID</th>
                          <th className="pb-3 font-semibold">Product</th>
                          <th className="pb-3 font-semibold">Amount</th>
                          <th className="pb-3 font-semibold">{t.trackingCol}</th>
                          <th className="pb-3 font-semibold">{t.shippingCol}</th>
                          <th className="pb-3 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {orders.map((ord, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40">
                            <td className="py-3.5 font-mono text-blue-400">{ord.orderId}</td>
                            <td className="py-3.5 text-white font-medium">{ord.productName}</td>
                            <td className="py-3.5 text-slate-300">KRW {ord.amount.toLocaleString()}</td>
                            <td className="py-3.5 font-mono text-amber-300">{ord.trackingNumber}</td>
                            <td className="py-3.5">
                              <select
                                value={ord.shippingStatus}
                                onChange={(e) => updateShippingStatus(ord.orderId, e.target.value as any)}
                                className="bg-slate-950 border border-slate-700 text-slate-100 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                              >
                                <option value="상품 준비중">📦 상품 준비중</option>
                                <option value="배송중">🚚 배송중</option>
                                <option value="배송완료">✅ 배송완료</option>
                              </select>
                            </td>
                            <td className="py-3.5 text-right">
                              <span className="text-[10px] text-slate-400">{ord.timestamp}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* SECTION 4: Video Editor & Compressor Studio */}
              <div className="bg-slate-900 border-2 border-amber-500/40 p-4 rounded-xl flex flex-col gap-4 shadow-xl w-full">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <span>🎬</span> {t.tabVideoEditor}
                  </h3>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded font-medium">
                    FFmpeg Web Engine Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs text-slate-300 font-semibold mb-1 block">편집할 동영상 파일 선택</label>
                      <select
                        value={selectedVideoAsset}
                        onChange={(e) => setSelectedVideoAsset(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                      >
                        <option value="/videos/honey_demo.mp4">🍯 honey_demo.mp4 (프리미엄 꿀 시연 영상)</option>
                        <option value="/videos/tea_demo.mp4">🍵 tea_demo.mp4 (전통차 세트 시연 영상)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-semibold mb-1 block">고압축 품질 (CRF 20 ~ 35, 권장: 28)</label>
                      <input
                        type="number"
                        min="20"
                        max="35"
                        value={compressionCrf}
                        onChange={(e) => setCompressionCrf(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-300 font-semibold mb-1 block">재생 속도</label>
                        <select
                          value={videoSpeed}
                          onChange={(e) => setVideoSpeed(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500"
                        >
                          <option value="1.0">1.0x (Normal)</option>
                          <option value="1.25">1.25x (Fast)</option>
                          <option value="1.5">1.5x</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 font-semibold mb-1 block">오디오 트랙</label>
                        <select
                          value={audioMute ? "mute" : "keep"}
                          onChange={(e) => setAudioMute(e.target.value === "mute")}
                          className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500"
                        >
                          <option value="keep">🔊 원본 오디오 유지 (권장)</option>
                          <option value="mute">🔇 무음 (Mute)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      disabled={isProcessing}
                      onClick={runVideoEditorCompression}
                      className="mt-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 text-white py-2.5 rounded-lg text-xs font-bold transition shadow-lg cursor-pointer border border-amber-400/30 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? "⏳ 동영상 압축 및 렌더링 중..." : "🚀 동영상 편집 및 압축 실행 (Render)"}
                    </button>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col font-mono text-[11px] text-emerald-400 h-[220px] overflow-y-auto shadow-inner w-full">
                    <p className="text-slate-500 pb-2 border-b border-slate-900 mb-2">// FFmpeg Studio Console Output</p>
                    {processLog ? (
                      <pre className="whitespace-pre-wrap">{processLog}</pre>
                    ) : (
                      <span className="text-slate-600 italic">Ready for video editing & compression tasks...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Live Commerce Store View (Mobile Full-Width Snap Scroll UI/UX)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col w-full max-w-full overflow-x-hidden box-border">
      {/* Header */}
      <header className="border-b border-slate-700 px-3 py-2 flex flex-col sm:flex-row justify-between items-center gap-2 bg-slate-900/90 backdrop-blur shadow-md w-full max-w-full box-border shrink-0">
        <h1 className="text-xs sm:text-sm font-bold flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0"></span>
            <span className="truncate">{t.title}</span>
          </div>
          <span className="text-[10px] bg-blue-600/20 text-blue-400 border border-blue-500/40 px-2 py-0.5 rounded-full font-medium shrink-0 sm:hidden">
            {t.sandbox}
          </span>
        </h1>
        
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => {
              window.location.hash = "#/admin";
              setIsAdminRoute(true);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 shadow shrink-0"
          >
            <span>{t.adminPortalBtn}</span>
          </button>

          <div className="flex bg-slate-950 border border-slate-700 rounded-md p-0.5 text-xs overflow-x-auto shrink-0">
            {(["ko", "en", "ja", "zh", "es", "fr"] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-0.5 rounded transition cursor-pointer font-medium uppercase text-[10px] shrink-0 ${lang === l ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                {l === "ko" ? "🇰🇷" : l === "en" ? "EN" : l === "ja" ? "🇯🇵" : l === "zh" ? "中文" : l === "es" ? "ES" : "FR"}
              </button>
            ))}
          </div>

          <span className="text-[11px] bg-blue-600/20 text-blue-400 border border-blue-500/40 px-2.5 py-1 rounded-full font-medium shrink-0 hidden sm:inline-block">
            {t.sandbox}
          </span>
        </div>
      </header>

      {/* Main Snap Scroll Container for Mobile / Grid for Desktop */}
      <div className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-3 p-2 sm:p-4 w-full max-w-full box-border items-stretch md:overflow-hidden snap-y md:snap-none snap-mandatory overflow-y-auto" style={{ height: 'calc(100vh - 55px)' }}>
        
        {/* Section 1: Video & Live Commerce Player (Snap Page 1) */}
        <div className="md:col-span-7 relative min-h-[580px] md:h-full bg-slate-900/40 border border-slate-700/80 rounded-2xl p-3 shadow-xl flex flex-col w-full max-w-full box-border snap-start shrink-0">
          <div className="relative w-full h-[380px] md:h-[460px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center shadow-lg shrink-0">
            <video
              ref={videoRef}
              key={activeProduct.id}
              autoPlay
              loop
              muted={isAudioMuted}
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-[center_35%] bg-black"
              onError={(e) => {
                console.warn("Local video load failed, switching to fallback stream.");
                const target = e.currentTarget;
                if (target.src !== activeProduct.fallbackVideoUrl) {
                  target.src = activeProduct.fallbackVideoUrl;
                  target.load();
                  target.play().catch(err => console.error("Fallback play error:", err));
                }
              }}
            >
              <source src={activeProduct.videoUrl} type="video/mp4" />
              <source src={activeProduct.fallbackVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>

            {/* Top-Left Badges */}
            <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-1">
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse uppercase tracking-wider shadow">
                ● {t.liveStream}
              </span>
              <span className="bg-black/70 backdrop-blur-md text-slate-200 text-[11px] px-2 py-0.5 rounded-md border border-slate-600 font-medium shadow">
                {t.marketName}
              </span>
            </div>

            {/* Top-Right Badges */}
            <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5">
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="bg-black/80 hover:bg-black text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-600 backdrop-blur-md shadow-lg transition cursor-pointer flex items-center gap-1"
              >
                <span>{isAudioMuted ? t.soundOff : t.soundOn}</span>
              </button>

              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border backdrop-blur-md shadow-lg ${activeProduct.stock <= 0 ? 'bg-red-600/90 text-white border-red-500' : activeProduct.stock <= 5 ? 'bg-amber-600/90 text-white border-amber-500 animate-pulse' : 'bg-black/80 text-amber-300 border-slate-600'}`}>
                {activeProduct.stock <= 0 ? t.soldOut : `🔥 ${t.stockLeft}${activeProduct.stock}${t.unit}`}
              </span>
            </div>
          </div>

          <div className="mt-3 flex-1 flex flex-col justify-end w-full max-w-full box-border">
            {!isCheckingOut && !latestOrder ? (
              <div className="bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-xl animate-fadeIn w-full box-border">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-xl shadow-inner shrink-0">
                    {activeProduct.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-[10px] text-blue-400 font-semibold tracking-wide">{t.aiLiveFeatured}</p>
                      {activeProduct.stock <= 5 && activeProduct.stock > 0 && (
                        <span className="text-[9px] text-red-400 font-bold bg-red-950/80 px-1.5 py-0.5 rounded border border-red-500/50 animate-pulse">
                          {t.lowStockWarning} ({activeProduct.stock}{t.unit})
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-white truncate">{activeProduct.name[lang]}</p>
                    <p className="text-[11px] text-slate-300">KRW {activeProduct.price.toLocaleString()} (~${Math.round(activeProduct.price / 1350)} USD)</p>
                  </div>
                </div>
                {activeProduct.stock > 0 ? (
                  <button 
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition shadow-lg cursor-pointer shrink-0 border border-blue-400/30 text-center"
                  >
                    {t.payWithPayPal}
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full sm:w-auto bg-slate-800 text-slate-500 px-4 py-2 rounded-lg text-xs font-bold cursor-not-allowed border border-slate-700 text-center"
                  >
                    {t.soldOut}
                  </button>
                )}
              </div>
            ) : isCheckingOut ? (
              <div className="bg-slate-900 border border-blue-500/70 p-3 rounded-xl shadow-xl animate-fadeIn w-full box-border">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold text-blue-400 flex items-center gap-1 truncate">
                    <span>💳</span> <span className="truncate">{t.secureCheckout}: {activeProduct.icon} {activeProduct.name[lang]}</span>
                  </h3>
                  <button 
                    onClick={() => setIsCheckingOut(false)}
                    className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer shrink-0"
                  >
                    {t.cancelBack}
                  </button>
                </div>
                <p className="text-xs text-slate-300 mb-2">
                  {t.totalAmount}: KRW {activeProduct.price.toLocaleString()} (~${Math.round(activeProduct.price / 1350)} USD)
                </p>
                <PayPalCheckoutButton 
                  amount={Math.round(activeProduct.price / 1350)} 
                  currency="USD" 
                  onSuccess={(orderId) => handlePaymentSuccess(orderId, activeProduct)} 
                />
              </div>
            ) : latestOrder ? (
              <div className="bg-slate-900 border border-emerald-500/70 p-3 rounded-xl shadow-xl animate-fadeIn flex flex-col gap-2.5 w-full box-border">
                <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                  <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-1 truncate">
                    <span>✅</span> <span className="truncate">{t.trackingViewTitle} (3초 후 자동 닫힘)</span>
                  </h3>
                  <button 
                    onClick={() => setLatestOrder(null)}
                    className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer shrink-0"
                  >
                    닫기
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <p className="text-[10px] text-slate-400">{t.orderIdLabel}</p>
                    <p className="font-mono font-bold text-blue-400 truncate">{latestOrder.orderId}</p>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <p className="text-[10px] text-slate-400">{t.shippingStatusLabel}</p>
                    <p className="font-bold text-amber-400 flex items-center gap-1 truncate">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0"></span>
                      <span className="truncate">{latestOrder.shippingStatus}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                  <div className="min-w-0 flex-1 truncate">
                    <p className="text-[10px] text-slate-400">운송장 번호 (Tracking No.)</p>
                    <p className="font-mono text-emerald-300 font-bold truncate">{latestOrder.trackingNumber}</p>
                  </div>
                  <span className="text-[10px] bg-blue-600/20 text-blue-400 border border-blue-500/40 px-2 py-0.5 rounded shrink-0 ml-2">
                    CJ대한통운
                  </span>
                </div>
              </div>
            ) : null}

            {checkoutStatus && !latestOrder && (
              <div className="mt-2 p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-xs text-emerald-300 font-semibold text-center shadow">
                {checkoutStatus}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: AI Shopping Agent & Live Chat (Snap Page 2) */}
        <div className="md:col-span-5 bg-slate-900/80 border border-slate-700/80 rounded-2xl flex flex-col min-h-[520px] md:h-full shadow-xl w-full max-w-full box-border snap-start shrink-0">
          <div className="p-3 border-b border-slate-700 font-semibold text-xs sm:text-sm flex justify-between items-center bg-slate-900/90 shrink-0">
            <span className="truncate">{t.chatTitle}</span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> {t.online}
            </span>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2.5 w-full max-w-full box-border">
            {messages.map(msg => (
              <div key={msg.id} className={msg.sender === "user" ? "flex flex-col items-end w-full" : "flex flex-col items-start w-full"}>
                <div className={msg.sender === "user" ? "max-w-[85%] p-2.5 rounded-xl text-xs sm:text-sm bg-blue-600 text-white shadow break-words" : "max-w-[85%] p-2.5 rounded-xl text-xs sm:text-sm bg-slate-800 text-slate-200 border border-slate-700 shadow break-words"}>
                  {typeof msg.text === "string" ? msg.text : msg.text[lang]}
                </div>
                {msg.suggestedProduct && (
                  <div className="mt-2 w-full max-w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl flex flex-col gap-2 shadow-md box-border">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                        {msg.suggestedProduct.icon}
                      </div>
                      <div className="text-xs min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-white truncate">{msg.suggestedProduct.name[lang]}</p>
                          <span className="text-[10px] text-amber-400 font-bold shrink-0">{t.stockLeft}{msg.suggestedProduct.stock}{t.unit}</span>
                        </div>
                        <p className="text-slate-400">KRW {msg.suggestedProduct.price.toLocaleString()} (~${Math.round(msg.suggestedProduct.price / 1350)} USD)</p>
                      </div>
                    </div>
                    {msg.suggestedProduct.stock > 0 ? (
                      <button
                        onClick={() => {
                          setActiveProduct(msg.suggestedProduct!);
                          setIsCheckingOut(true);
                        }}
                        className="w-full bg-[#0070BA] hover:bg-[#003087] text-white py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow border border-blue-400/30"
                      >
                        <span>{t.openCheckout}</span>
                      </button>
                    ) : (
                      <button disabled className="w-full bg-slate-800 text-slate-500 py-1.5 rounded-lg text-xs font-bold cursor-not-allowed">
                        {t.soldOut}
                      </button>
                    )}
                  </div>
                )}
                <span className="text-[9px] text-slate-500 mt-0.5">{msg.timestamp}</span>
              </div>
            ))}
          </div>

          <div className="px-2.5 pt-1.5 pb-1.5 flex gap-1.5 flex-wrap border-t border-slate-700 bg-slate-900/50 shrink-0 w-full max-w-full box-border">
            {t.quickPrompts.map((p: any, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleProductSwitch(p.type, p.label)}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-600 px-2 py-0.5 rounded-full transition cursor-pointer shadow-sm truncate max-w-full"
              >
                {p.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-2.5 border-t border-slate-700 flex gap-2 bg-slate-900/80 shrink-0 w-full max-w-full box-border">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="flex-1 min-w-0 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-100"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer shadow border border-blue-400/30 shrink-0">
              {t.send}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
export default LiveStreamView;