// The actual Wolfpack page composition lives in
// components/wolfpack/WolfpackPage.tsx so it can be reused by
// /wolfpack-global with a regional price override.
import WolfpackPage from "@/components/wolfpack/WolfpackPage";

const JOIN_URL = "https://whop.com/iknkfx/iknkfx/";

export default function Page() {
  return (
    <WolfpackPage
      joinHref={JOIN_URL}
      altHref={JOIN_URL}
      priceLabel="$997"
      smallLabel="ONE PAYMENT"
    />
  );
}
