/**
 * Generates all site images via Gemini imagen API.
 * Run: node scripts/generate-images.mjs
 * Requires GEMINI_API_KEY in .env.local
 *
 * Saves images to public/generated/ and prints a JSON map
 * of filename → path for updating component source files.
 */

import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'generated');

// Load API key from .env.local
function loadEnv() {
  try {
    const env = readFileSync(join(ROOT, '.env.local'), 'utf8');
    for (const line of env.split('\n')) {
      const [k, ...rest] = line.split('=');
      if (k?.trim() === 'GEMINI_API_KEY') return rest.join('=').trim();
    }
  } catch {}
  return process.env.GEMINI_API_KEY;
}

const API_KEY = loadEnv();
if (!API_KEY) {
  console.error('GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}

// Imagen 3 — best quality available via AI Studio API key
const IMAGEN_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImages?key=${API_KEY}`;
// Gemini 2.0 Flash image gen — fallback if Imagen quota exhausted
const GEMINI_IMG_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${API_KEY}`;

const IMAGES = [
  // ── Hero ─────────────────────────────────────────────────────────────
  {
    name: 'hero-bg',
    prompt: 'Ultra-cinematic dark studio photography environment, professional cinema camera on tripod, moody dark atmosphere, dramatic ambient lighting with subtle purple and cyan rim lights, deep blacks, film noir aesthetic, anamorphic horizontal format, no people, luxury premium feel, photorealistic, 8K',
  },
  // ── About ────────────────────────────────────────────────────────────
  {
    name: 'about-creator',
    prompt: 'Professional young male content creator and videographer, dark luxury studio portrait, dramatic Rembrandt side lighting, holding a cinema camera, sleek dark background, editorial fashion photography, sharp focus, film grain texture, cinematic color grade, high-end luxury aesthetic, photorealistic',
  },
  // ── Products ─────────────────────────────────────────────────────────
  {
    name: 'product-guide',
    prompt: 'Premium luxury digital creator guidebook, floating on deep black background, gold foil title embossed, minimalist editorial book cover design, soft dramatic studio lighting, subtle reflections, high-end product photography, photorealistic',
  },
  {
    name: 'product-luts',
    prompt: 'Cinematic color grading color science concept, film strips with teal and orange split tone color grade, dramatic moody professional video editing aesthetic, dark background with glowing color channel separations, photorealistic digital art',
  },
  {
    name: 'product-masterclass',
    prompt: 'Dynamic social media content creator filming vertical video on smartphone, cinematic neon pink and purple lighting, dark urban background, dramatic low-angle shot, professional production setup, high energy, photorealistic',
  },
  {
    name: 'product-notion',
    prompt: 'Sleek premium dark mode digital workspace dashboard on laptop screen, minimalist productivity aesthetic, architectural desk setup, soft ambient lighting, high-end tech photography, clean geometric composition, photorealistic',
  },
  // ── Showcase Row 1 ───────────────────────────────────────────────────
  {
    name: 'showcase-travel',
    prompt: 'Ultra-cinematic aerial travel photography, dramatic golden hour landscape, anamorphic lens flare, film grain, teal and orange color grade, widescreen 16:9, luxury editorial travel content, photorealistic',
  },
  {
    name: 'showcase-noir',
    prompt: 'Luxury fashion brand identity noir editorial, high contrast black and white, geometric minimalist composition, premium brand materials on black marble, dramatic hard light shadows, editorial commercial photography, photorealistic',
  },
  {
    name: 'showcase-urban',
    prompt: 'Urban street cinematic lifestyle photography, neon reflections on wet pavement at night, dramatic color graded, lone figure in motion blur, editorial fashion street photography, moody atmospheric, photorealistic',
  },
  {
    name: 'showcase-product-launch',
    prompt: 'Luxury product commercial hero shot, premium watch or object on obsidian surface, dramatic single-source studio lighting, deep shadows, water droplets, high-end advertising photography, photorealistic',
  },
  {
    name: 'showcase-timelapse',
    prompt: 'Night city timelapse long exposure photography, skyscraper light trails, aerial cityscape, deep blue hour sky, purple and gold city lights, cinematic wide angle, photorealistic',
  },
  // ── Showcase Row 2 ───────────────────────────────────────────────────
  {
    name: 'showcase-tokyo',
    prompt: 'Neon-soaked Tokyo night street photography, rain reflections on asphalt, vibrant cyan and magenta neon signs in Japanese, atmospheric fog, urban cyberpunk aesthetic, editorial documentary photography, photorealistic',
  },
  {
    name: 'showcase-portrait',
    prompt: 'High fashion editorial portrait photography, dramatic chiaroscuro lighting, deep shadows and highlights, model with strong features, black and white with subtle blue toning, luxury fashion magazine aesthetic, photorealistic',
  },
  {
    name: 'showcase-supercar',
    prompt: 'Luxury exotic sports car automotive hero photography, dark dramatic studio, single streak of light across carbon fiber body, low angle, smoke and atmosphere, premium commercial automotive photography, photorealistic',
  },
  {
    name: 'showcase-architecture',
    prompt: 'Minimalist modern architecture photography, extreme geometric lines and negative space, concrete and glass, natural diffused daylight, editorial architectural photography, wabi-sabi luxury aesthetic, photorealistic',
  },
  {
    name: 'showcase-street',
    prompt: 'Street culture documentary photography, candid urban scene, dramatic black and white with high contrast, grainy film aesthetic, decisive moment photography, powerful composition, Magnum Photos style, photorealistic',
  },
];

async function generateWithImagen(prompt) {
  const response = await fetch(IMAGEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: { text: prompt },
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: '4:3',
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Imagen API error ${response.status}: ${err}`);
  }

  const json = await response.json();
  const b64 = json.predictions?.[0]?.bytesBase64Encoded
    ?? json.generatedImages?.[0]?.image?.imageBytes;

  if (!b64) throw new Error('No image bytes in Imagen response');
  return { data: b64, ext: 'png' };
}

async function generateWithGemini(prompt) {
  const response = await fetch(GEMINI_IMG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const json = await response.json();
  const parts = json.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));
  if (!imagePart) throw new Error('No image in Gemini response');

  const ext = imagePart.inlineData.mimeType.split('/')[1] || 'png';
  return { data: imagePart.inlineData.data, ext };
}

async function generateImage(name, prompt) {
  // Try Imagen 3 first (best quality), fall back to Gemini image gen
  let result;
  try {
    result = await generateWithImagen(prompt);
  } catch (e) {
    console.log(`  (Imagen failed: ${e.message.slice(0, 80)} — trying Gemini)`);
    result = await generateWithGemini(prompt);
  }

  const filename = `${name}.${result.ext}`;
  const filepath = join(OUT_DIR, filename);
  writeFileSync(filepath, Buffer.from(result.data, 'base64'));
  return `/generated/${filename}`;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const results = {};
  let failed = [];

  for (const { name, prompt } of IMAGES) {
    process.stdout.write(`Generating ${name}... `);
    try {
      const path = await generateImage(name, prompt);
      results[name] = path;
      console.log(`✓ ${path}`);
    } catch (err) {
      console.log(`✗ ${err.message}`);
      failed.push(name);
    }
    // Respect rate limits — 2s between requests
    await sleep(2000);
  }

  console.log('\n── Results ─────────────────────────────');
  console.log(JSON.stringify(results, null, 2));

  if (failed.length) {
    console.log('\n── Failed ──────────────────────────────');
    console.log(failed.join(', '));
  }

  // Write a manifest for component update reference
  writeFileSync(
    join(ROOT, 'public', 'generated', 'manifest.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\nManifest written to public/generated/manifest.json');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
