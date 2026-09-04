import Reveal from "./Reveal";
import { TypeformPlaceholder } from "./ContentPlaceholder";
import { HomeSecHead, HomeWrap } from "./HomeSection";

export default function TypeformEmbed() {
  return (
    <section id="apply-form" className="py-[74px]">
      <HomeWrap>
        <Reveal>
          <HomeSecHead
            center
            eyebrow="Apply Now"
            title="Go through this and find out if you're a fit."
            sub="Form embed reserved below — swap in your WSA Typeform when ready."
          />
        </Reveal>
        <div className="mx-auto max-w-[920px]">
          <TypeformPlaceholder />
        </div>
      </HomeWrap>
    </section>
  );
}
