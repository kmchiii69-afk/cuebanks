import Image from "next/image";
import Reveal from "./Reveal";
import { HomeWrap, TypeformApplyLink } from "./HomeSection";
import { VIMEO_VSL_ID, funnelBtnGhost, funnelBtnNav } from "./funnel";

export default function HomeHero() {
  return (
    <>
      <header className="sticky top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center gap-3.5 border-b border-line-2 bg-black/86 px-[22px] py-3.5 backdrop-blur-[8px] max-[640px]:flex max-[640px]:justify-between max-[640px]:gap-2.5 max-[640px]:px-4 max-[640px]:py-2.5">
        <span className="justify-self-start max-[640px]:hidden" aria-hidden />
        <a href="#" className="flex items-center justify-center no-underline" aria-label="Wall Street Academy">
          <Image
            src="/wsa/home/1.png"
            alt="Wall Street Academy logo"
            width={96}
            height={96}
            className="size-24 rounded-full object-cover max-[640px]:size-[60px]"
            priority
          />
        </a>
        <div className="justify-self-end max-[640px]:ml-auto">
          <TypeformApplyLink className={funnelBtnNav}>Apply For Your Seat</TypeformApplyLink>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-line-2 bg-[radial-gradient(900px_500px_at_80%_-10%,rgba(24,139,246,0.16),transparent_60%),radial-gradient(700px_480px_at_0%_10%,rgba(37,99,235,0.06),transparent_55%),#000] py-16 max-[640px]:pb-14">
        <HomeWrap>
          <div className="mx-auto max-w-[760px] text-center">
            <Reveal startVisible>
              <div className="mb-3.5 font-h2 text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-acid">
                The WSA Inner Circle
              </div>
              <h1 className="mx-auto mb-[18px] max-w-[18ch] font-h1 text-[clamp(2.1rem,5.4vw,4rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-bone">
                Systems That Take <span className="text-acid">Forex Traders</span> to Profitability.
              </h1>
              <p className="mx-auto max-w-[52ch] font-h2 text-[clamp(1rem,2.2vw,1.3rem)] font-semibold text-[#cbd5e0]">
                Let&apos;s change the game for Forex.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
                <a href="#how" className={funnelBtnGhost}>
                  See How It Works
                </a>
              </div>
              <p className="mt-4 font-h2 text-[0.82rem] tracking-[0.04em] text-muted">
                10,000+ traders helped · Profits posted publicly since{" "}
                <b className="font-extrabold text-wsa-green">2019</b>
              </p>
            </Reveal>
          </div>

          <Reveal className="mx-auto mt-12 max-w-[880px] max-[640px]:mt-[34px]" delayMs={80} startVisible>
            <div className="relative aspect-video overflow-hidden rounded-[14px] border border-line-2 bg-[#0a0a0a] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
              <iframe
                src={`https://player.vimeo.com/video/${VIMEO_VSL_ID}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1`}
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full border-0"
                title="Cue VSL July 2026_2"
              />
            </div>
          </Reveal>
        </HomeWrap>
      </section>
    </>
  );
}
