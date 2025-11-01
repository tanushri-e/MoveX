import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Truck, Package, Factory, LogOut, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ to, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
        isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-blue-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-8">
          <Truck className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-bold">MoveX</h1>
        </div>

        <nav className="space-y-2">
          <NavItem
            to="/"
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Dashboard"
            isActive={location.pathname === '/'}
          />

          {/* Only show full navigation for Admin users */}
          {user?.role === 'admin' && (
            <>
              <NavItem
                to="/dispatch"
                icon={<Truck className="w-5 h-5" />}
                label="Dispatch"
                isActive={location.pathname === '/dispatch'}
              />
              <NavItem
                to="/inventory"
                icon={<Package className="w-5 h-5" />}
                label="Inventory"
                isActive={location.pathname === '/inventory'}
              />
              <NavItem
                to="/production"
                icon={<Factory className="w-5 h-5" />}
                label="Production"
                isActive={location.pathname === '/production'}
              />
              <NavItem
                to="/team"
                icon={<Users className="w-5 h-5" />}
                label="Team"
                isActive={location.pathname === '/team'}
              />
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {location.pathname === '/' ? 'Dashboard' : location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2)}
          </h2>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
