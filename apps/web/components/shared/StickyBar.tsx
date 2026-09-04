"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import Wrap from "./Wrap";

export default function StickyBar({
  label = "· Application Open",
  cta = "Apply Now →",
  ctaHref = "#apply",
}: {
  label?: string;
  cta?: string;
  ctaHref?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 700);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-280 ease-[cubic-bezier(0.22,1,0.36,1)] bg-[rgba(6,7,10,0.94)] backdrop-blur-[12px] border-b border-acid ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <Wrap>
        <div className="flex items-center justify-between py-3.5">
          <Logo />
          <div className="font-mono text-[10px] tracking-[0.18em] text-ash uppercase">
            {label}
          </div>
          <a href={ctaHref} className="btn text-[11px] py-2.5 px-4.5">
            {cta}
          </a>
        </div>
      </Wrap>
    </div>
  );
}
