'use client';

import { useEffect, useRef, useState } from 'react';

const FRAME_LERP = 0.14;
const MIN_SCROLL_SCREENS = 6;
const MAX_SCROLL_SCREENS = 12;
const STORY_CARDS = [
  {
    id: 'alex',
    eyebrow: 'Breakthrough',
    title: 'Overcoming the plateau',
    quote:
      'I was repeating the same moves for years. The shift came when I rebuilt the system, not the motivation.',
    author: 'Alex M.',
    accent: 'from-cyan-300/70 via-white/30 to-transparent',
  },
  {
    id: 'sarah',
    eyebrow: 'Rebuild',
    title: 'Built from zero',
    quote:
      'No audience, no product, no momentum. The discipline stack made the studio real.',
    author: 'Sarah K.',
    accent: 'from-white/70 via-white/20 to-transparent',
  },
  {
    id: 'marcus',
    eyebrow: 'Discipline',
    title: 'Systems over moods',
    quote:
      'Once the workflow became repeatable, progress stopped feeling random.',
    author: 'Marcus T.',
    accent: 'from-zinc-200/60 via-white/16 to-transparent',
  },
];
const STORY_TIMELINE = [
  {
    step: '01',
    label: 'Reset',
    detail: 'Cut the noise, rebuild the process, and make progress measurable.',
  },
  {
    step: '02',
    label: 'System',
    detail: 'Turn discipline into a repeatable operating rhythm instead of a mood.',
  },
  {
    step: '03',
    label: 'Scale',
    detail: 'What starts as a habit becomes a studio, a product, or a body of work.',
  },
];
const FEATURE_PILLARS = [
  {
    id: 'clarity',
    title: 'Clarity',
    copy: 'Cut through noise, identify leverage, and focus the next move.',
  },
  {
    id: 'cadence',
    title: 'Cadence',
    copy: 'Build a pace that survives low-energy days and compounds on strong ones.',
  },
  {
    id: 'craft',
    title: 'Craft',
    copy: 'Make the work feel sharp, deliberate, and impossible to confuse with average.',
  },
];
const SIGNALS = [
  { label: 'Stories collected', value: '168' },
  { label: 'Frames in sequence', value: '240+' },
  { label: 'System rebuilds', value: '03' },
  { label: 'Focus level', value: 'High' },
];
const LONGFORM_NOTES = [
  {
    id: 'discipline',
    eyebrow: 'Field Note 01',
    title: 'Discipline is architecture',
    copy:
      'The strongest stories do not start with momentum. They start with a boring, repeatable structure that keeps producing output when emotion is gone.',
  },
  {
    id: 'taste',
    eyebrow: 'Field Note 02',
    title: 'Taste needs standards',
    copy:
      'Ambition without standards becomes aesthetic fog. Progress appears when the bar is visible, named, and defended every week.',
  },
  {
    id: 'scale',
    eyebrow: 'Field Note 03',
    title: 'Scale comes after proof',
    copy:
      'Once the process can survive repetition, it can survive growth. What was private discipline becomes public work with weight behind it.',
  },
];
const CLOSING_QUOTES = [
  'Progress gets cinematic when the system gets real.',
  'The frame changes because the behavior changed first.',
  'Better work usually begins with quieter rules.',
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function drawImageCover(context, canvas, image) {
  const { width, height } = canvas.getBoundingClientRect();
  const imageAspectRatio = image.naturalWidth / image.naturalHeight;
  const canvasAspectRatio = width / height;

  let drawWidth = width;
  let drawHeight = height;

  if (imageAspectRatio > canvasAspectRatio) {
    drawWidth = height * imageAspectRatio;
  } else {
    drawHeight = width / imageAspectRatio;
  }

  const offsetX = (width - drawWidth) / 2;
  const offsetY = (height - drawHeight) / 2;

  context.clearRect(0, 0, width, height);
  context.fillStyle = '#000000';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

export default function StoriesSection({ frameUrls = [] }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastFrameIndexRef = useRef(-1);
  const [isReady, setIsReady] = useState(false);

  const scrollScreens = clamp(
    Math.ceil(frameUrls.length / 20) + 5,
    MIN_SCROLL_SCREENS,
    MAX_SCROLL_SCREENS
  );

  useEffect(() => {
    if (frameUrls.length === 0) {
      return undefined;
    }

    let isCancelled = false;

    const preloadFrames = async () => {
      const loadedFrames = await Promise.all(
        frameUrls.map(
          (src) =>
            new Promise((resolve, reject) => {
              const image = new Image();
              image.decoding = 'async';
              image.src = src;
              image.onload = () => resolve(image);
              image.onerror = () => reject(new Error(`Failed to load frame: ${src}`));
            })
        )
      );

      if (isCancelled) {
        return;
      }

      framesRef.current = loadedFrames;
      setIsReady(true);
    };

    preloadFrames().catch((error) => {
      console.error(error);
    });

    return () => {
      isCancelled = true;
    };
  }, [frameUrls]);

  useEffect(() => {
    if (!isReady || frameUrls.length === 0) {
      return undefined;
    }

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return undefined;
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    const resizeCanvas = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.round(width * devicePixelRatio);
      canvas.height = Math.round(height * devicePixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      const currentFrame = framesRef.current[lastFrameIndexRef.current] ?? framesRef.current[0];

      if (currentFrame) {
        drawImageCover(context, canvas, currentFrame);
      }
    };

    const updateTargetProgress = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const rawProgress = (window.scrollY - section.offsetTop) / scrollableDistance;
      targetProgressRef.current = clamp(rawProgress, 0, 1);
    };

    const drawFrame = (frameIndex) => {
      if (frameIndex === lastFrameIndexRef.current) {
        return;
      }

      const frame = framesRef.current[frameIndex];

      if (!frame) {
        return;
      }

      drawImageCover(context, canvas, frame);
      lastFrameIndexRef.current = frameIndex;
    };

    const tick = () => {
      // Lerp keeps frame changes fluid instead of snapping on each scroll event.
      const delta = targetProgressRef.current - currentProgressRef.current;

      if (Math.abs(delta) < 0.0005) {
        currentProgressRef.current = targetProgressRef.current;
      } else {
        currentProgressRef.current += delta * FRAME_LERP;
      }

      const frameIndex = Math.round(
        currentProgressRef.current * (framesRef.current.length - 1)
      );

      drawFrame(frameIndex);
      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    resizeCanvas();
    updateTargetProgress();
    drawFrame(0);
    animationFrameRef.current = window.requestAnimationFrame(tick);

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', updateTargetProgress, { passive: true });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', updateTargetProgress);

      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [frameUrls.length, isReady]);

  if (frameUrls.length === 0) {
    return <section className="min-h-screen bg-black" />;
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-black"
      style={{ height: `${scrollScreens * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* The sticky viewport keeps the canvas pinned while scroll progress drives frames. */}
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          aria-label="Scroll-driven frame animation"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.5)_28%,rgba(0,0,0,0.58)_64%,rgba(0,0,0,0.88)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(0,198,255,0.08),transparent_26%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative z-20">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-start px-4 pb-[24vh] pt-24 md:px-8 md:pt-28">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,0.94fr)_minmax(22rem,28rem)] lg:gap-8">
            <div className="space-y-[18vh]">
              <section className="max-w-3xl rounded-[2rem] border border-white/10 bg-black/34 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.48)] backdrop-blur-xl md:p-10">
                <p className="mb-3 text-[0.68rem] font-medium uppercase tracking-[0.45em] text-white/55">
                  Community Stories
                </p>
                <div className="flex items-start justify-between gap-6">
                  <div className="max-w-2xl">
                    <h1 className="font-display text-4xl font-semibold uppercase tracking-[0.14em] text-white md:text-6xl">
                      Scroll The Journey
                    </h1>
                    <p className="mt-5 max-w-2xl text-sm leading-7 text-white/68 md:text-base">
                      A cinematic reel driven by scroll, overlaid with discipline patterns,
                      turning points, and outcome signals behind the work.
                    </p>
                  </div>
                  <div className="hidden min-w-28 rounded-[1.5rem] border border-white/10 bg-white/6 px-4 py-5 text-right lg:block">
                    <p className="text-[0.62rem] uppercase tracking-[0.4em] text-white/35">
                      Frames
                    </p>
                    <p className="mt-2 font-display text-3xl uppercase tracking-[0.12em] text-white">
                      {frameUrls.length}
                    </p>
                  </div>
                </div>
                <div className="mt-8 grid gap-3 md:grid-cols-3">
                  {STORY_TIMELINE.map((item) => (
                    <div
                      key={item.step}
                      className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 backdrop-blur-md"
                    >
                      <p className="text-[0.7rem] uppercase tracking-[0.35em] text-cyan-200/65">
                        {item.step}
                      </p>
                      <h2 className="mt-3 font-display text-xl uppercase tracking-[0.08em] text-white">
                        {item.label}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-white/58">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {SIGNALS.map((signal) => (
                    <div
                      key={signal.label}
                      className="rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-5"
                    >
                      <p className="text-[0.62rem] uppercase tracking-[0.34em] text-white/38">
                        {signal.label}
                      </p>
                      <p className="mt-3 font-display text-2xl uppercase tracking-[0.12em] text-white">
                        {signal.value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* These cards stay outside the canvas so the frame animation remains GPU-friendly. */}
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_0.92fr]">
                {STORY_CARDS.map((story, index) => (
                  <article
                    key={story.id}
                    className={[
                      'overflow-hidden rounded-[1.9rem] border border-white/12 bg-[linear-gradient(180deg,rgba(18,18,18,0.56),rgba(0,0,0,0.3))]',
                      'p-6 shadow-[0_32px_100px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-7',
                      index === 1 ? 'md:translate-y-10' : '',
                      isReady ? 'opacity-100' : 'opacity-0',
                      'transition-opacity duration-700',
                    ].join(' ')}
                  >
                    <div className={`h-px w-full bg-gradient-to-r ${story.accent}`} />
                    <div className="mt-6 flex items-start justify-between gap-4">
                      <p className="text-[0.62rem] font-medium uppercase tracking-[0.38em] text-white/45">
                        {story.eyebrow}
                      </p>
                      <div className="rounded-full border border-white/12 px-3 py-1 text-[0.58rem] uppercase tracking-[0.36em] text-white/38">
                        Story
                      </div>
                    </div>
                    <h2 className="mt-4 max-w-xs font-display text-2xl font-semibold uppercase tracking-[0.08em] text-white md:text-[2rem]">
                      {story.title}
                    </h2>
                    <p className="mt-5 text-sm leading-7 text-white/72 md:text-[0.96rem]">
                      {story.quote}
                    </p>
                    <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                      <p className="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-white/42">
                        {story.author}
                      </p>
                      <div className="flex gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/65" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white/18" />
                      </div>
                    </div>
                  </article>
                ))}
              </section>

              <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,8,8,0.52),rgba(0,0,0,0.34))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.48)] backdrop-blur-xl md:p-8">
                  <p className="text-[0.68rem] uppercase tracking-[0.42em] text-cyan-100/48">
                    Why It Lands
                  </p>
                  <h2 className="mt-4 max-w-lg font-display text-3xl uppercase tracking-[0.1em] text-white md:text-4xl">
                    The page should feel like evidence, not decoration
                  </h2>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-white/66 md:text-base">
                    Strong stories become believable when the presentation has structure. The
                    film sets the emotional tempo. The cards, notes, and signals make the
                    transformation legible.
                  </p>
                  <div className="mt-8 grid gap-3">
                    {FEATURE_PILLARS.map((pillar) => (
                      <div
                        key={pillar.id}
                        className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="font-display text-xl uppercase tracking-[0.08em] text-white">
                            {pillar.title}
                          </h3>
                          <div className="h-px flex-1 bg-gradient-to-r from-white/22 to-transparent" />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-white/58">
                          {pillar.copy}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>

                <div className="grid gap-4">
                  {LONGFORM_NOTES.map((note, index) => (
                    <article
                      key={note.id}
                      className={[
                        'rounded-[1.8rem] border border-white/10 bg-black/30 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl',
                        index === 1 ? 'xl:translate-x-8' : '',
                      ].join(' ')}
                    >
                      <p className="text-[0.62rem] uppercase tracking-[0.4em] text-white/42">
                        {note.eyebrow}
                      </p>
                      <h3 className="mt-4 font-display text-2xl uppercase tracking-[0.08em] text-white">
                        {note.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-white/64 md:text-[0.96rem]">
                        {note.copy}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="max-w-2xl rounded-[2rem] border border-white/10 bg-black/28 p-6 shadow-[0_32px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-8">
                <p className="text-[0.68rem] uppercase tracking-[0.42em] text-white/45">
                  Editorial Note
                </p>
                <p className="mt-5 text-lg leading-8 text-white/78 md:text-2xl md:leading-10">
                  The point is not inspiration as spectacle. The point is making repetition look
                  intentional, then letting the results speak with quiet force.
                </p>
              </section>

              <section className="grid gap-4 lg:grid-cols-3">
                {CLOSING_QUOTES.map((quote) => (
                  <article
                    key={quote}
                    className="rounded-[1.7rem] border border-white/10 bg-white/6 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl"
                  >
                    <div className="text-3xl leading-none text-white/24">&quot;</div>
                    <p className="mt-3 text-base leading-7 text-white/74">
                      {quote}
                    </p>
                  </article>
                ))}
              </section>

              <section className="max-w-4xl rounded-[2.2rem] border border-cyan-200/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_34px_120px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:p-10">
                <p className="text-[0.68rem] uppercase tracking-[0.44em] text-cyan-100/52">
                  Final Frame
                </p>
                <h2 className="mt-4 max-w-3xl font-display text-3xl uppercase tracking-[0.1em] text-white md:text-5xl">
                  Build work that still looks sharp after the motion stops
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/66 md:text-base">
                  The last frame stays. The question is whether the process behind it was solid
                  enough to deserve staying on screen.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="rounded-full border border-white/14 bg-black/34 px-5 py-3 text-[0.72rem] uppercase tracking-[0.32em] text-white/72">
                    Systems First
                  </div>
                  <div className="rounded-full border border-white/14 bg-black/34 px-5 py-3 text-[0.72rem] uppercase tracking-[0.32em] text-white/72">
                    Taste With Standards
                  </div>
                  <div className="rounded-full border border-white/14 bg-black/34 px-5 py-3 text-[0.72rem] uppercase tracking-[0.32em] text-white/72">
                    Motion With Intent
                  </div>
                </div>
              </section>
            </div>

            <aside className="top-24 hidden lg:sticky lg:block">
              <div className="rounded-[2rem] border border-white/10 bg-black/36 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                <p className="text-[0.62rem] uppercase tracking-[0.42em] text-white/40">
                  Scroll Index
                </p>
                <div className="mt-6 space-y-4">
                  {STORY_TIMELINE.map((item) => (
                    <div
                      key={item.step}
                      className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-display text-xl uppercase tracking-[0.12em] text-white">
                          {item.step}
                        </p>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/25 to-transparent" />
                      </div>
                      <p className="mt-3 text-[0.7rem] uppercase tracking-[0.28em] text-white/42">
                        {item.label}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-white/56">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-[1.4rem] border border-cyan-300/14 bg-cyan-300/6 p-4">
                  <p className="text-[0.62rem] uppercase tracking-[0.38em] text-cyan-100/48">
                    Motion
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/66">
                    Scroll down to advance the sequence. Scroll up to reverse it. The final frame
                    locks at the end of the section.
                  </p>
                </div>
                <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-[0.62rem] uppercase tracking-[0.38em] text-white/42">
                    Reading Mode
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/60">
                    This page is built as a layered editorial surface: cinematic motion behind,
                    structured proof in front.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-24 md:px-8 lg:hidden">
          <div className="rounded-[1.8rem] border border-white/10 bg-black/40 p-5 backdrop-blur-xl">
            <p className="text-[0.62rem] uppercase tracking-[0.42em] text-white/40">
              Scroll Index
            </p>
            <div className="mt-5 grid gap-3">
              {STORY_TIMELINE.map((item) => (
                <div
                  key={item.step}
                  className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4"
                >
                  <p className="font-display text-lg uppercase tracking-[0.12em] text-white">
                    {item.step} {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/56">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
