import { Language } from "./productService";

interface MultilingualBundle {
  name: Record<Language, string>;
  description: Record<Language, string>;
}

// 1. 주요 특산물 및 라이브 상품 전용 고품질 사전
const KNOWN_PRODUCTS: Record<string, MultilingualBundle> = {
  "가평운악산": {
    name: {
      ko: "가평운악산 포도즙",
      en: "Gapyeong Unaksan Organic Grape Juice",
      ja: "加平雲岳山 有機栽培 ぶどうジュース",
      zh: "加平云岳山 有机纯葡萄汁",
      es: "Jugo de Uva Orgánico Gapyeong Unaksan",
      fr: "Jus de Raisin Bio Gapyeong Unaksan"
    },
    description: {
      ko: "운악산 비가림 친환경 포도로 정성껏 착즙한 100% 건강 포도즙",
      en: "100% Pure Organic Grape Juice freshly harvested from Mt. Unak",
      ja: "雲岳山の有機ブドウを100%使用した無添加プレミアムぶどう果汁",
      zh: "采用云岳山有机葡萄精心压榨而成的100%高端纯天然健康葡萄汁",
      es: "Jugo de uva 100% puro y orgánico, prensado en frío de las montañas de Unak",
      fr: "Jus de raisin 100% pur biologique, pressé à froid des monts Unak"
    }
  },
  "포도즙": {
    name: {
      ko: "가평운악산 친환경 포도즙",
      en: "Gapyeong Unaksan Eco-friendly Grape Juice",
      ja: "加平雲岳山 有機栽培 ぶどうジュース",
      zh: "加平云岳山 纯天然有机葡萄汁",
      es: "Jugo de Uva Orgánico Gapyeong",
      fr: "Jus de Raisin Biologique Gapyeong"
    },
    description: {
      ko: "운악산 비가림 친환경 포도로 정성껏 착즙한 100% 건강 포도즙",
      en: "100% Pure Organic Grape Juice freshly cold-pressed from Mt. Unak vineyards",
      ja: "雲岳山の有機ブドウを100%使用した無添加プレミアムぶどう果汁",
      zh: "采用云岳山有机葡萄精心压榨而成的100%高端纯天然健康葡萄汁",
      es: "Jugo de uva 100% puro y orgánico, prensado en frío de las montañas de Unak",
      fr: "Jus de raisin 100% pur biologique, pressé à froid des monts Unak"
    }
  },
  "문호리": {
    name: {
      ko: "문호리 뜨개질 공방",
      en: "Munhori Artisanal Knitting Studio Kit",
      ja: "文湖里 手編み ニット工房キット",
      zh: "汶湖里 匠心手工编织工坊材料包",
      es: "Taller de Tejido Artesanal Munhori",
      fr: "Atelier de Tricot Artisanal Munhori"
    },
    description: {
      ko: "문호리에 자리잡은 대바늘 코바늘 양성 손뜨개 공방 세트",
      en: "Artisanal hand-knitting workshop kit crafted along the Bukhan River",
      ja: "北漢江のほとり文湖里の温もりを込めた手編みニット工房セット",
      zh: "蕴含北汉江畔温暖文艺气息的纯手工毛线编织套件",
      es: "Kit de tejido artesanal premium elaborado a orillas del río Bukhan",
      fr: "Kit de tricot artisanal façonné avec soin au bord du fleuve Bukhan"
    }
  },
  "뜨개질": {
    name: {
      ko: "문호리 감성 손뜨개 공방 키트",
      en: "Munhori Artisanal Knitting Studio Kit",
      ja: "文湖里 手編み ニット工房キット",
      zh: "汶湖里 匠心手工编织工坊材料包",
      es: "Taller de Tejido Artesanal Munhori",
      fr: "Atelier de Tricot Artisanal Munhori"
    },
    description: {
      ko: "문호리에 자리잡은 대바늘 코바늘 양성 손뜨개 공방 세트",
      en: "Artisanal hand-knitting workshop kit crafted along the Bukhan River",
      ja: "北漢江のほとり文湖里の温もりを込めた手編みニット工房セット",
      zh: "蕴含北汉江畔温暖文艺气息的纯手工毛线编织套件",
      es: "Kit de tejido artesanal premium elaborado a orillas del río Bukhan",
      fr: "Kit de tricot artisanal façonné avec soin au bord du fleuve Bukhan"
    }
  },
  "꿀": {
    name: {
      ko: "양평 지리산 천연 벌꿀",
      en: "Yangpyeong Pure Natural Wild Honey",
      ja: "楊平 天然生ハチミツ",
      zh: "杨平 纯天然野生百花蜂蜜",
      es: "Miel Natural Pura de Yangpyeong",
      fr: "Miel Naturel Pur de Yangpyeong"
    },
    description: {
      ko: "자연의 순수함을 가득 담은 100% 무가공 천연 생벌꿀",
      en: "100% Unprocessed raw wildflower honey packed with pure nature",
      ja: "自然の純粋さをそのまま詰めた無添加天然生ハチミツ",
      zh: "封存大自然纯正风味的100%纯天然无添加野生生蜂蜜",
      es: "Miel silvestre 100% pura y sin procesar directamente de la naturaleza",
      fr: "Miel sauvage 100% pur non transformé aux arômes naturels délicats"
    }
  },
  "녹차": {
    name: {
      ko: "양평 수제 유기농 야생 녹차",
      en: "Yangpyeong Organic Wild Green Tea",
      ja: "楊平 伝統手摘み 有機野生緑茶",
      zh: "杨平 传统手工采摘 有机野生绿茶",
      es: "Té Verde Silvestre Orgánico de Yangpyeong",
      fr: "Thé Vert Biologique Sauvage de Yangpyeong"
    },
    description: {
      ko: "은은한 향과 깊은 풍미를 지닌 수제 명품 녹차",
      en: "Artisan-crafted premium wild green tea with a rich, delicate aroma",
      ja: "伝統の技で丁寧に焙煎した、奥深い香りの最高級手作り緑茶",
      zh: "传统手工精心炒制，香气清雅、滋味醇厚的特级野生名茶",
      es: "Té verde premium elaborado artesanalmente con aroma sutil y profundo",
      fr: "Thé vert artisanal de grand cru à la saveur subtile et raffinée"
    }
  }
};

