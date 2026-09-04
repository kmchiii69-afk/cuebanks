import Wrap from "./Wrap";

export default function ApplyBand({
  caption,
  href = "#apply",
}: {
  caption?: string;
  href?: string;
}) {
  return (
    <div className="bg-bg-2 border-y border-line py-12">
      <Wrap>
        <div className="flex items-center justify-between gap-6 flex-wrap">
          {caption && (
            <div className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-ash">
              {caption}
            </div>
          )}
          <a href={href} className="btn btn-lg ml-auto">
            Apply Now →
          </a>
        </div>
      </Wrap>
    </div>
  );
}
