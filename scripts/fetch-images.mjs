/**
 * Downloads AI-generated images from Pollinations.ai (free, no API key).
 * Uses FLUX model — high quality photorealistic output.
 * Run: node scripts/fetch-images.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'generated');

function url(prompt, w = 800, h = 600) {
  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 99999);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${w}&height=${h}&model=flux&nologo=true&seed=${seed}`;
}

const IMAGES = [
  {
    name: 'hero-bg',
    w: 1600, h: 900,
    prompt: 'ultra cinematic dark studio, professional cinema camera on tripod, moody dramatic lighting, deep blacks, subtle purple and cyan rim lights, film noir aesthetic, no people, luxury premium atmosphere, photorealistic 8K',
  },
  {
    name: 'about-creator',
    w: 600, h: 750,
    prompt: 'professional young male videographer content creator, dark luxury studio portrait, dramatic Rembrandt lighting, holding cinema camera, sleek dark background, editorial fashion photography, film grain, cinematic color grade, photorealistic',
  },
  {
    name: 'product-guide',
    w: 800, h: 600,
    prompt: 'premium luxury digital book floating on pure black background, gold foil title embossed on dark cover, minimalist editorial design, soft dramatic studio lighting, high-end product photography, photorealistic',
  },
  {
    name: 'product-luts',
    w: 800, h: 600,
    prompt: 'cinematic color grading visualization, film strips with teal and orange split tone, glowing color channels on dark background, professional video editing color science, moody dramatic, photorealistic digital art',
  },
  {
    name: 'product-masterclass',
    w: 800, h: 600,
    prompt: 'dynamic content creator filming vertical video on smartphone, cinematic neon pink and purple lighting, dark urban background, dramatic low angle shot, professional production setup, photorealistic',
  },
  {
    name: 'product-notion',
    w: 800, h: 600,
    prompt: 'sleek dark mode digital workspace on MacBook, minimalist productivity dashboard, architectural desk setup with soft ambient light, premium tech product photography, geometric composition, photorealistic',
  },
  // Showcase Row 1
  {
    name: 'sc-travel',
    w: 700, h: 525,
    prompt: 'ultra cinematic aerial travel photography, dramatic golden hour mountain landscape, anamorphic lens flare, film grain, teal and orange color grade, widescreen, luxury editorial, photorealistic',
  },
  {
    name: 'sc-noir',
    w: 700, h: 525,
    prompt: 'luxury fashion brand identity noir editorial, high contrast black and white, geometric minimalist composition, premium brand materials on black marble surface, dramatic hard light shadows, photorealistic',
  },
  {
    name: 'sc-urban',
    w: 700, h: 525,
    prompt: 'urban street cinematic lifestyle photography, neon reflections on wet pavement at night, dramatic color graded, lone figure silhouette, editorial fashion street, moody atmospheric, photorealistic',
  },
  {
    name: 'sc-launch',
    w: 700, h: 525,
    prompt: 'luxury product commercial hero shot, premium watch on obsidian reflective surface, dramatic single-source studio lighting, deep shadows, water droplets, high-end advertising photography, photorealistic',
  },
  {
    name: 'sc-timelapse',
    w: 700, h: 525,
    prompt: 'night city long exposure photography, skyscraper light trails, aerial cityscape, deep blue hour sky, purple and gold city lights, cinematic wide angle, photorealistic',
  },
  // Showcase Row 2
  {
    name: 'sc-tokyo',
    w: 700, h: 525,
    prompt: 'neon-soaked Tokyo night street, rain reflections on asphalt, vibrant cyan and magenta neon signs, atmospheric fog, urban cyberpunk aesthetic, editorial documentary photography, photorealistic',
  },
  {
    name: 'sc-portrait',
    w: 700, h: 525,
    prompt: 'high fashion editorial portrait photography, dramatic chiaroscuro lighting, deep shadows and highlights, strong features, black and white with subtle blue toning, luxury fashion magazine, photorealistic',
  },
  {
    name: 'sc-supercar',
    w: 700, h: 525,
    prompt: 'luxury exotic sports car automotive hero photography, dark dramatic studio, single streak of light across carbon fiber body, low angle dramatic, smoke and atmosphere, premium commercial, photorealistic',
  },
  {
    name: 'sc-architecture',
    w: 700, h: 525,
    prompt: 'minimalist modern architecture photography, extreme geometric lines negative space, concrete and glass, natural diffused daylight, editorial architectural, wabi-sabi luxury, photorealistic',
  },
  {
    name: 'sc-street',
    w: 700, h: 525,
    prompt: 'street culture documentary photography, candid urban scene, dramatic high contrast black and white, grainy film aesthetic, decisive moment, powerful composition, Magnum Photos style, photorealistic',
  },
];

async function download(name, imgUrl) {
  const res = await fetch(imgUrl, { signal: AbortSignal.timeout(60000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  const contentType = res.headers.get('content-type') || 'image/jpeg';
  const ext = contentType.includes('png') ? 'png' : 'jpg';
  const filename = `${name}.${ext}`;
  writeFileSync(join(OUT_DIR, filename), Buffer.from(buf));
  return `/generated/${filename}`;
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const manifest = {};

  for (const img of IMAGES) {
    const imgUrl = url(img.prompt, img.w, img.h);
    process.stdout.write(`⬇  ${img.name} (${img.w}x${img.h})... `);
    try {
      const path = await download(img.name, imgUrl);
      manifest[img.name] = path;
      console.log(`✓`);
    } catch (err) {
      console.log(`✗ ${err.message}`);
      manifest[img.name] = null;
    }
    await sleep(4000);
  }

  writeFileSync(join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('\nDone. Manifest:', JSON.stringify(manifest, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });
