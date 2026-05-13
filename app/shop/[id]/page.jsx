'use client';

import { useContext, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductContext } from '@/context/ProductContext';
import { Star, CheckCircle, ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { products, loading } = useContext(ProductContext);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  // The detail page can derive the product directly from the shared product list.
  const product = products.find((item) => item.id.toString() === id);

  const handleCheckout = async () => {
    if (!session) {
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.href));
      return;
    }

    try {
      setCheckoutLoading(true);
      const res = await axios.post(
        'http://localhost:8080/api/stripe/create-checkout-session',
        {
          // The backend checkout contract expects explicit items and quantities.
          items: [{ productId: product.id, quantity: 1 }],
        },
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      // This MVP uses a fake checkout, so we jump straight to the success page.
      if (res.data?.orderId) {
        router.push(`/checkout/success?orderId=${res.data.orderId}`);
        return;
      }

      throw new Error('Missing orderId in checkout response');
    } catch (error) {
      console.error('Checkout error:', error);
      alert("Une erreur est survenue lors de l'initialisation du paiement.");
      setCheckoutLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-light"></div></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center pt-20 text-white">Produit introuvable</div>;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6">
        <Link href="/shop" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-12 uppercase tracking-widest text-xs font-bold">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la boutique
        </Link>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/5] md:aspect-square bg-zinc-950 border border-zinc-800 overflow-hidden relative group">
              <img 
                src={product.imageUrl || 'https://via.placeholder.com/800x800'} 
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-8">
              <span className="text-primary-light uppercase tracking-widest text-sm font-semibold mb-3 block">{product.category}</span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{product.title}</h1>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-900">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 5) ? 'fill-primary-light text-primary-light' : 'text-zinc-700'}`} />
                  ))}
                  <span className="text-white ml-2 font-bold">{product.rating || '5.0'}</span>
                </div>
                <span className="text-zinc-600 text-sm">({product.reviews || 0} avis)</span>
              </div>
              
              <div className="text-4xl font-bold text-white mb-8">{product.price.toFixed(2)} €</div>
            </div>

            <p className="text-zinc-400 text-lg leading-relaxed mb-10">
              {product.description || "Un produit digital exceptionnel conçu pour transformer votre manière de créer et augmenter drastiquement la qualité de vos productions."}
            </p>

            <div className="space-y-4 mb-10">
               <div className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-primary-light mr-3" />
                  <span>Accès instantané après paiement</span>
               </div>
               <div className="flex items-center text-zinc-300">
                  <Download className="w-5 h-5 text-primary-light mr-3" />
                  <span>Téléchargement sécurisé & garanti</span>
               </div>
               <div className="flex items-center text-zinc-300">
                  <Star className="w-5 h-5 text-primary-light mr-3" />
                  <span>Mises à jour gratuites à vie</span>
               </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full bg-white text-black py-5 uppercase font-bold tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 flex justify-center items-center"
            >
              {checkoutLoading ? 'Redirection...' : 'Acheter maintenant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
