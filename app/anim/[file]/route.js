import fs from 'node:fs/promises';
import path from 'node:path';

const ANIM_DIRECTORY = path.join(process.cwd(), 'anim');
const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

export const runtime = 'nodejs';

export async function GET(_request, { params }) {
  const { file } = await params;
  const decodedFile = decodeURIComponent(file);
  const safeFile = path.basename(decodedFile);

  // Reject traversal attempts before reading from the local frame directory.
  if (safeFile !== decodedFile) {
    return new Response('Invalid file path.', { status: 400 });
  }

  const filePath = path.join(ANIM_DIRECTORY, safeFile);
  const extension = path.extname(safeFile).toLowerCase();
  const contentType = MIME_TYPES[extension] ?? 'application/octet-stream';

  try {
    const buffer = await fs.readFile(filePath);

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Frame not found.', { status: 404 });
  }
}
