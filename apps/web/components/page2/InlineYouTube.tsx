export default function InlineYouTube({
  videoId,
  title,
  start = 0,
}: {
  videoId: string;
  title: string;
  start?: number;
}) {
  const embed = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1${start ? `&start=${start}` : ""}`;
  return (
    <div
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ aspectRatio: "16/9" } as any)}
      className="relative block border border-line overflow-hidden bg-bg-2"
    >
      <iframe
        src={embed}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
}
