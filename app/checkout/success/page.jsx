'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { data: session } = useSession();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    if (!orderId || !session) {
      return;
    }

    let isActive = true;

    const run = async () => {
      try {
        // The backend completes fake checkout by order id, not by session token.
        await axios.post(
          `http://localhost:8080/api/stripe/complete-order?orderId=${orderId}`,
          null,
          { headers: { Authorization: `Bearer ${session.accessToken}` } }
        );
        if (isActive) {
          setStatus('success');
        }
      } catch (error) {
        console.error('Failed to complete order:', error);
        if (isActive) {
          setStatus('error');
        }
      }
    };

    run();

    return () => {
      isActive = false;
    };
  }, [orderId, session]);

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 p-12 text-center max-w-lg w-full">
        {status === 'processing' && (
          <div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-light mx-auto mb-8"></div>
            <h1 className="font-display text-2xl font-bold text-white mb-2">Validation de votre paiement...</h1>
            <p className="text-zinc-400">Veuillez patienter quelques instants.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-fade-in">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="font-display text-3xl font-bold text-white mb-4">Paiement Reussi !</h1>
            <p className="text-zinc-400 mb-8 max-w-sm mx-auto">
              Merci pour votre commande. Vous pouvez maintenant acceder a vos produits depuis votre tableau de bord.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
            >
              Aller au Dashboard <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="w-20 h-20 rounded-full border-4 border-red-500 flex items-center justify-center text-red-500 text-4xl mx-auto mb-6 font-bold">!</div>
            <h1 className="font-display text-2xl font-bold text-white mb-4">Erreur de validation</h1>
            <p className="text-zinc-400 mb-8">
              Nous n&apos;avons pas pu valider cette commande automatiquement. Contactez le support si vous avez ete facture.
            </p>
            <Link href="/shop" className="text-primary-light hover:text-white transition-colors underline">
              Retour a la boutique
            </Link>
          </div>
        )}
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
