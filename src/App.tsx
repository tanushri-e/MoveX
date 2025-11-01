import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Dispatch from './pages/Dispatch';
import Inventory from './pages/Inventory';
import Production from './pages/Production';
import Team from './pages/Team';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Layout from './components/Layout';

function PrivateRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { isAuthenticated, user } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user
  }));
  console.log("🔍 Checking PrivateRoute Auth State:", { isAuthenticated, user });
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'customer' ? '/products' : '/'} />;
  }

  return <>{children}</>;
}

function App() {
  const user = useAuthStore((state) => state.user);
  console.log("Current Auth State:", useAuthStore.getState());
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Customer Routes */}
        <Route
          path="/products"
          element={
            <PrivateRoute allowedRoles={['customer']}>
              <Layout>
                <Products />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute allowedRoles={['customer']}>
              <Layout>
                <Orders />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Staff Routes */}
        <Route
  path="/dashboard"
  element={
    <PrivateRoute allowedRoles={['admin', 'manager']}>
      <Layout>
        <Dashboard />
      </Layout>
    </PrivateRoute>
  }
/>

<Route
  path="/*"
  element={
    <PrivateRoute allowedRoles={['admin', 'manager']}>
      <Layout>
        <Routes>
          <Route path="/dispatch" element={<Dispatch />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/production" element={<Production />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </Layout>
    </PrivateRoute>
  }
/>


        {/* Redirect based on role */}
        <Route
          path="/"
          element={
            <Navigate
              to={user?.role === 'customer' ? '/products' : '/dashboard'}
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;