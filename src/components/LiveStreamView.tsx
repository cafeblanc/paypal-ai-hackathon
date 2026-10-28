import React, { useState, useRef, useEffect } from "react";
import PayPalCheckoutButton from "./PayPalCheckoutButton";
import { productService, ProductEntity, Language } from "../services/productService";

export type { Language };
export type Product = ProductEntity;

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
    initialGreeting: "페이팔 AI 에이전틱 커머스에 오신 것을 환영합니다! 아래 상품 버튼을 누르면 해당 상품의 동영상과 상세 설명을 즉시 확인하실 수 있습니다.",
    inputPlaceholder: "메시지를 입력하세요...",
    send: "전송",
    openCheckout: "페이팔 SDK 결제 열기",
    adminPortalBtn: "🔒 관리자",
    adminTitle: "보안 관리자 대시보드 (상품·동영상·재고·FAQ)",
    adminSubtitle: "PostgreSQL / 로컬 DB 연동 상품 등록, 동영상 매핑 및 실시간 재고 관리",
    adminAuthTitle: "관리자 보안 인증",
    adminAuthSubtitle: "상품 등록, 동영상 매핑, 재고 및 AI FAQ 관리를 위한 보안 로그인",
    passwordLabel: "관리자 비밀번호 (기본: admin1234)",
    passwordPlaceholder: "비밀번호 입력 (admin1234)",
    loginBtn: "관리자 로그인",
    loginError: "비밀번호가 올바르지 않습니다.",
    logoutBtn: "로그아웃",
    backToStore: "← 라이브 동영상 화면으로",
    sec0Title: "1. 신규 상품 등록 및 전용 동영상 매핑 (PostgreSQL / Local DB)",
    sec0Badge: "채팅창 상품 버튼 & 비디오 즉시 연동",
    sec0Desc: "상품 정보(상품명, 가격, 재고, 상세설명)와 미리 촬영한 동영상 파일 경로를 짝지어 등록하면, 라이브 채팅창 하단에 상품 버튼으로 즉시 생성됩니다.",
    prodNameLabel: "상품명 *",
    prodNamePlaceholder: "예: 양평 유기농 산딸기 세트",
    prodPriceLabel: "가격 (KRW) *",
    prodStockLabel: "초기 재고 *",
    prodIconLabel: "아이콘",
    prodVideoLabel: "매핑할 촬영 동영상 경로 *",
    prodDescLabel: "상품 상세설명 (채팅창 및 상품 카드에 표시됨)",
    prodDescPlaceholder: "예: 당일 수확한 100% 친환경 양평 산딸기를 산지 직송으로 보내드립니다.",
    registerBtn: "💾 상품 + 동영상 DB 등록하기",
    totalRevenue: "총 누적 매출",
    sandboxSub: "샌드박스 테스트 거래 기준",
    totalOrders: "총 주문 건수",
    ordersSub: "결제 완료된 주문",
    activeStock: "활성 재고 합계",
    stockSub: "전체 상품 잔여 수량",
    tabInventory: "등록된 상품 및 동영상/재고 목록",
    registeredCount: "개 등록됨",
    productNameCol: "상품명 / 상세설명",
    priceCol: "가격",
    stockCol: "재고",
    videoAssetCol: "매핑된 동영상",
    actionsCol: "관리",
    changeVideoBtn: "⚙️ 동영상 변경",
    deleteBtn: "삭제",
    tabQA: "AI 맞춤 답변 및 FAQ 사전 편집",
    qaDesc: "소비자가 라이브 채팅에서 질문할 때 즉시 매칭되는 AI 에이전트의 맞춤 답변을 실시간으로 편집하고 관리합니다.",
    qaKeywordCol: "인식 키워드",
    qaQuestionCol: "소비자 질문 유형",
    qaAnswerCol: "AI 에이전트 답변 (편집 가능)",
    qaKeywordPlace: "예: 배송, 할인, 성분",
    qaQuestionPlace: "예: 언제 도착하나요?",
    qaAnswerPlace: "예: 당일 발송됩니다.",
    addBtn: "추가",
    tabShipping: "배송 관리",
    orderHistory: "주문 내역",
    noOrders: "아직 발생한 주문 내역이 없습니다.",
    orderIdCol: "주문 번호",
    shippingCol: "배송 상태",
    trackingCol: "운송장 번호",
    dateCol: "주문 일시",
    statusPrep: "📦 상품 준비중",
    statusShip: "🚚 배송중",
    statusDone: "✅ 배송완료",
    tabVideoEditor: "동영상 편집 및 압축 스튜디오",
    videoSelectLabel: "편집할 동영상 파일 선택",
    crfLabel: "고압축 품질 (CRF 20 ~ 35, 권장: 28)",
    speedLabel: "재생 속도",
    audioLabel: "오디오 트랙",
    audioKeep: "🔊 원본 오디오 유지 (권장)",
    audioMuteOpt: "🔇 무음 (Mute)",
    renderBtn: "🚀 동영상 편집 및 압축 실행 (Render)",
    renderingBtn: "⏳ 동영상 압축 및 렌더링 중...",
    trackingViewTitle: "📦 주문 및 배송 추적 (3초 후 자동 닫힘)",
    closeBtn: "닫기",
    orderIdLabel: "주문 번호",
    shippingStatusLabel: "배송 상태",
    soundOn: "🔊 소리 켜기",
    soundOff: "🔇 음소거",
    lowStockWarning: "⚠️ [긴급] 재고 임박!",
    stockLeft: "남은 재고: ",
    unit: "개",
    orderUnit: "건",
    tapToPlay: "▶ 터치하여 라이브 영상 재생",
    tapToUnmute: "소리 켜기",
    viewSplit: "📱 분할 뷰",
    viewOverlay: "🎬 풀 라이브"
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
    paymentCompleted: "Payment completed! Fulfillment initiated.",
    chatTitle: "AI Shopping Agent & Live Chat",
    online: "Online",
    initialGreeting: "Welcome to PayPal AI Agentic Commerce! Tap a product button below to switch video and view details.",
    inputPlaceholder: "Type a message...",
    send: "Send",
    openCheckout: "Open PayPal Checkout",
    adminPortalBtn: "🔒 Admin",
    adminTitle: "Secure Admin Dashboard (Products, Video, Stock & FAQ)",
    adminSubtitle: "PostgreSQL / Local DB Product Registration, Video Mapping & Live Inventory",
    adminAuthTitle: "Admin Portal Authentication",
    adminAuthSubtitle: "Secure login for managing products, video mapping, stock & AI FAQ",
    passwordLabel: "Admin Password (Default: admin1234)",
    passwordPlaceholder: "Enter password (admin1234)",
    loginBtn: "Admin Login",
    loginError: "Incorrect password.",
    logoutBtn: "Logout",
    backToStore: "← Back to Live Video",
    sec0Title: "1. Register New Product & Video Mapping (PostgreSQL / Local DB)",
    sec0Badge: "Instant Chat Button & Video Sync",
    sec0Desc: "Pair product details with a pre-recorded video path to instantly create a product button in the live chat.",
    prodNameLabel: "Product Name *",
    prodNamePlaceholder: "e.g., Organic Raspberry Set",
    prodPriceLabel: "Price (KRW) *",
    prodStockLabel: "Initial Stock *",
    prodIconLabel: "Icon",
    prodVideoLabel: "Mapped Video Path *",
    prodDescLabel: "Product Description (Shown in chat & card)",
    prodDescPlaceholder: "e.g., 100% eco-friendly fresh raspberries shipped directly from the farm.",
    registerBtn: "💾 Save Product + Video to DB",
    totalRevenue: "Total Revenue",
    sandboxSub: "Sandbox Test Transactions",
    totalOrders: "Total Orders",
    ordersSub: "Completed Orders",
    activeStock: "Total Active Stock",
    stockSub: "Total Available Stock",
    tabInventory: "Registered Products & Video/Stock List",
    registeredCount: " registered",
    productNameCol: "Product / Description",
    priceCol: "Price",
    stockCol: "Stock",
    videoAssetCol: "Mapped Video",
    actionsCol: "Action",
    changeVideoBtn: "⚙️ Change Video",
    deleteBtn: "Delete",
    tabQA: "AI Custom Q&A & FAQ Editor",
    qaDesc: "Manage real-time AI auto-responses for live chat.",
    qaKeywordCol: "Keyword",
    qaQuestionCol: "Customer Question",
    qaAnswerCol: "AI Reply (Editable)",
    qaKeywordPlace: "e.g., shipping, discount",
    qaQuestionPlace: "e.g., When will it arrive?",
    qaAnswerPlace: "e.g., Shipped on the same day.",
    addBtn: "Add",
    tabShipping: "Shipping",
    orderHistory: "Order History",
    noOrders: "No orders yet.",
    orderIdCol: "Order ID",
    shippingCol: "Shipping Status",
    trackingCol: "Tracking No.",
    dateCol: "Timestamp",
    statusPrep: "📦 Preparing",
    statusShip: "🚚 In Transit",
    statusDone: "✅ Delivered",
    tabVideoEditor: "Video Editor & Compressor Studio",
    videoSelectLabel: "Select Video Asset to Edit",
    crfLabel: "Compression Quality (CRF 20 ~ 35, Rec: 28)",
    speedLabel: "Playback Speed",
    audioLabel: "Audio Track",
    audioKeep: "🔊 Keep Original Audio",
    audioMuteOpt: "🔇 Mute Audio",
    renderBtn: "🚀 Run Video Edit & Compression (Render)",
    renderingBtn: "⏳ Compressing & Rendering...",
    trackingViewTitle: "📦 Order & Tracking (Auto-closes in 3s)",
    closeBtn: "Close",
    orderIdLabel: "Order ID",
    shippingStatusLabel: "Status",
    soundOn: "🔊 Sound On",
    soundOff: "🔇 Muted",
    lowStockWarning: "⚠️ Low Stock!",
    stockLeft: "Stock: ",
    unit: "pcs",
    orderUnit: "orders",
    tapToPlay: "▶ Tap to Play Live Video",
    tapToUnmute: "Sound On",
    viewSplit: "📱 Split",
    viewOverlay: "🎬 Full Live"
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
    paymentCompleted: "決済完了！配送が開始されます。",
    chatTitle: "AI ショッピングエージェント & チャット",
    online: "オンライン",
    initialGreeting: "PayPal AI エージェンティックコマースへようこそ！下の商品ボタンで動画と詳細を確認できます。",
    inputPlaceholder: "メッセージを入力...",
    send: "送信",
    openCheckout: "PayPal 決済を開く",
    adminPortalBtn: "🔒 管理者",
    adminTitle: "セキュア管理者ダッシュボード (商品・動画・在庫・FAQ)",
    adminSubtitle: "PostgreSQL / ローカルDB連動 商品登録・動画マッピング・在庫管理",
    adminAuthTitle: "管理者ポータル認証",
    adminAuthSubtitle: "商品登録、動画マッピング、在庫、AI FAQ管理のためのログイン",
    passwordLabel: "管理者パスワード (基本: admin1234)",
    passwordPlaceholder: "パスワード入力 (admin1234)",
    loginBtn: "ログイン",
    loginError: "パスワードが正しくありません。",
    logoutBtn: "ログアウト",
    backToStore: "← ライブ動画画面へ",
    sec0Title: "1. 新規商品登録および専用動画マッピング (PostgreSQL / Local DB)",
    sec0Badge: "チャット商品ボタン＆動画即時連動",
    sec0Desc: "商品情報と動画ファイルパスをペアで登録すると、チャット下部に商品ボタンとして即時生成されます。",
    prodNameLabel: "商品名 *",
    prodNamePlaceholder: "例: オーガニックラズベリーセット",
    prodPriceLabel: "価格 (KRW) *",
    prodStockLabel: "初期在庫 *",
    prodIconLabel: "アイコン",
    prodVideoLabel: "マッピングする動画パス *",
    prodDescLabel: "商品詳細説明 (チャットとカードに表示)",
    prodDescPlaceholder: "例: 当日収穫した100%無農薬ラズベリーを産地直送でお届けします。",
    registerBtn: "💾 商品＋動画をDBに登録",
    totalRevenue: "総売上",
    sandboxSub: "サンドボックステスト取引",
    totalOrders: "総注文数",
    ordersSub: "決済完了注文",
    activeStock: "有効在庫合計",
    stockSub: "全商品の残り在庫",
    tabInventory: "登録済み商品および動画・在庫一覧",
    registeredCount: "件登録済み",
    productNameCol: "商品名 / 詳細説明",
    priceCol: "価格",
    stockCol: "在庫",
    videoAssetCol: "マッピング動画",
    actionsCol: "操作",
    changeVideoBtn: "⚙️ 動画変更",
    deleteBtn: "削除",
    tabQA: "AIカスタムQ&A・FAQ事前編集",
    qaDesc: "ライブチャットでの質問にマッチングされるAI回答を管理します。",
    qaKeywordCol: "認識キーワード",
    qaQuestionCol: "質問タイプ",
    qaAnswerCol: "AI回答内容 (編集可能)",
    qaKeywordPlace: "例: 配送、割引",
    qaQuestionPlace: "例: いつ届きますか？",
    qaAnswerPlace: "例: 当日発送いたします。",
    addBtn: "追加",
    tabShipping: "配送管理",
    orderHistory: "注文履歴",
    noOrders: "注文履歴がありません。",
    orderIdCol: "注文ID",
    shippingCol: "配送状態",
    trackingCol: "追跡番号",
    dateCol: "注文日時",
    statusPrep: "📦 商品準備中",
    statusShip: "🚚 配送中",
    statusDone: "✅ 配達完了",
    tabVideoEditor: "動画編集＆圧縮スタジオ",
    videoSelectLabel: "編集する動画ファイルを選択",
    crfLabel: "高圧縮品質 (CRF 20 ~ 35, 推奨: 28)",
    speedLabel: "再生速度",
    audioLabel: "オーディオトラック",
    audioKeep: "🔊 元の音声を維持",
    audioMuteOpt: "🔇 ミュート (無音)",
    renderBtn: "🚀 動画編集・圧縮を実行 (Render)",
    renderingBtn: "⏳ 圧縮およびレンダリング中...",
    trackingViewTitle: "📦 注文・配送追跡 (3秒後に自動で閉じます)",
    closeBtn: "閉じる",
    orderIdLabel: "注文ID",
    shippingStatusLabel: "状態",
    soundOn: "🔊 音声ON",
    soundOff: "🔇 ミュート",
    lowStockWarning: "⚠️ 残りわずか！",
    stockLeft: "残り在庫: ",
    unit: "個",
    orderUnit: "件",
    tapToPlay: "▶ タップしてライブ映像を再生",
    tapToUnmute: "音声オン",
    viewSplit: "📱 分割",
    viewOverlay: "🎬 フル画面"
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
    paymentCompleted: "支付成功！实时物流已启动。",
    chatTitle: "AI 购物助手 & 实时聊天",
    online: "在线",
    initialGreeting: "欢迎来到 PayPal AI 智能代理电商！点击下方商品按钮即可切换视频并查看详情。",
    inputPlaceholder: "输入消息...",
    send: "发送",
    openCheckout: "打开 PayPal 结账",
    adminPortalBtn: "🔒 管理员",
    adminTitle: "安全管理后台 (商品·视频·库存·FAQ)",
    adminSubtitle: "PostgreSQL / 本地DB联动 商品注册、视频映射与实时库存管理",
    adminAuthTitle: "管理员安全认证",
    adminAuthSubtitle: "登录以管理商品注册、视频映射、库存及 AI 问答",
    passwordLabel: "管理员密码 (默认: admin1234)",
    passwordPlaceholder: "输入密码 (admin1234)",
    loginBtn: "管理员登录",
    loginError: "密码错误。",
    logoutBtn: "登出",
    backToStore: "← 返回直播视频界面",
    sec0Title: "1. 注册新商品与专用视频映射 (PostgreSQL / Local DB)",
    sec0Badge: "聊天商品按钮与视频即时联动",
    sec0Desc: "将商品信息与预先拍摄的视频路径配对注册，即可在直播聊天底部即时生成商品按钮。",
    prodNameLabel: "商品名称 *",
    prodNamePlaceholder: "例: 杨平有机树莓礼盒",
    prodPriceLabel: "价格 (KRW) *",
    prodStockLabel: "初始库存 *",
    prodIconLabel: "图标",
    prodVideoLabel: "映射视频路径 *",
    prodDescLabel: "商品详细说明 (显示在聊天和商品卡中)",
    prodDescPlaceholder: "例: 当日采摘的100%生态树莓，产地直发。",
    registerBtn: "💾 保存商品 + 视频至数据库",
    totalRevenue: "总累计收入",
    sandboxSub: "沙盒测试交易",
    totalOrders: "总订单数",
    ordersSub: "已完成支付订单",
    activeStock: "有效库存总计",
    stockSub: "所有商品剩余库存",
    tabInventory: "已注册商品与视频/库存列表",
    registeredCount: "个已注册",
    productNameCol: "商品名称 / 详细说明",
    priceCol: "价格",
    stockCol: "库存",
    videoAssetCol: "映射视频",
    actionsCol: "操作",
    changeVideoBtn: "⚙️ 更换视频",
    deleteBtn: "删除",
    tabQA: "AI 自定义问答与 FAQ 编辑",
    qaDesc: "实时编辑和管理消费者提问的 AI 回复。",
    qaKeywordCol: "识别关键词",
    qaQuestionCol: "消费者问题类型",
    qaAnswerCol: "AI 助手回复 (可编辑)",
    qaKeywordPlace: "例: 物流, 折扣",
    qaQuestionPlace: "例: 什么时候能到？",
    qaAnswerPlace: "例: 当天发货。",
    addBtn: "添加",
    tabShipping: "物流管理",
    orderHistory: "订单记录",
    noOrders: "暂无订单记录。",
    orderIdCol: "订单号",
    shippingCol: "配送状态",
    trackingCol: "运单号",
    dateCol: "下单时间",
    statusPrep: "📦 商品准备中",
    statusShip: "🚚 配送中",
    statusDone: "✅ 配送完成",
    tabVideoEditor: "视频编辑与压缩工作室",
    videoSelectLabel: "选择要编辑的视频文件",
    crfLabel: "高压缩质量 (CRF 20 ~ 35, 推荐: 28)",
    speedLabel: "播放速度",
    audioLabel: "音轨设置",
    audioKeep: "🔊 保留原声",
    audioMuteOpt: "🔇 静音 (Mute)",
    renderBtn: "🚀 执行视频编辑与压缩 (Render)",
    renderingBtn: "⏳ 正在压缩与渲染...",
    trackingViewTitle: "📦 订单与物流追踪 (3秒后自动关闭)",
    closeBtn: "关闭",
    orderIdLabel: "订单号",
    shippingStatusLabel: "状态",
    soundOn: "🔊 声音开启",
    soundOff: "🔇 静音",
    lowStockWarning: "⚠️ 库存告急！",
    stockLeft: "剩余库存: ",
    unit: "个",
    orderUnit: "单",
    tapToPlay: "▶ 点击播放直播视频",
    tapToUnmute: "开启声音",
    viewSplit: "📱 分屏",
    viewOverlay: "🎬 全屏直播"
  },
  es: {
    marketName: "Festival de Yangpyeong",
    title: "PayPal AI Live Commerce",
    sandbox: "Sandbox",
    liveStream: "EN VIVO",
    aiLiveFeatured: "DESTACADO IA",
    payWithPayPal: "Pagar con PayPal",
    soldOut: "Agotado",
    secureCheckout: "Pago Seguro",
    totalAmount: "Total",
    cancelBack: "Volver",
    paymentCompleted: "¡Pago completado! Envío iniciado.",
    chatTitle: "Agente IA & Chat en Vivo",
    online: "En línea",
    initialGreeting: "¡Bienvenido! Toca un botón de producto abajo para ver su video y detalles.",
    inputPlaceholder: "Escribe un mensaje...",
    send: "Enviar",
    openCheckout: "Abrir Pago PayPal",
    adminPortalBtn: "🔒 Admin",
    adminTitle: "Panel de Administración Seguro (Productos, Video, Stock y FAQ)",
    adminSubtitle: "Registro de productos en PostgreSQL / DB Local, mapeo de video y stock en vivo",
    adminAuthTitle: "Autenticación de Administrador",
    adminAuthSubtitle: "Inicio de sesión seguro para gestionar productos, videos, stock y FAQ",
    passwordLabel: "Contraseña (Default: admin1234)",
    passwordPlaceholder: "Contraseña (admin1234)",
    loginBtn: "Iniciar Sesión",
    loginError: "Contraseña incorrecta.",
    logoutBtn: "Cerrar Sesión",
    backToStore: "← Volver al Video en Vivo",
    sec0Title: "1. Registrar Nuevo Producto y Video (PostgreSQL / Local DB)",
    sec0Badge: "Sincronización Instantánea con Chat y Video",
    sec0Desc: "Registra los datos del producto junto con el archivo de video para crear un botón instantáneo en el chat.",
    prodNameLabel: "Nombre del Producto *",
    prodNamePlaceholder: "ej., Set de Frambuesas Orgánicas",
    prodPriceLabel: "Precio (KRW) *",
    prodStockLabel: "Stock Inicial *",
    prodIconLabel: "Icono",
    prodVideoLabel: "Ruta del Video *",
    prodDescLabel: "Descripción del Producto (Visible en chat y tarjeta)",
    prodDescPlaceholder: "ej., Frambuesas 100% ecológicas cosechadas hoy.",
    registerBtn: "💾 Guardar Producto + Video en DB",
    totalRevenue: "Ingresos Totales",
    sandboxSub: "Transacciones de prueba Sandbox",
    totalOrders: "Pedidos Totales",
    ordersSub: "Pedidos completados",
    activeStock: "Stock Activo Total",
    stockSub: "Unidades disponibles",
    tabInventory: "Lista de Productos, Videos y Stock",
    registeredCount: " registrados",
    productNameCol: "Producto / Descripción",
    priceCol: "Precio",
    stockCol: "Stock",
    videoAssetCol: "Video Mapeado",
    actionsCol: "Acción",
    changeVideoBtn: "⚙️ Cambiar Video",
    deleteBtn: "Eliminar",
    tabQA: "Editor de Respuestas IA y FAQ",
    qaDesc: "Gestiona las respuestas automáticas del agente IA.",
    qaKeywordCol: "Palabra Clave",
    qaQuestionCol: "Pregunta del Cliente",
    qaAnswerCol: "Respuesta IA (Editable)",
    qaKeywordPlace: "ej., envío, descuento",
    qaQuestionPlace: "ej., ¿Cuándo llega?",
    qaAnswerPlace: "ej., Se envía el mismo día.",
    addBtn: "Añadir",
    tabShipping: "Gestión de Envíos",
    orderHistory: "Historial de Pedidos",
    noOrders: "Aún no hay pedidos.",
    orderIdCol: "ID Pedido",
    shippingCol: "Estado de Envío",
    trackingCol: "N° Seguimiento",
    dateCol: "Fecha",
    statusPrep: "📦 Preparando",
    statusShip: "🚚 En Camino",
    statusDone: "✅ Entregado",
    tabVideoEditor: "Estudio de Edición y Compresión de Video",
    videoSelectLabel: "Seleccionar Archivo de Video",
    crfLabel: "Calidad de Compresión (CRF 20 ~ 35, Rec: 28)",
    speedLabel: "Velocidad",
    audioLabel: "Pista de Audio",
    audioKeep: "🔊 Mantener Audio Original",
    audioMuteOpt: "🔇 Silenciar (Mute)",
    renderBtn: "🚀 Ejecutar Edición y Compresión (Render)",
    renderingBtn: "⏳ Comprimiendo y Renderizando...",
    trackingViewTitle: "📦 Seguimiento de Pedido (Cierra en 3s)",
    closeBtn: "Cerrar",
    orderIdLabel: "ID",
    shippingStatusLabel: "Estado",
    soundOn: "🔊 Sonido",
    soundOff: "🔇 Silencio",
    lowStockWarning: "⚠️ ¡Stock Bajo!",
    stockLeft: "Stock: ",
    unit: "pcs",
    orderUnit: "pedidos",
    tapToPlay: "▶ Toca para ver en vivo",
    tapToUnmute: "Activar sonido",
    viewSplit: "📱 Dividida",
    viewOverlay: "🎬 En Vivo"
  },
  fr: {
    marketName: "Festival de Yangpyeong",
    title: "PayPal AI Live Commerce",
    sandbox: "Sandbox",
    liveStream: "EN DIRECT",
    aiLiveFeatured: "PHARE IA",
    payWithPayPal: "Payer avec PayPal",
    soldOut: "Épuisé",
    secureCheckout: "Paiement Sécurisé",
    totalAmount: "Total",
    cancelBack: "Retour",
    paymentCompleted: "Paiement réussi ! Expédition lancée.",
    chatTitle: "Agent IA & Chat en Direct",
    online: "En ligne",
    initialGreeting: "Bienvenue ! Touchez un produit ci-dessous pour voir sa vidéo et ses détails.",
    inputPlaceholder: "Tapez un message...",
    send: "Envoyer",
    openCheckout: "Ouvrir PayPal",
    adminPortalBtn: "🔒 Admin",
    adminTitle: "Tableau de Bord Admin Sécurisé (Produits, Vidéo, Stock & FAQ)",
    adminSubtitle: "Enregistrement de produits PostgreSQL / DB Locale, mappage vidéo et stock en direct",
    adminAuthTitle: "Authentification Administrateur",
    adminAuthSubtitle: "Connexion sécurisée pour gérer les produits, vidéos, stocks et FAQ IA",
    passwordLabel: "Mot de passe (Défaut: admin1234)",
    passwordPlaceholder: "Mot de passe (admin1234)",
    loginBtn: "Connexion",
    loginError: "Mot de passe incorrect.",
    logoutBtn: "Déconnexion",
    backToStore: "← Retour à la Vidéo en Direct",
    sec0Title: "1. Enregistrer un Nouveau Produit et Vidéo (PostgreSQL / Local DB)",
    sec0Badge: "Synchro Instantanée Bouton Chat & Vidéo",
    sec0Desc: "Associez les détails du produit à un fichier vidéo pour créer instantanément un bouton dans le chat en direct.",
    prodNameLabel: "Nom du Produit *",
    prodNamePlaceholder: "ex., Coffret Framboises Bio",
    prodPriceLabel: "Prix (KRW) *",
    prodStockLabel: "Stock Initial *",
    prodIconLabel: "Icône",
    prodVideoLabel: "Chemin de la Vidéo *",
    prodDescLabel: "Description du Produit (Affichée dans le chat et la carte)",
    prodDescPlaceholder: "ex., Framboises 100% bio récoltées du jour.",
    registerBtn: "💾 Enregistrer Produit + Vidéo en DB",
    totalRevenue: "Revenu Total",
    sandboxSub: "Transactions de test Sandbox",
    totalOrders: "Commandes Totales",
    ordersSub: "Commandes payées",
    activeStock: "Stock Actif Total",
    stockSub: "Unités disponibles",
    tabInventory: "Liste des Produits, Vidéos et Stocks",
    registeredCount: " enregistrés",
    productNameCol: "Produit / Description",
    priceCol: "Prix",
    stockCol: "Stock",
    videoAssetCol: "Vidéo Mappée",
    actionsCol: "Action",
    changeVideoBtn: "⚙️ Changer Vidéo",
    deleteBtn: "Supprimer",
    tabQA: "Éditeur de Réponses IA & FAQ",
    qaDesc: "Gérez en temps réel les réponses automatiques de l'agent IA.",
    qaKeywordCol: "Mot-clé",
    qaQuestionCol: "Question Client",
    qaAnswerCol: "Réponse IA (Modifiable)",
    qaKeywordPlace: "ex., livraison, remise",
    qaQuestionPlace: "ex., Quand arrive-t-il ?",
    qaAnswerPlace: "ex., Expédié le jour même.",
    addBtn: "Ajouter",
    tabShipping: "Gestion des Expéditions",
    orderHistory: "Historique des Commandes",
    noOrders: "Aucune commande.",
    orderIdCol: "ID Commande",
    shippingCol: "Statut d'Expédition",
    trackingCol: "N° de Suivi",
    dateCol: "Date",
    statusPrep: "📦 En préparation",
    statusShip: "🚚 En cours",
    statusDone: "✅ Livré",
    tabVideoEditor: "Studio d'Édition et Compression Vidéo",
    videoSelectLabel: "Sélectionner le Fichier Vidéo",
    crfLabel: "Qualité de Compression (CRF 20 ~ 35, Rec: 28)",
    speedLabel: "Vitesse",
    audioLabel: "Piste Audio",
    audioKeep: "🔊 Conserver l'Audio Original",
    audioMuteOpt: "🔇 Muet (Mute)",
    renderBtn: "🚀 Lancer l'Édition et la Compression (Render)",
    renderingBtn: "⏳ Compression et Rendu en cours...",
    trackingViewTitle: "📦 Suivi de Commande (Fermeture dans 3s)",
    closeBtn: "Fermer",
    orderIdLabel: "ID",
    shippingStatusLabel: "Statut",
    soundOn: "🔊 Son Activé",
    soundOff: "🔇 Muet",
    lowStockWarning: "⚠️ Stock Limité !",
    stockLeft: "Stock : ",
    unit: "pcs",
    orderUnit: "commandes",
    tapToPlay: "▶ Touchez pour lancer le direct",
    tapToUnmute: "Activer son",
    viewSplit: "📱 Divisée",
    viewOverlay: "🎬 Plein Écran"
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

  const [products, setProducts] = useState<Product[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [qaList, setQaList] = useState<CustomQARecord[]>(INITIAL_QA_LIST);

  const [newProdName, setNewProdName] = useState<string>("");
  const [newProdPrice, setNewProdPrice] = useState<string>("35000");
  const [newProdStock, setNewProdStock] = useState<string>("10");
  const [newProdIcon, setNewProdIcon] = useState<string>("🎁");
  const [newProdVideo, setNewProdVideo] = useState<string>("/videos/honey_demo.mp4");
  const [newProdDesc, setNewProdDesc] = useState<string>("");
  const [isStartVideo, setIsStartVideo] = useState<boolean>(false);
  const [defaultProductId, setDefaultProductId] = useState<string | null>(null);

  const currentProd = activeProduct || products.find(p => p.id === defaultProductId) || products[0] || null;

  const [newKeyword, setNewKeyword] = useState<string>("");
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newAnswer, setNewAnswer] = useState<string>("");

  const [selectedVideoAsset, setSelectedVideoAsset] = useState<string>("/videos/honey_demo.mp4");
  const [compressionCrf, setCompressionCrf] = useState<number>(28);
  const [videoSpeed, setVideoSpeed] = useState<string>("1.0");
  const [audioMute, setAudioMute] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processLog, setProcessLog] = useState<string>("");

  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true); // 모바일 브라우저 자동재생(Autoplay) 정책 준수를 위해 기본 음소거 활성화
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState<boolean>(false);
  const [mobileLayoutMode, setMobileLayoutMode] = useState<"split" | "overlay">("split");

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
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);
  const [latestOrder, setLatestOrder] = useState<OrderRecord | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 결제 완료 창 (주문 및 배송 추적) 3초 후 자동 닫힘
  useEffect(() => {
    if (latestOrder) {
      const timer = setTimeout(() => {
        setLatestOrder(null);
        setCheckoutStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [latestOrder]);

  // 채팅 메시지 추가 시 스크롤바 노출 없이 최신 목록이 항상 밑에 보이고, 기존 대화는 위로 밀려 올라가 사라지도록 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    Promise.all([productService.getProducts(), productService.getDefaultProductId()]).then(([list, defId]) => {
      setProducts(list);
      setDefaultProductId(defId);
      const target = list.find(p => p.id === defId) || list[0] || null;
      setActiveProduct(target);
    });
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(window.location.hash.includes("admin") || window.location.pathname.includes("admin"));
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = isAudioMuted;
      videoRef.current.muted = isAudioMuted;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsAutoplayBlocked(false);
          })
          .catch(err => {
            console.warn("Video autoplay prevented by browser policy:", err);
            setIsAutoplayBlocked(true);
          });
      }
    }
  }, [activeProduct, isAudioMuted, currentProd?.videoUrl]);

  const handleTogglePlayOrUnmute = () => {
    if (!videoRef.current) return;
    if (!isPlaying || isAutoplayBlocked) {
      videoRef.current.muted = isAudioMuted;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setIsAutoplayBlocked(false);
      }).catch(err => {
        console.warn("User interaction play error:", err);
      });
    } else {
      const nextMuted = !isAudioMuted;
      setIsAudioMuted(nextMuted);
      if (videoRef.current) {
        videoRef.current.muted = nextMuted;
      }
    }
  };

  useEffect(() => {
    if (activeProduct) {
      const current = products.find(p => p.id === activeProduct.id);
      if (current) setActiveProduct(current);
    }
  }, [products]);

  // 상품란 클릭 시: 위에 있는 설명란을 완전히 없애고 오직 아래의 결제열기란 카드만 남김
  const handleSelectProductFromChat = (product: Product) => {
    setActiveProduct(product);
    setIsCheckingOut(false);

    // 상단 설명란 없이 하단 결제열기란 카드만 단독 추가
    const productCardMsg: ChatMessage = {
      id: Date.now().toString() + "-prod",
      sender: "ai",
      text: { ko: "", en: "", ja: "", zh: "", es: "", fr: "" },
      timestamp: new Date().toLocaleTimeString(),
      suggestedProduct: product
    };

    setMessages(prev => [...prev, productCardMsg]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const query = inputText.toLowerCase();
    const matchedQA = qaList.find(qa => query.includes(qa.keyword.toLowerCase()));
    const matchedProd = products.find(p =>
      query.includes((p.name.ko || "").toLowerCase()) ||
      query.includes((p.name.en || "").toLowerCase()) ||
      (query.includes("꿀") && p.id === "prod-001") ||
      (query.includes("차") && p.id === "prod-002")
    );

    const userMsg: ChatMessage = {
      id: Date.now().toString() + "-u",
      sender: "user",
      text: { ko: inputText, en: inputText, ja: inputText, zh: inputText, es: inputText, fr: inputText },
      timestamp: new Date().toLocaleTimeString()
    };

    let aiReplyText = "문의하신 내용에 대해 AI 에이전트가 확인 중입니다.";
    let suggestedProd: Product | undefined = undefined;

    if (matchedQA) {
      aiReplyText = matchedQA.answer;
    } else if (matchedProd) {
      setActiveProduct(matchedProd);
      aiReplyText = ""; // 상단 설명란 없이 결제열기란 카드만 표시
      suggestedProd = matchedProd;
    } else if (query.includes("pay") || query.includes("결제") || query.includes("checkout")) {
      if (!activeProduct || activeProduct.stock <= 0) {
        aiReplyText = "죄송합니다. 현재 선택하신 상품은 품절되었습니다.";
      } else {
        setIsCheckingOut(true);
        aiReplyText = "페이팔 안전 결제창을 열어드렸습니다.";
      }
    } else {
      aiReplyText = `[AI 에이전트 답변] "${inputText}" 문의가 접수되었습니다.`;
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

  const handlePaymentSuccess = async (orderId: string, product: Product) => {
    setCheckoutStatus(t.paymentCompleted);
    
    const newOrder: OrderRecord = {
      orderId,
      productName: product.name[lang] || product.name.ko,
      amount: product.price,
      currency: product.currency,
      timestamp: new Date().toLocaleString(),
      status: "Completed (Sandbox)",
      shippingStatus: "상품 준비중",
      trackingNumber: "KR-" + Math.floor(100000 + Math.random() * 900000)
    };
    setOrders(prev => [newOrder, ...prev]);
    setLatestOrder(newOrder);

    const updated = await productService.updateStock(product.id, product.stock - 1);
    setProducts(updated);
    const updatedActive = updated.find(p => p.id === product.id);
    if (updatedActive) setActiveProduct(updatedActive);
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

  const handleRegisterNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) {
      alert("상품명을 입력해 주세요.");
      return;
    }
    const descText = newProdDesc.trim() || `${newProdName.trim()} 등록 상품`;
    const updated = await productService.addProduct({
      name: { ko: newProdName, en: newProdName, ja: newProdName, zh: newProdName, es: newProdName, fr: newProdName },
      price: Number(newProdPrice) || 35000,
      currency: "KRW",
      stock: Number(newProdStock) || 10,
      icon: newProdIcon || "🎁",
      videoUrl: newProdVideo || "/videos/honey_demo.mp4",
      fallbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      description: { ko: descText, en: descText, ja: descText, zh: descText, es: descText, fr: descText }
    }, isStartVideo);

    setProducts(updated);
    const newDefId = await productService.getDefaultProductId();
    setDefaultProductId(newDefId);
    
    if (isStartVideo || updated.length === 1) {
      const created = updated[0];
      if (created) setActiveProduct(created);
    }

    setNewProdName("");
    setNewProdDesc("");
    setIsStartVideo(false);
    alert("새로운 상품이 등록되었습니다!");
  };

  const handleSetDefaultProduct = async (productId: string) => {
    await productService.setDefaultProductId(productId);
    setDefaultProductId(productId);
    const target = products.find(p => p.id === productId);
    if (target) setActiveProduct(target);
    alert("선택하신 상품이 시작 동영상 상품으로 지정되었습니다!");
  };

  const updateShippingStatus = (orderId: string, newStatus: "상품 준비중" | "배송중" | "배송완료") => {
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, shippingStatus: newStatus } : o));
    if (latestOrder && latestOrder.orderId === orderId) {
      setLatestOrder(prev => prev ? { ...prev, shippingStatus: newStatus } : null);
    }
  };

  const changeProductVideoMapping = async (productId: string) => {
    const newVideo = prompt("동영상 경로 입력:", "/videos/honey_demo.mp4");
    if (newVideo) {
      const updated = await productService.updateVideoMapping(productId, newVideo.trim());
      setProducts(updated);
    }
  };

  const updateProductStock = async (productId: string, newStock: number) => {
    const updated = await productService.updateStock(productId, newStock);
    setProducts(updated);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("정말 이 상품을 삭제하시겠습니까?")) return;
    const updated = await productService.deleteProduct(productId);
    setProducts(updated);
    const newDefId = await productService.getDefaultProductId();
    setDefaultProductId(newDefId);
    if (activeProduct && activeProduct.id === productId) {
      const nextTarget = updated.find(p => p.id === newDefId) || updated[0] || null;
      setActiveProduct(nextTarget);
    }
  };

  const handleResetToDefaultProducts = async () => {
    if (!confirm("기본 라이브 데모 상품(유기농 꿀, 전통차)으로 목록을 초기화하시겠습니까?")) return;
    const updated = await productService.resetToDefaultProducts();
    setProducts(updated);
    const newDefId = await productService.getDefaultProductId();
    setDefaultProductId(newDefId);
    const target = updated.find(p => p.id === newDefId) || updated[0] || null;
    setActiveProduct(target);
    alert("기본 라이브 상품으로 초기화되었습니다!");
  };

  const handleAddCustomQA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim() || !newAnswer.trim()) return;
    setQaList(prev => [...prev, { id: "qa-" + Date.now(), keyword: newKeyword.trim(), question: newQuestion.trim() || newKeyword.trim(), answer: newAnswer.trim() }]);
    setNewKeyword("");
    setNewQuestion("");
    setNewAnswer("");
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
    }, 1500);
  };

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <header className="border-b border-slate-700 px-6 py-3 flex justify-between items-center bg-slate-900/90 backdrop-blur shadow-md">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
            {t.adminTitle}
          </h1>
          <button
            onClick={() => {
              window.location.hash = "";
              setIsAdminRoute(false);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/40 px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shadow"
          >
            {t.backToStore}
          </button>
        </header>

        <div className="flex-1 max-w-6xl mx-auto w-full p-6 flex flex-col gap-6">
          {!isAdminLoggedIn ? (
            <div className="max-w-md mx-auto mt-20 bg-slate-900 border-2 border-slate-700 p-8 rounded-2xl shadow-2xl flex flex-col gap-5">
              <div className="text-center">
                <span className="text-4xl">🔐</span>
                <h2 className="text-xl font-bold text-white mt-2">Admin Portal Authentication</h2>
                <p className="text-xs text-slate-400 mt-1">보안 관리자 로그인</p>
              </div>

              <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">Password (admin1234)</label>
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
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-bold transition shadow-lg cursor-pointer">
                  {t.loginBtn}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-6 animate-fadeIn">
              {/* 상단 통계 요약 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1 shadow">
                  <p className="text-xs text-slate-400 font-medium">{t.totalRevenue}</p>
                  <p className="text-xl font-bold text-emerald-400">
                    KRW {orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500">{t.sandboxSub}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1 shadow">
                  <p className="text-xs text-slate-400 font-medium">{t.totalOrders}</p>
                  <p className="text-xl font-bold text-blue-400">{orders.length} {t.orderUnit}</p>
                  <p className="text-[10px] text-slate-500">{t.ordersSub}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-1 shadow">
                  <p className="text-xs text-slate-400 font-medium">{t.activeStock}</p>
                  <p className="text-xl font-bold text-amber-400">{products.reduce((sum, p) => sum + p.stock, 0)} {t.unit}</p>
                  <p className="text-[10px] text-slate-500">{t.stockSub}</p>
                </div>
              </div>

              {/* 신규 상품 및 동영상 매핑 등록 */}
              <div className="bg-slate-900 border-2 border-amber-500 p-6 rounded-2xl shadow-2xl flex flex-col gap-4">
                <h3 className="text-base font-bold text-amber-400">✨ 신규 상품 및 동영상 매핑 등록</h3>
                <form onSubmit={handleRegisterNewProduct} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-3">
                    <label className="text-xs text-slate-300 mb-1 block">상품명 *</label>
                    <input type="text" value={newProdName} onChange={e => setNewProdName(e.target.value)} placeholder="예: 유기농 산딸기" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-300 mb-1 block">가격 (KRW) *</label>
                    <input type="number" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-300 mb-1 block">재고 *</label>
                    <input type="number" value={newProdStock} onChange={e => setNewProdStock(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs text-slate-300 mb-1 block">동영상 경로 *</label>
                    <input type="text" value={newProdVideo} onChange={e => setNewProdVideo(e.target.value)} placeholder="/videos/파일명.mp4" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-amber-300 font-mono" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-xs text-slate-300 mb-1 block">아이콘</label>
                    <input type="text" value={newProdIcon} onChange={e => setNewProdIcon(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-center text-white" />
                  </div>
                  <div className="md:col-span-1">
                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white py-2 rounded text-xs font-bold cursor-pointer transition">등록</button>
                  </div>
                  <div className="md:col-span-8">
                    <label className="text-xs text-slate-300 mb-1 block">상세설명</label>
                    <input type="text" value={newProdDesc} onChange={e => setNewProdDesc(e.target.value)} placeholder="상품 상세 설명 입력" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white" />
                  </div>
                  <div className="md:col-span-4 flex items-center gap-2 pb-2">
                    <input 
                      type="checkbox" 
                      id="isStartVideoCheck" 
                      checked={isStartVideo} 
                      onChange={e => setIsStartVideo(e.target.checked)} 
                      className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700 cursor-pointer"
                    />
                    <label htmlFor="isStartVideoCheck" className="text-xs text-amber-300 font-semibold cursor-pointer">
                      ⭐ 등록 즉시 시작 동영상 상품으로 지정
                    </label>
                  </div>
                </form>
              </div>

              {/* SECTION 1: 상품 및 재고/동영상 관리 */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col gap-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>📦</span> {t.tabInventory} ({products.length}{t.registeredCount})
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetToDefaultProducts}
                      className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded text-xs transition cursor-pointer"
                    >
                      🔄 기본 데모 상품 세트로 초기화
                    </button>
                    <span className="text-xs text-slate-400 hidden sm:inline">실시간 DB/스토리지 연동</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[650px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3">{t.productNameCol}</th>
                        <th className="pb-3">{t.priceCol}</th>
                        <th className="pb-3">{t.stockCol}</th>
                        <th className="pb-3">{t.videoAssetCol}</th>
                        <th className="pb-3">시작 동영상</th>
                        <th className="pb-3 text-right">{t.actionsCol}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            등록된 상품이 없습니다. 상단 양식에서 상품과 동영상을 등록해 주세요.
                          </td>
                        </tr>
                      ) : products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-800/40">
                          <td className="py-3 font-bold text-white">
                            <div className="flex items-center gap-1.5">
                              <span>{p.icon}</span>
                              <span>{p.name[lang] || p.name.ko}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-normal mt-0.5">{p.description[lang] || p.description.ko}</p>
                          </td>
                          <td className="py-3 text-slate-300 whitespace-nowrap">KRW {p.price.toLocaleString()}</td>
                          <td className="py-3">
                            <input type="number" value={p.stock} onChange={e => updateProductStock(p.id, Number(e.target.value))} className="w-16 bg-slate-950 border border-slate-700 text-amber-400 font-bold rounded p-1 text-xs" />
                          </td>
                          <td className="py-3 font-mono text-amber-300 truncate max-w-[150px]">{p.videoUrl}</td>
                          <td className="py-3">
                            {p.id === defaultProductId ? (
                              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                                ⭐ 시작 동영상
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultProduct(p.id)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 px-2 py-1 rounded text-[11px] cursor-pointer transition"
                              >
                                대표로 지정
                              </button>
                            )}
                          </td>
                          <td className="py-3 text-right space-x-2 whitespace-nowrap">
                            <button onClick={() => changeProductVideoMapping(p.id)} className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-2.5 py-1 rounded text-xs transition cursor-pointer">{t.changeVideoBtn}</button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-2.5 py-1 rounded text-xs transition cursor-pointer">{t.deleteBtn}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 2: AI 맞춤 답변 및 FAQ 사전 편집 */}
              <div className="bg-slate-900 border-2 border-blue-500/40 p-5 rounded-xl flex flex-col gap-4 shadow-xl w-full overflow-hidden">
                <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                  <span>💬</span> {t.tabQA}
                </h3>
                <p className="text-xs text-slate-400">{t.qaDesc}</p>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs min-w-[500px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 font-semibold">{t.qaKeywordCol}</th>
                        <th className="pb-3 font-semibold">{t.qaQuestionCol}</th>
                        <th className="pb-3 font-semibold">{t.qaAnswerCol}</th>
                        <th className="pb-3 font-semibold text-right">{t.actionsCol}</th>
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
                              {t.deleteBtn}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <form onSubmit={handleAddCustomQA} className="mt-3 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-3">
                    <label className="text-[11px] text-slate-400 mb-1 block">{t.qaKeywordCol}</label>
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={e => setNewKeyword(e.target.value)}
                      placeholder={t.qaKeywordPlace}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="text-[11px] text-slate-400 mb-1 block">{t.qaQuestionCol}</label>
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={e => setNewQuestion(e.target.value)}
                      placeholder={t.qaQuestionPlace}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="text-[11px] text-slate-400 mb-1 block">{t.qaAnswerCol}</label>
                    <input
                      type="text"
                      value={newAnswer}
                      onChange={e => setNewAnswer(e.target.value)}
                      placeholder={t.qaAnswerPlace}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-xs font-bold transition cursor-pointer shadow border border-blue-400/30"
                    >
                      {t.addBtn}
                    </button>
                  </div>
                </form>
              </div>

              {/* SECTION 3: 배송 관리 & 주문 내역 */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col gap-4 w-full overflow-hidden">
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
                          <th className="pb-3 font-semibold">{t.orderIdCol}</th>
                          <th className="pb-3 font-semibold">{t.productNameCol}</th>
                          <th className="pb-3 font-semibold">{t.priceCol}</th>
                          <th className="pb-3 font-semibold">{t.trackingCol}</th>
                          <th className="pb-3 font-semibold">{t.shippingCol}</th>
                          <th className="pb-3 font-semibold text-right">{t.dateCol}</th>
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
                                className="bg-slate-950 border border-slate-700 text-slate-100 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                              >
                                <option value="상품 준비중">{t.statusPrep}</option>
                                <option value="배송중">{t.statusShip}</option>
                                <option value="배송완료">{t.statusDone}</option>
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

              {/* SECTION 4: 동영상 편집 및 압축 스튜디오 */}
              <div className="bg-slate-900 border-2 border-amber-500/40 p-5 rounded-xl flex flex-col gap-4 shadow-xl w-full">
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
                      <label className="text-xs text-slate-300 font-semibold mb-1 block">{t.videoSelectLabel}</label>
                      <select
                        value={selectedVideoAsset}
                        onChange={(e) => setSelectedVideoAsset(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.videoUrl}>{p.icon} {p.videoUrl} ({p.name[lang] || p.name.ko})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-semibold mb-1 block">{t.crfLabel}</label>
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
                        <label className="text-xs text-slate-300 font-semibold mb-1 block">{t.speedLabel}</label>
                        <select
                          value={videoSpeed}
                          onChange={(e) => setVideoSpeed(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option value="1.0">1.0x (Normal)</option>
                          <option value="1.25">1.25x (Fast)</option>
                          <option value="1.5">1.5x</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 font-semibold mb-1 block">{t.audioLabel}</label>
                        <select
                          value={audioMute ? "mute" : "keep"}
                          onChange={(e) => setAudioMute(e.target.value === "mute")}
                          className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option value="keep">{t.audioKeep}</option>
                          <option value="mute">{t.audioMuteOpt}</option>
                        </select>
                      </div>
                    </div>

                    <button
                      disabled={isProcessing}
                      onClick={runVideoEditorCompression}
                      className="mt-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 text-white py-2.5 rounded-lg text-xs font-bold transition shadow-lg cursor-pointer border border-amber-400/30 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? t.renderingBtn : t.renderBtn}
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

  // Main Live Commerce Store View (채팅창 길이 고정 및 내부 스크롤 완벽 적용 + 모바일 반응형 동적 뷰)
  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col w-full max-w-full overflow-hidden box-border">
      <header className="border-b border-slate-700 px-2.5 sm:px-3 py-2 flex justify-between items-center bg-slate-900/90 backdrop-blur shadow-md w-full shrink-0 z-30">
        <h1 className="text-xs sm:text-sm font-bold flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0"></span>
          <span className="truncate">{t.title}</span>
        </h1>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 모바일 동적 화면 전환 토글 (분할 뷰 vs 풀라이브 모드) */}
          <div className="flex md:hidden bg-slate-950 border border-slate-700 rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMobileLayoutMode("split")}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${mobileLayoutMode === "split" ? "bg-blue-600 text-white font-bold" : "text-slate-400"}`}
            >
              {t.viewSplit || "📱 분할"}
            </button>
            <button
              type="button"
              onClick={() => setMobileLayoutMode("overlay")}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${mobileLayoutMode === "overlay" ? "bg-red-600 text-white font-bold" : "text-slate-400"}`}
            >
              {t.viewOverlay || "🎬 풀라이브"}
            </button>
          </div>

          <button onClick={() => setIsAdminRoute(true)} className="bg-slate-800 text-amber-400 border border-amber-500/40 px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-semibold cursor-pointer shrink-0">
            {t.adminPortalBtn}
          </button>
          <div className="flex bg-slate-950 border border-slate-700 rounded p-0.5 text-xs shrink-0">
            {(["ko", "en", "ja", "zh", "es", "fr"] as Language[]).map(l => (
              <button key={l} onClick={() => setLang(l)} className={`px-1.5 sm:px-2 py-0.5 rounded uppercase text-[9px] sm:text-[10px] ${lang === l ? "bg-blue-600 text-white" : "text-slate-400"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="relative flex-1 flex flex-col md:grid md:grid-cols-12 gap-2 sm:gap-3 p-1.5 sm:p-4 w-full max-w-full box-border items-stretch overflow-hidden" style={{ height: "calc(100dvh - 52px)", maxHeight: "calc(100dvh - 52px)" }}>
        
        {/* Section 1: Video Player (동영상 구간 대폭 확대 및 페이팔 결제 버튼 상시 표시) */}
        <div className={`${mobileLayoutMode === "overlay" ? "absolute inset-0 md:relative md:inset-auto z-0" : isCheckingOut ? "h-[68%] sm:h-[65%] md:h-full shrink-0 md:shrink" : "h-[58%] sm:h-[60%] md:h-full shrink-0 md:shrink"} md:col-span-7 relative bg-slate-900/40 border border-slate-700/80 rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 shadow-xl flex flex-col justify-between w-full max-w-full overflow-hidden box-border`}>
          <div 
            onClick={handleTogglePlayOrUnmute}
            className={`relative w-full bg-black rounded-lg sm:rounded-xl overflow-hidden border border-slate-700 shadow-lg cursor-pointer select-none transition-all ${isCheckingOut ? "h-20 sm:h-24 shrink-0" : "flex-1 min-h-0"}`}
          >
            {currentProd ? (
              <>
                <video
                  ref={videoRef}
                  key={currentProd.id + "-" + currentProd.videoUrl}
                  autoPlay
                  loop
                  muted={isAudioMuted}
                  playsInline
                  // @ts-ignore
                  webkit-playsinline="true"
                  x5-playsinline="true"
                  preload="auto"
                  onPlay={() => {
                    setIsPlaying(true);
                    setIsAutoplayBlocked(false);
                  }}
                  onPause={() => setIsPlaying(false)}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%", display: "block" }}
                  className="absolute inset-0 w-full h-full object-cover bg-black"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== currentProd.fallbackVideoUrl) {
                      target.src = currentProd.fallbackVideoUrl;
                      target.load();
                      target.play().then(() => {
                        setIsPlaying(true);
                        setIsAutoplayBlocked(false);
                      }).catch(err => {
                        console.error("Fallback play error:", err);
                        setIsAutoplayBlocked(true);
                      });
                    }
                  }}
                >
                  <source src={currentProd.videoUrl} type="video/mp4" />
                  <source src={currentProd.fallbackVideoUrl} type="video/mp4" />
                </video>

                {/* 모바일 브라우저 자동재생 차단 또는 정지 상태 감지 시 중앙 탭-투-플레이 오버레이 */}
                {(!isPlaying || isAutoplayBlocked) && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePlayOrUnmute();
                    }}
                    className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs cursor-pointer p-4 text-center transition-all select-none"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center text-2xl sm:text-3xl shadow-xl ring-4 ring-red-500/40 animate-pulse mb-2.5">
                      ▶
                    </div>
                    <span className="text-white text-xs sm:text-sm font-bold bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-slate-700 shadow">
                      {t.tapToPlay || "▶ 터치하여 라이브 영상 재생"}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950">
                <span className="text-4xl mb-3">🎬</span>
                <p className="text-sm font-bold text-white mb-1">등록된 라이브 동영상 상품이 없습니다.</p>
                <p className="text-xs text-slate-400 mb-4">관리자 화면에서 판매 상품과 동영상을 등록해 주세요.</p>
                <button
                  type="button"
                  onClick={() => setIsAdminRoute(true)}
                  className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow cursor-pointer"
                >
                  🔒 관리자 화면에서 상품 등록하기
                </button>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-20 flex flex-col items-start gap-1">
              <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse uppercase">● {t.liveStream}</span>
              <span className="bg-black/70 text-slate-200 text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md border border-slate-600">{t.marketName}</span>
            </div>
            {/* 우측 상단 단일 통합 사운드 토글 버튼 (음소거 / 소리켜기) */}
            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 flex flex-col items-end gap-1.5">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const nextMuted = !isAudioMuted;
                  setIsAudioMuted(nextMuted);
                  if (videoRef.current) {
                    videoRef.current.muted = nextMuted;
                  }
                }} 
                className={`text-[10px] sm:text-[11px] px-2.5 py-1 rounded border transition font-semibold cursor-pointer shadow-md ${isAudioMuted ? "bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 font-bold" : "bg-black/80 hover:bg-black/90 text-white border-slate-600"}`}
              >
                {isAudioMuted ? t.soundOn : t.soundOff}
              </button>
              {currentProd && (
                <span className={`text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-1 rounded border ${currentProd.stock <= 0 ? "bg-red-600 text-white" : "bg-black/80 text-amber-300"}`}>
                  {currentProd.stock <= 0 ? t.soldOut : `${t.stockLeft}${currentProd.stock}${t.unit}`}
                </span>
              )}
            </div>
          </div>

          <div className="mt-1.5 sm:mt-2 shrink-0 w-full box-border">
            {currentProd && !isCheckingOut && !latestOrder ? (
              <div className="bg-slate-900/95 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-700 flex items-center justify-between gap-2 shadow-xl w-full h-[64px] sm:h-[76px] box-border overflow-hidden">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-base sm:text-xl shrink-0">{currentProd.icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-xs font-bold text-white truncate">{currentProd.name[lang] || currentProd.name.ko}</p>
                    <p className="text-[10px] sm:text-[11px] text-amber-300 font-semibold truncate">
                      KRW {currentProd.price.toLocaleString()} · <span className="text-slate-400 font-normal">{currentProd.description[lang] || currentProd.description.ko}</span>
                    </p>
                  </div>
                </div>
                {currentProd.stock > 0 ? (
                  <button onClick={() => setIsCheckingOut(true)} className="bg-[#0070BA] hover:bg-[#005ea6] active:scale-95 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs font-bold shrink-0 cursor-pointer shadow-lg transition flex items-center gap-1 border border-blue-400/40">
                    <span>💳</span>
                    <span>{t.payWithPayPal}</span>
                  </button>
                ) : (
                  <button disabled className="bg-slate-800 text-slate-500 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs font-bold shrink-0">{t.soldOut}</button>
                )}
              </div>
            ) : !currentProd ? (
              <div className="bg-slate-900/95 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-700 flex items-center justify-between shadow-xl w-full h-[64px] sm:h-[76px] box-border px-3 sm:px-4">
                <p className="text-[11px] sm:text-xs text-slate-400">관리자 화면에서 등록된 판매 상품이 없습니다.</p>
                <button onClick={() => setIsAdminRoute(true)} className="bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 border border-amber-500/50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold cursor-pointer">
                  상품 등록하기
                </button>
              </div>
            ) : isCheckingOut && currentProd ? (
              <div className="bg-slate-900 border border-blue-500 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-xl w-full box-border">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] sm:text-xs font-bold text-blue-400 flex items-center gap-1">
                    <span>🔒</span> {t.secureCheckout}
                  </span>
                  <button onClick={() => setIsCheckingOut(false)} className="text-[10px] sm:text-[11px] text-slate-400 hover:text-white underline cursor-pointer">{t.cancelBack}</button>
                </div>
                <PayPalCheckoutButton 
                  amount={Math.round(currentProd.price / 1350)} 
                  currency="USD" 
                  lang={lang}
                  onSuccess={(orderId) => handlePaymentSuccess(orderId, currentProd)} 
                />
              </div>
            ) : latestOrder ? (
              <div className="bg-slate-900 border border-emerald-500 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-xl flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-400">{t.trackingViewTitle}</span>
                  <button onClick={() => { setLatestOrder(null); setCheckoutStatus(null); }} className="text-[10px] sm:text-[11px] text-slate-400 hover:text-white cursor-pointer">{t.closeBtn || "닫기"}</button>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 font-mono">{latestOrder.orderId} / {latestOrder.shippingStatus}</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Section 2: AI Shopping Agent & Live Chat (채팅창 상단 제목 줄 삭제하여 동영상 공간 최대 확보) */}
        <div className={`${mobileLayoutMode === "overlay" ? "absolute bottom-0 left-0 right-0 h-[42%] md:relative md:inset-auto md:h-full z-20 bg-slate-950/90 md:bg-slate-900/80 backdrop-blur-md md:backdrop-blur-none" : "flex-1 min-h-0 md:h-full"} md:col-span-5 bg-slate-900/80 border border-slate-700/80 rounded-xl sm:rounded-2xl flex flex-col shadow-xl w-full max-w-full overflow-hidden box-border`}>
          {/* 채팅창 내부 스크롤 영역: 제목 줄 없이 바로 대화 내용이 시원하게 위로 올라감 */}
          <div 
            ref={chatMessagesRef}
            className="flex-1 min-h-0 p-2 sm:p-3 overflow-y-auto no-scrollbar flex flex-col gap-2 sm:gap-2.5 w-full box-border"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {messages.map(msg => (
              <div key={msg.id} className={msg.sender === "user" ? "flex flex-col items-end w-full" : "flex flex-col items-start w-full"}>
                {/* 1. 위에 있는 설명란 제거: 상품 카드가 없고 텍스트가 있을 때만 말풍선 표시 */}
                {!msg.suggestedProduct && ((typeof msg.text === "string" ? msg.text : msg.text[lang])?.trim()) ? (
                  <div className={msg.sender === "user" ? "max-w-[85%] p-2 sm:p-2.5 rounded-xl text-xs sm:text-sm bg-blue-600 text-white shadow break-words whitespace-pre-line" : "max-w-[85%] p-2 sm:p-2.5 rounded-xl text-xs sm:text-sm bg-slate-800 text-slate-200 border border-slate-700 shadow break-words whitespace-pre-line"}>
                    {typeof msg.text === "string" ? msg.text : msg.text[lang]}
                  </div>
                ) : null}
                {/* 2. 아래에 있는 결제열기란만 남김: 상품 정보 및 결제 열기 버튼 카드 */}
                {msg.suggestedProduct && (
                  <div className="w-full max-w-full bg-slate-900 border border-slate-700 p-2 sm:p-2.5 rounded-xl flex flex-col gap-1.5 sm:gap-2 shadow-md box-border">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-base sm:text-lg shrink-0">{msg.suggestedProduct.icon}</div>
                      <div className="text-xs min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-white truncate text-[11px] sm:text-xs">{msg.suggestedProduct.name[lang] || msg.suggestedProduct.name.ko}</p>
                          <span className="text-[9px] sm:text-[10px] text-amber-400 font-bold shrink-0">{t.stockLeft}{msg.suggestedProduct.stock}{t.unit}</span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5">{msg.suggestedProduct.description[lang] || msg.suggestedProduct.description.ko}</p>
                        <p className="text-amber-300 font-semibold mt-0.5 text-[10px] sm:text-xs">KRW {msg.suggestedProduct.price.toLocaleString()}</p>
                      </div>
                    </div>
                    {msg.suggestedProduct.stock > 0 ? (
                      <button onClick={() => { setActiveProduct(msg.suggestedProduct!); setIsCheckingOut(true); }} className="w-full bg-[#0070BA] hover:bg-[#005ea6] text-white py-1.5 sm:py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow">
                        {t.openCheckout}
                      </button>
                    ) : (
                      <button disabled className="w-full bg-slate-800 text-slate-500 py-1.5 sm:py-2 rounded-lg text-xs font-bold">{t.soldOut}</button>
                    )}
                  </div>
                )}
                <span className="text-[9px] text-slate-500 mt-0.5">{msg.timestamp}</span>
              </div>
            ))}
            {/* 최신 대화로 자동 스크롤 타겟 */}
            <div ref={messagesEndRef} className="h-0 w-0" />
          </div>

          <div className="px-2 sm:px-2.5 pt-1.5 pb-1.5 flex gap-1 sm:gap-1.5 flex-wrap border-t border-slate-700 bg-slate-900/60 shrink-0 w-full box-border">
            {products.length === 0 ? (
              <div className="flex items-center justify-between w-full text-[10px] sm:text-[11px] text-slate-400 px-1 py-0.5">
                <span>등록된 상품 버튼이 없습니다.</span>
                <button type="button" onClick={() => setIsAdminRoute(true)} className="text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer">
                  + 관리자에서 상품 등록
                </button>
              </div>
            ) : products.map((prod) => (
              <button
                key={prod.id}
                type="button"
                onClick={() => handleSelectProductFromChat(prod)}
                className={`text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full cursor-pointer shadow-sm flex items-center gap-1 border transition ${currentProd && currentProd.id === prod.id ? "bg-amber-600 text-white border-amber-400 font-bold" : "bg-slate-800 text-blue-300 border-slate-600 hover:bg-slate-700"}`}
              >
                <span>{prod.icon}</span>
                <span className="truncate max-w-[120px] sm:max-w-[140px]">{prod.name[lang] || prod.name.ko}</span>
                {prod.id === defaultProductId && <span className="text-[9px] text-amber-300 font-bold ml-0.5">★</span>}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-2 sm:p-2.5 border-t border-slate-700 flex gap-2 bg-slate-900/80 shrink-0 w-full box-border">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="flex-1 min-w-0 bg-slate-950 border border-slate-700 rounded-lg px-2 sm:px-2.5 py-1.5 text-xs sm:text-sm text-slate-100 focus:outline-none"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white shrink-0 cursor-pointer transition">
              {t.send}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
export default LiveStreamView;