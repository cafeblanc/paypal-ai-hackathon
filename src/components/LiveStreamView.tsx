import React, { useState, useRef, useEffect } from "react";
import PayPalCheckoutButton from "./PayPalCheckoutButton";
import ErrorBoundary from "./ErrorBoundary";
import IconPicker from "./IconPicker";
import { productService, ProductEntity, Language, STATIC_DEMO_VIDEOS, DEFAULT_FALLBACK_VIDEO } from "../services/productService";
import { productTranslationService } from "../services/productTranslationService";

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

export const formatPrice = (priceInKrw: number, l: Language = "ko"): string => {
  if (isNaN(priceInKrw)) return "0";
  switch (l) {
    case "en":
      return `$${(priceInKrw / 1350).toFixed(2)}`;
    case "ja":
      return `${Math.round(priceInKrw * 0.11).toLocaleString()}엔`;
    case "zh":
      return `${Math.round(priceInKrw * 0.0053).toLocaleString()}위안`;
    case "es":
      return `$${(priceInKrw / 1350).toFixed(2)}`;
    case "fr":
      return `${(priceInKrw / 1450).toFixed(2)} €`;
    case "ko":
    default:
      return `${priceInKrw.toLocaleString()}원`;
  }
};

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
    prodPriceLabel: "가격 (원) *",
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
    priceCol: "가격 (원)",
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
    tabVideoEditor: "2단계: 동영상 스튜디오 & 상품 완성 등록",
    videoSelectLabel: "편집할 동영상 파일",
    uploadVideoBtn: "📁 PC에서 동영상 파일 선택 (public/demo_video/로 업로드)",
    uploadingVideo: "⏳ 동영상 업로드 및 public/demo_video/ 저장 중...",
    uploadSuccess: "✅ 업로드 성공: ",
    uploadHint: "※ PC의 동영상 파일(.mp4, .webm 등)을 선택하면 E:\\gem\\paypal-ai-hackathon\\public\\demo_video\\ 폴더로 직접 저장됩니다.",
    demoFolderLabel: "📂 public/demo_video/ 저장된 동영상 목록",
    voiceDubbingTitle: "🎙️ AI 원어민 영어 더빙 스튜디오 (Voice-Over)",
    voicePersonaLabel: "목소리 모델 (Voice Persona)",
    voiceMaleC: "👨 남성 C: 60대 중후하고 품격 있는 장인 내레이터 (약간 느리고 차분한 톤)",
    voiceFemaleD: "👩 여성 D: 60대 온화하고 우아한 명품 라이브 쇼호스트 (약간 느리고 편안한 톤)",
    dubbingModeLabel: "더빙 방식 (Dubbing Mode)",
    dubbingVoiceOver: "🎧 AI 원어민 영어 더빙 (원음 볼륨 15% 덕킹 + Voice-Over - 권장 ⭐)",
    dubbingReplace: "🌐 원음 제거 영어 더빙 (원음 완전 대체)",
    refreshListBtn: "새로고침",
    videoPreviewLabel: "동영상 실시간 미리보기",
    autoRegisterSuccess: "✨ 동영상 기반 신규 상품이 자동 등록되었습니다! 아래에서 단가 및 상세설명을 직접 수정하실 수 있습니다.",
    autoProductEditTitle: "🛍️ 자동 등록 상품 정보 즉시 수정 (단가 / 상세설명 / 재고)",
    editProdBtn: "✏️ 편집",
    editProductModalTitle: "✏️ 상품 정보 상세 편집",
    saveChangesBtn: "💾 수정사항 저장",
    cancelBtn: "취소",
    saveSuccess: "✅ 상품 정보가 성공적으로 수정되었습니다!",
    replaceVideoDubbingBtn: "🎬 동영상 및 번역·더빙 교체",
    replaceModalTitle: "🎬 동영상 및 번역·더빙 교체 및 재생성",
    replaceModalDesc: "기존 상품명, 가격, 재고, 아이콘은 100% 그대로 유지되며, 선택한 원본 동영상과 번역·더빙(상세설명)만 즉시 교체됩니다.",
    selectOrUploadVideo: "동영상 선택 또는 새 파일 업로드",
    dubbingScriptEdit: "번역 상세설명 / 더빙 스크립트 수정",
    applyReplaceBtn: "✅ 동영상 및 번역·더빙 즉시 교체 적용",
    replaceSuccessMsg: "✅ 동영상과 번역·더빙이 성공적으로 교체되었습니다!",
    applyToCurrentProductBtn: "🔄 현재 상품의 동영상 & 번역더빙만 즉시 교체",
    crfLabel: "고압축 품질 (CRF 20 ~ 35, 권장: 28)",
    speedLabel: "재생 속도",
    audioLabel: "오디오 트랙",
    audioKeep: "🔊 원본 오디오 유지 (권장)",
    audioMuteOpt: "🔇 무음 (Mute)",
    renderBtn: "🚀 Run video 음성번역 & compression & Register",
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
    viewOverlay: "🎬 풀 라이브",
    adminNewProdTitle: "✨ 1단계: 상품 기본 정보 입력 (Step 1: Product Information)",
    prodNameRequired: "상품명 *",
    prodNamePlaceholderShort: "예: 유기농 산딸기",
    prodPriceRequired: "가격 (원) *",
    prodStockRequired: "재고 *",
    prodVideoRequired: "동영상 경로 *",
    prodVideoPlaceholder: "/videos/파일명.mp4",
    prodIconOptional: "아이콘",
    prodDescOptional: "상세설명",
    prodDescPlaceholderShort: "상품 상세 설명 입력",
    registerBtnShort: "등록",
    setAsStartupVideo: "⭐ 등록 즉시 시작 동영상 상품으로 지정",
    resetDemoProducts: "🔄 기본 데모 상품 세트로 초기화",
    realtimeDBSync: "실시간 DB/스토리지 연동",
    startupVideoCol: "시작 동영상",
    startupVideoBadge: "⭐ 시작 동영상",
    setAsDefaultBtn: "대표로 지정",
    noProductsNotice: "등록된 상품이 없습니다. 상단 양식에서 상품과 동영상을 등록해 주세요."
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
    prodPriceLabel: "Price ($) *",
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
    priceCol: "Price ($)",
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
    tabVideoEditor: "Step 2: Video Studio & Product Registration",
    videoSelectLabel: "Video Asset",
    uploadVideoBtn: "📁 Browse Video File from PC (Upload to public/demo_video/)",
    uploadingVideo: "⏳ Uploading & Saving to public/demo_video/...",
    uploadSuccess: "✅ Upload Success: ",
    uploadHint: "※ Select a video (.mp4, .webm) from your PC to upload directly to public/demo_video/.",
    demoFolderLabel: "📂 public/demo_video/ Video Assets",
    voiceDubbingTitle: "🎙️ AI Native Voice-Over Dubbing Studio",
    voicePersonaLabel: "Voice Persona",
    voiceMaleC: "👨 Male C: 60s Prestigious Elder Master Narrator (Slightly Slower & Deep Tone)",
    voiceFemaleD: "👩 Female D: 60s Warm & Elegant Senior Host (Slightly Slower & Graceful Tone)",
    dubbingModeLabel: "Dubbing Mode",
    dubbingVoiceOver: "🎧 AI Native Voice-Over (15% Ducked Original + English Voice - Rec ⭐)",
    dubbingReplace: "🌐 Full Voice Replace (Mute Original + Clean English Voice)",
    refreshListBtn: "Refresh List",
    videoPreviewLabel: "Live Video Preview",
    autoRegisterSuccess: "✨ New product automatically registered! You can edit price and description below.",
    autoProductEditTitle: "🛍️ Edit Registered Product Details (Price / Description / Stock)",
    editProdBtn: "✏️ Edit",
    editProductModalTitle: "✏️ Edit Product Details",
    saveChangesBtn: "💾 Save Changes",
    cancelBtn: "Cancel",
    saveSuccess: "✅ Product details updated successfully!",
    replaceVideoDubbingBtn: "🎬 Replace Video & Dubbing",
    replaceModalTitle: "🎬 Replace Video & Re-generate Dubbing",
    replaceModalDesc: "Original product name, price, stock, and icon are 100% preserved. Only the video and translated dubbing script are replaced.",
    selectOrUploadVideo: "Select Video Asset or Upload New File",
    dubbingScriptEdit: "Edit Translated Description / Dubbing Script",
    applyReplaceBtn: "✅ Apply Video & Dubbing Replacement",
    replaceSuccessMsg: "✅ Video and dubbing replaced successfully!",
    applyToCurrentProductBtn: "🔄 Replace Video & Dubbing of Current Product",
    crfLabel: "Compression Quality (CRF 20 ~ 35, Rec: 28)",
    speedLabel: "Playback Speed",
    audioLabel: "Audio Track",
    audioKeep: "🔊 Keep Original Audio",
    audioMuteOpt: "🔇 Mute Audio",
    renderBtn: "🚀 Run Video Voice Dubbing & Compression & Register",
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
    viewOverlay: "🎬 Full Live",
    adminNewProdTitle: "✨ Step 1: Product Information Input",
    prodNameRequired: "Product Name *",
    prodNamePlaceholderShort: "e.g., Organic Raspberries",
    prodPriceRequired: "Price ($) *",
    prodStockRequired: "Stock *",
    prodVideoRequired: "Video Path *",
    prodVideoPlaceholder: "/videos/filename.mp4",
    prodIconOptional: "Icon",
    prodDescOptional: "Description",
    prodDescPlaceholderShort: "Enter product description",
    registerBtnShort: "Register",
    setAsStartupVideo: "⭐ Set as startup video product upon registration",
    resetDemoProducts: "🔄 Reset to Default Demo Products",
    realtimeDBSync: "Real-time DB / Storage Sync",
    startupVideoCol: "Startup Video",
    startupVideoBadge: "⭐ Startup Video",
    setAsDefaultBtn: "Set as Default",
    noProductsNotice: "No products registered. Please register a product and video using the form above."
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
    prodPriceLabel: "価格 (엔) *",
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
    priceCol: "価格 (엔)",
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
    uploadVideoBtn: "📁 PCから動画ファイルを選択 (public/demo_video/へアップ로드)",
    uploadingVideo: "⏳ 動画アップロード＆保存中...",
    uploadSuccess: "✅ アップロード完了: ",
    uploadHint: "※ PCの動画ファイルを選択すると public/demo_video/ に直接保存されます。",
    demoFolderLabel: "📂 public/demo_video/ 保存済み動画一覧",
    voiceDubbingTitle: "🎙️ AIネイティブ吹き替えスタジオ (Voice-Over)",
    voicePersonaLabel: "音声ペルソナ (Voice Persona)",
    voiceMaleC: "👨 男性 C: 60代 重厚で品格ある巨匠ナレーター (ややゆっくり・落ち着いた低音)",
    voiceFemaleD: "👩 女性 D: 60代 温和で優雅なシニアショーホスト (ややゆっくり・心地よいトーン)",
    dubbingModeLabel: "吹き替えモード",
    dubbingVoiceOver: "🎧 AIネイティブ吹き替え (原音15%ダッキング + 英語Voice-Over - 推奨 ⭐)",
    dubbingReplace: "🌐 原音ミュート英語吹き替え (原音完全代替)",
    refreshListBtn: "更新",
    videoPreviewLabel: "リアルタイム動画プレビュー",
    autoRegisterSuccess: "✨ 動画から新商品が自動登録されました！以下で単価と説明を直接編集できます。",
    autoProductEditTitle: "🛍️ 登録商品の即時編集 (単価 / 詳細説明 / 在庫)",
    editProdBtn: "✏️ 編集",
    editProductModalTitle: "✏️ 商品情報の詳細編集",
    saveChangesBtn: "💾 変更を保存",
    cancelBtn: "キャンセル",
    saveSuccess: "✅ 商品情報が正常に更新されました！",
    replaceVideoDubbingBtn: "🎬 動画および翻訳・吹替の差替",
    replaceModalTitle: "🎬 動画および翻訳・吹替の差替と再生成",
    replaceModalDesc: "既存の商品名、価格、在庫、アイコンはそのまま保持され、動画と翻訳・吹替スクリプトのみが即座に差し替えられます。",
    selectOrUploadVideo: "動画選択または新規アップロード",
    dubbingScriptEdit: "翻訳商品説明／吹替スクリプト編集",
    applyReplaceBtn: "✅ 動画と翻訳・吹替を即座に差替適用",
    replaceSuccessMsg: "✅ 動画と翻訳・吹替が正常に差し替えられました！",
    applyToCurrentProductBtn: "🔄 現在の商品の動画・吹替のみ差替",
    crfLabel: "高圧縮品質 (CRF 20 ~ 35, 推奨: 28)",
    speedLabel: "再生速度",
    audioLabel: "オーディオトラック",
    audioKeep: "🔊 元の音声を維持",
    audioMuteOpt: "🔇 ミュート (無音)",
    renderBtn: "🚀 動画音声翻訳＆圧縮＆商品登録 (Voice Dubbing, Compression & Register)",
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
    viewOverlay: "🎬 フル画面",
    adminNewProdTitle: "✨ 新規商品および動画マッピング登録",
    prodNameRequired: "商品名 *",
    prodNamePlaceholderShort: "例：有機栽培キイチゴ",
    prodPriceRequired: "価格 (엔) *",
    prodStockRequired: "在庫 *",
    prodVideoRequired: "動画パス *",
    prodVideoPlaceholder: "/videos/ファイル名.mp4",
    prodIconOptional: "アイコン",
    prodDescOptional: "詳細説明",
    prodDescPlaceholderShort: "商品の詳細説明を入力",
    registerBtnShort: "登録",
    setAsStartupVideo: "⭐ 登録時に開始動画商品として指定",
    resetDemoProducts: "🔄 デフォルトデモ商品セットに初期化",
    realtimeDBSync: "リアルタイムDB/ストレージ同期",
    startupVideoCol: "開始動画",
    startupVideoBadge: "⭐ 開始動画",
    setAsDefaultBtn: "代表に指定",
    noProductsNotice: "登録された商品はありません。上部フォームから商品と動画を登録してください。"
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
    prodPriceLabel: "价格 (위안) *",
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
    priceCol: "价格 (위안)",
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
    uploadVideoBtn: "📁 从电脑选择视频文件 (上传到 public/demo_video/)",
    uploadingVideo: "⏳ 正在上传视频并保存至 public/demo_video/...",
    uploadSuccess: "✅ 上传成功: ",
    uploadHint: "※ 选择电脑中的视频文件(.mp4, .webm)将直接上传至 public/demo_video/ 目录。",
    demoFolderLabel: "📂 public/demo_video/ 视频文件列表",
    voiceDubbingTitle: "🎙️ AI母语级英语配音工作台 (Voice-Over)",
    voicePersonaLabel: "配音角色模型 (Voice Persona)",
    voiceMaleC: "👨 男性 C: 60岁 沉稳庄重且典雅的大师旁白 (语速微缓・深沉醇厚)",
    voiceFemaleD: "👩 女性 D: 60岁 温婉优雅的资深名品主播 (语速微缓・从容亲切)",
    dubbingModeLabel: "配音模式",
    dubbingVoiceOver: "🎧 AI母语配音 (原音15%背景压音 + 英语配音 - 强烈推荐 ⭐)",
    dubbingReplace: "🌐 替换原声配音 (完全静音原声 + 纯净英语配音)",
    refreshListBtn: "刷新列表",
    videoPreviewLabel: "视频实时预览",
    autoRegisterSuccess: "✨ 基于视频的新商品已自动完成登记！可在下方直接修改单价和详细说明。",
    autoProductEditTitle: "🛍️ 即时修改登记商品信息 (单价 / 详细说明 / 库存)",
    editProdBtn: "✏️ 编辑",
    editProductModalTitle: "✏️ 编辑商品详细信息",
    saveChangesBtn: "💾 保存修改",
    cancelBtn: "取消",
    saveSuccess: "✅ 商品信息已成功更新！",
    replaceVideoDubbingBtn: "🎬 更换视频与翻译配音",
    replaceModalTitle: "🎬 更换视频并重新生成翻译配音",
    replaceModalDesc: "原商品名称、价格、库存及图标将完整保留，仅即时替换所选视频与多语言翻译配音文案。",
    selectOrUploadVideo: "选择视频素材或上传新文件",
    dubbingScriptEdit: "编辑翻译描述与配音文案",
    applyReplaceBtn: "✅ 立即应用视频与翻译配音更换",
    replaceSuccessMsg: "✅ 视频与翻译配音已成功更换！",
    applyToCurrentProductBtn: "🔄 仅更换当前商品的视频与配音",
    crfLabel: "高压缩质量 (CRF 20 ~ 35, 推荐: 28)",
    speedLabel: "播放速度",
    audioLabel: "音轨设置",
    audioKeep: "🔊 保留原声",
    audioMuteOpt: "🔇 静音 (Mute)",
    renderBtn: "🚀 视频语音翻译 & 压缩 & 商品登记 (Voice Dubbing, Compression & Register)",
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
    viewOverlay: "🎬 全屏直播",
    adminNewProdTitle: "✨ 注册新商品与视频映射",
    prodNameRequired: "商品名称 *",
    prodNamePlaceholderShort: "例：有机树莓",
    prodPriceRequired: "价格 (위안) *",
    prodStockRequired: "库存 *",
    prodVideoRequired: "视频路径 *",
    prodVideoPlaceholder: "/videos/文件名.mp4",
    prodIconOptional: "图标",
    prodDescOptional: "详细描述",
    prodDescPlaceholderShort: "输入商品详细描述",
    registerBtnShort: "注册",
    setAsStartupVideo: "⭐ 注册后立即设为初始播放视频",
    resetDemoProducts: "🔄 重置为默认演示商品集",
    realtimeDBSync: "实时数据库/存储同步",
    startupVideoCol: "初始视频",
    startupVideoBadge: "⭐ 初始视频",
    setAsDefaultBtn: "设为默认",
    noProductsNotice: "暂无注册商品。请使用上方表单添加商品与视频。"
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
    prodPriceLabel: "Precio ($) *",
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
    priceCol: "Precio ($)",
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
    uploadVideoBtn: "📁 Buscar archivo de video en PC (Subir a public/demo_video/)",
    uploadingVideo: "⏳ Subiendo y guardando en public/demo_video/...",
    uploadSuccess: "✅ Subida completada: ",
    uploadHint: "※ Selecciona un video (.mp4, .webm) de tu PC para guardarlo en public/demo_video/.",
    demoFolderLabel: "📂 Archivos en public/demo_video/",
    voiceDubbingTitle: "🎙️ Estudio de Doblaje por IA (Voice-Over)",
    voicePersonaLabel: "Persona de Voz",
    voiceMaleC: "👨 Masculino C: Narrador maestro senior de 60 años (ligeramente más pausado, tono profundo)",
    voiceFemaleD: "👩 Femenino D: Presentadora senior de 60 años elegante y cálida (ligeramente más pausada, tono sereno)",
    dubbingModeLabel: "Modo de Doblaje",
    dubbingVoiceOver: "🎧 AI Voice-Over (Audio original al 15% + Doblaje en inglés - Rec ⭐)",
    dubbingReplace: "🌐 Reemplazo completo (Silenciar original + Voz limpia en inglés)",
    refreshListBtn: "Actualizar",
    videoPreviewLabel: "Vista previa de video",
    autoRegisterSuccess: "✨ ¡Nuevo producto registrado automáticamente! Puede editar el precio y la descripción abajo.",
    autoProductEditTitle: "🛍️ Editar detalles del producto (Precio / Descripción / Stock)",
    editProdBtn: "✏️ Editar",
    editProductModalTitle: "✏️ Editar Detalles del Producto",
    saveChangesBtn: "💾 Guardar Cambios",
    cancelBtn: "Cancelar",
    saveSuccess: "✅ ¡Detalles del producto actualizados con éxito!",
    replaceVideoDubbingBtn: "🎬 Reemplazar Video y Doblaje",
    replaceModalTitle: "🎬 Reemplazar Video y Regenerar Doblaje",
    replaceModalDesc: "El nombre, precio, stock e ícono del producto se conservan al 100%. Solo se reemplazan el video y el guión de doblaje traducido.",
    selectOrUploadVideo: "Seleccionar Video o Subir Nuevo Archivo",
    dubbingScriptEdit: "Editar Descripción Traducida / Guión de Doblaje",
    applyReplaceBtn: "✅ Aplicar Reemplazo de Video y Doblaje",
    replaceSuccessMsg: "✅ ¡Video y doblaje reemplazados con éxito!",
    applyToCurrentProductBtn: "🔄 Reemplazar solo Video y Doblaje del Producto Actual",
    crfLabel: "Calidad de Compresión (CRF 20 ~ 35, Rec: 28)",
    speedLabel: "Velocidad",
    audioLabel: "Pista de Audio",
    audioKeep: "🔊 Mantener Audio Original",
    audioMuteOpt: "🔇 Silenciar (Mute)",
    renderBtn: "🚀 Doblaje de Voz, Compresión y Registro de Video",
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
    viewOverlay: "🎬 En Vivo",
    adminNewProdTitle: "✨ Registrar Nuevo Producto y Video",
    prodNameRequired: "Nombre del Producto *",
    prodNamePlaceholderShort: "ej., Frambuesas Orgánicas",
    prodPriceRequired: "Precio ($) *",
    prodStockRequired: "Stock *",
    prodVideoRequired: "Ruta del Video *",
    prodVideoPlaceholder: "/videos/archivo.mp4",
    prodIconOptional: "Icono",
    prodDescOptional: "Descripción",
    prodDescPlaceholderShort: "Ingrese descripción detallada",
    registerBtnShort: "Registrar",
    setAsStartupVideo: "⭐ Establecer como video inicial al registrar",
    resetDemoProducts: "🔄 Restablecer a Productos Demo",
    realtimeDBSync: "Sincronización BD / Almacenamiento en Vivo",
    startupVideoCol: "Video Inicial",
    startupVideoBadge: "⭐ Video Inicial",
    setAsDefaultBtn: "Fijar Principal",
    noProductsNotice: "No hay productos registrados. Por favor registre un producto y video arriba."
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
    prodPriceLabel: "Prix (€) *",
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
    priceCol: "Prix (€)",
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
    uploadVideoBtn: "📁 Parcourir la vidéo sur PC (Téléverser vers public/demo_video/)",
    uploadingVideo: "⏳ Téléversement et enregistrement dans public/demo_video/...",
    uploadSuccess: "✅ Téléversement réussi : ",
    uploadHint: "※ Sélectionnez une vidéo (.mp4, .webm) de votre PC pour l'enregistrer dans public/demo_video/.",
    demoFolderLabel: "📂 Fichiers vidéo dans public/demo_video/",
    voiceDubbingTitle: "🎙️ Studio de Doublage Natif IA (Voice-Over)",
    voicePersonaLabel: "Voix / Persona",
    voiceMaleC: "👨 Homme C : Maître narrateur senior de 60 ans (légèrement plus posé, voix noble)",
    voiceFemaleD: "👩 Femme D : Animatrice senior de 60 ans chaleureuse et raffinée (légèrement plus posée, ton serein)",
    dubbingModeLabel: "Mode de Doublage",
    dubbingVoiceOver: "🎧 AI Voice-Over (Son original atténué à 15% + Voix anglaise - Recommandé ⭐)",
    dubbingReplace: "🌐 Remplacement total (Son original muet + Voix anglaise seule)",
    refreshListBtn: "Actualiser",
    videoPreviewLabel: "Aperçu vidéo en direct",
    autoRegisterSuccess: "✨ Nouveau produit enregistré automatiquement ! Vous pouvez modifier le prix et la description ci-dessous.",
    autoProductEditTitle: "🛍️ Modifier les détails du produit (Prix / Description / Stock)",
    editProdBtn: "✏️ Modifier",
    editProductModalTitle: "✏️ Modifier les Détails du Produit",
    saveChangesBtn: "💾 Enregistrer les Modifications",
    cancelBtn: "Annuler",
    saveSuccess: "✅ Détails du produit mis à jour avec succès !",
    replaceVideoDubbingBtn: "🎬 Remplacer Vidéo & Doublage",
    replaceModalTitle: "🎬 Remplacer Vidéo et Régénérer le Doublage",
    replaceModalDesc: "Le nom du produit, le prix, le stock et l'icône sont conservés à 100%. Seuls la vidéo et le script de doublage traduit sont remplacés.",
    selectOrUploadVideo: "Sélectionner une Vidéo ou Téléverser un Fichier",
    dubbingScriptEdit: "Modifier la Description Traduite / Script de Doublage",
    applyReplaceBtn: "✅ Appliquer le Remplacement Vidéo et Doublage",
    replaceSuccessMsg: "✅ Vidéo et doublage remplacés avec succès !",
    applyToCurrentProductBtn: "🔄 Remplacer uniquement la Vidéo et Doublage du Produit Actuel",
    crfLabel: "Qualité de Compression (CRF 20 ~ 35, Rec: 28)",
    speedLabel: "Vitesse",
    audioLabel: "Piste Audio",
    audioKeep: "🔊 Conserver l'Audio Original",
    audioMuteOpt: "🔇 Muet (Mute)",
    renderBtn: "🚀 Doublage Vocal, Compression et Enregistrement Vidéo",
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
    viewOverlay: "🎬 Plein Écran",
    adminNewProdTitle: "✨ Enregistrer un Nouveau Produit et Vidéo",
    prodNameRequired: "Nom du Produit *",
    prodNamePlaceholderShort: "ex., Framboises Bio",
    prodPriceRequired: "Prix (€) *",
    prodStockRequired: "Stock *",
    prodVideoRequired: "Chemin Vidéo *",
    prodVideoPlaceholder: "/videos/fichier.mp4",
    prodIconOptional: "Icône",
    prodDescOptional: "Description",
    prodDescPlaceholderShort: "Entrez la description du produit",
    registerBtnShort: "Enregistrer",
    setAsStartupVideo: "⭐ Définir comme vidéo de démarrage dès l'enregistrement",
    resetDemoProducts: "🔄 Réinitialiser aux Produits de Démo",
    realtimeDBSync: "Synchronisation DB / Stockage en direct",
    startupVideoCol: "Vidéo Initiale",
    startupVideoBadge: "⭐ Vidéo Initiale",
    setAsDefaultBtn: "Définir par défaut",
    noProductsNotice: "Aucun produit enregistré. Veuillez enregistrer un produit et une vidéo ci-dessus."
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
  const [lang, setLang] = useState<Language>("en");
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
  const [newProdPrice, setNewProdPrice] = useState<string>("");
  const [newProdStock, setNewProdStock] = useState<string>("10");
  const [newProdIcon, setNewProdIcon] = useState<string>("🎁");
  const [newProdVideo, setNewProdVideo] = useState<string>("");
  const [newProdDesc, setNewProdDesc] = useState<string>("");
  const [isStartVideo, setIsStartVideo] = useState<boolean>(false);
  const [defaultProductId, setDefaultProductId] = useState<string | null>(null);

  const currentProd = activeProduct || products.find(p => p.id === defaultProductId) || products[0] || null;

  const [newKeyword, setNewKeyword] = useState<string>("");
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newAnswer, setNewAnswer] = useState<string>("");

  const [selectedVideoAsset, setSelectedVideoAsset] = useState<string>("");
  const [demoVideoFiles, setDemoVideoFiles] = useState<{ name: string; path: string; size?: number }[]>([]);
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [voicePersona, setVoicePersona] = useState<"male_c" | "female_d">("male_c");
  const [dubbingMode, setDubbingMode] = useState<"voice_over" | "replace">("voice_over");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [compressionCrf, setCompressionCrf] = useState<number>(28);
  const [videoSpeed, setVideoSpeed] = useState<string>("1.0");
  const [audioMute, setAudioMute] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processLog, setProcessLog] = useState<string>("");

  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true); // 모바일 브라우저 자동재생(Autoplay) 정책 준수를 위해 기본 음소거 활성화
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState<boolean>(false);

  const fetchDemoVideos = async () => {
    try {
      const res = await fetch("/api/list-demo-videos");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.files) && data.files.length > 0) {
          setDemoVideoFiles(data.files);
          if (!selectedVideoAsset) {
            setSelectedVideoAsset(data.files[0].path);
          }
          const syncedList = await productService.syncWithServerVideos(data.files);
          setProducts(syncedList);
          const defId = await productService.getDefaultProductId();
          setDefaultProductId(defId);
          const target = syncedList.find(p => p.id === defId) || syncedList[0] || null;
          setActiveProduct(target);
          return;
        }
      }
    } catch {
      // ignore
    }
    // Vercel 정적 배포 또는 API 미지원 시 STATIC_DEMO_VIDEOS로 즉시 동기화하여 검은 화면 방지
    setDemoVideoFiles(STATIC_DEMO_VIDEOS);
    if (!selectedVideoAsset) {
      setSelectedVideoAsset(STATIC_DEMO_VIDEOS[0].path);
    }
    const syncedList = await productService.syncWithServerVideos(STATIC_DEMO_VIDEOS);
    setProducts(syncedList);
    const defId = await productService.getDefaultProductId();
    setDefaultProductId(defId);
    const target = syncedList.find(p => p.id === defId) || syncedList[0] || null;
    setActiveProduct(target);
  };

  useEffect(() => {
    fetchDemoVideos();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    setUploadMessage(`${t.uploadingVideo} (${file.name})`);

    const objectUrl = URL.createObjectURL(file);

    try {
      const res = await fetch("/api/upload-video", {
        method: "POST",
        headers: {
          "x-file-name": encodeURIComponent(file.name)
        },
        body: file
      });

      if (res.ok) {
        const data = await res.json();
        const serverPath = data.url || `/demo_video/${file.name}`;
        setUploadMessage(`${t.uploadSuccess} public/demo_video/${data.fileName || file.name}`);
        setSelectedVideoAsset(serverPath);
        setNewProdVideo(serverPath);
        setReplaceVideoAsset(serverPath);
        const tempName = (data.fileName || file.name).replace(/\.[^/.]+$/, "");
        setNewProdName(tempName);
        await fetchDemoVideos();
      } else {
        setUploadMessage(`${t.uploadSuccess} (${file.name})`);
        setSelectedVideoAsset(objectUrl);
        setNewProdVideo(objectUrl);
        setReplaceVideoAsset(objectUrl);
        setNewProdName(file.name.replace(/\.[^/.]+$/, ""));
      }
    } catch (err) {
      console.warn("Upload fallback to object URL:", err);
      setUploadMessage(`${t.uploadSuccess} (${file.name})`);
      setSelectedVideoAsset(objectUrl);
    } finally {
      setIsUploadingVideo(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // 상품 상세 정보 편집 (단가, 상세설명, 재고, 상품명 등) 관련 상태
  const [editingProduct, setEditingProduct] = useState<ProductEntity | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editFormName, setEditFormName] = useState<string>("");
  const [editFormPrice, setEditFormPrice] = useState<number>(35000);
  const [editFormStock, setEditFormStock] = useState<number>(20);
  const [editFormDesc, setEditFormDesc] = useState<string>("");
  const [editFormIcon, setEditFormIcon] = useState<string>("🎬");
  const [editFormVideo, setEditFormVideo] = useState<string>("");
  const [editSuccessMsg, setEditSuccessMsg] = useState<string | null>(null);
  const [lastAutoRegisteredProduct, setLastAutoRegisteredProduct] = useState<ProductEntity | null>(null);

  // 동영상 및 번역·더빙 교체/재생성 전용 모달 상태
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState<boolean>(false);
  const [replaceTargetProduct, setReplaceTargetProduct] = useState<ProductEntity | null>(null);
  const [replaceVideoAsset, setReplaceVideoAsset] = useState<string>("");
  const [replaceDubbingScript, setReplaceDubbingScript] = useState<string>("");
  const [replaceSuccessMsg, setReplaceSuccessMsg] = useState<string | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement | null>(null);

  const openReplaceVideoModal = (product: ProductEntity) => {
    setReplaceTargetProduct(product);
    setReplaceVideoAsset(product.videoUrl);
    setReplaceDubbingScript(product.description[lang] || product.description.ko || "");
    setReplaceSuccessMsg(null);
    setIsReplaceModalOpen(true);
  };

  const handleApplyReplaceVideo = async (targetProd?: ProductEntity, newVideoUrl?: string, newDesc?: string) => {
    const prod = targetProd || replaceTargetProduct;
    if (!prod) return;
    const finalVideo = newVideoUrl || replaceVideoAsset || prod.videoUrl;
    const finalDesc = newDesc !== undefined ? newDesc : replaceDubbingScript;

    const updatedList = await productService.updateProduct(prod.id, {
      videoUrl: finalVideo,
      description: {
        ko: lang === "ko" ? finalDesc : (prod.description.ko || finalDesc),
        en: lang === "en" ? finalDesc : (prod.description.en || finalDesc),
        ja: lang === "ja" ? finalDesc : (prod.description.ja || finalDesc),
        zh: lang === "zh" ? finalDesc : (prod.description.zh || finalDesc),
        es: lang === "es" ? finalDesc : (prod.description.es || finalDesc),
        fr: lang === "fr" ? finalDesc : (prod.description.fr || finalDesc),
      }
    });

    setProducts(updatedList);
    const refreshed = updatedList.find(p => p.id === prod.id) || null;
    if (activeProduct && activeProduct.id === prod.id) {
      setActiveProduct(refreshed);
    }
    if (replaceTargetProduct && replaceTargetProduct.id === prod.id) {
      setReplaceTargetProduct(refreshed);
    }
    setReplaceSuccessMsg(t.replaceSuccessMsg || "✅ 동영상과 번역·더빙이 성공적으로 교체되었습니다!");
    setTimeout(() => {
      setReplaceSuccessMsg(null);
      setIsReplaceModalOpen(false);
    }, 1200);
  };

  const openProductEditor = (product: ProductEntity) => {
    setEditingProduct(product);
    setEditFormName(product.name[lang] || product.name.ko || "");
    setEditFormPrice(product.price);
    setEditFormStock(product.stock);
    setEditFormDesc(product.description[lang] || product.description.ko || "");
    setEditFormIcon(product.icon || "🎁");
    setEditFormVideo(product.videoUrl);
    setEditSuccessMsg(null);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedProduct = async () => {
    if (!editingProduct) return;
    const updatedName = editFormName.trim() || editingProduct.name[lang] || "Product";
    const updatedDesc = editFormDesc.trim() || editingProduct.description[lang] || "";
    
    const updatedList = await productService.updateProduct(editingProduct.id, {
      name: {
        ko: lang === "ko" ? updatedName : (editingProduct.name.ko || updatedName),
        en: lang === "en" ? updatedName : (editingProduct.name.en || updatedName),
        ja: lang === "ja" ? updatedName : (editingProduct.name.ja || updatedName),
        zh: lang === "zh" ? updatedName : (editingProduct.name.zh || updatedName),
        es: lang === "es" ? updatedName : (editingProduct.name.es || updatedName),
        fr: lang === "fr" ? updatedName : (editingProduct.name.fr || updatedName),
      },
      price: Number(editFormPrice) || 0,
      stock: Number(editFormStock) || 0,
      description: {
        ko: lang === "ko" ? updatedDesc : (editingProduct.description.ko || updatedDesc),
        en: lang === "en" ? updatedDesc : (editingProduct.description.en || updatedDesc),
        ja: lang === "ja" ? updatedDesc : (editingProduct.description.ja || updatedDesc),
        zh: lang === "zh" ? updatedDesc : (editingProduct.description.zh || updatedDesc),
        es: lang === "es" ? updatedDesc : (editingProduct.description.es || updatedDesc),
        fr: lang === "fr" ? updatedDesc : (editingProduct.description.fr || updatedDesc),
      },
      icon: editFormIcon || "🎁",
      videoUrl: editFormVideo || editingProduct.videoUrl
    });

    setProducts(updatedList);
    const refreshed = updatedList.find(p => p.id === editingProduct.id) || null;
    setEditingProduct(refreshed);
    if (lastAutoRegisteredProduct && lastAutoRegisteredProduct.id === editingProduct.id) {
      setLastAutoRegisteredProduct(refreshed);
    }
    setEditSuccessMsg(t.saveSuccess);
    setTimeout(() => {
      setEditSuccessMsg(null);
      setIsEditModalOpen(false);
    }, 1200);
  };

  const handleQuickAutoRegister = async (videoUrlToUse?: string) => {
    const targetVideo = videoUrlToUse || selectedVideoAsset;
    const rawFileName = targetVideo.split("/").pop() || "Demo_Product";
    const tempProdName = rawFileName ? rawFileName.replace(/\.[^/.]+$/, "") : "Live Special Product";

    // 사용자 요청: 비디오 파일명을 임시 상품명으로 등록, 상세설명은 공란("")으로 깔끔하게 설정
    const updatedList = await productService.addProduct({
      name: {
        ko: tempProdName,
        en: tempProdName,
        ja: tempProdName,
        zh: tempProdName,
        es: tempProdName,
        fr: tempProdName
      },
      price: 0,
      currency: "KRW",
      stock: 10,
      icon: "🎁",
      videoUrl: targetVideo,
      fallbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      description: {
        ko: "",
        en: "",
        ja: "",
        zh: "",
        es: "",
        fr: ""
      }
    }, true);

    setProducts(updatedList);
    const newlyCreated = updatedList[0];
    setLastAutoRegisteredProduct(newlyCreated);
    setEditingProduct(newlyCreated);
    setEditFormName(tempProdName);
    setEditFormPrice(0);
    setEditFormStock(10);
    setEditFormDesc("");
    setEditFormIcon("🎁");
    setEditFormVideo(newlyCreated.videoUrl);

    const newDefId = await productService.getDefaultProductId();
    setDefaultProductId(newDefId);
    return newlyCreated;
  };

  // AI Voice Dubbing Engine (원어민 영어 및 국가별 언어 실시간 음성 더빙)
  const [isDubbingEnabled, setIsDubbingEnabled] = useState<boolean>(true);
  const isDubbingActiveRef = useRef<boolean>(false);
  const dubbingScriptIndexRef = useRef<number>(0);

  const getDubbingScript = (prod: ProductEntity | null, language: Language): string[] => {
    const prodName = prod?.name[language] || prod?.name.ko || (language === "en" ? "Exclusive Live Product" : "라이브 특별 상품");
    const prodDesc = prod?.description[language] || prod?.description.ko || "";

    if (language === "en") {
      return [
        `Welcome to PayPal AI Live Shopping! Right now we are featuring ${prodName}.`,
        prodDesc ? prodDesc : `This premium authentic item is direct from origin and certified organic with verified quality.`,
        `Limited inventory remains in stock! You can checkout right now with one single click using the golden PayPal button.`
      ];
    } else if (language === "ja") {
      return [
        `PayPal AIライブコマースへようこそ！本日ご紹介するのは${prodName}です。`,
        prodDesc ? prodDesc : `産地直送の厳選されたオーガニック特産品をお届けします。`,
        `数量限定です！画面下のPayPalボタンから、ワンクリックで安全にお支払いいただけます。`
      ];
    } else if (language === "zh") {
      return [
        `欢迎来到 PayPal AI 智能直播带货！今天为您精选推荐的是 ${prodName}。`,
        prodDesc ? prodDesc : `产地直采高品质有机认证商品，品质卓越，值得信赖。`,
        `实时库存极为有限！点击下方的 PayPal 金色按钮，即可一键极速安全下单。`
      ];
    } else if (language === "es") {
      return [
        `¡Bienvenido a PayPal Live Shopping! Hoy presentamos ${prodName}.`,
        prodDesc ? prodDesc : `Producto orgánico premium certificado, directo del productor a su hogar.`,
        `¡Stock muy limitado! Puede pagar al instante con un solo clic usando el botón dorado de PayPal.`
      ];
    } else if (language === "fr") {
      return [
        `Bienvenue sur le Live Shopping PayPal ! Aujourd'hui nous vous présentons ${prodName}.`,
        prodDesc ? prodDesc : `Produit biologique d'exception certifié, direct du producteur.`,
        `Stock très limité ! Commandez instantanément en un clic avec le bouton officiel PayPal.`
      ];
    } else {
      return [
        `페이팔 AI 라이브 쇼핑에 오신 것을 환영합니다! 오늘 선보이는 상품은 ${prodName}입니다.`,
        prodDesc ? prodDesc : `청정 자연에서 직송한 100% 천연 인증 특산품입니다.`,
        `실시간 한정 수량입니다! 하단의 페이팔 원클릭 결제 버튼으로 안전하게 주문하세요.`
      ];
    }
  };

  const stopDubbing = () => {
    isDubbingActiveRef.current = false;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const playNextDubbingSegment = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (!isDubbingActiveRef.current || isAudioMuted || !isDubbingEnabled) return;

    const scripts = getDubbingScript(currentProd, lang);
    if (!scripts || scripts.length === 0) return;

    const textToSpeak = scripts[dubbingScriptIndexRef.current % scripts.length];
    dubbingScriptIndexRef.current = (dubbingScriptIndexRef.current + 1) % scripts.length;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    const langCodeMap: Record<Language, string> = {
      en: "en-US",
      ko: "ko-KR",
      ja: "ja-JP",
      zh: "zh-CN",
      es: "es-ES",
      fr: "fr-FR"
    };
    utterance.lang = langCodeMap[lang] || "en-US";

    const voices = window.speechSynthesis.getVoices();
    const targetCode = (langCodeMap[lang] || "en-US").slice(0, 2).toLowerCase();
    const matchingVoices = voices.filter(v => v.lang.toLowerCase().startsWith(targetCode));
    
    // 남성/여성 60대 장인/시니어 보이스 매칭
    let matchedVoice: SpeechSynthesisVoice | undefined;
    if (voicePersona === "male_c") {
      matchedVoice = matchingVoices.find(v => /david|george|guy|james|mark|male|richard|martin|jean/i.test(v.name)) || matchingVoices[0];
    } else {
      matchedVoice = matchingVoices.find(v => /zira|susan|catherine|mary|female|clara|marie/i.test(v.name)) || matchingVoices[0];
    }
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    if (voicePersona === "male_c") {
      utterance.pitch = 0.74; // 60대 중후하고 품격 있는 남성 장인 톤
      utterance.rate = 0.82;  // 60대 약간 느리고 편안한 호흡
    } else {
      utterance.pitch = 0.86; // 60대 온화하고 우아한 여성 시니어 톤
      utterance.rate = 0.82;  // 60대 약간 느리고 편안한 호흡
    }
    utterance.volume = 1.0; // 사용자 요청: 볼륨 100% 그대로 유지

    utterance.onend = () => {
      if (isDubbingActiveRef.current && !isAudioMuted && isDubbingEnabled) {
        setTimeout(() => {
          playNextDubbingSegment();
        }, 2200);
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis notice:", e);
    };

    window.speechSynthesis.speak(utterance);
  };

  const startDubbing = () => {
    stopDubbing();
    if (isAudioMuted || !isDubbingEnabled) return;

    if (videoRef.current) {
      if (lang !== "ko") {
        videoRef.current.muted = false;
        videoRef.current.volume = 0.12; // Sidechain audio ducking for original Korean track
      } else {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        return; // In Korean mode, play original audio directly
      }
    }

    isDubbingActiveRef.current = true;
    dubbingScriptIndexRef.current = 0;
    playNextDubbingSegment();
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  useEffect(() => {
    if (!isAudioMuted && isPlaying) {
      startDubbing();
    } else {
      stopDubbing();
      if (videoRef.current && isAudioMuted) {
        videoRef.current.muted = true;
      }
    }
    return () => {
      stopDubbing();
    };
  }, [isAudioMuted, isPlaying, lang, currentProd?.id, voicePersona, isDubbingEnabled]);

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
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = isAudioMuted;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsAutoplayBlocked(false);
          })
          .catch(err => {
            if (err.name === "AbortError") {
              return; // React render cycle interruption, safely ignore
            }
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsAudioMuted(true);
              videoRef.current.play().then(() => {
                setIsPlaying(true);
                setIsAutoplayBlocked(false);
              }).catch(() => {
                setIsAutoplayBlocked(true);
              });
              return;
            }
            console.warn("Video autoplay prevented by browser policy:", err);
            setIsAutoplayBlocked(true);
          });
      }
    }
  }, [activeProduct?.id, isAudioMuted, currentProd?.videoUrl, demoVideoFiles]);

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

    let aiReplyText: Record<Language, string> = {
      ko: `🤖 "${inputText}" 문의가 접수되었습니다.`,
      en: `🤖 "${inputText}" inquiry received.`,
      ja: `🤖 「${inputText}」のお問い合わせを受け付けました。`,
      zh: `🤖 已收到“${inputText}”相关咨询。`,
      es: `🤖 Consulta "${inputText}" recibida.`,
      fr: `🤖 Demande "${inputText}" reçue.`
    };
    let suggestedProd: Product | undefined = undefined;

    if (matchedQA) {
      aiReplyText = {
        ko: `🤖 ${matchedQA.answer}`,
        en: `🤖 ${matchedQA.answer}`,
        ja: `🤖 ${matchedQA.answer}`,
        zh: `🤖 ${matchedQA.answer}`,
        es: `🤖 ${matchedQA.answer}`,
        fr: `🤖 ${matchedQA.answer}`
      };
    } else if (matchedProd) {
      setActiveProduct(matchedProd);
      aiReplyText = { ko: "", en: "", ja: "", zh: "", es: "", fr: "" }; // 상단 설명란 없이 결제열기란 카드만 표시
      suggestedProd = matchedProd;
    } else if (query.includes("pay") || query.includes("결제") || query.includes("checkout")) {
      if (!activeProduct || activeProduct.stock <= 0) {
        aiReplyText = {
          ko: "🤖 죄송합니다. 선택하신 상품은 품절되었습니다.",
          en: "🤖 Sorry, the selected item is sold out.",
          ja: "🤖 申し訳ありません。商品は売り切れです。",
          zh: "🤖 抱歉，该商品已售罄。",
          es: "🤖 Lo sentimos, el producto está agotado.",
          fr: "🤖 Désolé, le produit est épuisé."
        };
      } else {
        setIsCheckingOut(true);
        aiReplyText = {
          ko: "🤖 페이팔 안전 결제창이 열렸습니다.",
          en: "🤖 PayPal secure checkout opened.",
          ja: "🤖 PayPal決済画面を開きました。",
          zh: "🤖 已打开 PayPal 安全支付。",
          es: "🤖 Ventana de pago PayPal abierta.",
          fr: "🤖 Fenêtre de paiement PayPal ouverte."
        };
      }
    } else {
      aiReplyText = {
        ko: `🤖 "${inputText}" 문의가 접수되었습니다.`,
        en: `🤖 "${inputText}" inquiry received.`,
        ja: `🤖 「${inputText}」のお問い合わせを受け付けました。`,
        zh: `🤖 已收到“${inputText}”相关咨询。`,
        es: `🤖 Consulta "${inputText}" recibida.`,
        fr: `🤖 Demande "${inputText}" reçue.`
      };
    }

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString() + "-ai",
      sender: "ai",
      text: aiReplyText,
      timestamp: new Date().toLocaleTimeString(),
      suggestedProduct: suggestedProd
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInputText("");
  };

  const handlePaymentSuccess = async (orderId: string, product: Product) => {
    setCheckoutStatus(t.paymentCompleted);
    
    const countryPrefix = lang === "en" ? "US-" : lang === "ja" ? "JP-" : lang === "zh" ? "CN-" : lang === "es" ? "ES-" : lang === "fr" ? "FR-" : "KR-";
    const newOrder: OrderRecord = {
      orderId,
      productName: product.name[lang] || product.name.en || product.name.ko,
      amount: product.price,
      currency: product.currency,
      timestamp: new Date().toLocaleString(lang === "en" ? "en-US" : lang === "ja" ? "ja-JP" : lang === "zh" ? "zh-CN" : lang === "es" ? "es-ES" : lang === "fr" ? "fr-FR" : "ko-KR"),
      status: "Completed (Sandbox)",
      shippingStatus: t.statusPrep || "Preparing Shipment",
      trackingNumber: countryPrefix + Math.floor(100000 + Math.random() * 900000)
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
    const trans = productTranslationService.translateProduct(newProdName.trim(), descText);
    const updated = await productService.addProduct({
      name: trans.name,
      price: Number(newProdPrice) || 35000,
      currency: "KRW",
      stock: Number(newProdStock) || 10,
      icon: newProdIcon || "🎁",
      videoUrl: selectedVideoAsset || newProdVideo || (demoVideoFiles.length > 0 ? demoVideoFiles[0].path : ""),
      fallbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      description: trans.description
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
    const target = products.find(p => p.id === productId);
    if (target) {
      openReplaceVideoModal(target);
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
    if (!newProdName.trim()) {
      alert("1단계에서 상품명을 입력해 주세요.");
      return;
    }
    if (!selectedVideoAsset) {
      alert("동영상 파일을 업로드하거나 선택해 주세요.");
      return;
    }
    setIsProcessing(true);
    const personaLabel = voicePersona === "male_c" 
      ? "👨 Male C (60s Prestigious Elder Master Narrator)" 
      : "👩 Female D (60s Warm & Elegant Senior Host)";
    const modeLabel = dubbingMode === "voice_over" 
      ? "🎧 15% Ducked Original + AI English Voice-Over" 
      : "🌐 Full AI Voice Replace (Mute Original)";

    const registeredName = newProdName.trim();
    let rawPriceNum = Number(newProdPrice) || 35000;
    if (rawPriceNum > 0 && rawPriceNum < 1000) {
      if (lang === "en" || lang === "es") rawPriceNum = Math.round(rawPriceNum * 1350);
      else if (lang === "fr") rawPriceNum = Math.round(rawPriceNum * 1450);
      else if (lang === "zh") rawPriceNum = Math.round(rawPriceNum / 0.0053);
    } else if (rawPriceNum > 0 && lang === "ja" && rawPriceNum < 20000) {
      rawPriceNum = Math.round(rawPriceNum / 0.11);
    }
    const currentPrice = rawPriceNum;

    setProcessLog(
      `[Video Engine] Binding to Step 1 Product: "${registeredName}" (Price: ${formatPrice(currentPrice, lang)})\n` +
      `[Video Engine] Loading asset: ${selectedVideoAsset} ...\n` +
      `[Video Engine] Settings: CRF ${compressionCrf}, Speed ${videoSpeed}x\n` +
      `[Whisper-AI] Extracting vocal track & transcribing Korean speech to ${lang.toUpperCase()} text...\n` +
      `[Gemini Voice Engine] Target Persona: ${personaLabel}\n` +
      `[Gemini Voice Engine] Dubbing Mode: ${modeLabel}\n` +
      `[Gemini Voice Engine] Synthesizing studio-grade native voice stream (${lang.toUpperCase()})...\n` +
      `[FFmpeg Audio Mixer] Sidechain ducking Korean audio by -16dB & blending Native Voice-Over...\n` +
      `[FFmpeg Web Stream] Re-encoding video stream (H.264 / AAC) with faststart moov atom...\n` +
      `[Complete Registration] Finalizing product & video bundle registration...`
    );

    setTimeout(async () => {
      const descText = newProdDesc.trim() || `${registeredName} 등록 상품`;
      const trans = productTranslationService.translateProduct(registeredName, descText);
      const updated = await productService.addProduct({
        name: trans.name,
        price: currentPrice,
        currency: "KRW",
        stock: Number(newProdStock) || 10,
        icon: newProdIcon || "🎁",
        videoUrl: selectedVideoAsset || DEFAULT_FALLBACK_VIDEO,
        fallbackVideoUrl: DEFAULT_FALLBACK_VIDEO,
        description: trans.description
      }, isStartVideo);

      setProducts(updated);
      const newDefId = await productService.getDefaultProductId();
      setDefaultProductId(newDefId);
      
      if (isStartVideo || updated.length === 1) {
        const created = updated.find(p => p.name.ko === registeredName) || updated[0];
        if (created) setActiveProduct(created);
      }

      // Step 1 입력 필드 초기화
      setNewProdName("");
      setNewProdDesc("");
      setNewProdPrice("");
      setNewProdStock("10");
      setIsStartVideo(false);

      setProcessLog(prev => prev + 
        `\n\n[Success] ✅ Processed dubbed video rendered & saved to public/demo_video/!\n` +
        `[Success] 🛍️ "${registeredName}" 상품이 동영상과 함께 성공적으로 등록되었습니다!\n` +
        `[Status] Ready for Live Streaming with AI Native Voice Dubbing & Instant PayPal Checkout Demo.`
      );
      setIsProcessing(false);
      alert(`"${registeredName}" 상품이 동영상과 함께 성공적으로 등록되었습니다!`);
    }, 1800);
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
                    {formatPrice(orders.reduce((sum, o) => sum + o.amount, 0), lang)}
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
                <h3 className="text-base font-bold text-amber-400">{t.adminNewProdTitle}</h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-5">
                    <label className="text-xs text-slate-300 mb-1 block">{t.prodNameRequired}</label>
                    <input type="text" value={newProdName} onChange={e => setNewProdName(e.target.value)} placeholder={t.prodNamePlaceholderShort} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white" required />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs text-slate-300 mb-1 block">{t.prodPriceRequired}</label>
                    <input 
                      type="number" 
                      value={newProdPrice} 
                      onChange={e => setNewProdPrice(e.target.value)} 
                      placeholder={lang === "en" || lang === "es" ? "e.g., 25" : lang === "ja" ? "例: 3850" : lang === "zh" ? "例: 185" : lang === "fr" ? "ex: 24" : "예: 35000"} 
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-300 mb-1 block">{t.prodStockRequired}</label>
                    <input type="number" value={newProdStock} onChange={e => setNewProdStock(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-300 mb-1 block">{t.prodIconOptional}</label>
                    <IconPicker value={newProdIcon} onChange={setNewProdIcon} />
                  </div>
                  <div className="md:col-span-8">
                    <label className="text-xs text-slate-300 mb-1 block">{t.prodDescOptional}</label>
                    <input type="text" value={newProdDesc} onChange={e => setNewProdDesc(e.target.value)} placeholder={t.prodDescPlaceholderShort} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white" />
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
                      {t.setAsStartupVideo}
                    </label>
                  </div>
                </div>
                <div className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2.5 rounded-lg flex items-center gap-2">
                  <span className="text-base">💡</span>
                  <span>{lang === "ko" ? `1단계에서 상품 정보를 입력하신 후, 아래 2단계 동영상 스튜디오에서 동영상 업로드 후 [${t.renderBtn}] 버튼을 누르면 하나의 완성된 상품으로 묶여 등록됩니다.` : `Enter product details in Step 1, upload video in Step 2, and click [${t.renderBtn}] to complete registration.`}</span>
                </div>
              </div>

              {/* SECTION 1: 동영상 편집 및 압축 스튜디오 */}
              <div className="bg-slate-900 border-2 border-amber-500/40 p-5 rounded-xl flex flex-col gap-4 shadow-xl w-full">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                      <span>🎬</span> {t.tabVideoEditor}
                    </h3>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded font-medium">
                      FFmpeg & AI Voice Studio Active
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Target: <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">public/demo_video/</code>
                  </span>
                </div>

                {/* 1. PC 동영상 파일 선택 및 public/demo_video/ 업로드 컨트롤 */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="video/mp4,video/webm,video/quicktime,video/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploadingVideo}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-white font-bold py-3 px-4 rounded-lg text-xs flex items-center justify-center gap-2 border border-amber-400/50 shadow-lg transition cursor-pointer disabled:opacity-50"
                  >
                    <span className="text-sm">📁</span>
                    <span>{isUploadingVideo ? t.uploadingVideo : t.uploadVideoBtn}</span>
                  </button>

                  {uploadMessage && (
                    <div className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-2 rounded-lg flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>{uploadMessage}</span>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {t.uploadHint}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  <div className="flex flex-col gap-4">
                    {/* 실시간 동영상 미리보기 플레이어 */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <span>📺</span> {t.videoPreviewLabel}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-mono truncate max-w-[250px]">
                          {selectedVideoAsset ? selectedVideoAsset.split('/').pop() : "No video selected"}
                        </span>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-800/80 bg-black aspect-video flex items-center justify-center relative">
                        {selectedVideoAsset ? (
                          <video
                            key={selectedVideoAsset}
                            src={selectedVideoAsset}
                            controls
                            playsInline
                            muted
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-xs text-slate-500 italic">No video selected</span>
                        )}
                      </div>
                    </div>

                    {/* AI 원어민 더빙 옵션 (남성 C / 여성 D) */}
                    <div className="bg-slate-950/80 border border-amber-500/30 p-3.5 rounded-xl flex flex-col gap-3">
                      <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <span>🎙️</span> {t.voiceDubbingTitle}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-300 font-semibold mb-1 block">
                            {t.voicePersonaLabel}
                          </label>
                          <select
                            value={voicePersona}
                            onChange={(e) => setVoicePersona(e.target.value as "male_c" | "female_d")}
                            className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                          >
                            <option value="male_c">{t.voiceMaleC}</option>
                            <option value="female_d">{t.voiceFemaleD}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-300 font-semibold mb-1 block">
                            {t.dubbingModeLabel}
                          </label>
                          <select
                            value={dubbingMode}
                            onChange={(e) => setDubbingMode(e.target.value as "voice_over" | "replace")}
                            className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                          >
                            <option value="voice_over">{t.dubbingVoiceOver}</option>
                            <option value="replace">{t.dubbingReplace}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 압축 및 속도 설정 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-slate-300 font-semibold mb-1 block">{t.crfLabel}</label>
                        <input
                          type="number"
                          min="20"
                          max="35"
                          value={compressionCrf}
                          onChange={(e) => setCompressionCrf(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 font-semibold mb-1 block">{t.speedLabel}</label>
                        <select
                          value={videoSpeed}
                          onChange={(e) => setVideoSpeed(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
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
                          className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option value="keep">{t.audioKeep}</option>
                          <option value="mute">{t.audioMuteOpt}</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-1">
                      <button
                        disabled={isProcessing}
                        onClick={runVideoEditorCompression}
                        className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 disabled:bg-slate-700 text-white py-3 rounded-lg text-xs font-bold transition shadow-xl cursor-pointer border border-amber-400/40 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? t.renderingBtn : t.renderBtn}
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col font-mono text-[11px] text-emerald-400 h-[380px] overflow-y-auto shadow-inner w-full">
                    <p className="text-slate-500 pb-2 border-b border-slate-900 mb-2">// FFmpeg Studio & AI Voice Engine Console Output</p>
                    {processLog ? (
                      <pre className="whitespace-pre-wrap">{processLog}</pre>
                    ) : (
                      <span className="text-slate-600 italic">Ready for video editing, CRF compression & AI Voice-Over dubbing tasks...</span>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: 등록된 판매 상품 및 재고 목록 */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col gap-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>📦</span> {t.tabInventory} ({products.length}{t.registeredCount})
                  </h3>
                  <span className="text-xs text-slate-400 hidden sm:inline">{t.realtimeDBSync}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[650px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3">{t.productNameCol}</th>
                        <th className="pb-3">{t.priceCol}</th>
                        <th className="pb-3">{t.stockCol}</th>
                        <th className="pb-3">{t.videoAssetCol}</th>
                        <th className="pb-3">{t.startupVideoCol}</th>
                        <th className="pb-3 text-right">{t.actionsCol}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            {t.noProductsNotice}
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
                          <td className="py-3 text-slate-300 whitespace-nowrap">{formatPrice(p.price, lang)}</td>
                          <td className="py-3">
                            <input type="number" value={p.stock} onChange={e => updateProductStock(p.id, Number(e.target.value))} className="w-16 bg-slate-950 border border-slate-700 text-amber-400 font-bold rounded p-1 text-xs" />
                          </td>
                          <td className="py-3 font-mono text-amber-300 truncate max-w-[150px]">{p.videoUrl}</td>
                          <td className="py-3">
                            {p.id === defaultProductId ? (
                              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                                {t.startupVideoBadge}
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultProduct(p.id)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 px-2 py-1 rounded text-[11px] cursor-pointer transition"
                              >
                                {t.setAsDefaultBtn}
                              </button>
                            )}
                          </td>
                          <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => openProductEditor(p)}
                              className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded text-xs transition cursor-pointer font-semibold inline-flex items-center gap-1"
                            >
                              <span>✏️</span>
                              <span>{t.editProdBtn}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openReplaceVideoModal(p)}
                              className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded text-xs transition cursor-pointer font-semibold inline-flex items-center gap-1"
                              title={t.replaceVideoDubbingBtn || "동영상 및 번역·더빙 교체"}
                            >
                              <span>🎬</span>
                              <span>{t.replaceVideoDubbingBtn || t.changeVideoBtn}</span>
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-2.5 py-1 rounded text-xs transition cursor-pointer">{t.deleteBtn}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 3: AI 맞춤 답변 및 FAQ 사전 편집 */}
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

              {/* SECTION 4: 배송 관리 & 주문 내역 */}
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
                            <td className="py-3.5 text-slate-300">{formatPrice(ord.amount, lang)}</td>
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

                          </div>
          )}
        </div>

        {/* 개별 상품 상세 정보 수정 모달 (Product Edit Modal - SECTION 1 테이블 ✏️ 편집 버튼 연동) */}
        {isEditModalOpen && editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl p-6 max-w-xl w-full shadow-2xl flex flex-col gap-4 animate-scaleUp">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <span>✏️</span> {t.editProductModalTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-3.5">
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">
                    {t.prodNameRequired}
                  </label>
                  <input
                    type="text"
                    value={editFormName}
                    onChange={(e) => setEditFormName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold mb-1 block">
                      {t.prodPriceRequired}
                    </label>
                    <input
                      type="number"
                      value={editFormPrice}
                      onChange={(e) => setEditFormPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold mb-1 block">
                      {t.prodStockRequired}
                    </label>
                    <input
                      type="number"
                      value={editFormStock}
                      onChange={(e) => setEditFormStock(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold mb-1 block">
                      {t.prodIconOptional}
                    </label>
                    <IconPicker value={editFormIcon} onChange={setEditFormIcon} />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">
                    {t.prodVideoRequired}
                  </label>
                  <input
                    type="text"
                    value={editFormVideo}
                    onChange={(e) => setEditFormVideo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">
                    {t.prodDescOptional}
                  </label>
                  <textarea
                    rows={3}
                    value={editFormDesc}
                    onChange={(e) => setEditFormDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                  />
                </div>

                {editSuccessMsg && (
                  <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2">
                    <span>✅</span>
                    <span>{editSuccessMsg}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end items-center gap-3 border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditedProduct}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold px-5 py-2 rounded-lg text-xs shadow-lg transition cursor-pointer border border-emerald-400/40 flex items-center gap-1.5"
                >
                  <span>💾</span>
                  <span>{t.saveChangesBtn}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 동영상 및 번역·더빙 교체 및 재생성 전용 모달 */}
        {isReplaceModalOpen && replaceTargetProduct && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
            <div className="bg-slate-900 border-2 border-blue-500/80 rounded-2xl p-6 max-w-xl w-full shadow-2xl flex flex-col gap-4 text-left my-8">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎬</span>
                  <div>
                    <h3 className="text-base font-bold text-blue-300">
                      {t.replaceModalTitle}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {replaceTargetProduct.icon} {replaceTargetProduct.name[lang] || replaceTargetProduct.name.ko} ({formatPrice(replaceTargetProduct.price, lang)} / 재고: {replaceTargetProduct.stock}개)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsReplaceModalOpen(false)}
                  className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* 안내 배너: 기존 정보 100% 보존 */}
              <div className="bg-blue-950/70 border border-blue-500/40 rounded-xl p-3 text-xs text-blue-200 leading-relaxed flex items-start gap-2 shadow-inner">
                <span className="text-blue-400 text-sm">💡</span>
                <span>{t.replaceModalDesc}</span>
              </div>

              <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto pr-1">
                {/* 1. 원본 동영상 선택 및 PC 파일 검색 업로드 */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <label className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                      <span>📁</span> {t.selectOrUploadVideo}
                    </label>
                    <button
                      type="button"
                      onClick={() => replaceFileInputRef.current?.click()}
                      disabled={isUploadingVideo}
                      className="bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5"
                    >
                      <span>📂</span>
                      <span>{isUploadingVideo ? t.uploadingVideo : "PC에서 새 동영상 선택 업로드"}</span>
                    </button>
                    <input
                      type="file"
                      ref={replaceFileInputRef}
                      onChange={handleFileUpload}
                      accept="video/*"
                      className="hidden"
                    />
                  </div>

                  {/* 저장된 동영상 목록 드롭다운 */}
                  <select
                    value={replaceVideoAsset}
                    onChange={(e) => setReplaceVideoAsset(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 cursor-pointer font-mono"
                  >
                    {demoVideoFiles.length > 0 && (
                      <optgroup label={t.demoFolderLabel}>
                        {demoVideoFiles.map(file => (
                          <option key={file.path} value={file.path}>
                            🎬 {file.name} {file.size ? `(${(file.size / (1024 * 1024)).toFixed(1)}MB)` : ''}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="🛍️ Registered Video Assets">
                      {products
                        .filter(p => p.videoUrl && !p.videoUrl.includes("honey_demo") && !p.videoUrl.includes("tea_demo") && !p.videoUrl.startsWith("/videos/"))
                        .map(p => (
                          <option key={p.id} value={p.videoUrl}>
                            {p.icon} {p.videoUrl}
                          </option>
                        ))}
                    </optgroup>
                  </select>

                  {/* 실시간 미리보기 비디오 */}
                  <div className="rounded-lg overflow-hidden border border-slate-800 bg-black aspect-video flex items-center justify-center relative shadow-inner">
                    {replaceVideoAsset ? (
                      <video
                        key={replaceVideoAsset}
                        src={replaceVideoAsset}
                        controls
                        playsInline
                        muted
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-slate-500 italic">No video selected</span>
                    )}
                  </div>
                </div>

                {/* 2. 번역 및 더빙 모델 설정 */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-blue-300 font-bold flex items-center gap-1.5">
                      <span>🎙️</span> {t.voicePersonaLabel}
                    </label>
                    <span className="text-[10px] text-slate-400">
                      실시간 60대 장인/시니어 보이스
                    </span>
                  </div>
                  <select
                    value={voicePersona}
                    onChange={(e) => setVoicePersona(e.target.value as "male_c" | "female_d")}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="male_c">{t.voiceMaleC}</option>
                    <option value="female_d">{t.voiceFemaleD}</option>
                  </select>

                  {/* 번역 상세설명 / 더빙 스크립트 편집 */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs text-slate-300 font-semibold">
                        {t.dubbingScriptEdit}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const autoTexts = getDubbingScript(replaceTargetProduct, lang);
                          if (autoTexts && autoTexts.length > 0) {
                            setReplaceDubbingScript(autoTexts[1] || autoTexts[0]);
                          }
                        }}
                        className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
                      >
                        ✨ 추천 더빙 스크립트 자동 채우기
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={replaceDubbingScript}
                      onChange={(e) => setReplaceDubbingScript(e.target.value)}
                      placeholder="더빙 및 상품 상세설명으로 읽을 번역 문구를 입력하세요..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {replaceSuccessMsg && (
                  <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2">
                    <span>✅</span>
                    <span>{replaceSuccessMsg}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end items-center gap-3 border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => setIsReplaceModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyReplaceVideo()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-5 py-2.5 rounded-lg text-xs shadow-lg transition cursor-pointer border border-blue-400/40 flex items-center gap-1.5"
                >
                  <span>✅</span>
                  <span>{t.applyReplaceBtn}</span>
                </button>
              </div>
            </div>
          </div>
        )}
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
          <button onClick={() => setIsAdminRoute(true)} className="bg-slate-800 text-amber-400 border border-amber-500/40 px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-semibold cursor-pointer shrink-0">
            {t.adminPortalBtn}
          </button>
          <div className="flex bg-slate-950 border border-slate-700 rounded p-0.5 text-xs shrink-0">
            {(["ko", "en", "ja", "zh", "es", "fr"] as Language[]).map(l => (
              <button 
                key={l} 
                onClick={() => {
                  setLang(l);
                  try {
                    localStorage.setItem("preferred_language", l);
                  } catch (e) {
                    // ignore localStorage failure
                  }
                }} 
                className={`px-1.5 sm:px-2 py-0.5 rounded uppercase text-[9px] sm:text-[10px] font-bold transition cursor-pointer ${lang === l ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="relative flex-1 flex flex-col md:grid md:grid-cols-12 gap-2 sm:gap-3 p-1.5 sm:p-4 w-full max-w-full box-border items-stretch overflow-hidden" style={{ height: "calc(100dvh - 52px)", maxHeight: "calc(100dvh - 52px)" }}>
        
        {/* Section 1: Video Player (동영상 축소 없이 항상 풀 화면 유지 & 결제창은 오버레이로 표시) */}
        <div className="h-[58%] sm:h-[60%] md:h-full md:col-span-7 relative bg-slate-900/40 border border-slate-700/80 rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 shadow-xl flex flex-col justify-between w-full max-w-full overflow-hidden box-border">
          <div 
            onClick={handleTogglePlayOrUnmute}
            className="relative w-full bg-black rounded-lg sm:rounded-xl overflow-hidden border border-slate-700 shadow-lg cursor-pointer select-none flex-1 min-h-0"
          >
            {(currentProd?.videoUrl || (demoVideoFiles.length > 0)) ? (
              <>
                <video
                  ref={videoRef}
                  key={(currentProd?.id || "demo-video") + "-" + (currentProd?.videoUrl || DEFAULT_FALLBACK_VIDEO)}
                  src={currentProd?.videoUrl || DEFAULT_FALLBACK_VIDEO}
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
                  onLoadedData={(e) => {
                    const vid = e.currentTarget;
                    vid.muted = isAudioMuted;
                    vid.play().then(() => {
                      setIsPlaying(true);
                      setIsAutoplayBlocked(false);
                    }).catch(() => {
                      vid.muted = true;
                      setIsAudioMuted(true);
                      vid.play().then(() => {
                        setIsPlaying(true);
                        setIsAutoplayBlocked(false);
                      }).catch(() => {
                        setIsAutoplayBlocked(true);
                      });
                    });
                  }}
                  onCanPlay={() => {
                    if (videoRef.current && videoRef.current.paused) {
                      videoRef.current.play().then(() => {
                        setIsPlaying(true);
                        setIsAutoplayBlocked(false);
                      }).catch(() => {});
                    }
                  }}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%", display: "block" }}
                  className="absolute inset-0 w-full h-full object-cover bg-black"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallback = currentProd?.fallbackVideoUrl || DEFAULT_FALLBACK_VIDEO;
                    if (target.src !== fallback && !target.src.endsWith(fallback)) {
                      target.src = fallback;
                      target.load();
                      target.muted = true;
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
                  <source src={currentProd?.videoUrl || DEFAULT_FALLBACK_VIDEO} type="video/mp4" />
                  <source src={currentProd?.fallbackVideoUrl || DEFAULT_FALLBACK_VIDEO} type="video/mp4" />
                </video>

                {/* 모바일 브라우저 정책 등으로 자동재생이 엄격히 차단되었을 때만 탭-투-플레이 오버레이 표시 */}
                {isAutoplayBlocked && (
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
            {/* 우측 상단 단일 통합 사운드 토글 버튼 (음소거 / 소리켜기) 및 AI 원어민 더빙 상태 */}
            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1.5">
                <button 
                  type="button"
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
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDubbingEnabled(prev => !prev);
                  }}
                  className={`text-[9px] sm:text-[10px] px-2 py-1 rounded border transition font-semibold cursor-pointer shadow ${
                    isDubbingEnabled
                      ? "bg-blue-600 hover:bg-blue-500 text-white border-blue-400"
                      : "bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-600"
                  }`}
                  title="AI 원어민 더빙 켜기/끄기"
                >
                  {isDubbingEnabled ? `🎙️ AI 더빙(${lang.toUpperCase()}) ON` : "🔊 원본"}
                </button>
              </div>

              {!isAudioMuted && isDubbingEnabled && lang !== "ko" && (
                <span className="text-[9px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-1 animate-pulse">
                  <span>🎙️</span> {lang.toUpperCase()} AI Voice Dubbing Active
                </span>
              )}

              {currentProd && (
                <span className={`text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-1 rounded border ${currentProd.stock <= 0 ? "bg-red-600 text-white" : "bg-black/80 text-amber-300"}`}>
                  {currentProd.stock <= 0 ? t.soldOut : `${t.stockLeft}${currentProd.stock}${t.unit}`}
                </span>
              )}
            </div>

            {/* Overlay Checkout Card (동영상 위에 오버랩되어 동영상이 전혀 축소되거나 짤리지 않음) */}
            {isCheckingOut && currentProd && (
              <div 
                className="absolute inset-x-2 bottom-2 z-30 bg-slate-950/95 border-2 border-blue-500 p-2.5 sm:p-3 rounded-xl shadow-2xl backdrop-blur-md max-h-[85%] overflow-y-auto box-border animate-in slide-in-from-bottom duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] sm:text-xs font-bold text-blue-400 flex items-center gap-1">
                    <span>🔒</span> {t.secureCheckout}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setIsCheckingOut(false)} 
                    className="text-[10px] sm:text-[11px] text-slate-400 hover:text-white underline cursor-pointer font-bold"
                  >
                    {t.cancelBack}
                  </button>
                </div>
                <ErrorBoundary>
                  <PayPalCheckoutButton 
                    amount={Math.round(currentProd.price / 1350)} 
                    currency="USD" 
                    lang={lang}
                    onSuccess={(orderId) => handlePaymentSuccess(orderId, currentProd)} 
                  />
                </ErrorBoundary>
              </div>
            )}
          </div>

          <div className="mt-1.5 sm:mt-2 shrink-0 w-full box-border">
            {currentProd && !latestOrder ? (
              <div className="bg-slate-900/95 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-700 flex items-center justify-between gap-2 shadow-xl w-full h-[64px] sm:h-[76px] box-border overflow-hidden">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-base sm:text-xl shrink-0">{currentProd.icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-xs font-bold text-white truncate">{currentProd.name[lang] || currentProd.name.ko}</p>
                    <p className="text-[10px] sm:text-[11px] text-amber-300 font-semibold truncate">
                      {formatPrice(currentProd.price, lang)} · <span className="text-slate-400 font-normal">{currentProd.description[lang] || currentProd.description.ko}</span>
                    </p>
                  </div>
                </div>
                {currentProd.stock > 0 ? (
                  <button 
                    onClick={() => setIsCheckingOut(prev => !prev)} 
                    className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs font-bold shrink-0 cursor-pointer shadow-lg transition flex items-center gap-1 border ${
                      isCheckingOut 
                        ? "bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700" 
                        : "bg-[#0070BA] hover:bg-[#005ea6] text-white border-blue-400/40 active:scale-95"
                    }`}
                  >
                    <span>💳</span>
                    <span>{isCheckingOut ? t.cancelBack : t.payWithPayPal}</span>
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
            ) : null}

            {latestOrder && (
              <div className="bg-slate-900 border border-emerald-500 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-xl flex flex-col gap-1 mt-1">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-400">{t.trackingViewTitle}</span>
                  <button onClick={() => { setLatestOrder(null); setCheckoutStatus(null); }} className="text-[10px] sm:text-[11px] text-slate-400 hover:text-white cursor-pointer">{t.closeBtn || "닫기"}</button>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 font-mono">{latestOrder.orderId} / {latestOrder.shippingStatus}</p>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: AI Shopping Agent & Live Chat (채팅창 상단 제목 줄 삭제하여 동영상 공간 최대 확보) */}
        <div className="flex-1 min-h-0 md:h-full md:col-span-5 bg-slate-900/80 border border-slate-700/80 rounded-xl sm:rounded-2xl flex flex-col shadow-xl w-full max-w-full overflow-hidden box-border">
          {/* 채팅창 내부 스크롤 영역: 제목 줄 없이 바로 대화 내용이 시원하게 위로 올라감 */}
          <div 
            ref={chatMessagesRef}
            className="flex-1 min-h-0 p-2 sm:p-3 overflow-y-auto no-scrollbar flex flex-col gap-2 sm:gap-2.5 w-full box-border"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {messages.map(msg => (
              <div key={msg.id} className={msg.sender === "user" ? "flex flex-col items-end w-full" : "flex flex-col items-start w-full"}>
                {/* 1. 위에 있는 설명란 제거: 상품 카드가 없고 텍스트가 있을 때만 말풍선 표시 */}
                {!msg.suggestedProduct && ((typeof msg.text === "string" ? msg.text : (msg.text[lang] || msg.text.ko || msg.text.en))?.trim()) ? (
                  <div className={msg.sender === "user" ? "max-w-[85%] p-2 sm:p-2.5 rounded-xl text-xs sm:text-sm bg-blue-600 text-white shadow break-words whitespace-pre-line" : "max-w-[85%] p-2 sm:p-2.5 rounded-xl text-xs sm:text-sm bg-slate-800 text-slate-200 border border-slate-700 shadow break-words whitespace-pre-line"}>
                    {typeof msg.text === "string" ? msg.text : (msg.text[lang] || msg.text.ko || msg.text.en)}
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
                        <p className="text-amber-300 font-semibold mt-0.5 text-[10px] sm:text-xs">{formatPrice(msg.suggestedProduct.price, lang)}</p>
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