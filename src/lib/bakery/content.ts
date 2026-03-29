export type BakeryNavItem = {
  href: string;
  label: string;
};

export type BakeryProduct = {
  slug: string;
  name: string;
  subtitle: string;
  price: string;
  weight: string;
  tags: string[];
  summary: string;
  ingredients: string[];
  tastingNotes: string;
  storage: string;
  allergens: string[];
  bakingDays: string;
};

export type BakeryNewsItem = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
};

export const bakeryBrand = {
  zhName: "簡單純麵包",
  enName: "Simple Pure Bakery",
  tagline: "每日現烤，讓麵包回到生活裡最自然的位置。",
  intro:
    "位於台灣巷弄的精品手作麵包店，重視原料、發酵與口感層次，提供適合日常也適合送禮的麵包選擇。",
};

export const bakeryNavigation: BakeryNavItem[] = [
  { href: "/work/simple-bakery", label: "首頁" },
  { href: "/work/simple-bakery/products", label: "產品" },
  { href: "/work/simple-bakery/about", label: "關於" },
  { href: "/work/simple-bakery/group-order", label: "團購" },
  { href: "/work/simple-bakery/delivery", label: "配送" },
  { href: "/work/simple-bakery/news", label: "消息" },
  { href: "/work/simple-bakery/faq", label: "FAQ" },
  { href: "/work/simple-bakery/contact", label: "聯絡" },
];

export const bakeryProducts: BakeryProduct[] = [
  {
    slug: "classic-milk-toast",
    name: "純白生吐司",
    subtitle: "柔軟濕潤，適合早餐與三明治",
    price: "NT$180",
    weight: "500g",
    tags: ["招牌", "每日限定"],
    summary:
      "以日本麵粉與低溫長時發酵製作，口感細緻有彈性，不抹醬也能感受奶香與麥香。",
    ingredients: ["日本高筋麵粉", "北海道牛乳", "法國奶油", "海鹽", "天然酵母"],
    tastingNotes: "前段奶香柔和，中段帶有穀物甜感，尾韻乾淨。",
    storage: "常溫 1 天，冷凍可保存 7 天。食用前回烤 3 分鐘風味最佳。",
    allergens: ["麩質", "乳製品"],
    bakingDays: "週二至週日",
  },
  {
    slug: "brown-sugar-cinnamon-roll",
    name: "黑糖肉桂捲",
    subtitle: "濕潤層次與台灣黑糖香氣",
    price: "NT$95",
    weight: "130g",
    tags: ["人氣", "午茶推薦"],
    summary:
      "使用手炒黑糖與斯里蘭卡肉桂，表面淋上輕盈奶霜，甜度克制不膩口。",
    ingredients: ["麵粉", "台灣黑糖", "肉桂粉", "奶油乳酪", "鮮奶"],
    tastingNotes: "黑糖焦香先出現，接著肉桂木質調，最後帶出奶霜清甜。",
    storage: "常溫 1 天，冷藏 2 天。建議回烤 2 分鐘後享用。",
    allergens: ["麩質", "乳製品"],
    bakingDays: "週三、五、六",
  },
  {
    slug: "sea-salt-butter-roll",
    name: "海鹽奶油捲",
    subtitle: "外酥內彈，鹹香平衡",
    price: "NT$70",
    weight: "85g",
    tags: ["日常", "鹹麵包"],
    summary:
      "使用法國發酵奶油與屏東海鹽，卷層烘烤後形成薄脆外殼與濕潤芯體。",
    ingredients: ["高筋麵粉", "發酵奶油", "海鹽", "砂糖", "酵母"],
    tastingNotes: "入口有奶油香，咀嚼後海鹽層次明顯，尾韻帶輕微焦香。",
    storage: "常溫 1 天。建議烤箱 180°C 回烤 2 分鐘。",
    allergens: ["麩質", "乳製品"],
    bakingDays: "每日供應",
  },
  {
    slug: "red-bean-brioche",
    name: "紅豆布里歐",
    subtitle: "台式甜感與法式麵包體",
    price: "NT$85",
    weight: "110g",
    tags: ["季節", "台灣風味"],
    summary:
      "自製低糖紅豆餡搭配奶香布里歐，口感柔軟、甜度清爽，適合作為下午點心。",
    ingredients: ["布里歐麵團", "萬丹紅豆", "雞蛋", "奶油", "二砂糖"],
    tastingNotes: "前段蛋奶香濃郁，中段紅豆細緻綿密，尾韻帶微微焦糖感。",
    storage: "常溫 1 天，冷藏 2 天。回溫後風味較佳。",
    allergens: ["麩質", "蛋", "乳製品"],
    bakingDays: "週二、四、六",
  },
];

export const bakeryFeaturedProductSlugs = [
  "classic-milk-toast",
  "brown-sugar-cinnamon-roll",
  "sea-salt-butter-roll",
] as const;

