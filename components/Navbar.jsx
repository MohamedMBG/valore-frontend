'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === '/stories') {
    return null;
  }

  const links = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/mindset', label: 'Mindset' },
    { href: '/studio', label: 'Studio' },
    { href: '/stories', label: 'Stories' },
    { href: '/battle', label: 'Battle' },
    { href: '/#showcase', label: 'Showcase' },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 bg-[#0A0A0A]/90 backdrop-blur-md glow-line-bottom transition-all">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className={clsx(
          "font-display text-2xl font-bold tracking-widest uppercase flex items-center gap-2",
          pathname === '/' ? "animate-shimmer text-white" : "text-white glow-text-hover"
        )}>
          Veloir
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {links.map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className={clsx(
                  "text-sm font-medium tracking-wide uppercase transition-colors glow-text-hover",
                  pathname === link.href ? "text-[#7C3AED]" : "text-[#A1A1AA]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 border-l border-zinc-800/50 pl-4">
            {session ? (
              <div className="flex items-center gap-4">
                <Link href={session.user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="text-[#A1A1AA] hover:text-[#7C3AED] transition-colors">
                  <User className="w-5 h-5 glow-text-hover" />
                </Link>
                <button 
                  onClick={() => signOut()} 
                  className="text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-[#7C3AED] transition-colors glow-text-hover"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-sm font-medium tracking-wide uppercase text-[#A1A1AA] hover:text-[#7C3AED] transition-colors glow-text-hover">
                Login
              </Link>
            )}
            <Link href="/cart" className="text-[#A1A1AA] hover:text-[#7C3AED] transition-colors relative glow-text-hover">
              <ShoppingBag className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-[#A1A1AA] hover:text-[#7C3AED] transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6 glow-text-hover" /> : <Menu className="w-6 h-6 glow-text-hover" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#0A0A0A] glow-line-bottom shadow-2xl flex flex-col p-6 gap-6">
          {links.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={clsx(
                "text-lg font-medium tracking-wide uppercase glow-text-hover",
                pathname === link.href ? "text-[#7C3AED]" : "text-[#A1A1AA]"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-zinc-800/50 my-2 stitch-border" />
          {session ? (
            <>
              <Link href={session.user.role === 'ADMIN' ? '/admin' : '/dashboard'} onClick={() => setIsOpen(false)} className="text-lg font-medium text-white uppercase glow-text-hover">
                Dashboard
              </Link>
              <button 
                onClick={() => { signOut(); setIsOpen(false); }} 
                className="text-lg font-medium text-red-500 uppercase text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium text-white uppercase glow-text-hover">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
