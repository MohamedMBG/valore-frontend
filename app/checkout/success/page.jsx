'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 p-12 text-center max-w-lg w-full">
        <div className="animate-fade-in">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold text-white mb-4">Paiement Reussi !</h1>
          <p className="text-zinc-400 mb-3 max-w-sm mx-auto">
            Merci pour votre commande. Votre paiement a ete simule avec succes et votre produit est maintenant disponible depuis votre tableau de bord.
          </p>
          {orderId && (
            <p className="text-zinc-500 text-sm uppercase tracking-[0.3em] mb-8">
              Order #{orderId}
            </p>
          )}
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
          >
            Aller au Dashboard <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function CheckoutSuccessFallback() {
  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 p-12 text-center max-w-lg w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-light mx-auto mb-8"></div>
        <h1 className="font-display text-2xl font-bold text-white mb-2">Chargement...</h1>
        <p className="text-zinc-400">Preparation de la confirmation de commande.</p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
