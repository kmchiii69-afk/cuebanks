// Static content for the Wolfpack sales pages.
// Same data lives at /wolfpack and /wolfpack-global — only the price
// ($997 vs $297 for PPP geos) and one image path differ between the two.
// Both variants pass the price/url through `WolfpackPage` as props.

import type {
  HeroBadge,
  PackageTileData,
  KryptonCaseData,
  ResultBannerData,
  VideoTestimonialData,
  ReviewData,
  WolfWinTileData,
  RickRossSlide,
  LifestyleTile,
  FAQItem,
  TopCallTileData,
  TradeRowData,
  FooterLink,
} from "./data";

export const TICKER_BASE: { color: string; text: string }[] = [
  { color: "var(--acid)", text: "· 7,000+ TRADERS · 63 COUNTRIES ·" },
  { color: "var(--bone)", text: "· 21 YEARS LIVE ·" },
  { color: "var(--acid)", text: "· $20K → $1.7M · 420 DAYS ·" },
  { color: "var(--bone)", text: "· QUANTUM CIPHER REPORT · EVERY MONDAY ·" },
  { color: "#9B5CFF", text: "· COPY · MIRROR · LEARN ·" },
  { color: "var(--acid)", text: "· $1.2M IN 30 DAYS · KRYPTON 2.0 ·" },
  { color: "#FF2DAB", text: "· STAY A SHEEP · GET EATEN BY WOLVES ·" },
  { color: "var(--acid)", text: "· OR BECOME ONE ·" },
];

export const RECEIPT_STATS: { v: string; k: string; color: string }[] = [
  { v: "7,000+", k: "Traders in the pack", color: "var(--acid)" },
  { v: "63", k: "Countries represented", color: "var(--bone)" },
  { v: "10 yrs", k: "Live on the screens", color: "var(--acid)" },
  { v: "4.95★", k: "Across 135 Whop reviews", color: "var(--acid)" },
];

export const HERO_BADGES: HeroBadge[] = [
  { k: "ONE PAYMENT", v: "Price from $297" },
  { k: "INCLUDED", v: "Krypton + WSA Report" },
  { k: "DELIVERY", v: "Instant · Whop" },
  { k: "GUARANTEE", v: "Receipts on file" },
];

export const KRYPTON_CASES: KryptonCaseData[] = [
  {
    tag: "Case · 01",
    big: "$1.75M",
    from: "Up from $20K · 100×",
    span: "420 days",
    note: "The 100× crypto strategy documented from start to finish. One account, one system, four hundred and twenty days of execution.",
    accent: "var(--acid)",
  },
  {
    tag: "Case · 02",
    big: "$1.2M",
    from: "30-day swing window",
    span: "Krypton 2.0",
    note: "The exact playbook used through the November 2024 cycle — entries, scale-outs, and the final close. All on screen.",
    accent: "var(--acid)",
  },
  {
    tag: "Case · 03",
    big: "$302K",
    from: "Single XRP cycle",
    span: "Day in the life",
    note: "Filmed on the road with a 7-figure trader. One position. One chart. One decision. Done from a phone at Mt. Fuji.",
    accent: "var(--acid)",
  },
  {
    tag: "Case · 04",
    big: "+176%",
    from: "Inside 7 minutes",
    span: "The premise",
    note: "The one-sit walkthrough that breaks down WHY this works — the market structure, the cycle logic, the edge.",
    accent: "var(--acid)",
  },
];

export const RESULT_BANNERS: ResultBannerData[] = [
  {
    kicker: "Krypton 2.0 · 30 Days",
    big: "$1.2M",
    sub: "Profit in a single 30-day swing window through the November 2024 cycle. Pre-positioned before the move, held through the breakout, closed at structure.",
    period: "November 2024 · 30-day window",
    image: "/uploads/cam/nov-2024-01.jpg",
    accent: "var(--acid)",
  },
  {
    kicker: "From $20K · Last Bull Run",
    big: "$1.7M",
    sub: "420 days. The framework times entries across cycle phases — accumulation, expansion, distribution — and sizes accordingly.",
    period: "2020–2021 · 420 days",
    image: "/uploads/cam/2020-bull-1-7m.jpg",
    accent: "var(--acid)",
    flipped: true,
  },
  {
    kicker: "Wall Street Academy Report · Monday Drop",
    big: "WSA Report",
    sub: "The framework that helps you enter the week with a complete plan — majors, alts, forex pairs, all bracketed before Sunday is out.",
    period: "Every Monday morning",
    image: "/uploads/cam/qcreport.jpg",
    accent: "#9B5CFF",
  },
];

