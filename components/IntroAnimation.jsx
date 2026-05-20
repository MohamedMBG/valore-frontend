'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroAnimation = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [showBranding, setShowBranding] = useState(true);
  const name = "AURELIUS DROGOW";
  const letters = name.split("");

  // Compute particle positions once on mount — Math.random() in render causes new values every re-render
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      startX: Math.random() * 100,
      endX: Math.random() * 100 + (Math.random() - 0.5) * 10,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5,
    })),
    []
  );

  useEffect(() => {
    setIsMounted(true);
    const brandingTimer = setTimeout(() => {
      setShowBranding(false);
    }, 3200);

    return () => clearTimeout(brandingTimer);
  }, [onComplete]);

  const completeIntro = () => {
    setIsEnding(true);
    setIsVisible(false);
    if (onComplete) {
      setTimeout(onComplete, 1000); // Wait for exit animation
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
        >
          <video
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={completeIntro}
            onError={completeIntro}
            className="absolute inset-0 h-full w-full scale-[1.04] object-cover opacity-75 saturate-[1.15] contrast-[1.05]"
          >
            <source src="/videomp_.mp4" type="video/mp4" />
          </video>

          {/* Grain overlay — inline SVG avoids external fetch on every pageview */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '300px',
            }}
          />

          {/* Cinematic color and focus layers */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(255,255,255,0.10),transparent_34%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(0,209,255,0.14),transparent_52%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.18),transparent_74%)]" />

          {/* Frame and readability overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.12)_24%,rgba(0,0,0,0.18)_62%,rgba(0,0,0,0.72)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(10,10,10,0.12)_0%,rgba(0,0,0,0.84)_100%)]" />
          <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.9)]" />

          {/* Particles — isMounted guard prevents hydration mismatch; positions from useMemo not Math.random() in render */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {isMounted && particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: p.startX + "%", y: "110%", opacity: 0 }}
                animate={{ y: "-10%", opacity: [0, 0.4, 0], x: p.endX + "%" }}
                transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
                className="absolute w-[2px] h-[2px] bg-amber-200/40 rounded-full blur-[1px]"
              />
            ))}
          </div>

          {/* The Branding */}
          <AnimatePresence>
            {showBranding && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -28, scale: 0.96, filter: "blur(12px)" }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="relative z-10 flex flex-col items-center px-4 text-center"
              >
                <motion.div 
                  initial={{ scale: 0.86, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-wrap justify-center tracking-[0.24em] md:tracking-[0.52em]"
                >
                  {letters.map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ 
                        duration: 1.25, 
                        delay: 0.35 + i * 0.07,
                        ease: [0.215, 0.61, 0.355, 1] 
                      }}
                      className={`
                        text-3xl sm:text-5xl md:text-8xl font-serif italic text-white uppercase
                        ${char === " " ? "w-4 md:w-16" : ""}
                      `}
                      style={{
                        textShadow: "0 0 40px rgba(255,255,255,0.14)",
                        background: "linear-gradient(to bottom, #ffffff 0%, #f4f4f5 42%, #a1a1aa 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scaleX: 0.75 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 1.1, delay: 2.1, ease: "easeOut" }}
                  className="mt-7 h-px w-40 md:w-56 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                />

                <motion.div
                  initial={{ opacity: 0, letterSpacing: "0.2em" }}
                  animate={{ opacity: 1, letterSpacing: "0.42em" }}
                  transition={{ duration: 1.6, delay: 2.25, ease: "easeOut" }}
                  className="mt-6 text-[10px] md:text-sm uppercase text-zinc-300/80 font-sans tracking-[0.42em] font-light"
                >
                  Studio & Digital Vision
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cinematic Lens Flare Sweep */}
          <motion.div 
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "200%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none mix-blend-screen overflow-hidden"
          >
            <div className="h-full w-[40vw] bg-gradient-to-r from-transparent via-amber-200/5 to-transparent rotate-12 -translate-y-20"></div>
          </motion.div>

          {/* Flash Effect at end */}
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: isEnding ? [0, 0.12, 0] : 0 }}
             transition={{ duration: 0.35 }}
             className="absolute inset-0 bg-white pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
