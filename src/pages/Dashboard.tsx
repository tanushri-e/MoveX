import React, { useState, useEffect } from "react";
import { Truck, Clock, AlertTriangle, TrendingUp} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore"; 

interface Order {
  id: string;
  status: string;
  totalAmount: number;
}

// Mock data for delivery trends
const mockData = {
  deliveries: [
    { time: "00:00", value: 4 },
    { time: "04:00", value: 3 },
    { time: "08:00", value: 7 },
    { time: "12:00", value: 12 },
    { time: "16:00", value: 9 },
    { time: "20:00", value: 6 },
  ],
  stats: {
    activeDeliveries: 24,
    pendingOrders: 12,
    availableVehicles: 8,
    lowStockItems: 3
  }
};

// Component for displaying statistics
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend 
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType; 
  trend?: { value: number; isPositive: boolean } 
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{trend.value}% from last week</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

// Component to fetch and display recent orders
const RecentOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOrderListOpen, setIsOrderListOpen] = useState(false);

  // ✅ Fetch orders from Firebase Firestore
  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];

      console.log("📊 Admin received orders:", data);
      setOrders(data);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
        {orders.length > 0 && (
          <button
            onClick={() => setIsOrderListOpen(true)}
            className="text-blue-600 hover:underline"
          >
            View All Orders
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Loading orders...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center">No new orders.</p>
      ) : (
        <div className="space-y-3">
          {orders.slice(0, 3).map((order) => (
            <div key={order.id} className="p-4 bg-gray-100 rounded-lg">
              <div className="flex justify-between">
                <h3 className="text-md font-semibold">Order {order.id}</h3>
                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded">
                  {order.status}
                </span>
              </div>
              <p className="text-right font-bold mt-2">Total: ${order.totalAmount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Recent Orders */}
      <RecentOrders />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Deliveries"
          value={mockData.stats.activeDeliveries}
          icon={Truck}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Pending Orders"
          value={mockData.stats.pendingOrders}
          icon={Clock}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Available Vehicles"
          value={mockData.stats.availableVehicles}
          icon={Truck}
        />
        <StatCard
          title="Low Stock Items"
          value={mockData.stats.lowStockItems}
          icon={AlertTriangle}
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      {/* Delivery Trends Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Delivery Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData.deliveries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