// 2. 단어별 번역 매핑 사전
const DICTIONARY: { ko: string; en: string; ja: string; zh: string; es: string; fr: string }[] = [
  { ko: "친환경", en: "Eco-friendly", ja: "有機", zh: "环保", es: "Ecológico", fr: "Écologique" },
  { ko: "유기농", en: "Organic", ja: "オーガニック", zh: "有机", es: "Orgánico", fr: "Biologique" },
  { ko: "포도즙", en: "Grape Juice", ja: "ぶどうジュース", zh: "纯葡萄汁", es: "Jugo de Uva", fr: "Jus de Raisin" },
  { ko: "포도", en: "Grape", ja: "ブドウ", zh: "葡萄", es: "Uva", fr: "Raisin" },
  { ko: "뜨개질", en: "Knitting", ja: "手編み", zh: "编织", es: "Tejido", fr: "Tricot" },
  { ko: "공방", en: "Studio", ja: "工房", zh: "工坊", es: "Taller", fr: "Atelier" },
  { ko: "수제", en: "Handmade", ja: "手作り", zh: "手工", es: "Artesanal", fr: "Fait main" },
  { ko: "산딸기", en: "Wild Raspberry", ja: "野いちご", zh: "野草莓", es: "Frambuesa silvestre", fr: "Framboise sauvage" },
  { ko: "딸기", en: "Strawberry", ja: "いちご", zh: "草莓", es: "Fresa", fr: "Fraise" },
  { ko: "사과", en: "Apple", ja: "リンゴ", zh: "苹果", es: "Manzana", fr: "Pomme" },
  { ko: "배", en: "Korean Pear", ja: "梨", zh: "梨", es: "Pera", fr: "Poire" },
  { ko: "복숭아", en: "Peach", ja: "桃", zh: "桃子", es: "Melocotón", fr: "Pêche" },
  { ko: "벌꿀", en: "Honey", ja: "ハチミツ", zh: "蜂蜜", es: "Miel", fr: "Miel" },
  { ko: "꿀", en: "Honey", ja: "ハチミツ", zh: "蜂蜜", es: "Miel", fr: "Miel" },
  { ko: "녹차", en: "Green Tea", ja: "緑茶", zh: "绿茶", es: "Té Verde", fr: "Thé Vert" },
  { ko: "한우", en: "Hanwoo Beef", ja: "韓牛", zh: "韩牛", es: "Carne Hanwoo", fr: "Bœuf Hanwoo" },
  { ko: "홍삼", en: "Red Ginseng", ja: "高麗紅参", zh: "高丽红参", es: "Ginseng Rojo", fr: "Ginseng Rouge" },
  { ko: "도자기", en: "Ceramics", ja: "陶磁器", zh: "陶瓷", es: "Cerámica", fr: "Céramique" },
  { ko: "세트", en: "Set", ja: "セット", zh: "礼盒", es: "Set", fr: "Coffret" },
  { ko: "선물", en: "Gift Set", ja: "ギフト", zh: "礼盒", es: "Regalo", fr: "Cadeau" },
  { ko: "가평", en: "Gapyeong", ja: "加平", zh: "加平", es: "Gapyeong", fr: "Gapyeong" },
  { ko: "양평", en: "Yangpyeong", ja: "楊平", zh: "杨平", es: "Yangpyeong", fr: "Yangpyeong" },
  { ko: "문호리", en: "Munhori", ja: "文湖里", zh: "汶湖里", es: "Munhori", fr: "Munhori" },
  { ko: "운악산", en: "Unaksan", ja: "雲岳山", zh: "云岳山", es: "Unaksan", fr: "Unaksan" }
];

