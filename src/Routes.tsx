import { Routes, Route } from 'react-router-dom';
import AdminLogin from './administration/AdminLogin';
import AdminDashboard from './administration/AdminDashboard';
import App from './App';

const MainRoutes = () => {
  // Affiche le dashboard si un token JWT est présent
  const isAdmin = !!localStorage.getItem('adminToken');

  return (
    <Routes>
      <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <AdminLogin onSuccess={() => window.location.reload()} />} />
      <Route path="/*" element={<App />} />
    </Routes>
  );
};

export default MainRoutes;
