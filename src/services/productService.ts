import React, { useState, useRef, useEffect } from "react";
import PayPalCheckoutButton from "./PayPalCheckoutButton";
import { productService, ProductEntity, Language, CustomQARecord, OrderRecord, ChatMessage } from "../services/productService";

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
    inputPlaceholder: "메시지를 입력하세요...",
    send: "전송",
    openCheckout: "페이팔 SDK 결제 열기",
    adminPortalBtn: "🔒 관리자",
    adminTitle: "보안 관리자 대시보드 (PostgreSQL 연동)",
    adminSubtitle: "상품 사전 등록, 동영상 매핑, 실시간 재고 및 주문 관리",
    passwordPlaceholder: "비밀번호 (admin1234)",
    loginBtn: "로그인",
    loginError: "비밀번호가 올바르지 않습니다.",
    logoutBtn: "로그아웃",
    backToStore: "← 스토어로",
    tabInventory: "📦 상품 및 재고/동영상 관리",
    tabShipping: "🚚 배송 관리",
    tabQA: "💬 FAQ",
    totalRevenue: "총 매출",
    totalOrders: "총 주문",
    activeStock: "활성 재고",
    orderHistory: "주문 내역",
    noOrders: "주문 내역이 없습니다.",
    productNameCol: "상품명",
    priceCol: "가격",
    stockCol: "재고",
    videoAssetCol: "매핑 동영상",
    actionsCol: "관리",
    trackingViewTitle: "📦 주문 및 배송 추적",
    orderIdLabel: "주문 번호",
    shippingStatusLabel: "배송 상태",
    soundOn: "🔊 소리",
    soundOff: "🔇 음소거",
    lowStockWarning: "⚠️ [긴급] 재고 임박!",
    stockLeft: "남은 재고: ",
    unit: "개",
    addProductTitle: "➕ PostgreSQL 신규 상품 및 동영상 등록",
    newNameLabel: "상품명 (한국어)",
    newPriceLabel: "가격 (KRW)",
    newStockLabel: "초기 재고",
    newVideoLabel: "동영상 경로 (예: /videos/demo.mp4)",
    newIconLabel: "아이콘 이모지",
    registerBtn: "상품 및 동영상 DB 등록"
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
    inputPlaceholder: "Type a message...",
    send: "Send",
    openCheckout: "Open PayPal Checkout",
    adminPortalBtn: "🔒 Admin",
    adminTitle: "Admin Dashboard (PostgreSQL)",
    adminSubtitle: "Product registration, video mapping & inventory",
    passwordPlaceholder: "Password (admin1234)",
    loginBtn: "Login",
    loginError: "Incorrect password.",
    logoutBtn: "Logout",
    backToStore: "← Back",
    tabInventory: "📦 Products & Video Mapping",
    tabShipping: "🚚 Shipping",
    tabQA: "💬 FAQ",
    totalRevenue: "Revenue",
    totalOrders: "Orders",
    activeStock: "Stock",
    orderHistory: "Order History",
    noOrders: "No orders yet.",
    productNameCol: "Product",
    priceCol: "Price",
    stockCol: "Stock",
    videoAssetCol: "Video Asset",
    actionsCol: "Action",
    trackingViewTitle: "📦 Order & Tracking",
    orderIdLabel: "Order ID",
    shippingStatusLabel: "Status",
    soundOn: "🔊 Sound On",
    soundOff: "🔇 Muted",
    lowStockWarning: "⚠️ Low Stock!",
    stockLeft: "Stock: ",
    unit: "pcs",
    addProductTitle: "➕ Register New Product & Video",
    newNameLabel: "Product Name",
    newPriceLabel: "Price (KRW)",
    newStockLabel: "Stock",
    newVideoLabel: "Video Path (/videos/...) ",
    newIconLabel: "Icon",
    registerBtn: "Save to DB"
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
    adminPortalBtn: "🔒 管理者",
    adminTitle: "管理者ダッシュボード",
    adminSubtitle: "商品登録・動画マッピング・在庫管理",
    passwordPlaceholder: "パスワード",
    loginBtn: "ログイン",
    loginError: "パスワードが違います。",
    logoutBtn: "ログアウト",
    backToStore: "← 戻る",
    tabInventory: "📦 商品・動画管理",
    tabShipping: "🚚 配送",
    tabQA: "💬 FAQ",
    totalRevenue: "総売上",
    totalOrders: "注文数",
    activeStock: "在庫合計",
    orderHistory: "注文履歴",
    noOrders: "注文なし",
    productNameCol: "商品名",
    priceCol: "価格",
    stockCol: "在庫",
    videoAssetCol: "動画",
    actionsCol: "操作",
    trackingViewTitle: "📦 注文・配送追跡",
    orderIdLabel: "注文ID",
    shippingStatusLabel: "状態",
    soundOn: "🔊 音声ON",
    soundOff: "🔇 ミュート",
    lowStockWarning: "⚠️ 残りわずか！",
    stockLeft: "残り在庫: ",
    unit: "個",
    addProductTitle: "➕ 新規商品・動画マッピング登録",
    newNameLabel: "商品名",
    newPriceLabel: "価格",
    newStockLabel: "初期在庫",
    newVideoLabel: "動画パス",
    newIconLabel: "アイコン",
    registerBtn: "DBに登録"
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
    inputPlaceholder: "输入消息...",
    send: "发送",
    openCheckout: "打开结账",
    adminPortalBtn: "🔒 管理员",
    adminTitle: "管理后台",
    adminSubtitle: "商品注册、视频映射与库存管理",
    passwordPlaceholder: "密码",
    loginBtn: "登录",
    loginError: "密码错误",
    logoutBtn: "登出",
    backToStore: "← 返回",
    tabInventory: "📦 商品与视频管理",
    tabShipping: "🚚 物流",
    tabQA: "💬 FAQ",
    totalRevenue: "收入",
    totalOrders: "订单",
    activeStock: "库存",
    orderHistory: "历史",
    noOrders: "暂无订单",
    productNameCol: "商品",
    priceCol: "价格",
    stockCol: "库存",
    videoAssetCol: "视频",
    actionsCol: "操作",
    trackingViewTitle: "📦 订单追踪",
    orderIdLabel: "订单号",
    shippingStatusLabel: "状态",
    soundOn: "🔊 声音",
    soundOff: "🔇 静音",
    lowStockWarning: "⚠️ 库存告急！",
    stockLeft: "剩余库存: ",
    unit: "个",
    addProductTitle: "➕ 注册新商品与视频",
    newNameLabel: "商品名称",
    newPriceLabel: "价格",
    newStockLabel: "库存",
    newVideoLabel: "视频路径",
    newIconLabel: "图标",
    registerBtn: "保存至DB"
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
    inputPlaceholder: "Escribe...",
    send: "Enviar",
    openCheckout: "Abrir pago",
    adminPortalBtn: "🔒 Admin",
    adminTitle: "Admin Dashboard",
    adminSubtitle: "Registro de productos y videos",
    passwordPlaceholder: "Password",
    loginBtn: "Login",
    loginError: "Error",
    logoutBtn: "Logout",
    backToStore: "← Volver",
    tabInventory: "📦 Productos y Videos",
    tabShipping: "🚚 Envíos",
    tabQA: "💬 FAQ",
    totalRevenue: "Ingresos",
    totalOrders: "Pedidos",
    activeStock: "Stock",
    orderHistory: "Historial",
    noOrders: "Sin pedidos",
    productNameCol: "Producto",
    priceCol: "Precio",
    stockCol: "Stock",
    videoAssetCol: "Video",
    actionsCol: "Acción",
    trackingViewTitle: "📦 Seguimiento",
    orderIdLabel: "ID",
    shippingStatusLabel: "Estado",
    soundOn: "🔊 Sonido",
    soundOff: "🔇 Silencio",
    lowStockWarning: "⚠️ ¡Stock Bajo!",
    stockLeft: "Stock: ",
    unit: "pcs",
    addProductTitle: "➕ Registrar Producto y Video",
    newNameLabel: "Nombre",
    newPriceLabel: "Precio",
    newStockLabel: "Stock",
    newVideoLabel: "Video Path",
    newIconLabel: "Icon",
    registerBtn: "Guardar"
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
    inputPlaceholder: "Tapez...",
    send: "Envoyer",
    openCheckout: "Ouvrir",
    adminPortalBtn: "🔒 Admin",
    adminTitle: "Admin Dashboard",
    adminSubtitle: "Gestion des produits & vidéos",
    passwordPlaceholder: "Mot de passe",
    loginBtn: "Connexion",
    loginError: "Erreur",
    logoutBtn: "Déconnexion",
    backToStore: "← Retour",
    tabInventory: "📦 Produits & Vidéos",
    tabShipping: "🚚 Expéditions",
    tabQA: "💬 FAQ",
    totalRevenue: "Revenu",
    totalOrders: "Commandes",
    activeStock: "Stock",
    orderHistory: "Historique",
    noOrders: "Aucune",
    productNameCol: "Produit",
    priceCol: "Prix",
    stockCol: "Stock",
    videoAssetCol: "Vidéo",
    actionsCol: "Action",
    trackingViewTitle: "📦 Suivi",
    orderIdLabel: "ID",
    shippingStatusLabel: "Statut",
    soundOn: "🔊 Son",
    soundOff: "🔇 Muet",
    lowStockWarning: "⚠️ Stock Limité !",
    stockLeft: "Stock : ",
    unit: "pcs",
    addProductTitle: "➕ Enregistrer Produit & Vidéo",
    newNameLabel: "Nom",
    newPriceLabel: "Prix",
    newStockLabel: "Stock",
    newVideoLabel: "Chemin Vidéo",
    newIconLabel: "Icône",
    registerBtn: "Enregistrer"
  }
};

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

  // productService를 통한 동적 상품 데이터 로드
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [qaList, setQaList] = useState<CustomQARecord[]>(INITIAL_QA_LIST);

  // 신규 상품 등록 폼 상태
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("39000");
  const [newStock, setNewStock] = useState("10");
  const [newVideo, setNewVideo] = useState("/videos/honey_demo.mp4");
  const [newIcon, setNewIcon] = useState("🎁");

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
  const [activeProduct, setActiveProduct] = useState<ProductEntity | null>(null);
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);
  const [latestOrder, setLatestOrder] = useState<OrderRecord | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 초기 상품 목록 불러오기
  useEffect(() => {
    productService.getProducts().then(list => {
      setProducts(list);
      if (list.length > 0 && !activeProduct) {
        setActiveProduct(list[0]);
      }
    });
  }, []);

  // 자동 3초 뒤 결제 완료(추적) 창 닫기 타이머
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
    if (videoRef.current && activeProduct) {
      videoRef.current.muted = isAudioMuted;
      videoRef.current.play().catch(err => {
        console.warn("Video autoplay prevented:", err);
      });
    }
  }, [activeProduct, isAudioMuted]);

  const handleProductSwitch = (prod: ProductEntity) => {
    setActiveProduct(prod);
    setIsCheckingOut(false);

    const userText = `${prod.name[lang]} 추천해줘 ${prod.icon}`;
    const userMsg: ChatMessage = {
      id: Date.now().toString() + "-u",
      sender: "user",
      text: { ko: userText, en: userText, ja: userText, zh: userText, es: userText, fr: userText },
      timestamp: new Date().toLocaleTimeString()
    };

    const aiText = `선택하신 상품 동영상(${prod.videoUrl})과 실시간 재고 연동이 완료되었습니다!`;
    const aiMsg: ChatMessage = {
      id: Date.now().toString() + "-ai",
      sender: "ai",
      text: { ko: aiText, en: aiText, ja: aiText, zh: aiText, es: aiText, fr: aiText },
      timestamp: new Date().toLocaleTimeString(),
      suggestedProduct: prod
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const query = inputText.toLowerCase();
    const userMsg: ChatMessage = {
      id: Date.now().toString() + "-u",
      sender: "user",
      text: { ko: inputText, en: inputText, ja: inputText, zh: inputText, es: inputText, fr: inputText },
      timestamp: new Date().toLocaleTimeString()
    };

    let aiReplyText = `[AI 에이전트] "${inputText}" 문의가 접수되었습니다.`;
    let suggestedProd = undefined;

    const matchedProd = products.find(p => query.includes(p.id) || query.includes(p.name.ko.toLowerCase()) || query.includes("꿀") && p.id === "prod-001" || query.includes("차") && p.id === "prod-002");
    
    if (matchedProd) {
      setActiveProduct(matchedProd);
      aiReplyText = `선택하신 상품 동영상 매핑이 적용되었습니다: ${matchedProd.videoUrl}`;
      suggestedProd = matchedProd;
    } else if (query.includes("pay") || query.includes("결제")) {
      if (activeProduct && activeProduct.stock > 0) {
        setIsCheckingOut(true);
        aiReplyText = "페이팔 안전 결제창을 열어드렸습니다.";
      } else {
        aiReplyText = "품절되었거나 선택된 상품이 없습니다.";
      }
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

  const handlePaymentSuccess = (orderId: string, product: ProductEntity) => {
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

    productService.updateStock(product.id, product.stock - 1).then(updated => {
      setProducts(updated);
      const curr = updated.find(p => p.id === product.id);
      if (curr) setActiveProduct(curr);
    });
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

  const handleAddNewProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert("상품명을 입력하세요.");
      return;
    }
    const updatedList = await productService.addProduct({
      name: { ko: newName, en: newName, ja: newName, zh: newName, es: newName, fr: newName },
      price: Number(newPrice) || 35000,
      currency: "KRW",
      stock: Number(newStock) || 10,
      icon: newIcon || "📦",
      videoUrl: newVideo || "/videos/honey_demo.mp4",
      fallbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      description: { ko: "관리자가 등록한 신규 라이브 매핑 상품", en: "Newly registered live product", ja: "新商品", zh: "新商品", es: "Nuevo", fr: "Nouveau" }
    });
    setProducts(updatedList);
    setNewName("");
    alert("새로운 상품과 전용 동영상이 성공적으로 등록되었습니다!");
  };

  const updateProductStockState = async (id: string, stock: number) => {
    const updated = await productService.updateStock(id, stock);
    setProducts(updated);
  };

  const changeVideoMappingState = async (id: string) => {
    const newPath = prompt("매핑할 동영상 파일 경로를 입력하세요 (예: /videos/honey_demo.mp4):", "/videos/honey_demo.mp4");
    if (newPath) {
      const updated = await productService.updateVideoMapping(id, newPath);
      setProducts(updated);
      alert(`동영상 매핑이 변경되었습니다: ${newPath}`);
    }
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
                <h2 className="text-lg font-bold text-white mt-2">Admin Authentication</h2>
                <p className="text-xs text-slate-400 mt-1">PostgreSQL 상품 및 동영상 관리 로그인</p>
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
                {loginError && <p className="text-xs text-red-400 font-medium">{t.loginError}</p>}
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-bold transition shadow-lg cursor-pointer border border-blue-400/30">
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
                <button onClick={() => setIsAdminLoggedIn(false)} className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0">
                  {t.logoutBtn}
                </button>
              </div>

              {/* SECTION: Add New Product & Video Mapping */}
              <div className="bg-slate-900 border-2 border-amber-500/40 p-4 rounded-xl flex flex-col gap-4 shadow-xl w-full">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <span>✨</span> {t.addProductTitle}
                </h3>
                <form onSubmit={handleAddNewProductSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-3">
                    <label className="text-[11px] text-slate-400 mb-1 block">{t.newNameLabel}</label>
                    <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="예: 유기농 산딸기" className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-100" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] text-slate-400 mb-1 block">{t.newPriceLabel}</label>
                    <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-100" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] text-slate-400 mb-1 block">{t.newStockLabel}</label>
                    <input type="number" value={newStock} onChange={e => setNewStock(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-100" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-[11px] text-slate-400 mb-1 block">{t.newVideoLabel}</label>
                    <input type="text" value={newVideo} onChange={e => setNewVideo(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-amber-300 font-mono" />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white py-2 rounded text-xs font-bold transition shadow cursor-pointer">
                      {t.registerBtn}
                    </button>
                  </div>
                </form>
              </div>

              {/* SECTION: Product Inventory & Video Mapping Management */}
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
                            <span className="text-base">{prod.icon}</span> {prod.name[lang] || prod.name.ko}
                          </td>
                          <td className="py-3.5 text-slate-300">KRW {prod.price.toLocaleString()}</td>
                          <td className="py-3.5">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={prod.stock}
                                onChange={(e) => updateProductStockState(prod.id, Number(e.target.value))}
                                className="w-16 bg-slate-950 border border-slate-700 text-amber-400 font-bold rounded px-2 py-1 text-xs"
                              />
                              <span className="text-slate-400">{t.unit}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-amber-300 font-mono text-[11px]">{prod.videoUrl}</td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => changeVideoMappingState(prod.id)}
                              className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/40 px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer"
                            >
                              ⚙️ 동영상 재매핑
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Live Commerce Store View
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
        
        {/* Section 1: Video & Live Commerce Player */}
        <div className="md:col-span-7 relative min-h-[580px] md:h-full bg-slate-900/40 border border-slate-700/80 rounded-2xl p-3 shadow-xl flex flex-col w-full max-w-full box-border snap-start shrink-0">
          <div className="relative w-full h-[380px] md:h-[460px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center shadow-lg shrink-0">
            {activeProduct && (
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
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>

            <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-1">
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse uppercase tracking-wider shadow">
                ● {t.liveStream}
              </span>
              <span className="bg-black/70 backdrop-blur-md text-slate-200 text-[11px] px-2 py-0.5 rounded-md border border-slate-600 font-medium shadow">
                {t.marketName}
              </span>
            </div>

            <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5">
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="bg-black/80 hover:bg-black text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-600 backdrop-blur-md shadow-lg transition cursor-pointer flex items-center gap-1"
              >
                <span>{isAudioMuted ? t.soundOff : t.soundOn}</span>
              </button>

              {activeProduct && (
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border backdrop-blur-md shadow-lg ${activeProduct.stock <= 0 ? 'bg-red-600/90 text-white border-red-500' : activeProduct.stock <= 5 ? 'bg-amber-600/90 text-white border-amber-500 animate-pulse' : 'bg-black/80 text-amber-300 border-slate-600'}`}>
                  {activeProduct.stock <= 0 ? t.soldOut : `🔥 ${t.stockLeft}${activeProduct.stock}${t.unit}`}
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 flex-1 flex flex-col justify-end w-full max-w-full box-border">
            {activeProduct && !isCheckingOut && !latestOrder ? (
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
                    <p className="text-xs font-bold text-white truncate">{activeProduct.name[lang] || activeProduct.name.ko}</p>
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
                  <button disabled className="w-full sm:w-auto bg-slate-800 text-slate-500 px-4 py-2 rounded-lg text-xs font-bold cursor-not-allowed border border-slate-700 text-center">
                    {t.soldOut}
                  </button>
                )}
              </div>
            ) : isCheckingOut && activeProduct ? (
              <div className="bg-slate-900 border border-blue-500/70 p-3 rounded-xl shadow-xl animate-fadeIn w-full box-border">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold text-blue-400 flex items-center gap-1 truncate">
                    <span>💳</span> <span className="truncate">{t.secureCheckout}: {activeProduct.icon} {activeProduct.name[lang] || activeProduct.name.ko}</span>
                  </h3>
                  <button onClick={() => setIsCheckingOut(false)} className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer shrink-0">
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
                  <button onClick={() => setLatestOrder(null)} className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer shrink-0">
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
              </div>
            ) : null}

            {checkoutStatus && !latestOrder && (
              <div className="mt-2 p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-xs text-emerald-300 font-semibold text-center shadow">
                {checkoutStatus}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: AI Shopping Agent & Live Chat (Dynamic Product Buttons) */}
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
                          <p className="font-bold text-white truncate">{msg.suggestedProduct.name[lang] || msg.suggestedProduct.name.ko}</p>
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

          {/* Dynamic Product Buttons from Database / productService */}
          <div className="px-2.5 pt-1.5 pb-1.5 flex gap-1.5 flex-wrap border-t border-slate-700 bg-slate-900/50 shrink-0 w-full max-w-full box-border">
            {products.map((prod) => (
              <button
                key={prod.id}
                type="button"
                onClick={() => handleProductSwitch(prod)}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-600 px-2.5 py-1 rounded-full transition cursor-pointer shadow-sm flex items-center gap-1"
              >
                <span>{prod.icon}</span>
                <span>{prod.name[lang] || prod.name.ko}</span>
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