export const productTranslationService = {
  /**
   * 한국어로 입력된 상품명과 설명을 6개 언어(ko, en, ja, zh, es, fr)로 번역하여 반환합니다.
   */
  translateProduct(rawName: string, rawDesc?: string): MultilingualBundle {
    const cleanName = (rawName || "").trim();
    const cleanDesc = (rawDesc || "").trim();

    // 1. 이미 정의된 대표 상품 키워드 매칭
    for (const [key, bundle] of Object.entries(KNOWN_PRODUCTS)) {
      if (cleanName.includes(key) || cleanName.toLowerCase().includes(key.toLowerCase())) {
        return {
          name: {
            ko: cleanName || bundle.name.ko,
            en: bundle.name.en,
            ja: bundle.name.ja,
            zh: bundle.name.zh,
            es: bundle.name.es,
            fr: bundle.name.fr
          },
          description: {
            ko: cleanDesc || bundle.description.ko,
            en: cleanDesc ? `${bundle.name.en} - ${bundle.description.en}` : bundle.description.en,
            ja: cleanDesc ? `${bundle.name.ja} - ${bundle.description.ja}` : bundle.description.ja,
            zh: cleanDesc ? `${bundle.name.zh} - ${bundle.description.zh}` : bundle.description.zh,
            es: cleanDesc ? `${bundle.name.es} - ${bundle.description.es}` : bundle.description.es,
            fr: cleanDesc ? `${bundle.name.fr} - ${bundle.description.fr}` : bundle.description.fr
          }
        };
      }
    }

    // 2. 단어 사전을 기반으로 다국어 이름 합성
    let nameEn = cleanName;
    let nameJa = cleanName;
    let nameZh = cleanName;
    let nameEs = cleanName;
    let nameFr = cleanName;

    for (const entry of DICTIONARY) {
      if (nameEn.includes(entry.ko)) nameEn = nameEn.replace(new RegExp(entry.ko, "g"), entry.en + " ");
      if (nameJa.includes(entry.ko)) nameJa = nameJa.replace(new RegExp(entry.ko, "g"), entry.ja);
      if (nameZh.includes(entry.ko)) nameZh = nameZh.replace(new RegExp(entry.ko, "g"), entry.zh);
      if (nameEs.includes(entry.ko)) nameEs = nameEs.replace(new RegExp(entry.ko, "g"), entry.es + " ");
      if (nameFr.includes(entry.ko)) nameFr = nameFr.replace(new RegExp(entry.ko, "g"), entry.fr + " ");
    }

    nameEn = nameEn.replace(/\s+/g, " ").trim();
    nameJa = nameJa.trim();
    nameZh = nameZh.trim();
    nameEs = nameEs.replace(/\s+/g, " ").trim();
    nameFr = nameFr.replace(/\s+/g, " ").trim();

    // 단어 사전에 완전히 없던 임의의 고유명사인 경우 각 언어별 품격 있는 접미사 부여
    if (nameEn === cleanName) nameEn = `${cleanName} Premium Selection`;
    if (nameJa === cleanName) nameJa = `${cleanName} 厳選ライブ特産品`;
    if (nameZh === cleanName) nameZh = `${cleanName} 直播精选特产`;
    if (nameEs === cleanName) nameEs = `Selección Especial ${cleanName}`;
    if (nameFr === cleanName) nameFr = `Sélection Exclusive ${cleanName}`;

    // 3. 상세설명 다국어 자동 생성
    const defaultDescKo = cleanDesc || `${cleanName} 라이브 특별 상품`;
    const descEn = cleanDesc ? `${nameEn} - Fresh premium local specialty with guaranteed authenticity.` : `${nameEn} - Fresh premium local specialty directly delivered.`;
    const descJa = cleanDesc ? `${nameJa} - 産地直送でお届けする安心・高品質な厳選特産品です。` : `${nameJa} - 産地直送でお届けする厳選ライブ商品。`;
    const descZh = cleanDesc ? `${nameZh} - 原产地直发，品质保证的新鲜精选特产。` : `${nameZh} - 原产地直发的精选直播特产。`;
    const descEs = cleanDesc ? `${nameEs} - Producto local fresco y auténtico de la más alta calidad.` : `${nameEs} - Producto local de alta calidad.`;
    const descFr = cleanDesc ? `${nameFr} - Produit artisanal d'exception livré directement du producteur.` : `${nameFr} - Produit artisanal de qualité supérieure.`;

    return {
      name: {
        ko: cleanName,
        en: nameEn,
        ja: nameJa,
        zh: nameZh,
        es: nameEs,
        fr: nameFr
      },
      description: {
        ko: defaultDescKo,
        en: descEn,
        ja: descJa,
        zh: descZh,
        es: descEs,
        fr: descFr
      }
    };
  }
};
