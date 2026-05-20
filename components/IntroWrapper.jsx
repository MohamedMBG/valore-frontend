'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic import: IntroAnimation (framer-motion + video logic) only loads on homepage
// Other pages pay zero JS cost for this component
const IntroAnimation = dynamic(() => import('./IntroAnimation'), { ssr: false });

const IntroWrapper = ({ children }) => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [hasCompletedIntro, setHasCompletedIntro] = useState(false);
  const showIntro = isHomePage && !hasCompletedIntro;
  const contentVisible = !showIntro;

  const handleComplete = () => {
    setHasCompletedIntro(true);
  };

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleComplete} />}
      <div className={`transition-opacity duration-1000 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
    </>
  );
};

export default IntroWrapper;
