"use client";

import Link from "next/link";
import { useState, useRef, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Globe from "@/components/ui/globe";
import {
  PHASES as PHASE_DEFS,
  TOTAL_PHASES,
  getPhase,
  isPhaseComplete,
  isPhaseUnlocked,
  type PhaseProgress,
} from "@/lib/phases";

// ─── Types ────────────────────────────────────────────────────────────────────
type Video = { id?: string; hash?: string; label: string; href?: string };
type DocSection = { heading: string; paras?: string[]; bullets?: string[]; footer?: string };
type DocContent = { title: string; sections: DocSection[] };
type ChecklistItem = { text: string };
type ChecklistSection = { heading: string; items: ChecklistItem[] };
type ChecklistDoc = { title: string; theme: "red" | "green"; sections: ChecklistSection[]; rule?: string };
type PhaseItem = { label: string; note: string; tag?: string; videos?: Video[]; doc?: DocContent; checklist?: ChecklistDoc; images?: string[] };
type Phase = { num: string; title: string; duration: string; tagline: string; checkpoint: string; items: PhaseItem[] };

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

// ─── Data ─────────────────────────────────────────────────────────────────────
export const CNC: Video[] = [
  { id: "1201290210", hash: "9363f5a5de", label: "6/14/26" },
  { id: "1197879523", hash: "b311ea99d1", label: "5/31/26" },
  { id: "1193112745", hash: "3863d9f697", label: "5/17/26" },
  { id: "1175798431", hash: "35eaed7df2", label: "3/15/26" },
  { id: "1173868687", hash: "98ec2906f4", label: "3/1/26" },
  { id: "1155829854", hash: "ff02517ce5", label: "1/18/26" },
  { id: "1148543829", label: "12/21/25" },
  { id: "1146446717", hash: "62f2b40525", label: "12/14/25" },
  { id: "1135200815", label: "11/9/25" },
  { id: "1133013682", label: "11/2/25" },
  { id: "1128727713", hash: "fbf97c074f", label: "10/19/25" },
  { id: "1114762699", hash: "a850701f27", label: "8/31/25" },
];

export const CUECASTS: Video[] = [
  { id: "1203318818", hash: "b8aac0cc6e", label: "6/21/26" },
  { id: "1195220470", hash: "274d018a3f", label: "5/24/26" },
  { id: "1191014940", hash: "a1cddec6bf", label: "5/10/26" },
  { id: "1188924684", hash: "139016c27f", label: "5/3/26" },
  { id: "1184668500", hash: "cb68200777", label: "4/19/26" },
  { id: "1177156977", hash: "9e81602352", label: "3/25/26" },
  { id: "1176203834", label: "3/23/26" },
  { id: "1163147705", hash: "765d97af81", label: "2/9/26" },
  { id: "1158257286", hash: "1e3fd6a142", label: "1/25/26" },
  { id: "1153452357", hash: "77525bb14c", label: "1/11/26" },
  { id: "1149962357", hash: "e1e8134fdf", label: "12/28/25" },
  { id: "1147535291", hash: "2d0e20e65f", label: "12/17/25" },
  { id: "1144396697", hash: "ad268fe005", label: "12/7/25" },
  { id: "1137540915", hash: "443c707268", label: "11/16/25" },
  { id: "1130752380", hash: "1dc6370c93", label: "10/26/25" },
  { id: "1126709097", hash: "f28e7bd37f", label: "10/12/25" },
  { id: "1124703573", hash: "9638d6e4c4", label: "10/5/25" },
  { id: "1122730757", hash: "555709566d", label: "9/28/25" },
  { id: "1120700415", label: "9/21/25" },
  { id: "1118628945", hash: "d79595cfac", label: "9/14/25" },
  { id: "1068805247", label: "3/24/25" },
];

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

const PHASES: Phase[] = [
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

// ─── Video Modal ───────────────────────────────────────────────────────────────
type ModalVideo = { id: string; hash?: string; label: string };

// ─── Document Modal ────────────────────────────────────────────────────────────
function DocumentModal({ doc, onClose }: { doc: DocContent; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.94)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 720, maxHeight: "85vh", background: "var(--bg-1)", border: "1px solid var(--line)", borderTop: "2px solid var(--acid)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1px solid var(--line)", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.16em", textTransform: "uppercase" }}>{doc.title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", lineHeight: 1, fontSize: 20, padding: "0 4px" }}>✕</button>
        </div>
        <div style={{ overflowY: "auto", padding: "28px 32px", flex: 1 }}>
          {doc.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>{s.heading}</div>
              {s.paras?.map((p, j) => (
                <p key={j} style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.6)", margin: "0 0 10px" }}>{p}</p>
              ))}
              {s.bullets && (
                <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none" }}>
                  {s.bullets.map((b, j) => (
                    <li key={j} style={{ display: "flex", gap: 10, fontFamily: "var(--font-body)", fontSize: 13.5, lineHeight: 1.7, color: "rgba(255,255,255,0.5)", marginBottom: 7 }}>
                      <span style={{ color: "var(--acid)", flexShrink: 0, marginTop: 1 }}>·</span>{b}
                    </li>
                  ))}
                </ul>
              )}
              {s.footer && <p style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.7, color: "rgba(37,99,235,0.65)", marginTop: 12, fontStyle: "italic", margin: "12px 0 0" }}>{s.footer}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Checklist Modal ───────────────────────────────────────────────────────────
