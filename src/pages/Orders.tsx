import React, { useState } from 'react';
import { Package, Search, Clock, MapPin, Truck } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

interface Order {
  id?: string;
  customerId?: string;
  status: string;
  deliveryAddress?: string;
  scheduledDate?: string;
  priority?: string;
  items: { id: string; productId: string; quantity: number; status: string }[];
  requiredProductionTime?: number;
  estimatedDeliveryTime?: number;
  createdAt: string;
  totalAmount: number;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerId: '2',
    status: 'processing',
    deliveryAddress: '123 Customer St, City',
    scheduledDate: '2024-03-20',
    priority: 'medium',
    items: [
      {
        id: '1',
        productId: '1',
        quantity: 2,
        status: 'in-production',
      },
    ],
    requiredProductionTime: 2,
    estimatedDeliveryTime: 24,
    createdAt: new Date().toISOString(),
    totalAmount: 200,
  },
];

function OrderStatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    'in-transit': 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const data: Order[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Order),
      }));

      console.log('📊 Orders fetched from Firestore:', data);
      setOrders(data);
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = async () => {
    const newOrder = {
      status: 'Received',
      items: [{ id: '1', productId: '1', quantity: 2, status: 'in-production' }],
      totalAmount: 100,
      createdAt: new Date().toISOString(),
    };
  
    try {
      console.log("📦 Attempting to send order:", JSON.stringify(newOrder, null, 2));
      if (!db) {
        console.error("❌ Firestore DB is not initialized!");
        alert("Firestore is not connected. Check your Firebase configuration.");
        return;
      }
  
      const docRef = await addDoc(collection(db, "orders"), newOrder);
      
      console.log("✅ Order successfully stored in Firestore, ID:", docRef.id);
      alert(`Order placed successfully! Order ID: ${docRef.id}`);
    } catch (error) { 
      if (error instanceof Error) { // ✅ Explicitly check error type
        console.error('❌ Firestore Error:', error.message);
        alert(`Failed to place order: ${error.message}`);
      }else {
        console.error("❌ Unknown Error:", error);
        alert("Failed to place order: An unknown error occurred.");
      }

    };
    const testFirestore = async () => {
      try {
        const docRef = await addDoc(collection(db, "test"), { name: "Test Entry" });
        console.log("✅ Firestore write successful, ID:", docRef.id);
      } catch (error) {
        console.error("❌ Firestore write failed:", error);
      }
    };
    testFirestore();
    
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Refresh Orders
        </button>
        <button
          onClick={confirmOrder}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
        >
          Confirm Order
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading && <p className="text-gray-500 text-center">Loading orders...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Package className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold">Order {order.id}</h3>
                    <p className="text-sm text-gray-500">
                      Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Estimated delivery: {order.estimatedDeliveryTime || 'N/A'}h</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{order.deliveryAddress || 'No Address Provided'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4" />
                    <span>Priority: {order.priority || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <h4 className="font-medium mb-2">Order Items</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium">Product #{item.productId}</span>
                      <span className="text-sm text-gray-500">Quantity: {item.quantity}</span>
                    </div>
                    <span className="text-sm text-blue-600">
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default Orders;
