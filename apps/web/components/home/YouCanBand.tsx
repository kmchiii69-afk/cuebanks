import Reveal from "./Reveal";
import { HomeEyebrow, HomeWrap } from "./HomeSection";
import { funnelBtn } from "./funnel";

export default function YouCanBand() {
  return (
    <section
      id="youcan"
      className="border-y border-line-2 bg-[radial-gradient(620px_320px_at_50%_0%,rgba(24,139,246,0.18),transparent_62%),linear-gradient(180deg,#070a10,#000)] py-[70px] text-center"
    >
      <HomeWrap>
        <Reveal>
          <HomeEyebrow>Your Turn</HomeEyebrow>
          <h2 className="mx-auto mb-[18px] max-w-[20ch] font-h2 text-[clamp(1.7rem,4vw,2.8rem)] font-extrabold tracking-[-0.01em] text-bone">
            If they can do it, <span className="text-acid">so can you.</span>
          </h2>
          <p className="mx-auto mb-[30px] max-w-[54ch] font-h1 text-[1.1rem] leading-[1.6] text-[#cbd5e0]">
            These aren&apos;t finance geniuses or hedge-fund insiders — they&apos;re everyday traders
            who followed a structured, rule-based system and got consistent.{" "}
            <span className="font-accent italic text-acid">You have the same shot.</span> Same
            market, same rules, same results within reach.
          </p>
          <a href="#apply" className={funnelBtn}>
            Apply For Your Seat <span aria-hidden>→</span>
          </a>
        </Reveal>
      </HomeWrap>
    </section>
  );
}