function ChecklistModal({ doc, onClose }: { doc: ChecklistDoc; onClose: () => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const totalItems = doc.sections.reduce((sum, s) => sum + s.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const isRed = doc.theme === "red";
  const accent = isRed ? "#ef4444" : "#22c55e";
  const noTrade = isRed && checkedCount >= 2;

  function toggle(key: string) { setChecked(prev => ({ ...prev, [key]: !prev[key] })); }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.94)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 680, maxHeight: "85vh", background: isRed ? "rgba(10,3,3,0.98)" : "rgba(3,10,6,0.98)", border: `1px solid ${accent}22`, borderTop: `2px solid ${accent}`, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: `1px solid ${accent}1a`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: accent, letterSpacing: "0.16em", textTransform: "uppercase" }}>{doc.title}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: `${accent}66`, letterSpacing: "0.14em" }}>{checkedCount} / {totalItems}</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "0 4px" }}>✕</button>
        </div>
        {noTrade && (
          <div style={{ padding: "10px 24px", background: "#ef44441a", borderBottom: "1px solid #ef444430", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 800, color: "#ef4444", letterSpacing: "0.14em", textTransform: "uppercase" }}>⛔ NO TRADE TODAY</span>
          </div>
        )}
        <div style={{ overflowY: "auto", padding: "20px 24px", flex: 1 }}>
          {doc.sections.map((section, si) => (
            <div key={si} style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: `${accent}aa`, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>{section.heading}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {section.items.map((item, ii) => {
                  const key = `${si}-${ii}`;
                  const on = !!checked[key];
                  return (
                    <label key={key} onClick={() => toggle(key)} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "8px 12px", borderRadius: 5, background: on ? `${accent}10` : "rgba(255,255,255,0.02)", border: `1px solid ${on ? accent + "30" : "rgba(255,255,255,0.06)"}`, transition: "all 0.12s" }}>
                      <div style={{ width: 15, height: 15, borderRadius: 3, border: `1.5px solid ${on ? accent : "rgba(255,255,255,0.18)"}`, background: on ? accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, transition: "all 0.12s" }}>
                        {on && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke={isRed ? "#fff" : "#000"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 13.5, lineHeight: 1.55, color: on ? accent : "rgba(255,255,255,0.55)", transition: "color 0.12s" }}>{item.text}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {doc.rule && (
          <div style={{ padding: "12px 24px", borderTop: `1px solid ${accent}18`, background: noTrade ? "#ef44441a" : "transparent", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: noTrade ? "#ef4444" : `${accent}44`, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              {noTrade ? "⛔ " : "· "}{doc.rule} ·
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ImageGalleryModal({ images, title, onClose }: { images: string[]; title: string; onClose: () => void }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (active) setActive(null); else onClose(); }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose, active]);

  return (
    <div onClick={() => { if (active) setActive(null); else onClose(); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.94)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: active ? 1100 : 860, background: "rgba(8,10,16,0.98)", border: "1px solid rgba(255,255,255,0.08)", borderTop: "2px solid var(--acid)", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {active && (
              <button onClick={() => setActive(null)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, padding: "0 4px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            )}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.16em", textTransform: "uppercase" }}>{active ? "IMAGE" : title}</span>
            {!active && <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em" }}>{images.length} charts</span>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "0 4px" }}>✕</button>
        </div>
        <div style={{ overflowY: "auto", padding: active ? 0 : 20 }}>
          {active ? (
            <img src={active} alt="" style={{ width: "100%", display: "block" }} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {images.map((src, i) => (
                <button key={i} onClick={() => setActive(src)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: 0, cursor: "pointer", overflow: "hidden", transition: "border-color 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.35)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
                  <img src={src} alt={`Chart ${i + 1}`} style={{ width: "100%", display: "block" }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VideoModal({ video, onClose }: { video: ModalVideo; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 1020, background: "var(--bg-1)", border: "1px solid var(--line)", borderTop: "2px solid var(--acid)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid var(--line)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.16em", textTransform: "uppercase" }}>{video.label}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", lineHeight: 1, fontSize: 20, padding: "0 4px" }}>✕</button>
        </div>
        <div style={{ position: "relative", paddingTop: "56.25%" }}>
          <iframe
            src={`https://player.vimeo.com/video/${video.id}?${video.hash ? `h=${video.hash}&` : ''}autoplay=1&color=f9ff3c&title=0&byline=0&portrait=0`}
            allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Calendly Widget ──────────────────────────────────────────────────────────
function CalendlyWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open]);

  return (
    <>
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 740, background: "rgba(8,10,16,0.98)", border: "1px solid rgba(255,255,255,0.1)", borderTop: "2px solid var(--acid)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
              <div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Book Your 1-on-1 Call</span>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "3px 0 0" }}>Your call will be with Felipe, trained directly under Cue for years. He knows this system inside out — come prepared with your questions.</p>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "0 4px", flexShrink: 0, marginLeft: 16 }}>✕</button>
            </div>
            <iframe
              src="https://calendly.com/alex-wsacademyfx?background_color=080a10&text_color=ffffff&primary_color=2563eb"
              style={{ width: "100%", height: 580, border: "none", display: "block" }}
              title="Book your 1-on-1 call"
            />
          </div>
        </div>
      )}

      {/* Floating button — bottom left */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed", bottom: 24, left: 24, zIndex: 999,
          display: "flex", alignItems: "center", gap: 9,
          padding: "0 16px 0 6px", height: 44, borderRadius: 30,
          background: "rgba(10,14,22,0.92)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(37,99,235,0.25)",
          cursor: "pointer",
          boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
          transition: "border-color 0.2s, background 0.2s",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.55)"; (e.currentTarget as HTMLElement).style.background = "rgba(20,24,38,0.96)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.25)"; (e.currentTarget as HTMLElement).style.background = "rgba(10,14,22,0.92)"; }}
      >
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2" width="12" height="11" rx="1.5" stroke="var(--acid)" strokeWidth="1.2"/>
            <path d="M4 1v2M10 1v2M1 5h12" stroke="var(--acid)" strokeWidth="1.2" strokeLinecap="round"/>
            <rect x="3.5" y="7" width="2" height="2" rx="0.4" fill="var(--acid)"/>
            <rect x="6.5" y="7" width="2" height="2" rx="0.4" fill="var(--acid)"/>
          </svg>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Book a Call</span>
      </button>
    </>
  );
}

// ─── Cue AI Chat Widget ────────────────────────────────────────────────────────
type ChatMessage = { role: "user" | "assistant"; content: string };

function CueChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, streaming]);

  async function send(text: string) {
    if (!text.trim() || streaming) return;
    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setStreaming(true);
    const assistantMsg: ChatMessage = { role: "assistant", content: "" };
    setMessages([...next, assistantMsg]);

    try {
      const res = await fetch("/api/cue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error("fetch failed");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        setMessages(prev => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + chunk };
          return copy;
        });
      }
    } catch {
      setMessages(prev => { const c = [...prev]; c[c.length - 1] = { role: "assistant", content: "Something went wrong." }; return c; });
    }
    setStreaming(false);
    inputRef.current?.focus();
  }

  const canSend = input.trim().length > 0 && !streaming;

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 92, right: 24, width: 370, height: 530, zIndex: 999,
          display: "flex", flexDirection: "column",
          background: "rgba(10,14,22,0.92)", backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          boxShadow: "0 0 0 1px rgba(37,99,235,0.08), 0 32px 100px rgba(0,0,0,0.85)",
          overflow: "hidden",
        }}>
          {/* Acid top rule */}
          <div style={{ height: 2, background: "linear-gradient(90deg, var(--acid) 0%, rgba(37,99,235,0.3) 100%)", flexShrink: 0 }} />

          {/* Header */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--acid)", boxShadow: "0 0 16px rgba(37,99,235,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 13, color: "#fff" }}>C</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--bone)", letterSpacing: "0.14em" }}>CUE AI</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <span className="pulse" style={{ width: 4, height: 4, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "#22c55e" }}>Online · Ask me anything</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 2px", transition: "color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--bone)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.length === 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: 8, gap: 8 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "rgba(37,99,235,0.5)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>ASK CUE ANYTHING</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, margin: "0 0 10px" }}>
                  Stuck on the roadmap? Not sure where to start? Ask me. I built this. I can walk you through all of it.
                </p>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.2)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 2 }}>ROADMAP</div>
                {["How do I go through this roadmap?", "Where do I start?", "What's Phase 1 about?", "How long does this take?"].map(q => (
                  <button key={q} onClick={() => send(q)}
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "9px 13px", color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-body)", fontSize: 12, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "background 0.15s, border-color 0.15s, color 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(37,99,235,0.07)"; e.currentTarget.style.borderColor = "rgba(37,99,235,0.25)"; e.currentTarget.style.color = "var(--bone)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}>
                    <span style={{ color: "var(--acid)", fontSize: 9, flexShrink: 0 }}>▸</span>{q}
                  </button>
                ))}
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.2)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 6, marginBottom: 2 }}>TRADING</div>
                {["What is the stack?", "Walk me through top-down analysis", "How do I manage a trade?"].map(q => (
                  <button key={q} onClick={() => send(q)}
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "9px 13px", color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-body)", fontSize: 12, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "background 0.15s, border-color 0.15s, color 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(37,99,235,0.07)"; e.currentTarget.style.borderColor = "rgba(37,99,235,0.25)"; e.currentTarget.style.color = "var(--bone)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}>
                    <span style={{ color: "var(--acid)", fontSize: 9, flexShrink: 0 }}>▸</span>{q}
                  </button>
                ))}
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 1, background: m.role === "assistant" ? "var(--acid)" : "rgba(255,255,255,0.06)", border: m.role === "user" ? "1px solid rgba(255,255,255,0.1)" : "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: m.role === "assistant" ? "0 0 10px rgba(37,99,235,0.2)" : "none" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 800, color: m.role === "assistant" ? "var(--bg)" : "var(--muted)" }}>{m.role === "assistant" ? "C" : "Y"}</span>
                  </div>
                  <div style={{ flex: 1, fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.65, color: m.role === "assistant" ? "var(--bone)" : "var(--ash)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {m.content}
                    {m.role === "assistant" && streaming && i === messages.length - 1 && m.content === "" && (
                      <span style={{ display: "inline-flex", gap: 3, verticalAlign: "middle", marginLeft: 2 }}>
                        {[0, 1, 2].map(d => <span key={d} className="pulse" style={{ width: 4, height: 4, background: "var(--acid)", borderRadius: "50%", display: "inline-block", animationDelay: `${d * 0.18}s` }} />)}
                      </span>
                    )}
                    {m.role === "assistant" && streaming && i === messages.length - 1 && m.content.length > 0 && (
                      <span style={{ display: "inline-block", width: 2, height: "0.9em", background: "var(--acid)", marginLeft: 2, verticalAlign: "text-bottom", animation: "pulse 1s ease-in-out infinite" }} />
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "10px 14px 14px", flexShrink: 0 }}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, overflow: "hidden" }}>
              <form onSubmit={(e: FormEvent) => { e.preventDefault(); send(input); }} style={{ display: "flex", alignItems: "center" }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={streaming}
                  placeholder="Ask Cue..."
                  style={{ flex: 1, background: "transparent", border: "none", padding: "11px 14px", color: "var(--bone)", fontFamily: "var(--font-body)", fontSize: 13, outline: "none" }}
                />
                <button type="submit" disabled={!canSend}
                  style={{ margin: "6px 8px 6px 0", background: canSend ? "var(--acid)" : "rgba(255,255,255,0.05)", border: "none", borderRadius: 8, width: 34, height: 34, cursor: canSend ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M7 1l6 6-6 6" stroke={canSend ? "#fff" : "var(--muted)"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toggle FAB */}
      {!open && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
          {/* Tooltip nudge */}
          <div style={{
            background: "rgba(10,14,22,0.92)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(37,99,235,0.25)", borderRadius: 10,
            padding: "8px 14px", display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            animation: "fabNudge 0.4s ease both",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0, animation: "pulse 1.4s ease-in-out infinite" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,0.75)", whiteSpace: "nowrap" }}>Got a question? Ask Cue</span>
          </div>
          {/* Pill button */}
          <div style={{ position: "relative" }}>
            {/* Pulse ring */}
            <span style={{
              position: "absolute", inset: -6, borderRadius: 40,
              border: "1.5px solid rgba(37,99,235,0.35)",
              animation: "fabRing 2s ease-in-out infinite",
              pointerEvents: "none",
            }} />
            <span style={{
              position: "absolute", inset: -12, borderRadius: 44,
              border: "1px solid rgba(37,99,235,0.15)",
              animation: "fabRing 2s ease-in-out infinite 0.4s",
              pointerEvents: "none",
            }} />
            <button
              onClick={() => setOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "0 18px 0 6px", height: 52, borderRadius: 36,
                background: "var(--acid)",
                border: "none", cursor: "pointer",
                boxShadow: "0 0 0 1px rgba(37,99,235,0.6), 0 8px 40px rgba(37,99,235,0.45)",
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: "-0.02em" }}>C</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 11, color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1 }}>Cue AI</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 10.5, color: "rgba(255,255,255,0.7)", lineHeight: 1 }}>Ask me anything</span>
              </div>
            </button>
          </div>
        </div>
      )}
      {open && (
        <button
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", bottom: 24, right: 24, width: 48, height: 48, borderRadius: "50%",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            cursor: "pointer", zIndex: 999,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
            <path d="M2 2L16 16M16 2L2 16" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </>
  );
}