export const TOP_CALL_TILES: TopCallTileData[] = [
  { src: "/uploads/top-call/btc-2.jpg", ticker: "BTC short", amount: "+$54,176", note: "Open 122,823 · Close 115,981" },
  { src: "/uploads/top-call/eth.jpg", ticker: "ETH short", amount: "+$67,902", note: "Open 4,674 · Close 3,994" },
  { src: "/uploads/top-call/sui.jpg", ticker: "SUI short", amount: "+$63,326", note: "Open 3.50 · Close 2.87" },
  { src: "/uploads/top-call/spx.jpg", ticker: "SPX short", amount: "+$34,160", note: "Open 1.51 · Close 1.19" },
  { src: "/uploads/top-call/deep.jpg", ticker: "DEEP short", amount: "+$9,671", note: "Open 0.14 · Close 0.10" },
  { src: "/uploads/top-call/btc-1.jpg", ticker: "BTC short", amount: "+$8,547", note: "Open 124,978 · Close 123,261" },
];

export const TRADE_ROWS: TradeRowData[] = [
  {
    kicker: "XRP · Phemex · Cross 10×",
    title: (<>$302K single trade — while golfing at Mt. Fuji.</>),
    img: "/uploads/cam/xrp-302k-01.jpg",
    body: "One position. Entered $2.65, closed $3.47. The whole thing ran while I was off the screens. That's the point of the system.",
    callouts: [{ v: "$302K", k: "Realized profit" }, { v: "+31%", k: "Price move" }, { v: "10×", k: "Cross leverage" }],
    accent: "var(--acid)",
  },
  {
    kicker: "AVAX · Phemex · Cross 10×",
    title: (<>$210K on AVAX — pre-positioned, walked.</>),
    img: "/uploads/cam/avax-210k-scene.jpg",
    body: "Long entry $25.41. Closed $29.30. Position set Sunday. Closed mid-week. Zero screen time during the move.",
    callouts: [{ v: "$210K", k: "Realized profit" }, { v: "+15.3%", k: "Price move" }, { v: "10×", k: "Cross leverage" }],
    accent: "var(--acid)",
    flip: true,
  },
];

export const LIFESTYLE_TILES: LifestyleTile[] = [
  { src: "/uploads/lifestyle/porsche-walk-back.jpg", tag: "The Porsche", line: "911 Targa GTS · paid in cash" },
  { src: "/uploads/lifestyle/bentley-wide.jpg", tag: "The Bentley", line: "Bentayga · family rig" },
  { src: "/uploads/lifestyle/deck-trading.jpg", tag: "Sunset deck", line: "Sunday plan · paradise office" },
  { src: "/uploads/lifestyle/alpine-1.jpg", tag: "French Alps", line: "Trip planned a week ago" },
];

export const RR_SLIDES: RickRossSlide[] = [
  { src: "/uploads/proof/rr-07.jpg", date: "Jul 11, 2025", amount: "+$1.59M", note: "One month into studying with Cue Banks" },
  { src: "/uploads/proof/rr-05.jpg", date: "Aug 03, 2025", amount: "+$201K", note: "UNI short · single trade" },
  { src: "/uploads/proof/rr-06.jpg", date: "Aug 03, 2025", amount: "Mindset", note: "\"Losing money in the markets is a choice.\"" },
  { src: "/uploads/proof/rr-04.jpg", date: "Aug 09, 2025", amount: "+$61K", note: "INJ long · 4-day swing" },
  { src: "/uploads/proof/rr-03.jpg", date: "Aug 17, 2025", amount: "+$1.8M", note: "Mid-May → August total" },
  { src: "/uploads/proof/rr-02.jpg", date: "Oct 14, 2025", amount: "+$2.92M", note: "$50K start · one month in" },
  { src: "/uploads/proof/rr-01.jpg", date: "Oct 15, 2025", amount: "+$3.16M", note: "All-time P&L · five months in" },
];

