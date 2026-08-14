// Rewrites the static href targets the funnels were authored with (placeholder
// "#" anchors and "index.html" links) into real app routes. Pure string
// replacement on the extracted body — the generated funnel modules stay
// pristine and re-runnable.
export function rewriteLinks(body: string, map: Array<[string, string]>): string {
  return map.reduce((acc, [from, to]) => acc.split(from).join(to), body);
}
