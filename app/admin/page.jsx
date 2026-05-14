'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, PackageSearch, Tag, Plus, Pencil, Trash2, BarChart3, Users, ShoppingCart } from 'lucide-react';
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminOrders,
  getAdminProducts,
  getAdminStats,
  updateAdminProduct,
} from '@/services/api';

const emptyProductForm = {
  title: '',
  description: '',
  price: '',
  category: '',
  imageUrl: '',
  rating: '',
  reviews: '',
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [pageLoading, setPageLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState(emptyProductForm);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session && session.user.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!session?.accessToken || session.user.role !== 'ADMIN') {
      return;
    }

    let isActive = true;

    const loadAdminData = async () => {
      try {
        setPageLoading(true);
        setError('');

        // Keep the admin dashboard simple: load stats, orders, and the current product list together.
        const [statsData, ordersData, productsData] = await Promise.all([
          getAdminStats(session.accessToken),
          getAdminOrders(session.accessToken),
          getAdminProducts(),
        ]);

        if (!isActive) {
          return;
        }

        setStats(statsData);
        setOrders(ordersData);
        setProducts(productsData);
      } catch (loadError) {
        if (isActive) {
          setError('Impossible de charger le dashboard admin pour le moment.');
        }
      } finally {
        if (isActive) {
          setPageLoading(false);
        }
      }
    };

    loadAdminData();

    return () => {
      isActive = false;
    };
  }, [session]);

  const resetProductForm = () => {
    setProductForm(emptyProductForm);
    setEditingProductId(null);
    setShowProductForm(false);
  };

  const openNewProductForm = () => {
    setSuccessMessage('');
    setError('');
    setProductForm(emptyProductForm);
    setEditingProductId(null);
    setShowProductForm(true);
  };

  const openEditProductForm = (product) => {
    setSuccessMessage('');
    setError('');
    setProductForm({
      title: product.title || '',
      description: product.description || '',
      price: product.price ?? '',
      category: product.category || '',
      imageUrl: product.imageUrl || '',
      rating: product.rating ?? '',
      reviews: product.reviews || '',
    });
    setEditingProductId(product.id);
    setShowProductForm(true);
  };

  const handleProductChange = (field, value) => {
    setProductForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const buildProductPayload = () => ({
    title: productForm.title.trim(),
    description: productForm.description.trim(),
    price: Number(productForm.price),
    category: productForm.category.trim(),
    imageUrl: productForm.imageUrl.trim() || null,
    rating: productForm.rating === '' ? null : Number(productForm.rating),
    reviews: productForm.reviews.trim() || null,
  });

  const handleProductSubmit = async (event) => {
    event.preventDefault();

    if (!session?.accessToken) {
      return;
    }

    try {
      setSavingProduct(true);
      setError('');
      setSuccessMessage('');

      const payload = buildProductPayload();
      let savedProduct;

      // One shared form handles both create and update to keep the admin page simple.
      if (editingProductId) {
        savedProduct = await updateAdminProduct(session.accessToken, editingProductId, payload);
        setProducts((current) => current.map((product) => (
          product.id === editingProductId ? savedProduct : product
        )));
        setSuccessMessage('Produit mis a jour.');
      } else {
        savedProduct = await createAdminProduct(session.accessToken, payload);
        setProducts((current) => [savedProduct, ...current]);
        setSuccessMessage('Produit cree.');
      }

      resetProductForm();
    } catch (submitError) {
      setError('La sauvegarde du produit a echoue. Verifiez les champs puis reessayez.');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!session?.accessToken || !confirm('Supprimer ce produit du catalogue ?')) {
      return;
    }

    try {
      setError('');
      setSuccessMessage('');
      await deleteAdminProduct(session.accessToken, productId);
      setProducts((current) => current.filter((product) => product.id !== productId));
      setSuccessMessage('Produit supprime.');
      if (editingProductId === productId) {
        resetProductForm();
      }
    } catch (deleteError) {
      setError('La suppression du produit a echoue.');
    }
  };

  if (status === 'loading' || pageLoading || (session && session.user.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-light"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN' || !stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Clients inscrits',
      value: stats.userCount,
      icon: Users,
      subtitle: 'Comptes utilisateurs crees',
    },
    {
      title: 'Commandes',
      value: stats.orderCount,
      icon: ShoppingCart,
      subtitle: 'Commandes totales en base',
    },
    {
      title: 'Produits actifs',
      value: stats.productCount,
      icon: PackageSearch,
      subtitle: 'Produits visibles sur le site',
    },
    {
      title: 'Revenu total',
      value: `${stats.totalRevenue} EUR`,
      icon: BarChart3,
      subtitle: 'Commandes completees seulement',
    },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen flex container mx-auto px-6 gap-8 flex-col lg:flex-row">
      <div className="w-full lg:w-64 shrink-0">
        <div className="bg-zinc-900 border border-zinc-800 p-6 sticky top-32">
          <div className="mb-8">
            <span className="bg-primary-light/20 text-primary-light uppercase tracking-widest text-[10px] font-bold px-2 py-1 mb-2 inline-block">Mode Admin</span>
            <h2 className="font-display text-xl font-bold text-white">Veloir Business</h2>
            <p className="text-sm text-zinc-500 mt-2">Pilotage simple du catalogue et des chiffres disponibles.</p>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Vue business' },
              { id: 'products', icon: PackageSearch, label: 'Produits' },
              { id: 'promo', icon: Tag, label: 'Visiteurs / promo' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-zinc-800 text-white border-l-2 border-primary-light'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 border-l-2 border-transparent'
                }`}
              >
                <item.icon className="w-4 h-4 mr-3" /> {item.label}
              </button>
            ))}
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

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="font-display text-3xl font-bold text-white mb-8 border-b border-zinc-900 pb-4">Tableau de bord business</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {statCards.map((stat) => (
                <div key={stat.title} className="bg-zinc-900 border border-zinc-800 p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">{stat.title}</p>
                      <span className="text-2xl font-bold text-white font-display">{stat.value}</span>
                    </div>
                    <stat.icon className="w-5 h-5 text-primary-light" />
                  </div>
                  <p className="text-sm text-zinc-500">{stat.subtitle}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 p-8">
                <h2 className="font-display text-xl text-white mb-4">Catalogue</h2>
                <p className="text-zinc-400 mb-4">
                  Le site affiche actuellement <span className="text-white font-semibold">{products.length}</span> produits. Le catalogue peut etre gere directement depuis l&apos;onglet produits.
                </p>
                <button
                  onClick={() => setActiveTab('products')}
                  className="inline-flex items-center px-4 py-3 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                >
                  Gerer les produits
                </button>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-8">
                <h2 className="font-display text-xl text-white mb-4">Visiteurs</h2>
                <p className="text-zinc-400 mb-4">
                  Aucune collecte de visiteurs n&apos;existe encore dans le backend. Le dashboard affiche donc les chiffres business reels disponibles sans inventer de trafic.
                </p>
                <p className="text-sm text-zinc-500">
                  Pour suivre les visiteurs, il faudra ajouter une source d&apos;analytics ou des evenements de navigation.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-800">
                <h2 className="font-display text-xl text-white">Achats recents</h2>
                <p className="text-sm text-zinc-500 mt-2">
                  Cette table confirme les achats enregistres avec client, statut, total et produits.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-widest text-xs">
                    <tr>
                      <th className="p-4 font-medium">Commande</th>
                      <th className="p-4 font-medium">Client</th>
                      <th className="p-4 font-medium">Statut</th>
                      <th className="p-4 font-medium">Produits</th>
                      <th className="p-4 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-300 divide-y divide-zinc-800">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="p-4">
                          <p className="font-medium text-white">#{order.id}</p>
                          <p className="text-zinc-500 text-xs mt-1">
                            {new Date(order.createdAt).toLocaleString('fr-FR')}
                          </p>
                        </td>
                        <td className="p-4">{order.customerEmail}</td>
                        <td className="p-4">
                          <span className={`text-xs font-bold uppercase tracking-widest ${
                            order.status === 'COMPLETED'
                              ? 'text-green-400'
                              : order.status === 'PENDING'
                                ? 'text-yellow-400'
                                : 'text-red-400'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            {order.items.map((item) => (
                              <p key={`${order.id}-${item.productId}`} className="text-zinc-400 text-xs">
                                {item.productTitle} x{item.quantity}
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-white font-medium">{order.totalAmount} EUR</td>
                      </tr>
                    ))}

                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-zinc-500">
                          Aucune commande enregistree pour le moment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-zinc-900 pb-4">
              <div>
                <h1 className="font-display text-3xl font-bold text-white">Gestion des Produits</h1>
                <p className="text-zinc-500 mt-2">Ajoutez, modifiez et supprimez les produits visibles sur le site.</p>
              </div>
              <button
                onClick={openNewProductForm}
                className="flex items-center px-4 py-3 bg-primary-light text-white text-sm font-bold uppercase tracking-widest hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" /> Nouveau produit
              </button>
            </div>

            {showProductForm && (
              <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8">
                <h2 className="font-display text-2xl text-white mb-6">
                  {editingProductId ? 'Modifier le produit' : 'Ajouter un produit'}
                </h2>

                <form onSubmit={handleProductSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Titre</label>
                      <input
                        type="text"
                        required
                        value={productForm.title}
                        onChange={(event) => handleProductChange('title', event.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 focus:outline-none focus:border-primary-light"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Categorie</label>
                      <input
                        type="text"
                        required
                        value={productForm.category}
                        onChange={(event) => handleProductChange('category', event.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 focus:outline-none focus:border-primary-light"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Prix</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={productForm.price}
                        onChange={(event) => handleProductChange('price', event.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 focus:outline-none focus:border-primary-light"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Rating</label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={productForm.rating}
                        onChange={(event) => handleProductChange('rating', event.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 focus:outline-none focus:border-primary-light"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Reviews</label>
                      <input
                        type="text"
                        value={productForm.reviews}
                        onChange={(event) => handleProductChange('reviews', event.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 focus:outline-none focus:border-primary-light"
                        placeholder="120 avis"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Image URL</label>
                    <input
                      type="text"
                      value={productForm.imageUrl}
                      onChange={(event) => handleProductChange('imageUrl', event.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 focus:outline-none focus:border-primary-light"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Description</label>
                    <textarea
                      required
                      rows="5"
                      value={productForm.description}
                      onChange={(event) => handleProductChange('description', event.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 focus:outline-none focus:border-primary-light"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      type="submit"
                      disabled={savingProduct}
                      className="bg-white text-black px-8 py-4 uppercase text-xs font-bold tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    >
                      {savingProduct ? 'Enregistrement...' : editingProductId ? 'Mettre a jour' : 'Publier'}
                    </button>
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className="border border-zinc-700 text-white px-8 py-4 uppercase text-xs font-bold tracking-widest hover:bg-zinc-800 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-widest text-xs">
                  <tr>
                    <th className="p-4 font-medium">Produit</th>
                    <th className="p-4 font-medium">Categorie</th>
                    <th className="p-4 font-medium">Prix</th>
                    <th className="p-4 font-medium">Rating</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300 divide-y divide-zinc-800">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="p-4">
                        <p className="font-medium text-white">{product.title}</p>
                        <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{product.description}</p>
                      </td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">{product.price} EUR</td>
                      <td className="p-4">{product.rating ?? '-'}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => openEditProductForm(product)}
                            className="inline-flex items-center text-primary-light hover:text-white transition-colors"
                          >
                            <Pencil className="w-4 h-4 mr-1" /> Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="inline-flex items-center text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {products.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-zinc-500">
                        Aucun produit disponible.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'promo' && (
          <div className="animate-fade-in space-y-6">
            <h1 className="font-display text-3xl font-bold text-white border-b border-zinc-900 pb-4">Visiteurs / promo</h1>
            <div className="bg-zinc-900 border border-zinc-800 p-8">
              <h2 className="font-display text-xl text-white mb-4">Etat actuel</h2>
              <p className="text-zinc-400 mb-4">
                Le projet ne stocke ni visites, ni sources de trafic, ni codes promo en backend. Cette zone reste volontairement sobre pour ne pas afficher de faux indicateurs business.
              </p>
              <p className="text-zinc-500 text-sm">
                Si vous voulez aller plus loin, la prochaine etape sera d&apos;ajouter une source d&apos;analytics ou une table de campagnes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
