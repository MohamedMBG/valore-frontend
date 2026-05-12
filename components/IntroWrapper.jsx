'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import IntroAnimation from './IntroAnimation';

const IntroWrapper = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showIntro, setShowIntro] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // Redirect to home on any direct page load/refresh if not already on home
    if (pathname !== '/') {
      router.push('/');
    }
  }, [pathname, router]);

  const handleComplete = () => {
    setShowIntro(false);
    setContentVisible(true);
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