// ─── Play button ───────────────────────────────────────────────────────────────
const btnStyle = { display: "inline-flex" as const, alignItems: "center" as const, gap: 5, padding: "3px 9px 3px 7px", background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.2)", color: "var(--acid)", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, cursor: "pointer", transition: "background 0.12s, border-color 0.12s", whiteSpace: "nowrap" as const, textDecoration: "none" };
const btnEnter = (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,0.15)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.5)"; };
const btnLeave = (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,0.07)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.2)"; };

function PlayBtn({ video, onPlay }: { video: Video; onPlay: (v: Video) => void }) {
  if (video.href) {
    return (
      <a href={video.href} target="_blank" rel="noopener noreferrer" style={btnStyle} onMouseEnter={btnEnter} onMouseLeave={btnLeave}>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 1h6v6H1zM3 3h2v2H3z" stroke="currentColor" strokeWidth="1"/></svg>
        {video.label}
      </a>
    );
  }
  return (
    <button onClick={() => onPlay(video)} style={btnStyle} onMouseEnter={btnEnter} onMouseLeave={btnLeave}>
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 1L7 4L1.5 7V1Z" fill="currentColor"/></svg>
      {video.label}
    </button>
  );
}

// ─── Module Item ──────────────────────────────────────────────────────────────
function ModuleItem({ item, index, isLast, onPlay, onOpenDoc, onOpenChecklist, onOpenImages }: { item: PhaseItem; index: number; isLast: boolean; onPlay: (v: Video) => void; onOpenDoc: (doc: DocContent) => void; onOpenChecklist: (c: ChecklistDoc) => void; onOpenImages: (images: string[], title: string) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "flex-start", gap: 20,
        padding: "26px 0",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.06)",
        transition: "background 0.15s",
        borderRadius: 6,
        marginLeft: -12, marginRight: -12, paddingLeft: 12, paddingRight: 12,
        background: hovered ? "rgba(255,255,255,0.025)" : "transparent",
        cursor: "default",
      }}
    >
      <div style={{
        flexShrink: 0, width: 30, height: 30, borderRadius: "50%",
        border: hovered ? "1px solid rgba(37,99,235,0.35)" : "1px solid rgba(255,255,255,0.1)",
        background: hovered ? "rgba(37,99,235,0.06)" : "rgba(255,255,255,0.03)",
        display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2,
        transition: "border-color 0.15s, background 0.15s",
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: hovered ? "rgba(37,99,235,0.7)" : "rgba(255,255,255,0.3)" }}>{index + 1}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, color: hovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.9)", letterSpacing: "-0.02em", transition: "color 0.15s" }}>{item.label}</span>
          {item.tag && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "#fff", background: "var(--acid)", padding: "3px 8px", borderRadius: 3 }}>{item.tag}</span>
          )}
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.5)", marginBottom: (item.videos?.length || item.doc || item.checklist || item.images?.length) ? 14 : 0 }}>{item.note}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {item.doc && (
            <button onClick={() => onOpenDoc(item.doc!)}
              style={{ ...btnStyle, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(37,99,235,0.07)"; e.currentTarget.style.borderColor = "rgba(37,99,235,0.3)"; e.currentTarget.style.color = "var(--acid)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 1h4l2 2v5H1V1z" stroke="currentColor" strokeWidth="1"/><path d="M5 1v2h2" stroke="currentColor" strokeWidth="1"/></svg>
              Read
            </button>
          )}
          {item.checklist && (
            <button onClick={() => onOpenChecklist(item.checklist!)}
              style={{ ...btnStyle, background: item.checklist.theme === "red" ? "rgba(239,68,68,0.07)" : "rgba(34,197,94,0.07)", border: `1px solid ${item.checklist.theme === "red" ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"}`, color: item.checklist.theme === "red" ? "#ef4444" : "#22c55e" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = item.checklist!.theme === "red" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = item.checklist!.theme === "red" ? "rgba(239,68,68,0.07)" : "rgba(34,197,94,0.07)"; }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 2h6M1 4h4M1 6h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              Checklist
            </button>
          )}
          {item.images && item.images.length > 0 && (
            <button onClick={() => onOpenImages(item.images!, item.label)}
              style={{ ...btnStyle, background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.15)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.07)"; }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1"/><path d="M1 5.5L3 3.5L4.5 5L5.5 4L7 5.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/></svg>
              Images
            </button>
          )}
          {item.videos?.map(v => <PlayBtn key={v.href ?? v.id} video={v} onPlay={onPlay} />)}
        </div>
      </div>
    </div>
  );
}

