import Reveal from "./Reveal";
import { HeroVideoPlaceholder } from "./ContentPlaceholder";
import { HomeWrap } from "./HomeSection";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--line)] bg-[radial-gradient(900px_500px_at_80%_-10%,rgba(var(--acid-rgb),0.16),transparent_60%),radial-gradient(700px_480px_at_0%_10%,rgba(var(--acid-rgb),0.06),transparent_55%),var(--bg)] py-16 sm:py-20">
      <HomeWrap>
        <div className="mx-auto max-w-[920px] text-center">
          <Reveal>
            <div className="mx-auto max-w-[820px]">
              <div className="mb-3.5 font-[family-name:var(--font-mono)] text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-[var(--acid)]">
                Welcome to WSA
              </div>
              <h1 className="mb-4 text-[clamp(2.1rem,5.4vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-[var(--bone)]">
                Systems That Take <span className="text-[var(--acid)]">Forex Traders</span> to
                Profitability.
              </h1>
              <p className="mx-auto mb-6 max-w-[52ch] text-[clamp(1rem,2.2vw,1.3rem)] font-semibold text-[var(--ash)]">
                Let&apos;s change the game for Forex.
              </p>
              <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
                <a href="#how" className="btn btn-ghost">
                  See How It Works
                </a>
                <a href="#apply-form" className="btn">
                  Apply For Your Seat
                </a>
              </div>
              <p className="font-[family-name:var(--font-mono)] text-[0.82rem] tracking-[0.04em] text-[var(--muted)]">
                10,000+ traders helped · Profits posted publicly since{" "}
                <b className="text-[var(--acid)]">2019</b>
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-10" delayMs={80}>
            <HeroVideoPlaceholder />
          </Reveal>
        </div>
      </HomeWrap>
    </section>
  );
}
