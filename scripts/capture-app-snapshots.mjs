/**
 * Capture key Wasl screens as 1080×1080 PNGs (Instagram square) on light-blue canvas.
 * Renders at iPhone 14 Pro Max size, then pads to square.
 * Output: app-snapshots/*.png (gitignored)
 *
 * Usage: node scripts/capture-app-snapshots.mjs
 * Requires: dev server on localhost:3000, playwright, sharp
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";
import sharp from "sharp";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, "app-snapshots");
const baseUrl = process.env.SNAPSHOT_BASE_URL ?? "http://127.0.0.1:3000/wasl";
const size = 1080;
const background = { r: 214, g: 236, b: 252 }; // light blue #D6ECFC

const shots = [
  { file: "01-home.png", path: "/", waitMs: 800 },
  { file: "02-new-invoice.png", path: "/new", fillDummy: true, waitMs: 600 },
  { file: "03-profile.png", path: "/profile", waitMs: 600 },
  { file: "04-invoice-filled.png", path: "/new", fillDummy: true, waitMs: 600 },
  { file: "05-export-preview.png", path: "/new", fillDummy: true, openExport: true, waitMs: 1200 },
];

async function toSquarePng(inputBuffer, outputPath) {
  const meta = await sharp(inputBuffer).metadata();
  const scale = Math.min(size / meta.width, size / meta.height) * 0.92;
  const width = Math.round(meta.width * scale);
  const height = Math.round(meta.height * scale);
  const resized = await sharp(inputBuffer).resize(width, height).png().toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background,
    },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toFile(outputPath);
}

async function enableDebugMode(page) {
  await page.request.post(`${baseUrl}/api/debug-mode`, {
    data: { enabled: true },
  });
}

/** Full iPhone viewport — app shell fills the screen at this size. */
async function captureMobile(page) {
  return page.screenshot({ type: "png", fullPage: false });
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const iPhone = devices["iPhone 14 Pro Max"];
  const context = await browser.newContext({
    ...iPhone,
    colorScheme: "light",
    locale: "en-US",
  });
  const page = await context.newPage();

  await enableDebugMode(page);

  for (const shot of shots) {
    console.log(`Capturing ${shot.file} …`);
    await page.goto(`${baseUrl}${shot.path}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(shot.waitMs);

    if (shot.fillDummy) {
      const fillBtn = page.getByRole("button", { name: /fill with sample|sample invoice/i });
      if (await fillBtn.isVisible().catch(() => false)) {
        await fillBtn.click();
        await page.waitForTimeout(400);
      } else {
        const emojiBtn = page.locator('button:text("🤪")');
        if (await emojiBtn.isVisible().catch(() => false)) {
          await emojiBtn.click();
          await page.waitForTimeout(400);
        }
      }
    }

    if (shot.openExport) {
      const exportBtn = page.getByRole("button", { name: /^export$/i });
      await exportBtn.click();
      await page.waitForTimeout(shot.waitMs);
    }

    const raw = await captureMobile(page);
    await toSquarePng(raw, path.join(outDir, shot.file));
  }

  await browser.close();

  const index = {
    generatedAt: new Date().toISOString(),
    device: "iPhone 14 Pro Max",
    folder: outDir,
    size: `${size}x${size}`,
    background: "#D6ECFC",
    files: shots.map((s) => s.file),
  };
  fs.writeFileSync(path.join(outDir, "index.json"), JSON.stringify(index, null, 2));

  console.log(`\nDone — ${shots.length} iPhone snapshots in:\n  ${outDir}`);
  for (const shot of shots) {
    console.log(`  ${path.join(outDir, shot.file)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
