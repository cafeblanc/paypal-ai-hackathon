import React, { useState, useRef, useEffect } from "react";

export interface IconItem {
  emoji: string;
  keywords: string[];
}

export interface IconCategory {
  id: string;
  label: string;
  icons: IconItem[];
}

export const ICON_CATEGORIES: IconCategory[] = [
  {
    id: "food",
    label: "🌾 식품/특산품",
    icons: [
      { emoji: "🍯", keywords: ["꿀", "벌꿀", "아카시아", "honey"] },
      { emoji: "🍓", keywords: ["딸기", "산딸기", "베리", "strawberry", "berry"] },
      { emoji: "🍵", keywords: ["차", "전통차", "녹차", "tea", "herbal"] },
      { emoji: "🍎", keywords: ["사과", "과일", "apple"] },
      { emoji: "🍇", keywords: ["포도", "과일", "grape"] },
      { emoji: "🍊", keywords: ["귤", "오렌지", "orange"] },
      { emoji: "🫐", keywords: ["블루베리", "blueberry"] },
      { emoji: "☕", keywords: ["커피", "원두", "coffee"] },
      { emoji: "🥩", keywords: ["한우", "고기", "소고기", "meat", "beef"] },
      { emoji: "🌾", keywords: ["쌀", "곡물", "rice", "grain"] },
      { emoji: "🧀", keywords: ["치즈", "유제품", "cheese"] },
      { emoji: "🥖", keywords: ["빵", "베이커리", "bread"] },
      { emoji: "🍪", keywords: ["쿠키", "디저트", "cookie"] },
      { emoji: "🍶", keywords: ["전통주", "술", "sake", "wine"] },
      { emoji: "🍱", keywords: ["도시락", "bento"] },
      { emoji: "🥗", keywords: ["샐러드", "유기농", "salad"] },
      { emoji: "🍙", keywords: ["주먹밥", "riceball"] },
      { emoji: "🌽", keywords: ["옥수수", "corn"] },
      { emoji: "🥕", keywords: ["당근", "야채", "carrot"] },
      { emoji: "🧄", keywords: ["마늘", "garlic"] }
    ]
  },
  {
    id: "shopping",
    label: "🎁 쇼핑/선물",
    icons: [
      { emoji: "🎁", keywords: ["선물", "기프트", "gift", "box"] },
      { emoji: "🛍️", keywords: ["쇼핑백", "쇼핑", "shopping", "bag"] },
      { emoji: "📦", keywords: ["택배", "배송", "package", "box"] },
      { emoji: "🏷️", keywords: ["특가", "할인", "tag", "sale"] },
      { emoji: "⭐", keywords: ["별", "인기", "star", "best"] },
      { emoji: "✨", keywords: ["스페셜", "신상품", "sparkles"] },
      { emoji: "🔥", keywords: ["핫딜", "인기", "fire", "hot"] },
      { emoji: "💎", keywords: ["다이아", "명품", "diamond"] },
      { emoji: "👑", keywords: ["프리미엄", "crown", "vip"] },
      { emoji: "🎉", keywords: ["축제", "파티", "party"] },
      { emoji: "🎀", keywords: ["리본", "ribbon"] },
      { emoji: "🛒", keywords: ["카트", "장바구니", "cart"] },
      { emoji: "🏆", keywords: ["트로피", "1위", "trophy"] },
      { emoji: "💯", keywords: ["백점", "최고", "100"] },
      { emoji: "🎈", keywords: ["풍선", "balloon"] }
    ]
  },
  {
    id: "fashion",
    label: "👗 패션/뷰티",
    icons: [
      { emoji: "👗", keywords: ["원피스", "드레스", "dress"] },
      { emoji: "👕", keywords: ["셔츠", "티셔츠", "shirt"] },
      { emoji: "👔", keywords: ["넥타이", "정장", "tie"] },
      { emoji: "👜", keywords: ["핸드백", "가방", "handbag"] },
      { emoji: "💄", keywords: ["립스틱", "화장품", "뷰티", "lipstick"] },
      { emoji: "👠", keywords: ["구두", "하이힐", "shoes", "heels"] },
      { emoji: "👟", keywords: ["스니커즈", "운동화", "sneakers"] },
      { emoji: "🧴", keywords: ["로션", "스킨케어", "lotion"] },
      { emoji: "🕶️", keywords: ["선글라스", "안경", "sunglasses"] },
      { emoji: "💍", keywords: ["반지", "보석", "ring"] },
      { emoji: "🧢", keywords: ["모자", "cap"] },
      { emoji: "🧦", keywords: ["양말", "socks"] },
      { emoji: "🧣", keywords: ["스카프", "목도리", "scarf"] }
    ]
  },
  {
    id: "media",
    label: "🎬 라이브/미디어",
    icons: [
      { emoji: "🎬", keywords: ["동영상", "영화", "movie", "video"] },
      { emoji: "📱", keywords: ["스마트폰", "모바일", "phone"] },
      { emoji: "💻", keywords: ["노트북", "컴퓨터", "laptop"] },
      { emoji: "🎧", keywords: ["헤드폰", "이어폰", "headphones"] },
      { emoji: "🎙️", keywords: ["마이크", "방송", "mic", "dubbing"] },
      { emoji: "📸", keywords: ["카메라", "사진", "camera"] },
      { emoji: "📺", keywords: ["TV", "모니터", "screen"] },
      { emoji: "⚡", keywords: ["번개", "즉시", "lightning"] },
      { emoji: "🔌", keywords: ["전자제품", "plug"] },
      { emoji: "⏱️", keywords: ["타이머", "시간", "timer"] },
      { emoji: "🔔", keywords: ["알림", "bell"] },
      { emoji: "🔊", keywords: ["사운드", "스피커", "sound"] }
    ]
  },
  {
    id: "nature",
    label: "🌿 친환경/자연",
    icons: [
      { emoji: "🌿", keywords: ["허브", "친환경", "herb", "organic"] },
      { emoji: "🌱", keywords: ["새싹", "유기농", "plant"] },
      { emoji: "🌸", keywords: ["꽃", "체리블라썸", "flower"] },
      { emoji: "🍀", keywords: ["네잎클로버", "행운", "clover"] },
      { emoji: "🌳", keywords: ["나무", "tree"] },
      { emoji: "💧", keywords: ["맑은물", "물", "water"] },
      { emoji: "☀️", keywords: ["햇살", "태양", "sun"] },
      { emoji: "⛰️", keywords: ["산", "양평", "mountain"] },
      { emoji: "🐝", keywords: ["벌", "꿀벌", "bee"] },
      { emoji: "🪵", keywords: ["나무목재", "wood"] }
    ]
  }
];

interface IconPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  className?: string;
  buttonLabel?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onChange,
  className = "",
  buttonLabel
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("food");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const activeCategory = ICON_CATEGORIES.find(c => c.id === selectedCategory) || ICON_CATEGORIES[0];

  const filteredIcons = search.trim()
    ? ICON_CATEGORIES.flatMap(c => c.icons).filter(item =>
        item.emoji.includes(search.trim()) ||
        item.keywords.some(k => k.toLowerCase().includes(search.toLowerCase().trim()))
      )
    : activeCategory.icons;

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-700 hover:border-amber-500 rounded-lg p-2 text-xs flex items-center justify-between gap-1.5 transition cursor-pointer text-white shadow-sm"
        title="아이콘 검색표 열기"
      >
        <span className="text-base">{value || "🎁"}</span>
        {buttonLabel && <span className="text-[11px] text-slate-300 truncate">{buttonLabel}</span>}
        <span className="text-[10px] text-slate-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 bg-slate-900 border-2 border-amber-500/70 rounded-xl shadow-2xl p-3 z-50 flex flex-col gap-2.5 animate-fadeIn">
          {/* Header & Search */}
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <span className="text-xs text-slate-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="아이콘 검색 (예: 꿀, 딸기, 차, 선물, 옷...)"
              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs (shown when not searching) */}
          {!search.trim() && (
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
              {ICON_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-[10px] px-2 py-1 rounded whitespace-nowrap font-medium transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-amber-500 text-slate-950 font-bold shadow"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Icon Grid */}
          <div className="grid grid-cols-6 sm:grid-cols-7 gap-1.5 max-h-44 overflow-y-auto p-1 bg-slate-950/70 border border-slate-800 rounded-lg">
            {filteredIcons.length > 0 ? (
              filteredIcons.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(item.emoji);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-9 h-9 flex items-center justify-center text-lg rounded-lg transition cursor-pointer hover:scale-125 hover:bg-amber-500/20 ${
                    value === item.emoji
                      ? "bg-amber-500/30 border border-amber-400"
                      : "hover:border hover:border-amber-500/40"
                  }`}
                  title={item.keywords.join(", ")}
                >
                  {item.emoji}
                </button>
              ))
            ) : (
              <div className="col-span-6 py-4 text-center text-xs text-slate-500">
                일치하는 아이콘이 없습니다.
              </div>
            )}
          </div>

          {/* Custom Input helper */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            <span>선택된 아이콘: <b className="text-amber-300 text-sm">{value}</b></span>
            <span className="text-slate-500">클릭 시 자동 선택됩니다</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IconPicker;