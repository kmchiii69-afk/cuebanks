import { CNC, CUECASTS } from "@/lib/roadmap-data";
import type { ChecklistDoc, DocContent, Phase } from "./types";


// ─── Intro Forex Document ─────────────────────────────────────────────────────
const INTRO_FOREX_DOC: DocContent = {
  title: "Introduction to Forex",
  sections: [
    {
      heading: "What is Forex & Why do people trade?",
      paras: ["Forex is short for the Foreign Exchange. The Forex market is the most liquid market in the world. It exchanges approximately $4.3 Trillion per day opposed to less liquid markets such as the New York Stock Exchange that exchanges approximately $20 Billion per day. People turn to trade the Forex markets for a variety of reasons:"],
      bullets: [
        "You can trade from anywhere in the world",
        "Most liquid market in the world",
        "Traders can profit whether a specific currency is increasing or decreasing in value",
        "Forex does not require a high initial investment",
        "Traders can begin with as little as $100 which makes Forex all the more popular",
        "High liquidity allows large amounts of leverage",
        "Some brokers allow leverage up to 1:1000",
      ],
      footer: "The goal of Forex is to buy a currency that is anticipated to gain value or sell a currency that is anticipated to lose value against another currency.",
    },
    {
      heading: "What do people trade?",
      paras: [
        "When trading Forex, it is inevitable that traders will run across currencies known as \"The Majors\". This term refers to the most frequently traded currencies in the world, with a list normally including the Euro (EUR), US Dollar (USD), Japanese Yen (JPY), Great British Pound (GBP), Australian Dollar (AUD), and the Swiss Franc (CHF).",
        "These currencies each carry a symbol (ISO code) and a nickname. These names will often come up in research and will be handy when communicating with other Forex Traders.",
      ],
    },
    {
      heading: "What are the four major markets to trade?",
      paras: ["The four major markets to trade include the London Session (3am EST–12pm EST), the New York Session (8am EST–5pm EST), the Sydney Session (5pm EST–2am EST), and the Tokyo Session (7pm EST–4am EST). During summer and winter months from 8am to 12pm the London and New York session overlap."],
    },
    {
      heading: "The London Session",
      paras: ["It is this session that 99% of traders keep their eyes on as London controls essentially the entire European market movements. Roughly 30% of all market transactions take place in the London Session."],
      bullets: [
        "Due to overlapping with two other major trading sessions, a large portion of Forex transactions are made during this time — leading to a massive surge in liquidity and lower transaction costs.",
        "The London Session is known to be specifically volatile for the EUR/USD, as a plethora of European news is released within a couple hours of the opening.",
        "Most major movements that occur during the London Session carry over into the New York Session.",
        "The best times to trade the EU & GBP/USD is during the overlap of the London & New York Session.",
        "Price action may slow down and trends start to change as European traders close their trades and take profits.",
      ],
    },
    {
      heading: "The New York Session",
      paras: ["This session begins at 8am EST and is the most traded session amongst all Forex traders, primarily due to influential market news. The most commonly traded pairs during this session are USD/JPY and EUR/USD, as well as Gold."],
      bullets: [
        "Major news is released in the beginning of this session.",
        "Every major transaction in the world involves the USD — whenever major news comes out that affects the USD, anything directly related to it will move drastically.",
        "The New York Session begins to majorly slow down after 1pm EST.",
        "There is almost little or no movement Friday afternoons as Asian and London traders are done for the weekend.",
      ],
    },
    {
      heading: "The Tokyo Session",
      paras: ["The Tokyo Session is often referred to as the Asian session. Japan is the third largest trading center in the world, and the Japanese Yen partakes in 16.5% of all forex transactions — with about 21% of all transactions taking place during this session."],
      bullets: [
        "The most commonly traded pair is the USD/JPY.",
        "The Bank of Japan (BOJ) has been known to inject massive amounts of government printed money into the markets, causing moves of 2000 pips within 20 minutes.",
        "Liquidity can often be very thin, making this session boring because of the lack of activity.",
        "It is more likely to see movement in Asia Pacific pairs like the AUD/USD and NZD/USD.",
        "Most action takes place early in this session due to major economic data that is released.",
      ],
    },
    {
      heading: "The Sydney Session",
      paras: ["This session starts and ends the trading week — opening Sunday at 5pm EST and closing Friday at 5pm EST. This session focuses on the volatility of AUD pairs (ex. AUDUSD, GBPAUD, AUDJPY). Normally this session has very low volatility compared to the other sessions."],
    },
    {
      heading: "Overview",
      paras: [
        "If you are looking for times of major volatility, look for times when two sessions overlap. Also note, trading on Fridays and Sundays can be a costly venture. Sunday is when investors are looking for the news to create a market path — paths can often go one way Sunday and completely reverse come Monday.",
        "NEVER hold a trade through the weekend as you are exposed to gaps in the market come Sunday when markets open due to news announced when the market is closed. The only exception is if you plan on swinging a trade for an extended period of time, and it is a part of your strategy.",
      ],
    },
    {
      heading: "Three Types of Analysis",
      paras: ["Traders often break down the analysis of the charts or Forex pairs into three different categories:"],
      bullets: [
        "Technical Analysis — Reading charts using a series of technical tools, normally involving mathematical equations and historical data to predict what will happen next.",
        "Fundamental Analysis — A review of the economics and political forces that might come into play when forecasting the direction of a currency pair. Examining economic health of a region, interest rates, or relationships between countries.",
        "Sentiment Analysis — How traders devise their own opinions over how the market is changing and where it's heading, often using Line Charts, Bar Charts, or Candlestick Charts.",
      ],
    },
  ],
};

