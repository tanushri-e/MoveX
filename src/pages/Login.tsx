import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, User, Building2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

type LoginType = 'staff' | 'customer';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState<LoginType>('customer');
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // TODO: Replace with actual Supabase authentication
      if (loginType === 'staff' && email === 'admin@example.com' && password === 'admin') {
        setUser({
          id: '1',
          email: 'admin@example.com',
          role: 'admin',
          name: 'Admin User'
        });
        navigate('/');
      } else if (loginType === 'customer' && email === 'customer@example.com' && password === 'customer') {
        setUser({
          id: '2',
          email: 'customer@example.com',
          role: 'customer',
          name: 'John Customer'
        });
        navigate('/products');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Truck className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          MoveX
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              className={`flex items-center px-4 py-2 rounded-lg ${
                loginType === 'customer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setLoginType('customer')}
            >
              <User className="w-5 h-5 mr-2" />
              Customer
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-lg ${
                loginType === 'staff'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setLoginType('staff')}
            >
              <Building2 className="w-5 h-5 mr-2" />
              Staff
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>

            {loginType === 'customer' && (
              <div className="text-sm text-center">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Don't have an account? Sign up
                </a>
              </div>
            )}
          </form>

          {loginType === 'customer' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Demo credentials</span>
                </div>
              </div>
              <div className="mt-2 text-sm text-center text-gray-600">
                Email: customer@example.com<br />
                Password: customer
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;