export const bakeryNews: BakeryNewsItem[] = [
  {
    slug: "spring-market-2026",
    title: "2026 春季市集限定禮盒開放預訂",
    date: "2026-03-18",
    excerpt: "推出 6 入手作麵包禮盒，含兩款春季限定口味，適合企業送禮與節慶拜訪。",
    category: "新品消息",
  },
  {
    slug: "new-baking-window",
    title: "出爐時段調整公告",
    date: "2026-03-05",
    excerpt: "為提升上午尖峰供應，平日第一批出爐調整為上午 10:30，歡迎提早預留。",
    category: "營業公告",
  },
  {
    slug: "group-order-free-shipping",
    title: "團購滿額免運方案上線",
    date: "2026-02-21",
    excerpt: "單筆滿 NT$5,000 享大台北冷凍宅配免運，企業團購可安排固定週配送。",
    category: "團購方案",
  },
];

export const bakeryFaq = [
  {
    question: "麵包每天都會供應嗎？",
    answer:
      "大部分品項為每日供應，部分限定款依烘烤日提供。建議先透過 LINE 或電話詢問當日出爐清單。",
  },
  {
    question: "可以提前預訂嗎？",
    answer:
      "可以，建議至少提前 2 天預訂。大量團購或節慶禮盒建議提前 7 天安排，以利排程。",
  },
  {
    question: "是否提供客製化禮盒？",
    answer:
      "可依預算與人數提供搭配建議，包含品牌貼紙、卡片與配送時段安排。",
  },
  {
    question: "麵包如何保存與回烤？",
    answer:
      "常溫建議當日食用完畢；若需延長保存請冷凍，回烤前先室溫退冰 10 分鐘，烤箱 170-180°C 回烤 2-4 分鐘。",
  },
  {
    question: "配送範圍有哪些？",
    answer:
      "目前提供門市自取、Lalamove 當日快送（雙北）與黑貓冷凍宅配（全台本島）。",
  },
] as const;

export const bakeryAbout = {
  story:
    "簡單純麵包從一個很單純的想法開始：做出每天都想吃、家人放心吃、也能拿來好好送禮的麵包。",
  values: [
    {
      title: "真實原料",
      description: "優先使用可追溯麵粉與乳製品，減少不必要添加。",
    },
    {
      title: "時間發酵",
      description: "以低溫長時發酵建立風味，讓口感更有層次。",
    },
    {
      title: "台灣日常",
      description: "以在地飲食習慣為核心，兼顧早餐、午茶與送禮需求。",
    },
  ],
  teamNote:
    "我們是小型烘焙團隊，維持每日有限產量，將每一批出爐品質控制在穩定水準。",
};

export const bakeryGroupOrder = {
  intro:
    "提供辦公室早餐、部門下午茶、品牌活動與節慶送禮團購方案，可依預算與人數客製。",
  plans: [
    {
      name: "日常團購",
      target: "20-40 人團隊",
      priceRange: "NT$2,800 起",
      includes: ["人氣麵包混搭", "個別包裝", "固定時段配送"],
    },
    {
      name: "企業茶會",
      target: "40-80 人活動",
      priceRange: "NT$6,000 起",
      includes: ["鹹甜搭配菜單", "品牌卡片", "分區裝箱"],
    },
    {
      name: "節慶禮盒",
      target: "客戶贈禮 / 內部福委",
      priceRange: "NT$9,000 起",
      includes: ["禮盒設計選項", "客製貼標", "分批寄送管理"],
    },
  ],
  leadTime: "一般團購請提前 3-5 天；節慶檔期請提前 10-14 天。",
};

export const bakeryDelivery = {
  methods: [
    {
      title: "門市自取",
      detail: "可選上午 11:00-13:00 或下午 16:00-19:00，逾時保留 30 分鐘。",
    },
    {
      title: "雙北當日快送",
      detail: "與 Lalamove 配送合作，依距離與時段計價。建議提前預約。",
    },
    {
      title: "全台冷凍宅配",
      detail: "黑貓冷凍宅配，每週二至週五出貨。部分品項不建議冷凍配送。",
    },
  ],
  notes: [
    "滿 NT$5,000（單點）享雙北免運一次。",
    "偏遠區域與特殊天候將視物流狀況調整。",
    "出貨後將提供追蹤編號。",
  ],
};

export const bakeryContact = {
  phone: "02-2712-1010",
  email: "hello@simplepurebakery.tw",
  line: "@simplepure",
  address: "台北市松山區民生東路四段 101 巷 12 號",
  hours: ["週二至週六 10:30-19:00", "週日 10:30-17:30", "週一公休"],
  contactReminder: "大量預訂、團購與禮盒合作，請先私訊或來電預約討論。",
};

export function getBakeryProductBySlug(slug: string): BakeryProduct | undefined {
  return bakeryProducts.find((product) => product.slug === slug);
}
