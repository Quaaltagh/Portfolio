import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = "public/PictureQuest";

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

for await (const file of walk(ROOT)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue;
  const base = file.replace(/\.(png|jpe?g)$/i, "");

  await sharp(file)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`${base}.webp`);

  await sharp(file)
    .resize({ width: 960, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(`${base}-thumb.webp`);

  console.log("OK", file);
}