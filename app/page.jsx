import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Video, Download } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import CinematicDivider from '@/components/CinematicDivider';
import ShowcaseSection from '@/components/ShowcaseSection';
import NewsletterForm from '@/components/NewsletterForm';

// Dummy data for products featured
const featuredProducts = [
  { id: 1, title: 'The Ultimate Creator Guide', price: 29.99, category: 'Guide PDF', imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80', rating: 5, reviews: 120 },
  { id: 2, title: 'Cinematic LUTs Pack', price: 49.99, category: 'Templates', imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80', rating: 4.8, reviews: 85 },
  { id: 3, title: 'TikTok Virality Masterclass', price: 99.99, category: 'Mini-Course', imageUrl: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=800&q=80', rating: 4.9, reviews: 200 }
];

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-[#0A0A0A]">
      {/* HERO SECTION */}
      <section className="relative h-screen flex glow-line-bottom overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0A0A0A]/80 md:bg-[#0A0A0A]/70 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=1600&q=80"
            alt="Creative Studio"
            fill
            priority
            sizes="100vw"
            className="object-cover grayscale opacity-30"
          />
        </div>
        
        <div className="container relative z-10 mx-auto px-6 flex flex-col justify-center items-center text-center animate-fade-in">
          <span className="text-[#00D1FF] uppercase tracking-[0.3em] text-sm mb-6 font-semibold">@drogow Presents</span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8">
            <span className="animate-shimmer">HYBRID VISION.</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#00D1FF]">
              CREATE INFINITY.
            </span>
          </h1>
          <p className="text-[#A1A1AA] max-w-2xl text-lg md:text-xl mb-12 font-light">
            The perfect alliance between premium digital resources for creators
            and a complete creative studio to propel your video projects.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/shop" className="group px-8 py-4 luxury-btn font-semibold uppercase tracking-widest">
              View Products
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/studio" className="group px-8 py-4 luxury-btn font-semibold uppercase tracking-widest">
              Discover the Studio
              <Video className="ml-3 w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* OVERRIDE CINEMATIC DIVIDER FOR THEME */}
      <div className="glow-line-bottom w-full"></div>

      {/* ABOUT SECTION */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative stitch-border luxury-card p-2 md:p-4">
            <div className="aspect-[4/5] bg-black overflow-hidden relative rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1552168324-d612d77725e3?w=800&q=80"
                alt="Creator @drogow"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover hover:brightness-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-[#0A0A0A] border border-[#7C3AED]/30 shadow-[0_0_15px_rgba(124,58,237,0.2)] p-8 hidden md:block rounded-xl stitch-border">
              <p className="font-display text-4xl font-bold text-white mb-2">1.5M+</p>
              <p className="text-[#00D1FF] uppercase tracking-widest text-xs">TikTok Followers</p>
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">Who am I?</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-[#7C3AED] to-[#00D1FF] mb-8 rounded" />
            <p className="text-[#A1A1AA] text-lg leading-relaxed mb-6">
              I am <strong className="text-white glow-text-hover">@drogow</strong>, passionate content creator and videographer. 
              Millions of views on TikTok taught me one thing: attention is the new gold.
            </p>
            <p className="text-[#A1A1AA] text-lg leading-relaxed mb-8">
              I founded Veloir to share my secrets through exclusive guides, and put my skills in 
              filming and editing at your disposal. Whether you want to learn or delegate, you are in the right place.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="border-l border-[#7C3AED]/30 pl-4 stitch-border border-y-0 border-r-0">
                <Download className="text-[#00D1FF] w-8 h-8 mb-4 glow-text-hover" />
                <h3 className="text-white font-bold mb-2">Premium Resources</h3>
                <p className="text-zinc-500 text-sm">Guides, templates, and courses to skyrocket your stats.</p>
              </div>
              <div className="border-l border-[#7C3AED]/30 pl-4 stitch-border border-y-0 border-r-0">
                <Video className="text-[#00D1FF] w-8 h-8 mb-4 glow-text-hover" />
                <h3 className="text-white font-bold mb-2">Creative Studio</h3>
                <p className="text-zinc-500 text-sm">Dynamic editing and professional filming.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="glow-line-bottom w-full"></div>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 bg-[#0A0A0A] relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">Featured Products</h2>
              <p className="text-[#A1A1AA] max-w-xl">The best of my digital resources to save you years of learning.</p>
            </div>
            <Link href="/shop" className="text-[#00D1FF] hover:text-white transition-colors uppercase tracking-widest text-sm font-semibold flex items-center mt-6 md:mt-0 glow-text-hover">
              See All <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <div className="glow-line-bottom w-full"></div>

      {/* SHOWCASE SECTION */}
      <ShowcaseSection />

      <div className="glow-line-bottom w-full"></div>

      {/* TIKTOK REVIEWS / EMBEDS SECTION */}
      <section className="py-24 bg-[#0A0A0A] overflow-hidden">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-center text-3xl md:text-5xl font-bold text-white mb-16">They talk about Veloir</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="luxury-card stitch-border p-8 transition-colors">
                <div className="flex text-[#7C3AED] mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-[#A1A1AA] italic mb-6">"The Ultimate Guide completely changed how I script my videos. +50k followers in 2 months, incredible!"</p>
                <div className="flex items-center gap-4 border-t border-[#7C3AED]/20 pt-4">
                  <div className="w-10 h-10 bg-black border border-[#00D1FF]/40 rounded-full glow-text-hover" />
                  <div>
                    <h4 className="text-white font-bold text-sm">Alex M.</h4>
                    <p className="text-[#00D1FF] text-xs">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="glow-line-bottom w-full"></div>

      {/* NEWSLETTER */}
      <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000')] bg-cover opacity-10 mix-blend-overlay" />
        <div className="container mx-auto px-6 relative z-10 max-w-3xl text-center luxury-card stitch-border p-12">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">Join the Elite.</h2>
          <p className="text-[#A1A1AA] mb-10 text-lg">
            Subscribe to the newsletter to receive exclusive tips on content creation, Veloir offers, and secret coupons.
          </p>
          <NewsletterForm />
        </div>
      </section>

    </div>
  );
}
