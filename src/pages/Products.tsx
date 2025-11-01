import React, { useState } from 'react';
import { ShoppingCart, Search, Plus, Trash2, Minus, X } from 'lucide-react';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Maggi',
    description: 'Two Minutes Instant Noodles',
    price: 12.99,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp3gCVWbHDWWXDEm3vGI5YkBNc18sbJ9fPpA&s',
    category: 'Noodles',
    productionTime: 1,
    inStock: 250
  },
  {
    id: '2',
    name: 'Nestle Kit Kat',
    description: 'Nestle Kitkat Chocolate Bar - Wafer Cocoa, 13.2g',
    price: 24.99,
    image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSYd6tb4xT5LHWNX0UvxTHU0MUDQeik0PqooalHiBxl_3bdM-tw',
    category: 'Chocolate',
    productionTime: 2,
    inStock: 100
  },
  {
    id: '3',
    name: 'Nescafe Classic',
    description: 'Instant Coffee Powder | 100% Pure Coffee | 90g',
    price: 18.99,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8DBeP1YCfAlTuQqpWV7iS6yNqaRR9acVPFRRCOvOCnZdLSIHocyqrqdv0tMrLit-taUw&usqp=CAU',
    category: 'Coffee Powder',
    productionTime: 1.5,
    inStock: 150
  }
];

function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{ productId: string; name: string; price: number; image: string; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const product = mockProducts.find(p => p.id === productId);
      if (product) {
        return [...prev, { productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }];
      }
      return prev;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart(prev =>
      prev
        .map(item => item.productId === productId ? { ...item, quantity: item.quantity + change } : item)
        .filter(item => item.quantity > 0)
    );
  };

  const handleConfirm = () => {
    if (cart.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cart));
      setIsCartOpen(false);
      navigate('/payment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button 
          onClick={() => setIsCartOpen(true)} 
          className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})</span>
        </button>
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Cart Items</h2>
              <button onClick={() => setIsCartOpen(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4 max-h-72 overflow-y-auto">
              {cart.length > 0 ? cart.map(item => (
                <div key={item.productId} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded" />
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">${item.price} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="bg-red-500 text-white px-3 py-2 rounded">
                      <Minus className="w-5 h-5" />
                    </button>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="bg-green-500 text-white px-3 py-2 rounded">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-red-600">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )) : <p className="text-center text-gray-500">Cart is empty.</p>}
            </div>

            <div className="flex justify-between mt-4">
              <button onClick={() => setCart([])} className="bg-gray-400 text-white px-5 py-2 rounded">Cancel</button>
              <button 
                onClick={handleConfirm}
                className={`px-5 py-2 rounded ${cart.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`} 
                disabled={cart.length === 0}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto border rounded-lg p-2">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <button onClick={() => addToCart(product.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
