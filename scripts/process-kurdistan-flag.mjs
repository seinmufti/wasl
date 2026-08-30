import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const assetPath = path.join(
  root,
  "..",
  ".cursor",
  "projects",
  "c-Users-DELL-programmer-react-wasl",
  "assets",
  "c__Users_DELL_AppData_Roaming_Cursor_User_workspaceStorage_dc510f4688aa3084087d632b594c7866_images_tmctmh34wz4b1-4d248bcd-9e94-4f00-bfe1-8bbf2d1ba262.jpg",
);

const input = fs.existsSync(assetPath)
  ? assetPath
  : path.join(root, "public", "images", "kurdistan-flag.jpg");

const output = path.join(root, "public", "images", "kurdistan-flag.png");

function isNearWhite(r, g, b, threshold = 245) {
  return r >= threshold && g >= threshold && b >= threshold;
}

function idx(x, y, width, channels) {
  return (y * width + x) * channels;
}

function floodTransparent(pixels, width, height, channels, threshold) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  const trySeed = (x, y) => {
    const i = y * width + x;
    if (visited[i]) return;
    const p = idx(x, y, width, channels);
    if (!isNearWhite(pixels[p], pixels[p + 1], pixels[p + 2], threshold)) return;
    visited[i] = 1;
    queue.push([x, y]);
  };

  for (let x = 0; x < width; x++) {
    trySeed(x, 0);
    trySeed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    trySeed(0, y);
    trySeed(width - 1, y);
  }

  while (queue.length > 0) {
    const [x, y] = queue.pop();
    const p = idx(x, y, width, channels);
    pixels[p + 3] = 0;

    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ]) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const ni = ny * width + nx;
      if (visited[ni]) continue;
      const np = idx(nx, ny, width, channels);
      if (!isNearWhite(pixels[np], pixels[np + 1], pixels[np + 2], threshold)) continue;
      visited[ni] = 1;
      queue.push([nx, ny]);
    }
  }
}

const meta = await sharp(input).metadata();
console.log("input:", meta.width, "x", meta.height);

const { data, info } = await sharp(input)
  .trim({ threshold: 20, background: { r: 255, g: 255, b: 255 } })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const pixels = Buffer.from(data);

floodTransparent(pixels, width, height, channels, 245);

await sharp(pixels, { raw: { width, height, channels } })
  .png()
  .toFile(output);

const outMeta = await sharp(output).metadata();
console.log("output:", outMeta.width, "x", outMeta.height, "png");