export const WOLF_WIN_TILES: WolfWinTileData[] = [
  { src: "/uploads/proof/win-01.jpg", handle: "@aulzon", dollars: "+147%", platform: "Gate.io", caption: "Two Gate.io shares in 24 hours. Followed the WSA Report plan exactly." },
  { src: "/uploads/proof/win-02.jpg", handle: "@rick_ross", dollars: "+$2.02M", platform: "Bybit", caption: "Hit the $2M goal in 2 months after starting with $50K." },
  { src: "/uploads/proof/win-03.jpg", handle: "@nate_smith", dollars: "+$21,257", platform: "Apex", caption: "10k → 100k individual challenge funded and running." },
  { src: "/uploads/proof/win-04.jpg", handle: "@yevrah1989", dollars: "+111%", platform: "Gate.io", caption: "XRPUSDT long — clean cycle play. In and out." },
  { src: "/uploads/proof/win-05.jpg", handle: "@j_mitch_tx", dollars: "+36.5%", platform: "Blofin", caption: "ETHUSDT short at 150x. Managed risk, banked clean." },
  { src: "/uploads/proof/win-06.jpg", handle: "@aljaz_qc", dollars: "+44.9%", platform: "Bybit", caption: "DEEPUSDT 3x long — clean swing, clean exit." },
  { src: "/uploads/proof/win-07.jpg", handle: "@nate_smith", dollars: "+52.7%", platform: "Bitget VIP", caption: "FOLKSUSDT short at 10x. Followed the plan." },
  { src: "/uploads/proof/win-08.jpg", handle: "@ametis_qc", dollars: "+330%", platform: "Bybit", caption: "AIOZUSDT long at 10x. Held through the expansion." },
  { src: "/uploads/proof/win-09.jpg", handle: "@shaunnz", dollars: "+131%", platform: "MEXC", caption: "AIOZUSDT close-long at 5x. WSA Report entry." },
  { src: "/uploads/proof/win-10.jpg", handle: "@servio_qc", dollars: "+$14,398", platform: "Bybit", caption: "SUPERUSDT long — held 11 days." },
  { src: "/uploads/proof/win-11.jpg", handle: "@nick_qc", dollars: "+199%", platform: "Bitget VIP", caption: "ORCAUSDT short at 10x. Textbook Krypton short setup." },
  { src: "/uploads/proof/win-12.jpg", handle: "@tm_qc", dollars: "+351%", platform: "Blofin", caption: "AIOZUSDT long at 10x. Held the position." },
];

export const FURU_ROWS: { furu: string; wolf: string }[] = [
  { furu: "Started in 2021 with meme coins, after watching TikTok.", wolf: "10 years live on the screens — every crash, every melt-up, since 2019." },
  { furu: "Screenshot testimonials 'borrowed' from Google Images.", wolf: "7,000+ traders across 63 countries · 4.95★ on Whop with verifiable receipts." },
  { furu: "One-trick pony. '100× leverage or bust.'", wolf: "Same playbook across Crypto, Forex, Stocks, and Futures." },
  { furu: "Didn't see the last market crash coming.", wolf: "Capital protection sized into every single trade — through every cycle phase." },
  { furu: "'All-in, or you're not a real degen.'", wolf: "Transparent with weekly reporting · wins and losses on the record." },
];

