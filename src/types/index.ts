export interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'driver' | 'customer';
  name: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  status: 'available' | 'in-transit' | 'maintenance';
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export interface Order {
  id: string;
  customerId: string;
  status: 'pending' | 'processing' | 'in-transit' | 'delivered';
  deliveryAddress: string;
  scheduledDate: string;
  assignedVehicleId?: string;
  assignedDriverId?: string;
  priority: 'low' | 'medium' | 'high';
  items: OrderItem[];
  requiredProductionTime: number;
  estimatedDeliveryTime: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  status: 'pending' | 'in-production' | 'completed';
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  type: 'raw' | 'finished';
  minThreshold: number;
  productionRate: number; // units per hour
  reorderPoint: number;
  leadTime: number; // hours
}

export interface ProductionSchedule {
  id: string;
  orderId: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  priority: number;
  lineId: string;
  efficiency: number;
}

export interface DeliverySchedule {
  id: string;
  orderId: string;
  vehicleId: string;
  driverId: string;
  startTime: string;
  estimatedArrival: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  route: {
    distance: number;
    duration: number;
    waypoints: [number, number][];
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  productionTime: number;
  inStock: number;
}