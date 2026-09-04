import Link from "next/link";
import type { ReactNode } from "react";

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund", label: "Refund" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/contact", label: "Contact" },
];

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 no-underline flex-shrink-0 whitespace-nowrap"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/wsa/home/1.png"
        alt="Wall Street Academy"
        className="h-11 w-11 rounded-full object-cover block"
      />
      <span className="font-mono text-[13px] font-bold text-bone tracking-[0.18em] uppercase">
        Wall Street Academy
      </span>
    </Link>
  );
}

export default function LegalShell({
  title,
  kicker,
  effectiveDate,
  children,
}: {
  title: string;
  kicker: string;
  effectiveDate: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg text-bone">
      {/* HEADER */}
      <header className="border-b border-line py-5 px-12 flex justify-between items-center">
        <Logo />
        <nav className="flex gap-6 items-center">
          {LEGAL_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-[10px] font-bold text-ash tracking-[0.22em] uppercase no-underline"
            >
              · {l.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* TITLE BLOCK */}
      <div className="max-w-[880px] mx-auto pt-24 pb-12 px-12">
        <div className="font-mono text-[11px] font-bold text-acid tracking-[0.22em] uppercase mb-4.5">
          · {kicker} ·
        </div>
        <h1 className="font-display font-semibold text-[72px] leading-[0.96] tracking-[-0.045em] text-bone mb-8 m-0">
          {title}
        </h1>
        <div className="font-mono text-[11px] font-bold text-ash tracking-[0.22em] uppercase border-y border-line py-4">
          · Effective {effectiveDate} · Wall Street Academy ·
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-[880px] mx-auto pb-30 px-12 font-body text-[16px] leading-[1.7] text-ash font-normal">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-line py-8 px-12 flex justify-between items-center flex-wrap gap-4 font-mono text-[10px] font-bold text-muted tracking-[0.22em] uppercase">
        <span>© 2026 · Wall Street Academy · All Rights Reserved</span>
        <span>· Not financial advice · Trading involves real risk of loss ·</span>
      </footer>
    </div>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display font-semibold text-[32px] leading-[1.05] tracking-[-0.025em] text-bone my-14 mb-4.5">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-display font-semibold text-[20px] leading-[1.2] tracking-[-0.015em] text-bone mt-8 mb-3">
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mb-4.5 m-0">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="m-0 mb-4.5 pl-5.5">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return <li className="mb-2">{children}</li>;
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-bg-1 border border-acid border-l-2 p-5 px-6 my-6 font-body text-[15px] leading-[1.6] text-bone font-medium">
      {children}
    </div>
  );
}
