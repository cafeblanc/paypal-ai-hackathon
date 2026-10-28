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
    orderUnit: "건"
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
    orderUnit: "orders"
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
    orderUnit: "件"
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
    orderUnit: "单"
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
    orderUnit: "pedidos"
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
    orderUnit: "commandes"
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
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);
  const [latestOrder, setLatestOrder] = useState<OrderRecord | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 채팅 메시지 추가 시 스크롤바 노출 없이 최신 목록이 항상 밑에 보이고, 기존 대화는 위로 밀려 올라가 사라지도록 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    productService.getProducts().then((list) => {
      setProducts(list);
      if (list.length > 0) setActiveProduct(list[0]);
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
      videoRef.current.muted = isAudioMuted;
      videoRef.current.play().catch(err => console.warn("Video autoplay prevented:", err));
    }
  }, [activeProduct, isAudioMuted]);

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
    });
    setProducts(updated);
    setNewProdName("");
    setNewProdDesc("");
    alert("새로운 상품이 등록되었습니다!");
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
    if (products.length <= 1) return;
    const updated = await productService.deleteProduct(productId);
    setProducts(updated);
    if (activeProduct && activeProduct.id === productId) setActiveProduct(updated[0]);
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

  const currentProd = activeProduct || products[0];

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
              <div className="bg-slate-900 border-2 border-amber-500 p-6 rounded-2xl shadow-2xl flex flex-col gap-4">
                <h3 className="text-base font-bold text-amber-400">✨ 신규 상품 및 동영상 매핑 등록</h3>
                <form onSubmit={handleRegisterNewProduct} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-3">
                    <label className="text-xs text-slate-300 mb-1 block">상품명</label>
                    <input type="text" value={newProdName} onChange={e => setNewProdName(e.target.value)} placeholder="예: 유기농 산딸기" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-300 mb-1 block">가격 (KRW)</label>
                    <input type="number" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-300 mb-1 block">재고</label>
                    <input type="number" value={newProdStock} onChange={e => setNewProdStock(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs text-slate-300 mb-1 block">동영상 경로</label>
                    <input type="text" value={newProdVideo} onChange={e => setNewProdVideo(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-amber-300 font-mono" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-xs text-slate-300 mb-1 block">아이콘</label>
                    <input type="text" value={newProdIcon} onChange={e => setNewProdIcon(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-center text-white" />
                  </div>
                  <div className="md:col-span-1">
                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white py-2 rounded text-xs font-bold cursor-pointer">등록</button>
                  </div>
                  <div className="md:col-span-12">
                    <label className="text-xs text-slate-300 mb-1 block">상세설명</label>
                    <input type="text" value={newProdDesc} onChange={e => setNewProdDesc(e.target.value)} placeholder="상품 상세 설명 입력" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white" />
                  </div>
                </form>
              </div>

              {/* 상품 목록 관리 */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col gap-4">
                <h3 className="text-sm font-bold text-white">📦 상품 및 재고/동영상 관리</h3>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">상품명 / 설명</th>
                      <th className="pb-3">가격</th>
                      <th className="pb-3">재고</th>
                      <th className="pb-3">동영상 경로</th>
                      <th className="pb-3 text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {products.map(p => (
                      <tr key={p.id}>
                        <td className="py-3 font-bold text-white">{p.icon} {p.name[lang] || p.name.ko}</td>
                        <td className="py-3 text-slate-300">KRW {p.price.toLocaleString()}</td>
                        <td className="py-3">
                          <input type="number" value={p.stock} onChange={e => updateProductStock(p.id, Number(e.target.value))} className="w-16 bg-slate-950 border border-slate-700 text-amber-400 font-bold rounded p-1 text-xs" />
                        </td>
                        <td className="py-3 font-mono text-amber-300">{p.videoUrl}</td>
                        <td className="py-3 text-right space-x-2">
                          <button onClick={() => changeVideoMapping(p.id)} className="bg-blue-600/20 text-blue-400 px-2.5 py-1 rounded text-xs">동영상 변경</button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-600/20 text-red-400 px-2.5 py-1 rounded text-xs">삭제</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Live Commerce Store View (채팅창 길이 고정 및 내부 스크롤 완벽 적용)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col w-full max-w-full overflow-x-hidden box-border">
      <header className="border-b border-slate-700 px-3 py-2 flex justify-between items-center bg-slate-900/90 backdrop-blur shadow-md w-full shrink-0">
        <h1 className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>{t.title}</span>
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsAdminRoute(true)} className="bg-slate-800 text-amber-400 border border-amber-500/40 px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer">
            {t.adminPortalBtn}
          </button>
          <div className="flex bg-slate-950 border border-slate-700 rounded p-0.5 text-xs">
            {(["ko", "en", "ja", "zh", "es", "fr"] as Language[]).map(l => (
              <button key={l} onClick={() => setLang(l)} className={`px-2 py-0.5 rounded uppercase text-[10px] ${lang === l ? "bg-blue-600 text-white" : "text-slate-400"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-3 p-2 sm:p-4 w-full max-w-full overflow-x-hidden box-border items-stretch md:overflow-hidden overflow-y-auto" style={{ height: "calc(100vh - 52px)" }}>
        
        {/* Section 1: Video Player */}
        <div className="md:col-span-7 relative h-[calc(100vh-68px)] md:h-full bg-slate-900/40 border border-slate-700/80 rounded-2xl p-2.5 sm:p-3 shadow-xl flex flex-col justify-between w-full max-w-full overflow-x-hidden box-border shrink-0">
          <div 
            className="relative w-full bg-black rounded-xl overflow-hidden border border-slate-700 shadow-lg shrink-0"
            style={{ height: isCheckingOut || latestOrder ? "calc(100% - 210px)" : "calc(100% - 96px)" }}
          >
            {currentProd && (
              <video
                ref={videoRef}
                key={currentProd.id + "-" + currentProd.videoUrl}
                autoPlay
                loop
                muted={isAudioMuted}
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%", display: "block" }}
                className="absolute inset-0 w-full h-full object-cover bg-black"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== currentProd.fallbackVideoUrl) {
                    target.src = currentProd.fallbackVideoUrl;
                    target.load();
                    target.play().catch(err => console.error("Fallback play error:", err));
                  }
                }}
              >
                <source src={currentProd.videoUrl} type="video/mp4" />
                <source src={currentProd.fallbackVideoUrl} type="video/mp4" />
              </video>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-1">
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse uppercase">● {t.liveStream}</span>
              <span className="bg-black/70 text-slate-200 text-[11px] px-2 py-0.5 rounded-md border border-slate-600">{t.marketName}</span>
            </div>
            <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5">
              <button onClick={() => setIsAudioMuted(!isAudioMuted)} className="bg-black/80 text-white text-[11px] px-2.5 py-1 rounded border border-slate-600">
                {isAudioMuted ? t.soundOff : t.soundOn}
              </button>
              {currentProd && (
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded border ${currentProd.stock <= 0 ? "bg-red-600 text-white" : "bg-black/80 text-amber-300"}`}>
                  {currentProd.stock <= 0 ? t.soldOut : `${t.stockLeft}${currentProd.stock}${t.unit}`}
                </span>
              )}
            </div>
          </div>

          <div className="mt-2.5 shrink-0 w-full box-border">
            {currentProd && !isCheckingOut && !latestOrder ? (
              <div className="bg-slate-900/95 p-3 rounded-xl border border-slate-700 flex items-center justify-between gap-2.5 shadow-xl w-full h-[86px] box-border overflow-hidden">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-xl shrink-0">{currentProd.icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{currentProd.name[lang] || currentProd.name.ko}</p>
                    <p className="text-[11px] text-amber-300 font-semibold truncate">
                      KRW {currentProd.price.toLocaleString()} · <span className="text-slate-400 font-normal">{currentProd.description[lang] || currentProd.description.ko}</span>
                    </p>
                  </div>
                </div>
                {currentProd.stock > 0 ? (
                  <button onClick={() => setIsCheckingOut(true)} className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer">
                    {t.payWithPayPal}
                  </button>
                ) : (
                  <button disabled className="bg-slate-800 text-slate-500 px-4 py-2.5 rounded-lg text-xs font-bold shrink-0">{t.soldOut}</button>
                )}
              </div>
            ) : isCheckingOut && currentProd ? (
              <div className="bg-slate-900 border border-blue-500 p-3 rounded-xl shadow-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-blue-400">{t.secureCheckout}</span>
                  <button onClick={() => setIsCheckingOut(false)} className="text-[11px] text-slate-400 underline">{t.cancelBack}</button>
                </div>
                <PayPalCheckoutButton amount={Math.round(currentProd.price / 1350)} currency="USD" onSuccess={(orderId) => handlePaymentSuccess(orderId, currentProd)} />
              </div>
            ) : latestOrder ? (
              <div className="bg-slate-900 border border-emerald-500 p-3 rounded-xl shadow-xl flex flex-col gap-2">
                <span className="text-xs font-bold text-emerald-400">{t.trackingViewTitle}</span>
                <p className="text-xs text-slate-300 font-mono">{latestOrder.orderId} / {latestOrder.shippingStatus}</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Section 2: AI Shopping Agent & Live Chat (채팅창 크기 고정 및 스크롤바 없는 자연스러운 위로 밀림 구현) */}
        <div className="md:col-span-5 bg-slate-900/80 border border-slate-700/80 rounded-2xl flex flex-col h-[calc(100vh-68px)] md:h-full shadow-xl w-full max-w-full overflow-hidden box-border shrink-0">
          <div className="p-3 border-b border-slate-700 font-semibold text-xs sm:text-sm flex justify-between items-center bg-slate-900/90 shrink-0">
            <span>{t.chatTitle}</span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> {t.online}</span>
          </div>
          
          {/* 채팅창 내부 스크롤 영역: 크기는 고정되고 스크롤바 없이 새 메시지가 오면 위로 밀려 올라감 */}
          <div 
            ref={chatMessagesRef}
            className="flex-1 min-h-0 p-3 overflow-y-auto no-scrollbar flex flex-col gap-2.5 w-full box-border"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {messages.map(msg => (
              <div key={msg.id} className={msg.sender === "user" ? "flex flex-col items-end w-full" : "flex flex-col items-start w-full"}>
                {/* 1. 위에 있는 설명란 제거: 상품 카드가 없고 텍스트가 있을 때만 말풍선 표시 */}
                {!msg.suggestedProduct && ((typeof msg.text === "string" ? msg.text : msg.text[lang])?.trim()) ? (
                  <div className={msg.sender === "user" ? "max-w-[85%] p-2.5 rounded-xl text-xs sm:text-sm bg-blue-600 text-white shadow break-words whitespace-pre-line" : "max-w-[85%] p-2.5 rounded-xl text-xs sm:text-sm bg-slate-800 text-slate-200 border border-slate-700 shadow break-words whitespace-pre-line"}>
                    {typeof msg.text === "string" ? msg.text : msg.text[lang]}
                  </div>
                ) : null}
                {/* 2. 아래에 있는 결제열기란만 남김: 상품 정보 및 결제 열기 버튼 카드 */}
                {msg.suggestedProduct && (
                  <div className="w-full max-w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl flex flex-col gap-2 shadow-md box-border">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0">{msg.suggestedProduct.icon}</div>
                      <div className="text-xs min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-white truncate">{msg.suggestedProduct.name[lang] || msg.suggestedProduct.name.ko}</p>
                          <span className="text-[10px] text-amber-400 font-bold shrink-0">{t.stockLeft}{msg.suggestedProduct.stock}{t.unit}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">{msg.suggestedProduct.description[lang] || msg.suggestedProduct.description.ko}</p>
                        <p className="text-amber-300 font-semibold mt-0.5">KRW {msg.suggestedProduct.price.toLocaleString()}</p>
                      </div>
                    </div>
                    {msg.suggestedProduct.stock > 0 ? (
                      <button onClick={() => { setActiveProduct(msg.suggestedProduct!); setIsCheckingOut(true); }} className="w-full bg-[#0070BA] hover:bg-[#005ea6] text-white py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow">
                        {t.openCheckout}
                      </button>
                    ) : (
                      <button disabled className="w-full bg-slate-800 text-slate-500 py-2 rounded-lg text-xs font-bold">{t.soldOut}</button>
                    )}
                  </div>
                )}
                <span className="text-[9px] text-slate-500 mt-0.5">{msg.timestamp}</span>
              </div>
            ))}
            {/* 최신 대화로 자동 스크롤 타겟 */}
            <div ref={messagesEndRef} className="h-0 w-0" />
          </div>

          <div className="px-2.5 pt-2 pb-2 flex gap-1.5 flex-wrap border-t border-slate-700 bg-slate-900/60 shrink-0 w-full box-border">
            {products.map((prod) => (
              <button
                key={prod.id}
                type="button"
                onClick={() => handleSelectProductFromChat(prod)}
                className={`text-[11px] px-2.5 py-1 rounded-full cursor-pointer shadow-sm flex items-center gap-1 border ${currentProd && currentProd.id === prod.id ? "bg-amber-600 text-white border-amber-400 font-bold" : "bg-slate-800 text-blue-300 border-slate-600"}`}
              >
                <span>{prod.icon}</span>
                <span className="truncate max-w-[140px]">{prod.name[lang] || prod.name.ko}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-2.5 border-t border-slate-700 flex gap-2 bg-slate-900/80 shrink-0 w-full box-border">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="flex-1 min-w-0 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-slate-100 focus:outline-none"
            />
            <button type="submit" className="bg-blue-600 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white shrink-0 cursor-pointer">
              {t.send}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
export default LiveStreamView;