export default function Logo() {
  return (
    <div className="flex items-center gap-3 flex-shrink-0 whitespace-nowrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/wsa/home/1.png"
        alt="Wall Street Academy"
        className="h-12 w-12 rounded-full object-cover block flex-shrink-0"
      />
      <span className="font-display font-extrabold text-[15px] tracking-[0.04em] text-bone whitespace-nowrap">
        Wall Street Academy
      </span>
    </div>
  );
}
