import './globals.css';
import { Outfit, Bebas_Neue } from 'next/font/google';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import IntroWrapper from '@/components/IntroWrapper';

// Outfit replaces Inter — geometric sans with character, not generic
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
// Bebas Neue replaces Space Grotesk — cinematic condensed display, all-caps by nature
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas-neue' });

export const metadata = {
  title: 'Veloir — Studio & Digital Shop by @drogow',
  description: 'Premium digital products, filming, and video editing services by @drogow.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${bebasNeue.variable} scroll-smooth`}>
      <body className="font-sans flex flex-col min-h-screen bg-black">
        <Providers>
          <IntroWrapper>
            <Navbar />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <Footer />
          </IntroWrapper>
        </Providers>
      </body>
    </html>
  );
}
