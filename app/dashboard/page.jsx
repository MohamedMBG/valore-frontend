'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Package, Settings } from 'lucide-react';
import { getMyOrders, getMyProfile, updateMyProfile } from '@/services/api';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ firstname: '', lastname: '' });
  const [pageLoading, setPageLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (!session?.accessToken) {
      return;
    }

    let isActive = true;

    const loadDashboardData = async () => {
      try {
        setPageLoading(true);
        setOrdersLoading(true);
        setError('');
        setOrdersError('');

        // Profile and orders are loaded separately so one failing request does not blank the whole dashboard.
        const profileData = await getMyProfile(session.accessToken);

        if (!isActive) {
          return;
        }

        setProfile(profileData);
        setFormData({
          firstname: profileData.firstname || '',
          lastname: profileData.lastname || '',
        });

        try {
          const ordersData = await getMyOrders(session.accessToken);

          if (!isActive) {
            return;
          }

          setOrders(ordersData);
        } catch (ordersLoadError) {
          if (isActive) {
            setOrders([]);
            setOrdersError('Les commandes ne peuvent pas etre chargees pour le moment.');
          }
        } finally {
          if (isActive) {
            setOrdersLoading(false);
          }
        }
      } catch (loadError) {
        if (isActive) {
          setError('Impossible de charger le dashboard pour le moment.');
        }
      } finally {
        if (isActive) {
          setPageLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isActive = false;
    };
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.accessToken) {
      return;
    }

    try {
      setSaveLoading(true);
      setError('');
      setSuccessMessage('');

      // The backend only allows first name and last name updates.
      const updatedProfile = await updateMyProfile(session.accessToken, formData);
      setProfile(updatedProfile);
      setFormData({
        firstname: updatedProfile.firstname || '',
        lastname: updatedProfile.lastname || '',
      });
      setSuccessMessage('Profil mis a jour.');
    } catch (saveError) {
      setError('La mise a jour du profil a echoue.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (status === 'loading' || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-light"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="pt-32 pb-24 min-h-screen flex container mx-auto px-6 gap-12 flex-col md:flex-row">
      <div className="w-full md:w-64 shrink-0">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 sticky top-32">
          <div className="mb-8">
            <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Connecte en tant que</p>
            <h2 className="font-display text-xl font-bold text-white">{profile.firstname} {profile.lastname}</h2>
            <p className="text-sm text-zinc-500 mt-1">{profile.email}</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-primary-light/10 text-primary-light border-l-2 border-primary-light' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 border-l-2 border-transparent'}`}
            >
              <Package className="w-4 h-4 mr-3" /> Mes Achats
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-primary-light/10 text-primary-light border-l-2 border-primary-light' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 border-l-2 border-transparent'}`}
            >
              <Settings className="w-4 h-4 mr-3" /> Parametres
            </button>
          </nav>
        </div>
      </div>

      <div className="flex-grow">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-500/10 border border-green-500/40 text-green-400 px-4 py-3 text-sm">
            {successMessage}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-8 border-b border-zinc-900 pb-4">Mes Achats</h1>

            {ordersError && (
              <div className="mb-6 bg-amber-500/10 border border-amber-500/40 text-amber-300 px-4 py-3 text-sm">
                {ordersError}
              </div>
            )}

            {ordersLoading ? (
              <div className="bg-zinc-900/50 border border-zinc-800 p-8 text-zinc-500">
                Chargement des commandes...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-zinc-900/50 border border-zinc-800 p-8 text-zinc-500">
                Aucune commande pour le moment.
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-zinc-900/50 border border-zinc-800 p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800 pb-4 mb-4">
                      <div>
                        <span className="text-xs text-zinc-500 uppercase tracking-widest">Commande #{order.id}</span>
                        <p className="text-sm text-zinc-400 mt-2">Statut: {order.status}</p>
                      </div>
                      <p className="text-white font-bold text-lg">{order.totalAmount} EUR</p>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={`${order.id}-${item.productId}`} className="flex items-center justify-between gap-4 text-sm">
                          <div>
                            <p className="text-white font-medium">{item.productTitle}</p>
                            <p className="text-zinc-500">Quantite: {item.quantity}</p>
                          </div>
                          <p className="text-zinc-300">{item.priceAtPurchase} EUR</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-8 border-b border-zinc-900 pb-4">Parametres du profil</h1>
            <div className="max-w-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Email</label>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-500 p-4 cursor-not-allowed"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Prenom</label>
                    <input
                      type="text"
                      value={formData.firstname}
                      onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 focus:outline-none focus:border-primary-light"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Nom</label>
                    <input
                      type="text"
                      value={formData.lastname}
                      onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 focus:outline-none focus:border-primary-light"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="border border-zinc-700 text-white px-8 py-3 uppercase text-xs font-bold tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {saveLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
