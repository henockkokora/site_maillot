import { useEffect, useState } from 'react';

interface Commande {
  _id: string;
  name: string;
  location: string;
  contact: string;
  cart: Array<{ jersey: { name: string; price: number }; quantity: number }>;
  date: string;
  livree?: boolean;
}

const AdminDashboard = () => {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [showLogoutNotif, setShowLogoutNotif] = useState(false);
  const [search, setSearch] = useState('');
  const [notif, setNotif] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'livree' | 'nonlivree'>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch('http://localhost:4000/commandes', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) {
          setNotif({ message: 'Session expirée ou accès refusé. Veuillez vous reconnecter.', type: 'error' });
          return [];
        }
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setCommandes)
      .catch(() => {
        setNotif({ message: "Erreur lors de la récupération des commandes.", type: 'error' });
      });
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (notif) {
      const t = setTimeout(() => setNotif(null), 3200);
      return () => clearTimeout(t);
    }
  }, [notif]);

  const handleLogout = () => {
    setShowLogoutNotif(true);
    setTimeout(() => {
      setShowLogoutNotif(false);
      localStorage.removeItem('adminToken');
      localStorage.setItem('adminConnected', 'false');
      window.location.href = '/admin';
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100/80 to-green-100/80 p-4 md:p-10 font-sans relative">
      {/* Bouton déconnexion */}
      <button
        onClick={handleLogout}
        className="fixed sm:absolute top-2 sm:top-6 left-2 sm:left-6 z-30 flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl shadow-lg font-semibold hover:from-red-600 hover:to-red-700 hover:scale-105 transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-red-200 text-xs sm:text-base"
        title="Déconnexion"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12h-9m9 0l-3-3m3 3l-3 3" /></svg>
        Déconnexion
      </button>
      {/* Notification déconnexion */}
      {showLogoutNotif && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-green-500/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-fade-in-up text-sm sm:text-base">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          Déconnexion réussie
        </div>
      )}
      <div className="w-full max-w-3xl mx-auto px-1 sm:px-0 mt-10 sm:mt-0">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-center bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
          Commandes reçues
        </h1>
        {/* Filtres statut + Barre de recherche */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-8 gap-2 sm:gap-4">
          <div className="flex gap-2 justify-center">
            <button onClick={() => setStatusFilter('all')} className={`px-3 py-1 rounded-full text-xs font-bold shadow ${statusFilter==='all' ? 'bg-orange-500 text-white' : 'bg-white border border-orange-300 text-orange-600'}`}>Toutes</button>
            <button onClick={() => setStatusFilter('nonlivree')} className={`px-3 py-1 rounded-full text-xs font-bold shadow ${statusFilter==='nonlivree' ? 'bg-yellow-400 text-white' : 'bg-white border border-yellow-300 text-yellow-700'}`}>Non livrées</button>
            <button onClick={() => setStatusFilter('livree')} className={`px-3 py-1 rounded-full text-xs font-bold shadow ${statusFilter==='livree' ? 'bg-green-500 text-white' : 'bg-white border border-green-300 text-green-700'}`}>Livrées</button>
          </div>
          <div className="relative w-full max-w-xs xs:max-w-sm sm:max-w-md mx-auto sm:mx-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 sm:py-3 rounded-xl border border-orange-200 bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900 placeholder-gray-400 text-sm sm:text-base transition-all"
              placeholder="Rechercher par nom, contact, lieu ou article..."
            />
          </div>
        </div>
        {commandes.length === 0 ? (
          <div className="text-gray-400 text-center text-lg bg-white/60 rounded-2xl py-10 shadow-inner backdrop-blur-lg">
            Aucune commande reçue pour le moment.
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-8">
            {commandes
              .filter(cmd => {
                // Filtrage par statut
                if (statusFilter === 'livree' && !cmd.livree) return false;
                if (statusFilter === 'nonlivree' && cmd.livree) return false;
                // Filtrage texte
                const q = search.toLowerCase();
                return (
                  cmd.name.toLowerCase().includes(q) ||
                  cmd.contact.toLowerCase().includes(q) ||
                  cmd.location.toLowerCase().includes(q) ||
                  cmd.cart.some(item => item.jersey.name.toLowerCase().includes(q))
                );
              })
              .map((cmd, idx) => (
                <div
                  key={cmd._id || idx}
                  className="relative group bg-white/70 backdrop-blur-lg border border-white/40 shadow-xl sm:shadow-2xl rounded-2xl sm:rounded-3xl px-2 py-3 xs:px-4 xs:py-4 sm:px-8 sm:py-7 transition-all duration-200 hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-orange-200"
                  style={{ boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.10)' }}
                >
                  {/* Boutons actions admin */}
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    {cmd.livree ? (
                      <button
                        className="px-2 py-1 rounded-lg text-xs font-bold shadow bg-yellow-400 hover:bg-yellow-500 text-white transition-all duration-150"
                        onClick={async () => {
                          const token = localStorage.getItem('adminToken');
                          try {
                            const res = await fetch(`http://localhost:4000/commandes/${cmd._id}/nonlivrer`, {
                              method: 'PATCH',
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            if (!res.ok) throw new Error();
                            setNotif({ message: 'Commande repassée à non livrée.', type: 'success' });
                            setCommandes(prev => prev.map(c => c._id === cmd._id ? { ...c, livree: false } : c));
                          } catch {
                            setNotif({ message: 'Erreur lors de la mise à jour.', type: 'error' });
                          }
                        }}
                      >
                        Non livrée
                      </button>
                    ) : (
                      <button
                        className="px-2 py-1 rounded-lg text-xs font-bold shadow bg-green-500 hover:bg-green-600 text-white transition-all duration-150"
                        onClick={async () => {
                          const token = localStorage.getItem('adminToken');
                          try {
                            const res = await fetch(`http://localhost:4000/commandes/${cmd._id}/livrer`, {
                              method: 'PATCH',
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            if (!res.ok) throw new Error();
                            setNotif({ message: 'Commande marquée comme livrée.', type: 'success' });
                            setCommandes(prev => prev.map(c => c._id === cmd._id ? { ...c, livree: true } : c));
                          } catch {
                            setNotif({ message: 'Erreur lors de la mise à jour.', type: 'error' });
                          }
                        }}
                      >
                        Livrer
                      </button>
                    )}
                    <button
                      className={`px-2 py-1 rounded-lg text-xs font-bold shadow bg-red-500 hover:bg-red-600 text-white transition-all duration-150 ${confirmDeleteId === cmd._id ? 'ring-2 ring-red-400' : ''}`}
                      onClick={async () => {
                        if (confirmDeleteId !== cmd._id) {
                          setConfirmDeleteId(cmd._id);
                          setNotif({ message: 'Cliquez encore pour confirmer la suppression.', type: 'error' });
                          setTimeout(() => setConfirmDeleteId(null), 2500);
                          return;
                        }
                        const token = localStorage.getItem('adminToken');
                        try {
                          const res = await fetch(`http://localhost:4000/commandes/${cmd._id}`, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          if (res.status === 401) {
                            setNotif({ message: 'Session expirée. Veuillez vous reconnecter.', type: 'error' });
                            setTimeout(() => window.location.href = '/admin', 1800);
                            return;
                          }
                          if (!res.ok) throw new Error();
                          setNotif({ message: 'Commande supprimée.', type: 'success' });
                          setCommandes(prev => prev.filter(c => c._id !== cmd._id));
                        } catch {
                          setNotif({ message: 'Erreur lors de la suppression.', type: 'error' });
                        } finally {
                          setConfirmDeleteId(null);
                        }
                      }}
                    >
                      {confirmDeleteId === cmd._id ? 'Confirmer' : 'Supprimer'}
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-3 gap-1 sm:gap-2">
                    <div className="font-bold text-xl md:text-2xl text-orange-700 flex-1 truncate">
                      {cmd.name}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 font-mono whitespace-nowrap">
                      {new Date(cmd.date).toLocaleString()}
                    </div>
                  </div>
                  <div className="mb-1 text-xs sm:text-sm text-gray-700"><span className="font-semibold">Contact :</span> {cmd.contact}</div>
                  <div className="mb-1 text-xs sm:text-sm text-gray-700"><span className="font-semibold">Lieu :</span> {cmd.location}</div>
                  <div className="mb-1 font-semibold text-green-700 text-xs sm:text-sm">Panier :</div>
                  <ul className="flex flex-col gap-1 sm:gap-2">
                    {cmd.cart.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between bg-white/70 border border-gray-100 rounded-lg px-2 py-1 sm:px-4 sm:py-2 shadow-inner text-xs sm:text-sm"
                      >
                        <span className="font-medium text-gray-800">{item.jersey.name}</span>
                        <span className="inline-flex items-center gap-1">
                          <span className="inline-block bg-gradient-to-r from-orange-400 to-green-400 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg shadow mr-1 sm:mr-2">
                            × {item.quantity}
                          </span>
                          <span className="text-orange-600 font-bold whitespace-nowrap">{(item.jersey.price * item.quantity).toLocaleString()} FCFA</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  {/* Total à payer */}
                  <div className="flex justify-end mt-2">
                    <span className="inline-block bg-gradient-to-r from-orange-400 to-green-400 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-xl shadow">
                      Total à payer : {cmd.cart.reduce((sum, item) => sum + item.jersey.price * item.quantity, 0).toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
