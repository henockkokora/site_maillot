import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import maillotBlanc from './assets/maillot_blanc_brode.jpg';
import maillotOrangeSimple from './assets/maillot_orange_pro_simple.jpg';
import maillotOrangeMax from './assets/maillot_orange_pro_max.jpg';

interface Jersey {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
}

function App() {
  // ...
  const jerseysRef = React.useRef<HTMLDivElement>(null);
  // Compteur animé pour fans satisfaits
  const [fanCount, setFanCount] = useState(0);
  const supportersRef = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Fonction pour lancer le compteur animé
  const startFanCount = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFanCount(0);
    let start = 0;
    const end = 500;
    const duration = 5000;
    const stepTime = Math.max(Math.floor(duration / end), 5);
    let current = start;
    timerRef.current = setInterval(() => {
      current += 5;
      if (current >= end) {
        current = end;
        if (timerRef.current) clearInterval(timerRef.current);
      }
      setFanCount(current);
    }, stepTime);
  };

  // Observer d'intersection pour déclencher le compteur à chaque visibilité
  React.useEffect(() => {
    const ref = supportersRef.current;
    if (!ref) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startFanCount();
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(ref);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJersey, setSelectedJersey] = useState<Jersey | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contact: '',
    quantity: 1,
  });
  // Panier : [{ jersey, quantity }], persistant localStorage
  const [cart, setCart] = useState<{ jersey: Jersey; quantity: number }[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  // Toast de notification
  const [successToast, setSuccessToast] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Gestion erreurs formulaire
  const [formErrors, setFormErrors] = useState<{ name?: string; location?: string; contact?: string }>({});

  // Ajout d’un article au panier
  const addToCart = (jersey: Jersey, quantity: number = 1) => {
    setCart((prev) => {
      const found = prev.find((item) => item.jersey.id === jersey.id);
      if (found) {
        return prev.map((item) =>
          item.jersey.id === jersey.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { jersey, quantity }];
    });
  };

  // Retirer un article du panier
  const removeFromCart = (jerseyId: number) => {
    setCart((prev) => prev.filter((item) => item.jersey.id !== jerseyId));
  };

  // Modifier la quantité d’un article
  const updateCartQuantity = (jerseyId: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.jersey.id === jerseyId ? { ...item, quantity } : item
      )
    );
  };

  // Nombre total d’articles
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Sauvegarde le panier à chaque changement
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);


  const jerseys: Jersey[] = [
    {
      id: 1,
      name: 'Maillot Blanc Brodé',
      image: maillotBlanc,
      price: 7500,
      description: 'Édition spéciale avec broderie premium',
    },
    {
      id: 2,
      name: 'Maillot Orange Pro Simple',
      image: maillotOrangeSimple,
      price: 7500,
      description: 'Version officielle pro pour supporters',
    },
    {
      id: 3,
      name: 'Maillot Orange Pro Max',
      image: maillotOrangeMax,
      price: 7500,
      description: 'Version authentique joueur premium',
    },
  ];

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJersey(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Commande confirmée!\nTotal: ${(selectedJersey!.price * formData.quantity).toLocaleString()} FCFA`);
    handleCloseModal();
  };

  const calculateTotal = () => {
    if (!selectedJersey) return 0;
    return selectedJersey.price * formData.quantity;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>

        <svg className="absolute top-20 right-20 w-32 h-32 text-orange-300 opacity-10" viewBox="0 0 200 200" fill="currentColor">
          <path d="M100,10 L130,80 L200,100 L130,120 L100,190 L70,120 L0,100 L70,80 Z"/>
        </svg>
        <svg className="absolute bottom-32 left-10 w-40 h-40 text-green-300 opacity-10" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
        <svg className="absolute top-1/3 left-1/4 w-48 h-48 text-orange-200 opacity-5" viewBox="0 0 200 200">
          <rect x="20" y="20" width="160" height="160" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(45 100 100)"/>
          <rect x="40" y="40" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(45 100 100)"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 pb-32 relative z-10">
        <header className="text-center mb-20">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600 mb-4 animate-pulse">
            Maillots Officiels
          </h1>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Équipe de Côte d'Ivoire
          </h2>
          <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500 font-semibold mb-6">
            Portez les couleurs des Éléphants
          </p>
          
        </header>

        <div className="grid md:grid-cols-3 gap-8" ref={jerseysRef}>
          {jerseys.map((jersey) => (
             <div
               key={jersey.id}
               className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
             >
               <div className="aspect-square bg-gradient-to-br from-orange-100 to-green-100 p-8 flex items-center justify-center">
                 <img
                   src={jersey.image}
                   alt={jersey.name}
                   className="w-full h-full object-contain"
                 />
               </div>
               <div className="p-6">
                 <h3 className="text-2xl font-bold text-gray-800 mb-2">
                   {jersey.name}
                 </h3>
                 <p className="text-gray-600 mb-4">{jersey.description}</p>
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-3xl font-bold text-orange-600">
                     {jersey.price.toLocaleString()} <span className="text-xl">FCFA</span>
                   </span>
                 </div>
                 <button
                   onClick={() => addToCart(jersey, 1)}
                   className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-green-600 transition-all duration-300 shadow-lg"
                 >
                   Ajouter au panier
                 </button>
               </div>
             </div>
           ))}

          {/* Icône panier flottante */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="fixed top-6 right-6 z-50 bg-white rounded-full shadow-xl p-4 flex items-center justify-center hover:bg-orange-50 transition-all border-2 border-orange-200"
            style={{ minWidth: 56, minHeight: 56 }}
          >
            <ShoppingCart size={28} className="text-orange-600" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-green-500 text-white text-xs font-bold rounded-full px-2 py-0.5 border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Modal panier stylé */}
          {isCartOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl">
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl"
                  title="Fermer le panier"
                >
                  <X size={24} />
                </button>
                <h3 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600">
                  Votre Panier
                </h3>
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500">Votre panier est vide.</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.jersey.id} className="flex items-center gap-4 border-b pb-2">
                        <img src={item.jersey.image} alt={item.jersey.name} className="w-16 h-16 rounded-lg object-contain bg-gray-50 border" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{item.jersey.name}</div>
                          <div className="text-sm text-gray-500">{item.jersey.price.toLocaleString()} FCFA</div>
                          <div className="flex items-center gap-2 mt-1">
                            <label className="text-xs text-gray-600">Quantité</label>
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={e => updateCartQuantity(item.jersey.id, Math.max(1, parseInt(e.target.value)))}
                              className="w-14 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.jersey.id)}
                          className="text-gray-400 hover:text-red-500 ml-2"
                          title="Retirer"
                        >
                          <X size={18} />
                        </button>
                        <div className="font-bold text-orange-600 ml-2 min-w-[60px] text-right">
                          {(item.jersey.price * item.quantity).toLocaleString()} FCFA
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-4 mt-4 border-t">
                      <span className="font-bold text-lg">Total :</span>
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600">
                        {cart.reduce((sum, item) => sum + item.jersey.price * item.quantity, 0).toLocaleString()} FCFA
                      </span>
                    </div>
                    <button
                      className="w-full mt-6 bg-gradient-to-r from-orange-600 to-green-600 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg hover:from-orange-700 hover:to-green-700 transition-all"
                      onClick={() => { setIsCartModalOpen(true); setIsCartOpen(false); }}
                    >
                      Valider la commande
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        <div className="mt-24 mb-12" ref={supportersRef}>
          <div className="bg-gradient-to-r from-orange-500 to-green-500 rounded-3xl p-12 text-center text-white shadow-2xl transition-all">
            <h3 className="text-4xl font-bold mb-4">Rejoignez la famille des supporters</h3>
            <p className="text-xl mb-8 opacity-95">
              Chaque maillot acheté est un acte de soutien envers nos Éléphants.
              Plus de 500 fans nous font déjà confiance!
            </p>
            <div className="flex justify-center gap-8 text-lg font-semibold">
              <div>
                <div className="text-3xl font-bold">{fanCount}+</div>
                <p className="text-sm opacity-90">Fans satisfaits</p>
              </div>
              <div>
                <div className="text-3xl font-bold">100%</div>
                <p className="text-sm opacity-90">Bonne qualité</p>
              </div>
              <div>
                <div className="text-3xl font-bold">24H</div>
                <p className="text-sm opacity-90">Livraison</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-lg">
            <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600 mb-4">
              Pourquoi acheter?
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3"><span className="text-2xl">✨</span> Maillots de bonne qualité</li>
              <li className="flex items-center gap-3"><span className="text-2xl">🎨</span> Designs exclusifs et modernes</li>
              <li className="flex items-center gap-3"><span className="text-2xl">💪</span> Matière confortable et durable</li>
              <li className="flex items-center gap-3"><span className="text-2xl">🚀</span> Livraison ultra-rapide</li>
            </ul>
          </div>
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-lg">
            <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600 mb-4">
              Avis de nos clients
            </h4>
            <div className="space-y-4">
              <div className="bg-white/50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">"Magnifique qualité! J'adore mon maillot!"</p>
                <p className="text-xs text-gray-500 mt-2">- Koffi, Abidjan</p>
              </div>
              <div className="bg-white/50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">"Livraison super rapide, bravo!"</p>
                <p className="text-xs text-gray-500 mt-2">- Awa, Yamoussoukro</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isCartOpen && (
  <button
    onClick={() => {
      if (jerseysRef.current) {
        jerseysRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }}
    className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-green-600 text-white py-6 px-8 font-bold text-xl shadow-2xl hover:from-orange-700 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-3 z-40"
  >
    <ShoppingCart size={28} />
    Commandez Maintenant
  </button>
)}

      {/* Toast notification moderne */}
      {successToast && (
        <div className="fixed top-8 right-8 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl bg-gradient-to-r from-green-400 to-green-600 text-white text-lg font-semibold animate-slide-in">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Commande confirmée avec succès !
        </div>
      )}
      {isCartModalOpen && cart.length > 0 && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full flex flex-col relative" style={{ maxHeight: '90vh' }}>
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white/90 rounded-t-2xl flex justify-end p-4 border-b border-white/40">
        <button
          onClick={() => setIsCartModalOpen(false)}
          className="text-gray-600 hover:text-red-500 text-2xl"
          title="Fermer le récapitulatif"
        >
          <X size={24} />
        </button>
      </div>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <h3 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600">Récapitulatif de la commande</h3>
        <div className="space-y-4 mb-6">
          {cart.map((item) => (
            <div key={item.jersey.id} className="flex items-center gap-4 border-b pb-2">
              <img src={item.jersey.image} alt={item.jersey.name} className="w-14 h-14 rounded-lg object-contain bg-gray-50 border" />
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{item.jersey.name}</div>
                <div className="text-xs text-gray-500">{item.jersey.price.toLocaleString()} FCFA</div>
                <div className="text-xs text-gray-600">Quantité : {item.quantity}</div>
              </div>
              <div className="font-bold text-orange-600 min-w-[60px] text-right">
                {(item.jersey.price * item.quantity).toLocaleString()} FCFA
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center font-bold text-lg mb-4">
          <span>Total :</span>
          <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600">
            {cart.reduce((sum, item) => sum + item.jersey.price * item.quantity, 0).toLocaleString()} FCFA
          </span>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            const errors: { name?: string; location?: string; contact?: string } = {};
            if (!formData.name.trim()) errors.name = 'Veuillez renseigner votre nom complet.';
            if (!formData.location.trim()) errors.location = 'Veuillez renseigner le lieu de livraison.';
            if (!formData.contact.trim()) {
              errors.contact = 'Veuillez renseigner un contact.';
            } else if (!/^[0-9]{10}$/.test(formData.contact.trim())) {
              errors.contact = 'Le numéro doit contenir exactement 10 chiffres.';
            }
            setFormErrors(errors);
            if (Object.keys(errors).length > 0) return;
            // Envoi au backend
            const commande = {
              name: formData.name.trim(),
              location: formData.location.trim(),
              contact: formData.contact.trim(),
              cart: cart.map(item => ({
                jersey: { name: item.jersey.name, price: item.jersey.price },
                quantity: item.quantity
              })),
              date: new Date().toISOString()
            };
            fetch('https://site-maillot-backedn.onrender.com/commandes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(commande),
            })
              .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
              })
              .then(() => {
                setIsCartModalOpen(false);
                setCart([]);
                setSuccessToast(true);
                if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
                toastTimeoutRef.current = setTimeout(() => setSuccessToast(false), 3000);
              })
              .catch(() => {
                alert("Erreur lors de l'envoi de la commande. Veuillez réessayer.");
              });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-800 font-semibold mb-2">Nom complet</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => {
                setFormData({ ...formData, name: e.target.value });
                if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
              }}
              className={`w-full px-4 py-3 rounded-xl bg-white/80 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 ${formErrors.name ? 'focus:ring-red-400' : 'focus:ring-orange-500'} text-gray-900`}
              placeholder="Votre nom"
            />
            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
          </div>
          <div>
            <label className="block text-gray-800 font-semibold mb-2">Lieu de livraison</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={e => {
                setFormData({ ...formData, location: e.target.value });
                if (formErrors.location) setFormErrors({ ...formErrors, location: undefined });
              }}
              className={`w-full px-4 py-3 rounded-xl bg-white/80 border ${formErrors.location ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 ${formErrors.location ? 'focus:ring-red-400' : 'focus:ring-orange-500'} text-gray-900`}
              placeholder="Adresse de livraison"
            />
            {formErrors.location && <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>}
          </div>
          <div>
            <label className="block text-gray-800 font-semibold mb-2">Contact</label>
            <input
              type="number"
              required
              inputMode="numeric"
              pattern="[0-9]{10}"
              minLength={10}
              maxLength={10}
              value={formData.contact}
              onChange={e => {
                // Empêche d'entrer plus de 10 chiffres
                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                setFormData({ ...formData, contact: value });
                if (formErrors.contact) setFormErrors({ ...formErrors, contact: undefined });
              }}
              className={`w-full px-4 py-3 rounded-xl bg-white/80 border ${formErrors.contact ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 ${formErrors.contact ? 'focus:ring-red-400' : 'focus:ring-orange-500'} text-gray-900`}
              placeholder="Numéro de téléphone (10 chiffres)"
            />
            {formErrors.contact && <p className="text-red-500 text-sm mt-1">{formErrors.contact}</p>}
          </div>
        </form>
      </div>
      {/* Sticky footer */}
      <div className="sticky bottom-0 z-20 bg-white/90 rounded-b-2xl p-4 border-t border-white/40">
        <button
          type="submit"
          form=""
          className="w-full bg-gradient-to-r from-orange-600 to-green-600 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg hover:from-orange-700 hover:to-green-700 transition-all"
          onClick={() => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
        >
          Confirmer la commande
        </button>
      </div>
    </div>
  </div>
)}

      {isModalOpen && selectedJersey && (
        <>
          {/* Animation CSS pour le modal */}
          <style>{`
            @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes modal-pop {
              from { transform: scale(0.95) translateY(40px); opacity: 0; }
              to { transform: scale(1) translateY(0); opacity: 1; }
            }
            .animate-fade-in { animation: fade-in 0.3s ease; }
            .animate-modal-pop { animation: modal-pop 0.3s cubic-bezier(0.4,0,0.2,1); }
          `}</style>

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl transition-opacity animate-fade-in">
            <div className="relative bg-white/90 rounded-3xl shadow-3xl max-w-md w-full p-6 border border-white/40 transition-transform animate-modal-pop overflow-y-auto" style={{ maxHeight: '90vh' }}>
              <button
                onClick={handleCloseModal}
                className="absolute z-50 top-2 right-2 text-gray-500 hover:text-red-500 transition-colors text-3xl bg-white/80 rounded-full p-1 shadow"
                title="Fermer"
              >
                <X size={32} />
              </button>

              <div className="flex flex-col items-center mb-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-green-100 mb-1 shadow-lg">
                  <ShoppingCart size={24} className="text-orange-600" />
                </span>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600 mb-1">
                  Passer Commande
                </h2>
              </div>

              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-200 shadow-md mb-2 bg-white">
                  <img src={selectedJersey.image} alt={selectedJersey.name} className="w-full h-full object-contain" />
                </div>
                <p className="font-bold text-base text-gray-800 mb-1">{selectedJersey.name}</p>
                <p className="text-orange-600 font-bold text-lg mb-1">{selectedJersey.price.toLocaleString()} FCFA</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2 text-base">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 text-base"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-gray-800 font-semibold mb-2 text-base">
                    Lieu de livraison
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 text-base"
                    placeholder="Adresse de livraison"
                  />
                </div>
                <div>
                  <label className="block text-gray-800 font-semibold mb-2 text-base">
                    Contact
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 text-base"
                    placeholder="Numéro de téléphone"
                  />
                </div>
                <div>
                  <label className="block text-gray-800 font-semibold mb-2 text-base">
                    Quantité
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    className="w-full px-5 py-3 rounded-xl bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 text-base"
                  />
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-semibold text-gray-800">Total:</span>
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600">
                      {calculateTotal().toLocaleString()} FCFA
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:from-orange-700 hover:to-green-700 transition-all duration-300"
                  >
                    Confirmer la commande
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
