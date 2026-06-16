module.exports = [
"[externals]/next/dist/build/adapter/setup-node-env.external.js [external] (next/dist/build/adapter/setup-node-env.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/build/adapter/setup-node-env.external.js", () => require("next/dist/build/adapter/setup-node-env.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/memory-cache.external.js [external] (next/dist/server/lib/incremental-cache/memory-cache.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/memory-cache.external.js", () => require("next/dist/server/lib/incremental-cache/memory-cache.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/shared-cache-controls.external.js [external] (next/dist/server/lib/incremental-cache/shared-cache-controls.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/shared-cache-controls.external.js", () => require("next/dist/server/lib/incremental-cache/shared-cache-controls.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/geo.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Regional (PPP) pricing for the funnel.
//
// Geo informs PRICE, not access: visitors from low purchasing-power
// countries who pick the budget tier get flagged for the regional Wolfpack
// offer (`offer=intl`); anyone who picks a $2,500+ tier routes to the
// booking calendar no matter where they are — the setter call filters real
// budgets from fantasy clicks. Rationale (June 2026 data): 73% of low-PPP
// submissions pick the budget tier, and 0 of the last 5 booked calls came
// from these geos — but Indonesia alone produced four $5K+ tier clicks in
// a month, and those are worth a setter's 30 minutes to verify.
//
// Country comes from Vercel's `x-vercel-ip-country` edge header, which is
// set by Vercel and can't be spoofed by the client in production. Locally
// the header is absent, so geo logic is a no-op in dev unless you send the
// header yourself.
//
// Edit freely — two-letter ISO 3166-1 alpha-2 codes, uppercase.
__turbopack_context__.s([
    "LOW_PPP_COUNTRIES",
    ()=>LOW_PPP_COUNTRIES,
    "isLowPPP",
    ()=>isLowPPP
]);
const LOW_PPP_COUNTRIES = new Set([
    // South / Southeast Asia
    "ID",
    "PK",
    "IN",
    "BD",
    "LK",
    "NP",
    "MM",
    "KH",
    "LA",
    "VN",
    "PH",
    // Africa
    "NG",
    "EG",
    "KE",
    "GH",
    "ET",
    "TZ",
    "UG",
    "ZM",
    "ZW",
    "SN",
    "CM",
    "CI",
    "MA",
    "TN",
    "DZ",
    // Central Asia / Caucasus
    "UZ",
    "TJ",
    "TM",
    "KG",
    "GE",
    "AM",
    "AZ",
    // Eastern Europe / Balkans (low-PPP tier only)
    "MD",
    "AL",
    "MK",
    "BA",
    "XK",
    "UA",
    // Latin America (low-PPP tier only)
    "BO",
    "NI",
    "HN",
    "GT",
    "SV",
    "PY",
    "VE",
    // Middle East (conflict / low-PPP tier)
    "IQ",
    "SY",
    "YE",
    "AF"
]);
function isLowPPP(country) {
    return !!country && LOW_PPP_COUNTRIES.has(country.trim().toUpperCase());
}
}),
"[project]/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "proxy",
    ()=>proxy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$geo$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/geo.ts [middleware] (ecmascript)");
;
;
function proxy(request) {
    const host = request.headers.get("host") || "";
    const path = request.nextUrl.pathname;
    // /wolfpack-global is the PPP-priced regional edition ($297). Fence it:
    //  - price integrity: countries outside the low-PPP list → /wolfpack
    //  - dormant until the $297 checkout env (NEXT_PUBLIC_WHOP_GLOBAL_URL)
    //    is set, so nobody sees a $297 page with a $997 checkout
    //  - ?preview=1 bypasses both checks for internal QA
    if (path === "/wolfpack-global" && request.nextUrl.searchParams.get("preview") !== "1") {
        const country = request.headers.get("x-vercel-ip-country");
        const checkoutLive = !!(process.env.NEXT_PUBLIC_WHOP_GLOBAL_URL || "").trim();
        if (country && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$geo$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["isLowPPP"])(country)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/wolfpack", request.url));
        }
        if (!checkoutLive) {
            // Keep the cohort tag so analytics still splits these visitors.
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/wolfpack?offer=intl", request.url));
        }
    }
    if (host === "free.quantumcipherlab.com" && !path.startsWith("/api/") && !path.startsWith("/_next/") && !path.startsWith("/uploads/")) {
        // Rewrite all free.quantumcipherlab.com/* → /free-course/*
        // e.g. /         → /free-course
        //      /confirm  → /free-course/confirm
        const rewritePath = path === "/" ? "/free-course" : `/free-course${path}`;
        const rewriteUrl = new URL(rewritePath, request.url);
        // new URL(path, base) drops the original query — re-attach it so UTM
        // params (and anything else) survive the rewrite server-side.
        rewriteUrl.search = request.nextUrl.search;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].rewrite(rewriteUrl);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)"
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0n18~h~._.js.map