export const VIDEO_TESTIMONIALS: VideoTestimonialData[] = [
  { videoId: "dUIipa1vxAs", headline: "I'm Up $3 Million Following Cue Since 2013", body: "Federal government insider reveals over a decade of profits trading Cue's methods." },
  { videoId: "kLxd_D9J7so", headline: "I Almost Tripled My Money In 7 Days", body: "Joined the Wolfpack one week ago. Walked out with nearly 3x his bag." },
  { videoId: "BLWlP9AjnEU", headline: "Wolfpack Gains Paid For My Trip To Tokyo", body: "Was losing before finding Cue — now funding international trips from Wolfpack profits." },
  { videoId: "EGzswQffvVE", headline: "Paid For Itself 10x Over — Just Bought A New Boat", body: "Long-time crypto holder who switched to active trading with Cue and never looked back." },
  { videoId: "PsFXUIHN1d0", headline: "Doubled My Trading Bag In The First 30 Days", body: "Signed up, doubled his account in a month, done." },
  { videoId: "7n3fCXL8Mjc", headline: "67% Win Rate After Just 2 Months", body: "Two months later: 67% win rate. No BS, no hand-holding." },
  { videoId: "wyj2ZsyWh8k", headline: "19 Years Old — Made $500 In My First Week", body: "Young trader, $500 profit in 7 days. By far the best crypto community." },
  { videoId: "EhY-AlMdbjk", headline: "13 Months Ago, Cue Changed My Life", body: "4-year Cue follower who finally joined the Wolfpack 13 months ago." },
  { videoId: "97eZEmI8qGY", headline: "Busy Dad, 2 Kids — Still Crushing Trades", body: "Full-time entrepreneur with two kids and zero free time." },
  { videoId: "V6C8JFw7ORw", headline: "All The Way From Africa — Growing My Capital With Cue", body: "Global member crushing it from Africa." },
  { videoId: "Xa56tineH0A", headline: "Owned Cue's Courses For Years — Just Rejoined", body: "Multi-year Krypton student who just rejoined the Wolfpack." },
  { videoId: "WYI-CU3PZfs", headline: "+10% On My Account In My First Month As A Beginner", body: "Started trading one month ago. Grew her account 10% as a complete beginner." },
  { videoId: "OD5uCL96EsQ", headline: "7 Months In And I'll Stay Forever", body: "Plans to renew year after year — the community is that good." },
  { videoId: "J1KuhYlTzy0", headline: "Multiple Discords — Cue Is The Only Real One", body: "Veteran crypto trader who's been burned by every fake guru." },
  { videoId: "OqhncwmHVhc", headline: "One Alert Paid For Months Of My Subscription", body: "Just one Wolfpack alert covered multiple months of membership." },
  { videoId: "KdqrqQb5VHg", headline: "Cue Will Double, Triple, Or More Your Portfolio", body: "Nobody else in crypto is this honest about wins AND losses." },
  { videoId: "NxdqQCEO2rc", headline: "Best Investment I've Ever Made In My Life", body: "Three-point breakdown: crypto signals, 30+ hours of training, brilliant community." },
  { videoId: "WDqtoIOIx8M", headline: "3 Years Trading Crypto — Should've Joined Cue Sooner", body: "Brazilian trader, 3 years in markets." },
  { videoId: "fL1F49uN6Jc", headline: "Following Cue Since 2019 — He Teaches You To Fish", body: "Used to follow YouTube shills and lose money. Found Cue in 2019." },
  { videoId: "iQOEVY3iEUQ", headline: "Blew Up My Bag Multiple Times — Then I Found Cue", body: "Multiple blowups. Cue's training turned everything around." },
];

