import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

export default function ProductCard({ product }) {
  return (
    <div className="group flex flex-col luxury-card stitch-border transition-all duration-300 overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0A0A]">
        {product.imageUrl ? (
          // fill requires parent to be position:relative with explicit dimensions (aspect-ratio provides this)
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
            <span className="text-zinc-700 uppercase tracking-widest text-xs">No image</span>
          </div>
        )}
        <div className="absolute top-4 left-4 bg-[#0A0A0A]/80 backdrop-blur px-3 py-1 text-xs uppercase tracking-widest text-[#00D1FF] stitch-border rounded">
          {product.category}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-display font-bold text-xl text-white mb-2">{product.title}</h3>
        
        <div className="flex items-center gap-2 mb-6">
          <div className="flex text-[#7C3AED]">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-[#A1A1AA] text-sm ml-1 font-medium">{product.rating}</span>
          </div>
          <span className="text-[#A1A1AA] text-sm">({product.reviews} reviews)</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between border-t border-zinc-800/50 pt-6 stitch-border">
          <span className="text-xl font-bold text-white">{product.price.toFixed(2)} €</span>
          <Link 
            href={`/shop/${product.id}`}
            className="text-sm uppercase tracking-widest font-semibold text-[#A1A1AA] hover:text-[#00D1FF] transition-colors glow-text-hover"
          >
            Discover
          </Link>
        </div>
      </div>
    </div>
  );
}
