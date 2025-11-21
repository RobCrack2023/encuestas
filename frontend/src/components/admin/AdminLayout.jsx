import { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiHome,
  FiUsers,
  FiHelpCircle,
  FiSettings,
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/candidatos', icon: FiUsers, label: 'Candidatos' },
    { path: '/admin/preguntas', icon: FiHelpCircle, label: 'Preguntas' },
    { path: '/admin/configuracion', icon: FiSettings, label: 'Configuración' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-blue-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-blue-800">
          {sidebarOpen && (
            <h1 className="text-xl font-bold">Admin Panel</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-800 rounded-lg transition"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* User Info */}
        {sidebarOpen && user && (
          <div className="p-4 border-b border-blue-800">
            <p className="text-sm text-blue-300">Bienvenido</p>
            <p className="font-medium">{user.username}</p>
            <p className="text-xs text-blue-300">{user.email}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-blue-800 text-white'
                  : 'hover:bg-blue-800 text-blue-200'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 transition w-full"
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find((item) => isActive(item.path))?.label || 'Panel de Administración'}
            </h2>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-800 transition"
              >
                Ver Sitio Público
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