export const REVIEWS: ReviewData[] = [
  { name: "Nikolay Stoev", date: "Oct 2024 · 1 month after purchase", quote: "As a member of his groups since 2021, I'm giving him a rate 10 out of 10! He's dominating every market — Crypto, Forex, Futures, CFDs, you name it. The only LEGIT trader I've stumbled across in this world of scammers." },
  { name: "Ronny Roehrig", date: "Dec 2024 · 2 months after purchase", quote: "Cue Banks is a fin genius. If you don't make money here, you will not make it anywhere. His trading strategies and his results are unique. If you want to make 'wife-changing money,' this is definitively the fastest way." },
  { name: "Renars Bzezinskis", date: "Nov 2024 · 4 days after purchase", quote: "This is the only person you need to follow or learn from to learn trading and not make mistakes like the rest of the 99% of the market." },
  { name: "Mario Fanto", date: "Oct 2024 · 21 days after purchase", quote: "The best decision I've ever made. You'll learn the best trading strategies and earn a lot of money at the same time. And with the Wall Street Academy Report you are prepared for the whole week and know what to do. Simply brilliant." },
  { name: "ShaunNZ", date: "Oct 2024 · 1 month after purchase", quote: "Look no further! This guy is the OG. Have been part of the Discord and now here for a while — best decision I've made in this space. Super engaging, unbeatable alpha, and top customer service. Money to be made $$$" },
  { name: "George G.", date: "Dec 2024 · 1 month after purchase", quote: "Number one pack, imo. 10 out of 10. Lots of the most useful info you may find. Sometimes I think he has some kind of inside info, but nope — it's just an undeniable skill. Keep running, man." },
  { name: "supremeshot00", date: "Feb 2025 · 2 days after purchase", quote: "I have been following Cue Banks for 5 years. Great leader, good principles, and he respects the art of trading. Everything you've said has checked out — and I've changed my life because of this." },
  { name: "Filip Rodeš", date: "Dec 2024 · 8 days after purchase", quote: "It seems like he has a magic ball to predict the future, haha. I swear he gets at least 7 out of 10 trades right. Highly recommend." },
  { name: "NvrPullOut", date: "Nov 2024 · 4 days after purchase", quote: "Cue Banks is the best at teaching technical analysis and keeping you informed every step of the way. I've followed him for years on YouTube — I wish I had joined his course sooner. He is the real deal. Hands down 10 out of 10." },
  { name: "Shay McCusker", date: "Jan 2025 · 14 days after purchase", quote: "THE place to go for trading education. All the info you need and nothing you don't. Doesn't hold back with info other traders would never share. 10 stars out of 5." },
  { name: "Kalaveti Mekemeke", date: "Nov 2024 · 16 days after purchase", quote: "Just joined last week. Subscribed to his strategy and the Wall Street Academy Report, plus the learning videos — it's been a game-changer. 10/10 compared to other sites I've tried before." },
  { name: "Andre Freire", date: "Dec 2024 · 1 month after purchase", quote: "Best trading program. Clean analysis, simplistic, and straightforward. Fantastic insights, great community. If you are considering entering crypto or trading in general, I highly recommend signing up." },
  { name: "djordje radulovic", date: "Dec 2024 · 12 days after purchase", quote: "Cue Banks's approach to trading and his approach to teaching is second to none. Such a straightforward dude — tells it how it is, always. Transparent about everything. Not some bullshit influencer posting Lambo bullshit and multi-zillion trades." },
  { name: "Jack Deth", date: "Dec 2024 · 3 months after purchase", quote: "Excellent course, well worth the price — and a lot more if you're willing to put in the time and effort. The WSA Report and the glimpse into Cue Banks's process alone makes this an easy investment. NOTE: this is not a trade-alert group. It's a professional sharing his system." },
  { name: "Simeon Rückert", date: "Dec 2024 · 1 month after purchase", quote: "The best overall package in the industry. For everyone who wants to start trading or further internalize the fundamentals. Cue has a simple but very effective trading style. The WSA Report is the real gold." },
  { name: "Mauricio Bento", date: "Dec 2024 · 13 days after purchase", quote: "I've been following his YouTube channel for a long time, and finally decided to join the Wolfpack. I love the courses and the analysis. Cue Banks rocks. I really enjoy how he's straightforward and far from a used-car salesman." },
  { name: "gary mills", date: "Nov 2024 · 17 days after purchase", quote: "Fantastic course and very informative. Best decision I've made since buying crypto. Should have joined years ago. Great community with loads of advice. Cue Banks has a no-BS approach — tells you how it is. Best guy in my opinion on YouTube." },
  { name: "HF", date: "Oct 2024 · 15 days after purchase", quote: "Wall Street Academy Report + video gives you clear buy and sell points for crypto, forex, and futures — so you don't have to guess. Super easy to follow. The Krypton Legacy Course is a huge bonus. 30+ hours of trading education." },
  { name: "Assadour Zomjian", date: "Dec 2024 · 24 days after purchase", quote: "Cue doesn't fool you around. One of the best crypto and forex channels ever. Great community, strong signals, even trading courses — all in one subscription." },
  { name: "Mykola Hnatyuk", date: "Dec 2024 · 2 months after purchase", quote: "Best one out there. Cue Banks's Krypton course is great — boosted my knowledge and confidence. The community is great as well, affordable price. Would definitely recommend." },
  { name: "J Mitch TX", date: "Dec 2025 · 6 days after purchase", quote: "If you take all classes and do not double your investment, I will pay you myself for your entrance. No one is perfect — however the weekly win ratio is outstanding. It's better to try and succeed than not try." },
  { name: "Branwill Storm", date: "Feb 2026 · 1 year after purchase", quote: "Crazy knowledge and value. This guy can flip your whole life around in all areas." },
  { name: "Gábor Földesi", date: "Oct 2024 · 1 month after purchase", quote: "This guy is LEGIT. You can learn a lot from his Krypton Legacy Course. You can also check, copy, and study his trades. All the things I searched for." },
  { name: "Crypto85", date: "Mar 2025 · 5 months after purchase", quote: "Great trader, great content. He is very active and helps his community. Very happy to be part of it. His trades are very accurate and easy to follow. Highly recommend." },
];

