// Extracts a self-contained funnel HTML file into:
//   - public/wsa/<name>/<n>.<ext>   (base64 images written out as real files)
//   - app/_funnels/<name>.ts        (compact module exporting { fonts, css, body, script })
//
// Usage: node scripts/extract-funnel.mjs <path-to.html> <name>
import fs from "node:fs";
import path from "node:path";

const [, , srcPath, name] = process.argv;
if (!srcPath || !name) {
  console.error("usage: node scripts/extract-funnel.mjs <html> <name>");
  process.exit(1);
}

const root = process.cwd();
const html = fs.readFileSync(srcPath, "utf8");

const imgDir = path.join(root, "public", "wsa", name);
fs.mkdirSync(imgDir, { recursive: true });

const EXT = { "image/jpeg": "jpg", "image/jpg": "jpg", "image/png": "png", "image/gif": "gif", "image/webp": "webp", "image/svg+xml": "svg" };

// 1) Replace every base64 data URI with a written-out file path.
let counter = 0;
const seen = new Map(); // dedupe identical images
let work = html.replace(/data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)/g, (_m, mime, b64) => {
  const clean = b64.replace(/\s+/g, "");
  if (seen.has(clean)) return seen.get(clean);
  const ext = EXT[mime.toLowerCase()] || "bin";
  const file = `${++counter}.${ext}`;
  fs.writeFileSync(path.join(imgDir, file), Buffer.from(clean, "base64"));
  const url = `/wsa/${name}/${file}`;
  seen.set(clean, url);
  return url;
});

// 2) Pull external stylesheet <link> hrefs (fonts) from <head>.
const fonts = [...work.matchAll(/<link[^>]+rel=["']?(?:preconnect|stylesheet)["']?[^>]*>/gi)]
  .map((m) => m[0])
  .filter((l) => /fonts\.|stylesheet/i.test(l));

// 3) Collect all <style> blocks.
const css = [...work.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n");

// 4) Collect all <script> blocks (inline only).
const script = [...work.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join("\n");

// 5) Body inner HTML, with <script> and <style> stripped out.
const bodyMatch = work.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let body = bodyMatch ? bodyMatch[1] : work;
body = body.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");

const outDir = path.join(root, "app", "_funnels");
fs.mkdirSync(outDir, { recursive: true });
const mod =
  `// AUTO-GENERATED from ${path.basename(srcPath)} by scripts/extract-funnel.mjs — do not edit by hand.\n` +
  `export const fonts = ${JSON.stringify(fonts)};\n` +
  `export const css = ${JSON.stringify(css)};\n` +
  `export const body = ${JSON.stringify(body)};\n` +
  `export const script = ${JSON.stringify(script)};\n`;
fs.writeFileSync(path.join(outDir, `${name}.ts`), mod);

console.log(`✓ ${name}: ${counter} images → public/wsa/${name}/, module → app/_funnels/${name}.ts`);
console.log(`  fonts:${fonts.length} css:${css.length}b body:${body.length}b script:${script.length}b`);
