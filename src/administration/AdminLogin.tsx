import React, { useState } from 'react';

const AdminLogin = ({ onSuccess }: { onSuccess: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:4000/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.status === 401) {
        setError('Identifiants invalides.');
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      localStorage.setItem('adminToken', data.token);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
      }, 1200);
    } catch {
      setError("Erreur serveur ou réseau. Essayez encore.");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100/80 to-green-100/80 font-sans relative px-2 sm:px-0">
      {showSuccess && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-green-500/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-fade-in-up text-sm sm:text-base">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          Connexion réussie
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-lg bg-white/60 px-4 py-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-md space-y-6 sm:space-y-8 border border-white/40"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
      >
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent mb-6 drop-shadow-lg tracking-tight">
          Connexion Admin
        </h2>
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Nom d'utilisateur</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-5 py-3 rounded-2xl border border-gray-200 bg-white/70 shadow-inner focus:outline-none focus:ring-4 focus:ring-orange-300 focus:border-orange-400 transition-all duration-200 placeholder-gray-400"
            placeholder="Votre identifiant"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-5 py-3 rounded-2xl border border-gray-200 bg-white/70 shadow-inner focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-400 transition-all duration-200 placeholder-gray-400"
            placeholder="Votre mot de passe"
            required
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center font-semibold bg-red-50 rounded-xl py-2 shadow animate-pulse">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-2xl font-bold shadow-lg hover:scale-105 hover:from-orange-600 hover:to-green-600 focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all duration-200 drop-shadow-lg"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;