// ─── Checklist Data ────────────────────────────────────────────────────────────
const NO_TRADE_CHECKLIST: ChecklistDoc = {
  title: "No Trade Checklist",
  theme: "red",
  rule: "2 OR MORE BOXES CHECKED = NO TRADE TODAY",
  sections: [
    { heading: "Choppy Market", items: [
      { text: "Market is ranging with no clear direction" },
      { text: "Price is stuck mid-range with no momentum" },
      { text: "Liquidity grabs with no follow-through" },
    ]},
    { heading: "Bad Timing", items: [
      { text: "Wrong session or the move already ran" },
      { text: "Missed the initial setup — now chasing" },
      { text: "Low volume, dead market hours" },
    ]},
    { heading: "Timeframe Conflict", items: [
      { text: "HTF and LTF are not aligned" },
      { text: "Mixed directional signals across timeframes" },
      { text: "Major level directly blocking the target" },
    ]},
    { heading: "Poor Setup", items: [
      { text: "Fibonacci zone is weak or not clean" },
      { text: "No confluence layers present" },
      { text: "Indecisive candles at the entry zone" },
    ]},
    { heading: "Risk Reward", items: [
      { text: "R:R is below minimum threshold" },
      { text: "Stop loss placement doesn't make sense" },
      { text: "Target is vague or overlapping a major level" },
    ]},
    { heading: "Emotional State", items: [
      { text: "Trying to recover a previous loss" },
      { text: "Feeling frustrated, impatient, or anxious" },
      { text: "Trading out of boredom — no real edge present" },
    ]},
  ],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TRADE_READY_CHECKLIST: ChecklistDoc = {
  title: "Trade Ready Checklist",
  theme: "green",
  sections: [
    { heading: "Market Structure & Trend Context", items: [
      { text: "Higher highs & higher lows confirmed (uptrend)" },
      { text: "Lower highs & lower lows confirmed (downtrend)" },
      { text: "Price respecting structure, not breaking randomly" },
      { text: "Recent BOS or ChoCH identified on entry timeframe" },
    ]},
    { heading: "Multi-Timeframe Alignment", items: [
      { text: "Higher timeframe bias identified (1H / 4H)" },
      { text: "Entry timeframe aligned with HTF direction" },
      { text: "No major HTF level directly blocking the target" },
    ]},
    { heading: "Support, Resistance & Key Levels", items: [
      { text: "Major horizontal S&R levels marked" },
      { text: "Daily and session highs/lows identified" },
      { text: "Previous structure highs/lows marked" },
      { text: "Price reacting at a key level — not mid-range" },
    ]},
    { heading: "Fibonacci Confluence", items: [
      { text: "Fibonacci drawn from correct swing high to low (or reverse)" },
      { text: "Confluence at a key level: 38.2%, 50%, 61.8%, 78.6%, 88.6%" },
      { text: "Fib zone aligns with structure, S&R, or MA" },
    ]},
    { heading: "Trendlines & Counter-Trend Lines", items: [
      { text: "Valid trendline drawn with minimum 2–3 confirmed touches" },
      { text: "Counter-trend line showing the current pullback or correction" },
      { text: "Entry aligns with trendline support or resistance" },
      { text: "Trendline angles are natural — no forced drawings" },
    ]},
    { heading: "Risk, Target & Trade Quality", items: [
      { text: "Clear invalidation level for stop loss placement" },
      { text: "Risk:Reward meets minimum (2R or better)" },
      { text: "Target aligns with structure, liquidity, or major level" },
      { text: "Position size calculated correctly for account size" },
    ]},
  ],
};

const TOP_DOWN_DOC: DocContent = {
  title: "Cue's Steps to Understanding Top-Down Analysis",
  sections: [
    {
      heading: "Thought Process Is Everything",
      paras: ["Run through these steps every session before touching a lower timeframe entry. This is the exact flow Cue uses."],
    },
    {
      heading: "Steps 1 – 7",
      bullets: [
        "1. Understand what asset you're focused on",
        "2. See what type of structure you're in — uptrend, downtrend, or consolidation",
        "3. What timeframe do you see structure on the cleanest? H1 – H4... Daily? Barely",
        "4. How are the moving averages currently? Up, down, flat",
        "5. Locate where you are within the structure based on your Fibs 0–100%",
        "6. Next you'll be seeing if you can see a change in trend coming soon based on the fib level it's at",
        "7. Look to see if you're able to go to lower timeframes to see if you broke either a higher low (if in uptrend) or a lower high (if in downtrend)",
      ],
    },
    {
      heading: "Steps 8 – 14",
      bullets: [
        "8. Look for candle pattern formations within structure to find a higher low entry opportunity or a lower high entry in a downtrend",
        "9. Make sure the candle pattern you're entering is based on the direction of the overall trend on the higher timeframe",
        "10. As you enter, make sure it's flowing with where the higher timeframe structure is headed. Build this minor trend on lower timeframes that matches the higher timeframe's direction",
        "11. Based on the asset you're trading, identify a 'Nmon fluctuating zone' for stop loss based on lower timeframe structure to minimize risk. Check that your expected projection outweighs the risk",
        "12. The goal is to aim for risk-to-reward ratios of 2:1 or 3:1+",
        "13. Projections can be based on higher timeframe Fibonacci — e.g., -27% or -61.8% targets. For intraday, use 15m or 30m timeframes for quicker targets",
        "14. Always advise taking trades that align with the overall market direction on higher timeframes",
      ],
    },
    {
      heading: "Focus Points (Permanent)",
      bullets: [
        "1. Market Structure (PERMANENT)",
        "2. Major Time Frame & Minor Timeframe",
        "3. Moving Averages",
        "4. Candle Stick Analysis",
        "5. Fibonacci",
        "6. Trendlines",
      ],
    },
  ],
};

// ─── Additional Docs ──────────────────────────────────────────────────────────
const BACKTEST_DOC: DocContent = {
  title: "Backtest Your Pair",
  sections: [
    {
      heading: "How to Backtest",
      paras: [
        "Go back no more than 5 months and start with the higher time frames (HTFs), either H4 or H1. Begin with a top-down analysis: identify the market structure on the HTFs, mark support and resistance levels, draw Fibonacci, identify exhaustion zones, and look for confluence areas. Check where the moving averages (MAs) are positioned and whether they align with the structure.",
        "Then move down to the lower time frames (LTFs), depending on the chosen approach (for example, H4 → M30 → M15 or H1 → M15 → M5), and look for potential entries, scale-in opportunities, and exits. Check which higher time frame (HTF) provides the clearest market structure. Do not prioritize or force yourself to always use the same time frame — adapt to current market conditions and choose the one that offers the best analysis.",
        "Always remember to adapt to the market conditions. Every situation is different. Sometimes analyzing the H4 and then moving directly to M30 will not provide enough detail, so you may need to use M15 and M5 instead. Likewise, you cannot always rely on moving averages — if they are inconsistent, cutting through the candles and not clearly respecting the structure, use other technical tools instead.",
        "Draw trendlines or counter-trendlines when they are valid, but never force them onto the chart.",
      ],
    },
  ],
};

const SELF_EVAL_DOC: DocContent = {
  title: "Trader Self-Reevaluation Phase",
  sections: [
    {
      heading: "Objective",
      paras: ["The main goal of this phase is for a trader to step back and honestly re-evaluate himself — to understand current performance, mindset, and progress since starting, and to identify what must change going forward."],
    },
    {
      heading: "Instructions",
      paras: ["Write a structured self-reflection covering the points below. Be honest and specific — this is about clarity, not perfection."],
    },
    {
      heading: "1 — Current State & Progress",
      paras: ["Describe where you are currently as a trader. What results are you getting, and how has your approach, mindset, or discipline changed since you started?"],
    },
    {
      heading: "2 — Core Strengths & Weak Points",
      paras: ["Identify your strongest qualities that help you in trading, and your main weaknesses that consistently hurt your performance. Focus on what truly impacts your results, not general traits."],
    },
    {
      heading: "3 — Recurring Patterns",
      paras: ["What patterns do you notice in your trading behavior? This can include mistakes you repeat, emotional reactions, timing issues, overtrading, or anything that shows up consistently in both winning and losing periods."],
    },
    {
      heading: "4 — Main Problem & Root Cause",
      paras: ["What is the single biggest issue currently limiting your progress? Go deeper than the surface-level problem and explain the real cause behind it."],
    },
    {
      heading: "5 — Direction Moving Forward",
      paras: ["Based on your reflection, what needs to change immediately? Define what you will stop doing, what you will improve, and what your main focus should be in the next phase."],
    },
    {
      heading: "Note",
      paras: ["This is not a checklist exercise. The goal is to force clarity and self-awareness so you can accurately see what is holding you back and what needs to be fixed before moving forward."],
    },
  ],
};

const IMPROVE_DOC: DocContent = {
  title: "Identify Where You Need to Improve",
  sections: [
    {
      heading: "Focus Areas",
      bullets: [
        "Reading price action — Understanding how candles close, why they closed that way, and what you can expect to happen afterwards",
        "Time frame correlation — Understanding how higher and lower time frames work together to confirm trade direction",
        "Market structure — Understanding how the market moves in bullish and bearish trends. What to expect and how to take advantage of it",
        "Consistency — The ability to repeat good trading habits and achieve profitable results over time",
        "Entries/Exits — Finding the right time to enter and exit trades without unnecessary drawdown, getting stopped out, or leaving profits on the chart",
        "Maintaining the trade and scaling in — Managing open trades effectively and adding to winning positions to maximize profits",
        "Risk management — Managing losses and position sizes so you stay profitable even with a low win rate or bad market conditions",
        "Top down analysis — Analyzing higher time frames first then moving to lower time frames for execution, so you always know what you are looking for",
      ],
    },
  ],
};

// Renamed from `PHASES` to avoid the name collision with `@/lib/phases`
// which exports the canonical phase definitions. Pages import the curated
// roadmap version (the long, copy-rich one) from this module.
export const ROADMAP_PHASES: Phase[] = [
  // ── PREPARE ──────────────────────────────────────────────────────────────────
  {
    num: "00", title: "Prepare", duration: "Week 1",
    tagline: "Before the program officially starts, this is where you set yourself up. The traders who skip this week show up to Week 1 unprepared — don't be that person.",
    checkpoint: "You've watched the welcome video, your 1-on-1 channel is active, you know your lot sizing and risk parameters, and you've examined your own trading fears. You're ready.",
    items: [
      {
        label: "Welcome Video",
        note: "Start here. Quillan will walk you through what Wall Street Academy is, what this program is built on, and exactly what to expect. Watch before anything else.",
        videos: [{ id: "1205968513", label: "Welcome" }],
      },
      {
        label: "Read This",
        tag: "Action Required",
        note: "Make sure you have your own 1-on-1 channel. If you don't, open a support ticket and ask for it. This channel is an additional resource alongside the Cue AI to help you on your trading journey. You can ask anything, get feedback on your trades, strategy, mindset, and receive personal guidance whenever you need it.\n\nCue is going to host 1 webinar per week. You need to have completed your phases — if you haven't, you cannot be on the webinar. We need to hold you accountable. That's the only way you're going to see progress and improvement. Don't cut corners.",
      },
      {
        label: "Introduction to Forex",
        note: "What the market actually is, how it moves, and what it isn't. The foundation is support and resistance — everything else is built on top of that.",
        doc: INTRO_FOREX_DOC,
        videos: [{ label: "Trading Sessions", href: "https://www.babypips.com/tools/forex-market-hours" }],
      },
      {
        label: "Risk Management 101",
        note: "Cue usually risks 5–15% per trade, depending on his confidence, the confluence, and the cushion in his account. He always says \"The most confident person in the room will make the most amount of money.\"",
        videos: [{ id: "160573172", label: "Risk Management 101" }],
      },
      {
        label: "Risk Management — Homework",
        tag: "Homework",
        note: "Do your own case scenario and create a breakdown similar to the one shown in the video above. Ask yourself:\n\n· How much are you going to deposit?\n· How much are you willing to risk per trade?\n· Which pair do you trade?\n· What is your usual stop loss (SL)?\n· Based on these factors, calculate your appropriate lot size.\n\nCue typically risks between 10% and 15% per trade, but that depends on his confidence, account balance, market conditions, confluences, and overall setup quality. Your risk should be based on your own level of precision, confidence, and consistency — whether that is 5%, 10%, or 15%.\n\nIf you are only risking 1% per trade, focus on improving your edge: study more, backtest more, keep a detailed journal, and build the confidence and consistency needed before increasing your risk.\n\nAs Cue always says: \"The most confident person in the room will make the most amount of money.\"",
        images: ["/images/homework-1.png"],
      },
      {
        label: "The Four Fears + Greed, Revenge & Trading Style",
        note: "You are the problem at times. Not the broker. Not the market. You. Know your patterns before they cost you.",
        videos: [
          { id: "1090913021", label: "The Greed Effect 2.0" },
          { id: "1090918934", label: "Knowing Your Trading Style 2.0" },
          { id: "1090926102", label: "Fear of Market 2.0" },
          { id: "1090921899", label: "Revenge Trading 2.0" },
        ],
      },
      {
        label: "Homework — Examine Yourself",
        tag: "Homework",
        note: "What is your biggest fear when you trade? Are you afraid of losing money, missing opportunities, or being wrong? How do you react in each of these situations and what is the outcome of your reactions usually?\n\nAsk yourself whether this is how you should react as a disciplined trader. If not, think about what you can do to improve your behavior and responses. Always reflect on how you can better yourself, become more consistent, and make more rational trading decisions.",
      },
    ],
  },

  // ── SET ───────────────────────────────────────────────────────────────────────
  {
    num: "SET", title: "Set", duration: "Week 2 – 3",
    tagline: "The fundamentals are the foundation. Support, resistance, Fibonacci, structure, trendlines — master these tools before you try to combine them.",
    checkpoint: "You can identify trend, mark S&R, draw Fibonacci, understand market structure, and draw clean trendlines. You've sent your homework for feedback. The fundamentals are locked in.",
    items: [
      {
        label: "Demo vs Live",
        note: "Demo doesn't replicate the emotional weight of real money. This module bridges that gap so your first live account doesn't become a tuition payment.",
        videos: [{ id: "1090929269", label: "Demo vs Live 2.0" }],
      },
      {
        label: "Introduction to TradeLocker",
        note: "No MT4 or MT5? No problem. This module walks you through TradeLocker — Cue's preferred alternative platform — and how to get your charts set up correctly from day one.",
        videos: [{ id: "900590824", label: "Introducing TradeLocker" }],
      },
      {
        label: "Identifying the Trend",
        note: "Higher high points, higher low points — that's a bullish market. Lower highs, lower lows — that's bearish. Structure is always first.",
        videos: [{ id: "1162341882", hash: "e9c9f5a402", label: "Identifying the Trend" }],
      },
      {
        label: "Cue's Tips",
        tag: "Tips",
        note: "What higher timeframe is the cleanest for structure?\n\nIf you base your structure on the H4 timeframe, drop down to M30 and M15 for more details and base your entries on them. Use M5 if you need even more precision.\n\nIf H1 is much cleaner, use M15 and M5 for details and entries.\n\nSometimes M30 or M15 are going to be too noisy — go down to M5 or even M1.\n\nIt always depends. You need to adapt to market conditions.\n\n· DAILY / H1 / M30\n· H4 / M30 / M15\n· H1 / M15 / M5\n\nMain analysis TFs: Daily, H4, H1\nEntry TFs: M30, M15, M5, M1\n\nExample: I am basing my HTF structure on H1. I'm not going to drop to M30 — there aren't enough candles. If I go to M15 I get significantly more candles and more detailed price action, which helps me get better entries. Always understand that lower timeframes are only for execution and fine-tuning — the higher timeframe defines the main market direction.\n\nStudy, backtest, apply on the chart and review afterwards / journal.",
      },
      {
        label: "Support & Resistance",
        note: "What forms a support and resistance level? What needs to happen for it to be considered broken or tested? This is the foundation of every setup you will ever take.",
        images: [
          "/images/sr-1.png",
          "/images/sr-2.png",
          "/images/sr-3.png",
          "/images/sr-4.png",
          "/images/sr-5.png",
          "/images/sr-6.png",
        ],
      },
      {
        label: "S&R — Homework",
        tag: "Homework",
        note: "Send 10 or more examples of how you would identify and place support and resistance levels in your 1-on-1 chat. Make sure to include if support is broken or tested.\n\nIt's important to get the fundamentals right. This will give both you and us the feedback we need to understand what areas require improvement and where we should focus our work moving forward.\n\nIf you have any questions, send a message in the 1-on-1 chat. If you want feedback, you will get it.",
      },
      {
        label: "Additional Information",
        note: "Helpful notes on risk management, pair selection, and lot sizing — the practical details that make the difference.",
        doc: {
          title: "Helpful Notes",
          sections: [
            {
              heading: "Cue's Risk Management",
              paras: ["Forex-specific sizing rules — different rules apply for metals and indices."],
              bullets: [
                "0.50 Lot per $500 in your account",
                "1.00 Lot per $1,000 in your account",
                "Scale proportionally from there",
              ],
              footer: "Disclaimer: This is Cue's personal approach based on his experience. Adjust based on your own account size and risk tolerance.",
            },
            {
              heading: "Focus and Master One Pair",
              paras: [
                "You can master that one pair and make a profit from that one pair every day for the rest of your life. Jumping from pair to pair isn't going to help you with being consistent and being able to catch major moves from a pair.",
                "Choose a pair that suits your lifestyle with the times that the pair is the most volatile (sessions).",
              ],
            },
            {
              heading: "Lot Size & Position Management",
              paras: [
                "Keep in mind that the smaller your lot size, the more you are going to want to stay in the market to see a substantial amount of profit. A higher lot size means you will see a larger profit with a smaller pip gain.",
                "Once you learn how to manage your risk, you can definitely take advantage of this.",
              ],
            },
          ],
        },
      },
      {
        label: "Market Structure 1.0 + 2.0",
        note: "The structure of every move — what breaks it, what confirms it, and what it tells you about the next setup. This is the foundation everything else sits on.",
        videos: [
          { id: "208979674", label: "Market Structure 2.0" },
          { id: "157785913", label: "Market Structure 1.0" },
        ],
        images: ["/images/ms-chart-1.png"],
      },
      {
        label: "Market Structure Homework",
        tag: "Homework",
        note: "Send 5 charts where you mark HLs, HHs, LLs, LHs in your 1-on-1 chat.",
      },
      {
        label: "Using Fibonacci 1.0 + 2.0",
        note: "Point A to point B — 38.2% is your first higher-low opportunity, 23.6% is where it gets sloppy. Know which levels to trust and which ones to wait through.",
        videos: [
          { id: "214333836", label: "Fibonacci 2.0" },
          { id: "148814763", label: "Fibonacci 1.0" },
        ],
        images: [
          "/images/fib-bd-1.png",
          "/images/fib-bd-2.png",
          "/images/fib-bd-3.png",
        ],
      },
      {
        label: "Fibonacci Tool Settings and Chart Examples",
        note: "How to configure the Fibonacci tool correctly in your charting platform. Follow these exact settings so your retracement levels match what Cue uses.",
        images: [
          "/images/fib-tool-settings.png",
          "/images/fib-tool-1.png",
          "/images/fib-tool-2.png",
          "/images/fib-tool-3.png",
          "/images/fib-tool-4.png",
          "/images/fib-1.png",
          "/images/fib-2.png",
          "/images/fib-3.png",
        ],
      },
      {
        label: "Fibonacci — Homework",
        tag: "Homework",
        note: "Draw Fibonacci retracements on 5 charts from swing high to swing low (and reverse). Make sure the levels are clean and correctly drawn. Send your charts in the 1-on-1 chat.",
      },
      {
        label: "Drawing Trendlines",
        note: "Always draw trendlines from wick to wick. If you can't walk in it, it's invalid. If that line is too steep, it's forced — it's gonna break, guaranteed waste of time. You want a nice angle.",
        videos: [{ id: "1162341491", label: "Drawing Trendlines 2.0" }],
        images: [
          "/images/gbpjpy-tl-1.png",
          "/images/tl-us30-1.png",
          "/images/tl-us30-2.png",
          "/images/tl-us30-3.png",
          "/images/tl-xau-1.png",
          "/images/tl-xau-2.png",
          "/images/tl-xau-3.png",
          "/images/tl-xau-4.png",
        ],
      },
      {
        label: "GBPJPY — Candle Breakdown",
        note: "This is what a sexy candle looks like — clean, precise, at the right level. If it's not this, don't touch it. Study these setups until you can spot them instantly.",
        images: [
          "/images/gbpjpy-candle-1.png",
          "/images/gbpjpy-candle-2.png",
          "/images/gbpjpy-candle-3.png",
          "/images/gbpjpy-candle-4.png",
          "/images/gbpjpy-candle-5.png",
        ],
      },
      {
        label: "Trendlines — Homework",
        tag: "Homework",
        note: "Draw 10 trendlines and 10 counter trendlines as shown above.",
        images: [
          "/images/tl-hw-1.png",
          "/images/tl-hw-2.png",
          "/images/tl-hw-3.png",
          "/images/tl-hw-4.png",
          "/images/tl-hw-5.png",
          "/images/tl-hw-6.png",
          "/images/tl-hw-7.png",
        ],
      },
      {
        label: "Confluence XXX",
        note: "The full system in motion — live charts, real setups, structure clean, MAs below the market, 38.2% respected, price acting like butter. Note: there is no audio from 1h 11m to 1h 34m due to a video issue. Sound resumes at 1h 34m.",
        videos: [{ id: "351940671", label: "Confluence XXX" }],
      },
    ],
  },

  // ── EXECUTE ───────────────────────────────────────────────────────────────────
  {
    num: "EXE", title: "Execute", duration: "Week 4",
    tagline: "Confluence Series is a set of videos where Cue shows you how to combine all technical analysis concepts and adapt them to different market conditions. It also brings together and builds on everything you have learned previously.",
    checkpoint: "You understand how all technical analysis concepts combine into one system. You can identify a confluence setup. You're ready to launch.",
    items: [
      {
        label: "Confluence 30.0",
        note: "Deep-end confluence application. After watching, share what you have learned in the Discord.",
        videos: [{ id: "680498239", label: "Confluence 30.0" }],
      },
      {
        label: "66 and Friends",
        note: "Cue's advanced confluence framework. When you see 66 set up on a chart, you already know what's about to happen. This is the system within the system.",
        videos: [{ id: "901447438", label: "66 and Friends" }],
      },
      {
        label: "Chart N Chill",
        note: "Live chart session alongside the confluence material.",
        videos: [{ id: "993518415", label: "7/28/24" }],
      },
      {
        label: "Confluence Tick By Tick",
        note: "Unfiltered real-time execution. Tick by tick — every candle, every close, every moment the market makes a new move. This is how the professional thinks.",
        videos: [{ id: "1042367807", label: "Tick by Tick" }],
      },
      {
        label: "Chart N Chill",
        note: "Live chart session.",
        videos: [{ id: "1000235936", label: "8/18/24" }],
      },
    ],
  },

  // ── PHASE 1 ───────────────────────────────────────────────────────────────────
  {
    num: "01", title: "Phase 1 — Launch", duration: "Week 5",
    tagline: "The curriculum lands here. Study the material, execute in real time, review what you did wrong, and build the habit of reviewing every session.",
    checkpoint: "You're analyzing charts, applying the full system, and reviewing your sessions. You know what to improve. The fundamentals are becoming second nature.",
    items: [
      {
        label: "Chart N Chill",
        note: "Live chart sessions — study these alongside the phase material.",
        videos: [
          { id: "1012499868", label: "9/15/24" },
          { id: "1019458261", label: "10/13/24" },
          { id: "1024574724", label: "10/28/24" },
        ],
      },
      {
        label: "Top Down Analysis — Cue's Exact Flow",
        note: "H4 for 30% of your time, M5 for 60%, H1 or M30 for the last 10%. Run through these steps every session before you touch a lower timeframe entry.",
        doc: TOP_DOWN_DOC,
        images: ["/images/top-down-pdf-1.png"],
      },
      {
        label: "Yes & No Trade Checklist",
        note: "Run this before every trade. Know when to pull the trigger and when to step away from the charts.",
        checklist: NO_TRADE_CHECKLIST,
        images: [
          "/images/checklist-yes.png",
          "/images/checklist-no.png",
        ],
      },
      {
        label: "Major Market Patterns",
        note: "Study these patterns until you can identify them in real time. These are the recurring setups that show up across all pairs — know what they look like before you see them live.",
        images: ["/images/major-market-patterns.png"],
      },
      {
        label: "Identify Where You Need to Improve",
        note: "Be honest about where your weak points are. This is how you direct your practice time instead of just watching more videos.",
        doc: IMPROVE_DOC,
      },
      {
        label: "Common Technical F**k Ups",
        note: "Treat the charts like a piece of art. Precision, precision, precision. This is Cue's breakdown of the exact mistakes he sees most — the ones that are easily fixed once you see them.",
        videos: [{ id: "1135918376", label: "Common Technical Mistakes" }],
      },
      {
        label: "Chart N Chill",
        note: "Live chart sessions.",
        videos: [
          { id: "1026578614", label: "11/4/24" },
          { id: "1057675113", label: "2/16/25" },
          { id: "1062031860", label: "3/2/25" },
        ],
      },
      {
        label: "Post Course Mindset",
        note: "Patience is the biggest thing. It's a transfer of money from the impatient to the patient. Growing a small account, when to scale lot size, when to withdraw — and when not to.",
        videos: [
          { id: "300094585", label: "Part 1" },
          { id: "300094738", label: "Part 2" },
          { id: "300094622", label: "Part 3" },
          { id: "300094282", label: "Part 4" },
          { id: "300094389", label: "Part 5" },
          { id: "300094193", label: "Part 6" },
        ],
      },
    ],
  },

  // ── PHASE 2 ───────────────────────────────────────────────────────────────────
  {
    num: "02", title: "Phase 2", duration: "Week 6 – 7",
    tagline: "Backtest everything. Confluence RAW shows you unfiltered decision-making in real time. This is where reps turn into edge.",
    checkpoint: "You're backtesting consistently and logging your trades. The edge is getting clearer.",
    items: [
      {
        label: "Confluence RAW",
        note: "Unfiltered, uncut confluence application. Real-time decision-making without the polish — this is how Cue actually trades.",
        videos: [{ id: "1149579397", label: "Confluence RAW" }],
      },
      {
        label: "Cue Cast",
        note: "Live market analysis session.",
        videos: [{ id: "1068805247", label: "3/24/25" }],
      },
      {
        label: "Chart N Chill",
        note: "Live chart sessions.",
        videos: [
          { id: "1073067677", label: "4/6/25" },
          { id: "1075342024", label: "4/13/25" },
          { id: "1077278344", label: "4/20/25" },
        ],
      },
      {
        label: "Backtest Your Pair",
        tag: "Homework",
        note: "Go back no more than 5 months on your chosen pair. Start with HTF top-down analysis, mark S&R, draw Fibonacci, identify exhaustion zones and confluence areas. Then drop to LTFs for entries. Always adapt to current market conditions.",
        doc: BACKTEST_DOC,
      },
      {
        label: "Chart N Chill",
        note: "Live chart session.",
        videos: [{ id: "1079236967", label: "4/27/25" }],
      },
    ],
  },

  // ── PHASE 3 ───────────────────────────────────────────────────────────────────
  {
    num: "03", title: "Phase 3", duration: "Week 7 – 10",
    tagline: "The main goal of this phase is to see where you need the most focus — where you need to improve, what's holding you back, what changed since you started.",
    checkpoint: "You've completed a full honest self-evaluation. You know exactly where you are, what's holding you back, and what needs to change.",
    items: [
      {
        label: "Homework — Trader Self-Reevaluation",
        tag: "Homework",
        note: "Step back and honestly re-evaluate yourself. Understand your current performance, mindset, and progress since starting. Identify what must change going forward.",
        doc: SELF_EVAL_DOC,
      },
      {
        label: "Chart N Chill",
        note: "Live chart sessions.",
        videos: [
          { id: "1081375136", hash: "cca8a4dfdc", label: "5/5/25" },
          { id: "1085559828", label: "5/18/25" },
          { id: "1088773116", label: "5/25/25" },
        ],
      },
      {
        label: "Study, Trade, Review + Journal, Backtest, Repeat",
        note: "Use Cue AI and your 1-on-1 chat for feedback. You need feedback and repetition. There is no shortcut — this is the process.",
      },
    ],
  },

  // ── PHASE 4 ───────────────────────────────────────────────────────────────────
  {
    num: "04", title: "Phase 4", duration: "Week 11 – 14",
    tagline: "Advanced Cue Cast deep dives and Chart N Chill live analysis. This is where professional-level thinking gets locked in.",
    checkpoint: "Deep in the curriculum. Advanced sessions reviewed, live analysis absorbed. Your reading of the market is sharper.",
    items: [
      {
        label: "Cue Cast",
        note: "Live market analysis sessions.",
        videos: [
          { id: "1089713979", hash: "9e305bfb82", label: "6/2/25 B" },
          { id: "1089858154", hash: "b07ae65236", label: "6/2/25" },
          { id: "1093588206", hash: "6400ebc70c", label: "6/15/25" },
        ],
      },
      {
        label: "Chart N Chill",
        note: "Live chart sessions.",
        videos: [
          { id: "1095497142", label: "6/22/25" },
          { id: "1097412063", label: "6/29/25" },
        ],
      },
      {
        label: "Cue Cast",
        note: "Live market analysis session.",
        videos: [{ id: "1097719191", hash: "164ecad44f", label: "6/30/25" }],
      },
      {
        label: "Chart N Chill",
        note: "Live chart sessions.",
        videos: [
          { id: "1099239519", label: "7/6/25" },
          { id: "1101101876", label: "7/13/25" },
          { id: "1106944714", hash: "20f9223044", label: "8/3/25" },
          { id: "1108943478", label: "8/10/25" },
        ],
      },
      {
        label: "Cue Cast",
        note: "Live market analysis sessions.",
        videos: [
          { id: "1110811593", hash: "4f6fcd1aa4", label: "8/17/25" },
          { id: "1112787551", hash: "99d5e68566", label: "8/24/25" },
        ],
      },
    ],
  },

  // ── BONUS ─────────────────────────────────────────────────────────────────────
  {
    num: "★", title: "Bonus", duration: "Week 14 – 21",
    tagline: "Every Chart N Chill and CueCAST session on demand. When you have a question, the answer is probably already recorded here. Most recent first.",
    checkpoint: "Keep watching. Keep reviewing. Keep improving.",
    items: [
      {
        label: `Chart N Chill — ${CNC.length} Sessions`,
        note: "Every Chart N Chill session on demand. Most recent first.",
        videos: CNC,
      },
      {
        label: `CueCAST — ${CUECASTS.length} Sessions`,
        note: "Cue's live market analysis sessions. Real time, real charts, real decisions — this is how the professional thinks through a session.",
        videos: CUECASTS,
      },
    ],
  },
];

