import Reveal from "./Reveal";
import { HomeEyebrow, HomeWrap } from "./HomeSection";

export default function YouCanBand() {
  return (
    <section
      id="youcan"
      className="border-y border-[var(--line)] bg-[radial-gradient(620px_320px_at_50%_0%,rgba(var(--acid-rgb),0.14),transparent_62%),var(--bg)] py-[70px] text-center"
    >
      <HomeWrap>
        <Reveal>
          <HomeEyebrow>Your Turn</HomeEyebrow>
          <h2 className="mx-auto mb-[18px] max-w-[20ch] text-[clamp(1.7rem,4vw,2.8rem)] font-bold tracking-[-0.03em] text-[var(--bone)]">
            If they can do it, <span className="text-[var(--acid)]">so can you.</span>
          </h2>
          <p className="mx-auto mb-[30px] max-w-[54ch] text-[1.1rem] leading-relaxed text-[var(--ash)]">
            These aren&apos;t finance geniuses or hedge-fund insiders — they&apos;re everyday traders
            who followed a structured, rule-based system and got consistent.{" "}
            <span className="font-semibold text-[var(--acid)]">You have the same shot.</span> Same
            market, same rules, same results within reach.
          </p>
          <a href="#apply-form" className="btn">
            Apply For Your Seat <span aria-hidden>→</span>
          </a>
        </Reveal>
      </HomeWrap>
    </section>
  );
}