export const PACKAGE_TILES: PackageTileData[] = [
  {
    idx: 1, kicker: "· Weekly Plan · The Backbone ·", accent: "var(--acid)",
    title: "Wall Street Academy Report",
    body: "Copy trading plans in Crypto & Forex sent every Monday with all the setups.",
    items: ["Crypto & Forex setups", "Sent every Monday", "All the setups included", "Copy and execute"],
    wide: true,
  },
  {
    idx: 2, kicker: "· Course · Alt-Coin Profit Model ·", accent: "var(--acid)",
    title: "Krypton Course",
    body: "The ultimate alt-coin course built around a 7-figure profit model. 30+ hours of content.",
    items: ["Ultimate alt-coin course", "7 Figure Profit Model", "30+ hours of content", "Beginner to advanced"],
  },
  {
    idx: 3, kicker: "· Curriculum · Beginner to Pro ·", accent: "#9B5CFF",
    title: "Pro Level Courses",
    body: "The beginner to pro starter course getting you ready to tackle trading.",
    items: ["Beginner to pro", "Ready to tackle trading", "Foundation curriculum", "Starter framework"],
  },
  {
    idx: 4, kicker: "· Indicators · TradingView Pack ·", accent: "#6FE9FF",
    title: "DEGENR8 Suite",
    body: "The full DEGENR8 TradingView indicator suite giving you the edge needed to start profiting.",
    items: ["Full indicator suite", "TradingView integration", "The edge to start profiting", "Private to members"],
  },
  {
    idx: 5, kicker: "· Community · The Room ·", accent: "var(--pink)",
    title: "LIVE Chat",
    body: "Real-time updates on current trades plus the best trading community on the planet.",
    items: ["Real-time trade updates", "Best trading community on the planet", "7,000+ traders", "63 countries"],
    wide: true,
  },
  {
    idx: 6, kicker: "· Framework · The Long Game ·", accent: "var(--acid)",
    title: "Krypton Millionaire Framework",
    body: "The Krypton Millionaire Framework — the full system for building long-term wealth as a trader.",
    items: ["Full millionaire framework", "Built on the Krypton system", "Long-term wealth building", "Included at no extra cost"],
    wide: true,
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    q: "What exactly do I get?",
    a: "Everything listed in the package section — Krypton course (30+ hours), weekly WSA Report, Pro Level curriculum, DEGENR8 suite, live chat, Millionaire Framework. One payment, instant access.",
  },
  {
    q: "Is this the same as the Mentorship application?",
    a: "No. Mentorship is application-only capped cohort with 1:1 access and live calls. Wolfpack is the operator's self-serve lane — same playbook, asynchronous.",
  },
  {
    q: "Do I need to be experienced to follow along?",
    a: "No. Pro Level courses built for someone who's never opened a chart. About half the pack started as complete beginners.",
  },
  {
    q: "Can I do this while working a full-time job?",
    a: "Yes — by design. WSA Report drops Monday morning. Read it once, place orders, walk away. One weekly planning session sets up the next five days.",
  },
  {
    q: "How is this different from ICT, SMC, or signal services?",
    a: "ICT/SMC leave you making live decisions all day. Signal services hand you trades but never teach why. Wolfpack gives pre-planned weekly framework.",
  },
  {
    q: "What markets do you cover?",
    a: "Primarily crypto majors and forex. Krypton framework forged in stocks for 16 years. Same methodology applies to indices, gold, any liquid asset.",
  },
  {
    q: "Is there a refund?",
    a: "Refund terms run through Whop's standard policy. The cleaner answer: most people who sign up stay. 4.95★ from 135 reviews isn't an accident.",
  },
  {
    q: "Is this financial advice?",
    a: "Absolutely not. This is education. Trade your own size, own capital, own risk parameters.",
  },
];

export const PRICE_ROWS: string[] = [
  "All six deliverables · unlocked instantly",
  "Wall Street Academy Report · every Monday morning",
  "Live chat with 7,000+ traders · 63 countries",
  "Direct line to the operator team",
  "No upsells inside · everything included",
];

export const FOOTER_PACK_LINKS: FooterLink[] = [
  { label: "Package", href: "#package" },
  { label: "Results", href: "#results" },
  { label: "Furu vs Pack", href: "#vs" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

export const FOOTER_OTHER_LINKS: FooterLink[] = [
  { label: "Free Course", href: "/free-course" },
  { label: "The Mentorship", href: "#" },
  { label: "Brand Codex", href: "#" },
];
