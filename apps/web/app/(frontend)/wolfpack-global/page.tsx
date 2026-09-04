// REGIONAL EDITION — duplicate of /wolfpack with PPP pricing ($297 instead
// of $997) for low-PPP geos. The page composition, data, and section
// components live in components/wolfpack/. proxy.ts fences the route:
// non-listed countries bounce to /wolfpack, this stays dormant until the
// checkout link is provisioned via NEXT_PUBLIC_WHOP_GLOBAL_URL.
//
// When you edit the main Wolfpack page, mirror the change here by editing
// the variant below — that's the only file that differs.
import WolfpackPage from "@/components/wolfpack/WolfpackPage";

const JOIN_URL = (process.env.NEXT_PUBLIC_WHOP_GLOBAL_URL || "https://whop.com/iknkfx/iknkfx/").trim();

export default function Page() {
  return (
    <WolfpackPage
      joinHref={JOIN_URL}
      altHref={JOIN_URL}
      priceLabel="$297"
      smallLabel="ONE PAYMENT"
    />
  );
}
