// Copie les sources dans docs/lib/ : GitHub Pages ne publie que le dossier docs/.
// Copies the sources into docs/lib/: GitHub Pages only serves the docs/ folder.
// Usage : node scripts/sync-docs.mjs   (ou / or: npm run sync-docs)
import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src");
const dest = join(root, "docs", "lib");
mkdirSync(dest, { recursive: true });
for (const file of readdirSync(src).filter((f) => f.endsWith(".js"))) {
  copyFileSync(join(src, file), join(dest, file));
  console.log("docs/lib/" + file);
}
