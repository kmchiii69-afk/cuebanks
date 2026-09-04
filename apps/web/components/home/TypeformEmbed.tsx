import Reveal from "./Reveal";
import { HomeSecHead, HomeWrap } from "./HomeSection";
import { TYPEFORM_ID } from "./funnel";

export default function TypeformEmbed() {
  return (
    <section id="apply-form" className="py-[74px]">
      <HomeWrap>
        <Reveal>
          <HomeSecHead
            center
            eyebrow="Apply Now"
            title="Go through this and find out if you're a fit."
          />
        </Reveal>
        <div className="mx-auto max-w-[860px] overflow-hidden rounded-[14px] border border-line-2 border-t-2 border-t-wsa-blue bg-bg-2">
          <div data-tf-live={TYPEFORM_ID} className="min-h-[560px]" />
        </div>
      </HomeWrap>
    </section>
  );
}