// Globe position per section (hero + 8 phases)
const GLOBE_POS = [
  { left: 78, top: 30, scale: 2.8, opacity: 0.32 }, // hero
  { left: 20, top: 55, scale: 2.4, opacity: 0.30 }, // prepare (00)
  { left: 88, top: 52, scale: 2.0, opacity: 0.28 }, // set
  { left: 16, top: 50, scale: 2.2, opacity: 0.26 }, // execute
  { left: 76, top: 22, scale: 1.8, opacity: 0.25 }, // phase 01
  { left: 72, top: 44, scale: 2.6, opacity: 0.30 }, // phase 02
  { left: 15, top: 42, scale: 2.0, opacity: 0.26 }, // phase 03
  { left: 82, top: 28, scale: 3.0, opacity: 0.28 }, // phase 04
  { left: 60, top: 65, scale: 2.2, opacity: 0.26 }, // bonus
];

function fmt(ts: number) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function RoadmapPage() {
  const router = useRouter();
  const [activeVideo, setActiveVideo] = useState<ModalVideo | null>(null);
  const [activeDoc, setActiveDoc] = useState<DocContent | null>(null);
  const [activeChecklist, setActiveChecklist] = useState<ChecklistDoc | null>(null);
  const [activeImages, setActiveImages] = useState<{ images: string[]; title: string } | null>(null);
  const [globeTransform, setGlobeTransform] = useState(
    `translate3d(78vw, 30vh, 0) translate3d(-50%, -50%, 0) scale3d(2.8, 2.8, 1)`
  );
  const [globeOpacity, setGlobeOpacity] = useState(0.32);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLElement>(null);

  // ── Auth + member state ──
  const [member, setMember] = useState<{ email: string; name: string; cohort: string; created_at: number; current_phase: number; phase_progress: PhaseProgress } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [homeworkChecked, setHomeworkChecked] = useState<Record<number, boolean>>({});
  const [completingPhase, setCompletingPhase] = useState<number | null>(null);
  const [completeError, setCompleteError] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) { router.replace('/login'); return null; } return r.json(); })
      .then(data => {
        if (data) {
          setMember(data);
          setNotes(localStorage.getItem(`wsa-notes-${data.email}`) || '');
        }
      })
      .catch(() => router.replace('/login'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function markPhaseComplete(phaseId: number) {
    if (!member || completingPhase) return;
    const def = getPhase(phaseId);
    if (def?.hasHomework && !homeworkChecked[phaseId]) return;
    setCompletingPhase(phaseId);
    setCompleteError(e => ({ ...e, [phaseId]: '' }));
    try {
      const res = await fetch('/api/portal/phase-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phaseId, homeworkConfirmed: def?.hasHomework ? true : undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCompleteError(e => ({ ...e, [phaseId]: data.error || 'Something went wrong' }));
        return;
      }
      setMember(m => m ? { ...m, phase_progress: data.phase_progress ?? m.phase_progress, current_phase: data.current_phase ?? m.current_phase } : m);
    } finally {
      setCompletingPhase(null);
    }
  }

  function saveNotes() {
    if (!member) return;
    localStorage.setItem(`wsa-notes-${member.email}`, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  }

  const totalVideos = PHASES.reduce((acc, p) => acc + p.items.reduce((a, i) => a + (i.videos?.length ?? 0), 0), 0);

  // Parallax globe — snap to nearest section
  useEffect(() => {
    function handleScroll() {
      const refs: (Element | null)[] = [
        heroRef.current,
        ...Array.from({ length: PHASES.length }, (_, i) => phaseRefs.current[i] ?? null),
      ];
      const midpoint = window.innerHeight / 2;
      let closest = 0;
      let minDist = Infinity;
      refs.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - midpoint);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      const p = GLOBE_POS[closest] ?? GLOBE_POS[0];
      setGlobeTransform(
        `translate3d(${p.left}vw, ${p.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${p.scale}, ${p.scale}, 1)`
      );
      setGlobeOpacity(p.opacity);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function jumpTo(i: number) {
    phaseRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "var(--bone)", position: "relative" }}>

      {/* ── Space atmosphere ─────────────────────────────────────────────────── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 100% 70% at 65% 28%, rgba(6,10,20,1) 0%, rgba(0,0,0,1) 65%)" }} />

      {/* ── Parallax Globe ───────────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: 0, left: 0,
        zIndex: 0, pointerEvents: "none",
        opacity: globeOpacity,
        willChange: "transform, opacity",
        transform: globeTransform,
        transition: "transform 1400ms cubic-bezier(0.23, 1, 0.32, 1), opacity 700ms ease",
      }}>
        <Globe size={250} />
      </div>

      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
      {activeDoc && <DocumentModal doc={activeDoc} onClose={() => setActiveDoc(null)} />}
      {activeChecklist && <ChecklistModal doc={activeChecklist} onClose={() => setActiveChecklist(null)} />}
      {activeImages && <ImageGalleryModal images={activeImages.images} title={activeImages.title} onClose={() => setActiveImages(null)} />}
      <CalendlyWidget />
      <CueChat />

      {/* HEADER */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "18px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(20px)", zIndex: 100 }}>
        <Link href="/portal" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wsa/home/1.png" alt="Wall Street Academy" style={{ height: 44, width: 44, borderRadius: "50%", objectFit: "cover" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--bone)", letterSpacing: "0.18em", textTransform: "uppercase" }}>Wall Street Academy</span>
        </Link>
        {/* Phase jump nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {PHASES.map((p, i) => (
            <button key={i} onClick={() => jumpTo(i)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", padding: "4px 8px", cursor: "pointer", transition: "color 0.15s, border-color 0.15s", borderRadius: 3 }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--acid)"; e.currentTarget.style.borderColor = "rgba(37,99,235,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
              {p.num}
            </button>
          ))}
        </div>
        {/* Profile avatar → opens progress drawer */}
        <button
          onClick={() => setDrawerOpen(true)}
          title={member?.name || 'My Progress'}
          style={{
            width: 38, height: 38, borderRadius: "50%",
            background: member ? "rgba(37,99,235,0.12)" : "rgba(255,255,255,0.06)",
            border: `1.5px solid ${member ? "rgba(37,99,235,0.4)" : "rgba(255,255,255,0.14)"}`,
            color: member ? "var(--acid)" : "var(--muted)",
            fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s", flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(37,99,235,0.2)"; e.currentTarget.style.borderColor = "rgba(37,99,235,0.7)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = member ? "rgba(37,99,235,0.12)" : "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = member ? "rgba(37,99,235,0.4)" : "rgba(255,255,255,0.14)"; }}
        >
          {member ? member.name.charAt(0).toUpperCase() : "?"}
        </button>
      </header>

      {/* ── Progress Drawer ───────────────────────────────────────────────────── */}
      {/* Backdrop */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200, backdropFilter: "blur(2px)" }}
        />
      )}
      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 340,
        background: "#0a0c10", borderLeft: "1px solid rgba(255,255,255,0.08)",
        zIndex: 201, display: "flex", flexDirection: "column",
        transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.32, 0, 0.2, 1)",
        overflowY: "auto",
      }}>
        {/* Drawer header */}
        <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 4 }}>My Progress</div>
            {member && (
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                {member.cohort ? `Cohort ${member.cohort}` : 'WSA Member'} · Joined {fmt(member.created_at)}
              </div>
            )}
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "0 2px", transition: "color 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--bone)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; }}>✕</button>
        </div>

        {/* Progress bar */}
        <div style={{ padding: "20px 20px 8px", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase" }}>16-Week Curriculum</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
              {(member?.current_phase ?? 0) <= 1 && !isPhaseComplete(member?.phase_progress, 1) ? 'Not started' : isPhaseComplete(member?.phase_progress, TOTAL_PHASES) ? 'Complete' : `Phase ${member?.current_phase} of ${TOTAL_PHASES}`}
            </span>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(((member?.current_phase ?? 1) - 1) / TOTAL_PHASES) * 100}%`, background: "var(--acid)", borderRadius: 2, transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Phase list */}
        <div style={{ padding: "8px 20px 4px", display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
          {PHASE_DEFS.map((ph) => {
            const isDone = isPhaseComplete(member?.phase_progress, ph.id);
            const isActive = !isDone && isPhaseUnlocked(member?.phase_progress, ph.id);
            return (
              <div
                key={ph.id}
                onClick={() => jumpTo(ph.id - 1)}
                style={{
                  background: isActive ? "rgba(37,99,235,0.06)" : isDone ? "rgba(34,197,94,0.04)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isActive ? "rgba(37,99,235,0.25)" : isDone ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)"}`,
                  borderRadius: 7, padding: "11px 14px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  cursor: "pointer", transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = isDone ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: isActive ? "var(--acid)" : isDone ? "#22c55e" : "rgba(255,255,255,0.2)", letterSpacing: "0.1em", flexShrink: 0, width: 18 }}>
                    {isDone ? "✓" : isActive ? ph.num : "🔒"}
                  </span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500, color: isActive ? "#fff" : isDone ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.45)" }}>{ph.title}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {isActive && <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--acid)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Current</span>}
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em", flexShrink: 0 }}>{ph.duration}</span>
                </div>
              </div>
            );
          })}
          <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(255,255,255,0.2)", margin: "6px 0 0", textAlign: "center" }}>
            Tap a phase to jump to it
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "16px 20px", flexShrink: 0 }} />

        {/* Notes */}
        <div style={{ padding: "0 20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Notes & Feedback</div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Questions, feedback, what you're working on..."
            style={{
              flex: 1, minHeight: 140, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, padding: "12px 14px", color: "var(--bone)", fontFamily: "var(--font-body)",
              fontSize: 13, lineHeight: 1.65, resize: "none", outline: "none", transition: "border-color 0.15s",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "rgba(37,99,235,0.25)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />
          <button
            onClick={saveNotes}
            style={{
              background: notesSaved ? "rgba(34,197,94,0.12)" : "rgba(37,99,235,0.08)",
              border: `1px solid ${notesSaved ? "rgba(34,197,94,0.3)" : "rgba(37,99,235,0.2)"}`,
              borderRadius: 7, padding: "10px 16px",
              fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
              color: notesSaved ? "#22c55e" : "var(--acid)", cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {notesSaved ? "✓ Saved" : "Save Notes"}
          </button>
        </div>
      </div>

      {/* HERO */}
      <section ref={heroRef} style={{ maxWidth: 860, margin: "0 auto", padding: "96px 48px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ position: "relative" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(48px, 7.5vw, 88px)", lineHeight: 0.92, letterSpacing: "-0.045em", color: "var(--bone)", margin: "0 0 24px" }}>
            The Inner Circle<br />
            <em style={{ color: "var(--acid)", fontStyle: "normal" }}>Roadmap.</em>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 18, lineHeight: 1.65, color: "rgba(255,255,255,0.45)", margin: "0 auto 36px", maxWidth: 500, letterSpacing: "0.01em" }}>
            Every module. Every drill. Every live session — in the exact order that builds a profitable trader.
          </p>
          {/* Stats row */}
          <div style={{ display: "inline-flex", gap: 0, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: 80, borderRadius: 12 }}>
            {[
              { n: "8", label: "Phases" },
              { n: "16", label: "Weeks" },
              { n: String(totalVideos) + "+", label: "Videos" },
              { n: `${CNC.length + CUECASTS.length}`, label: "Live Sessions" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "18px 28px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none", textAlign: "center", background: "rgba(255,255,255,0.03)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, letterSpacing: "-0.04em", color: "var(--acid)", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHASES */}
      <section style={{ maxWidth: 920, margin: "0 auto", padding: "0 48px 100px", position: "relative", zIndex: 1 }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 28, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, rgba(37,99,235,0.5) 0%, rgba(37,99,235,0.04) 100%)", pointerEvents: "none" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {PHASES.map((phase, i) => {
              const videoCount = phase.items.reduce((a, item) => a + (item.videos?.length ?? 0), 0);
              const phaseId = i + 1;
              const def = getPhase(phaseId);
              const unlocked = isPhaseUnlocked(member?.phase_progress, phaseId);
              const complete = isPhaseComplete(member?.phase_progress, phaseId);
              const completion = member?.phase_progress?.[String(phaseId)];
              const prevTitle = i > 0 ? PHASES[i - 1].title : null;
              return (
                <div key={i} ref={el => { phaseRefs.current[i] = el; }} style={{ display: "flex", gap: 32, position: "relative", scrollMarginTop: 80 }}>
                  {/* Dot */}
                  <div style={{ flexShrink: 0, width: 56, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 32, position: "relative", zIndex: 1 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#000", border: `1.5px solid ${complete ? "rgba(34,197,94,0.6)" : "rgba(37,99,235,0.6)"}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(37,99,235,0.12), 0 0 60px rgba(37,99,235,0.05)" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: complete ? "#22c55e" : "var(--acid)", letterSpacing: "0.04em" }}>{complete ? "✓" : unlocked ? phase.num : "🔒"}</span>
                    </div>
                  </div>

                  {/* Card */}
                  <div style={{ flex: 1, background: "rgba(12,16,24,0.7)", border: "1px solid rgba(255,255,255,0.07)", borderTop: `1px solid ${complete ? "rgba(34,197,94,0.3)" : "rgba(37,99,235,0.3)"}`, overflow: "hidden", backdropFilter: "blur(8px)", boxShadow: "0 0 0 0 transparent, 0 8px 40px rgba(0,0,0,0.5)", opacity: unlocked ? 1 : 0.55 }}>
                    {/* Card header */}
                    <div style={{ padding: "36px 40px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em", textTransform: "uppercase", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "5px 12px" }}>{phase.duration}</div>
                        {videoCount > 0 && (
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.14em", textTransform: "uppercase", background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 4, padding: "5px 12px" }}>
                            ▶ {videoCount} videos
                          </div>
                        )}
                      </div>
                      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px, 3vw, 34px)", letterSpacing: "-0.03em", color: "var(--bone)", margin: "0 0 14px" }}>{phase.title}</h2>
                      <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 16, lineHeight: 1.75, color: "rgba(255,255,255,0.48)", margin: 0, maxWidth: 620 }}>{phase.tagline}</p>
                    </div>

                    {/* Items */}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "8px 40px" }}>
                      {phase.items.map((item, j) => (
                        <ModuleItem key={j} item={item} index={j} isLast={j === phase.items.length - 1} onPlay={v => { if (v.id) setActiveVideo({ id: v.id, hash: v.hash, label: v.label }); }} onOpenDoc={setActiveDoc} onOpenChecklist={setActiveChecklist} onOpenImages={(imgs, title) => setActiveImages({ images: imgs, title })} />
                      ))}
                    </div>

                    {/* Checkpoint */}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(37,99,235,0.03)", padding: "20px 40px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "rgba(37,99,235,0.45)", letterSpacing: "0.22em", textTransform: "uppercase", flexShrink: 0, paddingTop: 3, whiteSpace: "nowrap" }}>· After ·</div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 14, lineHeight: 1.7, color: "rgba(37,99,235,0.65)" }}>{phase.checkpoint}</div>
                    </div>

                    {/* Mark as Complete */}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "20px 40px" }}>
                      {!unlocked ? (
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>
                          🔒 Locked — complete {prevTitle} first
                        </div>
                      ) : complete ? (
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "#22c55e", letterSpacing: "0.04em" }}>
                          ✓ Completed {completion ? fmt(new Date(completion.completedAt).getTime()) : ""}
                          {completion?.completedBy === "admin" && <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 500 }}> · Marked by coach</span>}
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {def?.hasHomework && (
                            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                              <input
                                type="checkbox"
                                checked={!!homeworkChecked[phaseId]}
                                onChange={e => setHomeworkChecked(h => ({ ...h, [phaseId]: e.target.checked }))}
                                style={{ marginTop: 3, accentColor: "#2563eb" }}
                              />
                              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                                I&apos;ve submitted my homework for this phase in my private Discord channel.
                              </span>
                            </label>
                          )}
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <button
                              onClick={() => markPhaseComplete(phaseId)}
                              disabled={completingPhase === phaseId || (def?.hasHomework && !homeworkChecked[phaseId])}
                              style={{
                                alignSelf: "flex-start",
                                background: "rgba(37,99,235,0.12)",
                                border: "1px solid rgba(37,99,235,0.4)",
                                borderRadius: 7, padding: "10px 20px",
                                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                                color: "var(--acid)",
                                cursor: def?.hasHomework && !homeworkChecked[phaseId] ? "not-allowed" : "pointer",
                                opacity: def?.hasHomework && !homeworkChecked[phaseId] ? 0.4 : 1,
                                transition: "opacity 0.15s",
                              }}
                            >
                              {completingPhase === phaseId ? "Marking..." : `Mark ${phase.title} Complete`}
                            </button>
                            {completeError[phaseId] && (
                              <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#ef4444" }}>{completeError[phaseId]}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INCLUDED */}
      <section style={{ maxWidth: 920, margin: "0 auto", padding: "0 48px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 48 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.2)", letterSpacing: "0.26em", textTransform: "uppercase", textAlign: "center", marginBottom: 28 }}>· What&apos;s included ·</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
            {[
              { label: `${totalVideos}+ Videos`, desc: "Every module, webinar, and live session — all on demand." },
              { label: `${CNC.length} Chart N Chill`, desc: "Every Chart N Chill on record. The answer is probably already in here." },
              { label: `${CUECASTS.length} CueCAST Sessions`, desc: "Cue's live market analysis — real time, real charts." },
              { label: "16 Weekly Webinars", desc: "1 live webinar per week with Cue across 16 weeks. Bring your charts." },
              { label: "Structured Drills", desc: "Practice between phases is required. This is a training program, not a library." },
              { label: "Cue AI — On Demand", desc: "Ask Cue anything, anytime. Trained on WSA content, answers in his voice." },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: "20px 22px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 14, color: "rgba(255,255,255,0.85)", marginBottom: 6, letterSpacing: "-0.01em" }}>{s.label}</div>
                <div style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 12.5, lineHeight: 1.55, color: "rgba(255,255,255,0.32)" }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.18)", letterSpacing: "0.22em", textTransform: "uppercase", position: "relative", zIndex: 1 }}>
        <span>© 2026 · iknkfx inc · All Rights Reserved</span>
        <span>· Not financial advice · Trading involves real risk of loss ·</span>
      </footer>
    </div>
  );
}
