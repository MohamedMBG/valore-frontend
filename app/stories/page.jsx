import fs from 'node:fs/promises';
import path from 'node:path';
import StoriesSection from '@/components/StoriesSection';

const ANIM_DIRECTORY = path.join(process.cwd(), 'anim');

async function getFrameUrls() {
  const files = await fs.readdir(ANIM_DIRECTORY);

  return files
    .filter((file) => /\.(avif|gif|jpe?g|png|webp)$/i.test(file))
    .sort((left, right) =>
      left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' })
    )
    .map((file) => `/anim/${encodeURIComponent(file)}`);
}

export const metadata = {
  title: 'Stories | Veloir',
  description: 'Success stories from the Veloir community.',
};

export default async function StoriesPage() {
  const frameUrls = await getFrameUrls();

  return <StoriesSection frameUrls={frameUrls} />;
}
