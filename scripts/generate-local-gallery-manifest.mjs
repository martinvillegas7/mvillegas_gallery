import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const folders = {
  naturaleza: "TEMPORAL/NATURALEZA",
  retratos: "TEMPORAL/RETRATOS",
  deporte: "TEMPORAL/DEPORTE",
};

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp)$/i;

const manifest = {};

for (const [category, folder] of Object.entries(folders)) {
  const directory = path.join(root, "public", folder);
  try {
    const files = await readdir(directory);
    manifest[category] = files
      .filter(
        (name) => IMAGE_EXTENSIONS.test(name) && !name.startsWith(".")
      )
      .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
  } catch {
    manifest[category] = [];
  }
}

const output = path.join(root, "lib/local-gallery-manifest.json");
await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`);

const counts = Object.fromEntries(
  Object.entries(manifest).map(([category, files]) => [category, files.length])
);
console.log(`Local gallery manifest: ${JSON.stringify(counts)}`);
