import { create } from 'zustand';
import { Order, ProductionSchedule, DeliverySchedule, Vehicle } from '../types';
import { addDays, addHours, format, parse } from 'date-fns';

interface SchedulingState {
  orders: Order[];
  productionSchedules: ProductionSchedule[];
  deliverySchedules: DeliverySchedule[];
  availableVehicles: Vehicle[];
  
  // Production Scheduling
  scheduleProduction: (order: Order) => ProductionSchedule;
  optimizeProductionSchedule: () => void;
  
  // Delivery Scheduling
  scheduleDelivery: (order: Order, schedule: ProductionSchedule) => DeliverySchedule;
  optimizeDeliveryRoutes: () => void;
  
  // Analytics
  getProductionEfficiency: () => number;
  getDeliveryEfficiency: () => number;
}

export const useSchedulingStore = create<SchedulingState>((set, get) => ({
  orders: [],
  productionSchedules: [],
  deliverySchedules: [],
  availableVehicles: [],

  scheduleProduction: (order: Order) => {
    const productionTime = calculateProductionTime(order);
    const priority = calculatePriority(order);
    const availableLine = findAvailableProductionLine();

    const schedule: ProductionSchedule = {
      id: crypto.randomUUID(),
      orderId: order.id,
      startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      endTime: format(addHours(new Date(), productionTime), "yyyy-MM-dd'T'HH:mm:ss"),
      status: 'scheduled',
      priority,
      lineId: availableLine.id,
      efficiency: calculateLineEfficiency(availableLine)
    };

    set(state => ({
      productionSchedules: [...state.productionSchedules, schedule]
    }));

    return schedule;
  },

  optimizeProductionSchedule: () => {
    const { productionSchedules } = get();
    
    // Sort by priority and optimize time slots
    const optimizedSchedules = [...productionSchedules].sort((a, b) => b.priority - a.priority);
    
    // Adjust start times to minimize gaps
    optimizedSchedules.forEach((schedule, index) => {
      if (index > 0) {
        const previousSchedule = optimizedSchedules[index - 1];
        schedule.startTime = previousSchedule.endTime;
        schedule.endTime = format(
          addHours(parse(schedule.startTime, "yyyy-MM-dd'T'HH:mm:ss", new Date()), 
          getProductionDuration(schedule.orderId)),
          "yyyy-MM-dd'T'HH:mm:ss"
        );
      }
    });

    set({ productionSchedules: optimizedSchedules });
  },

  scheduleDelivery: (order: Order, productionSchedule: ProductionSchedule) => {
    const vehicle = findOptimalVehicle(order);
    const driver = findAvailableDriver();
    const route = calculateOptimalRoute(order.deliveryAddress);

    const schedule: DeliverySchedule = {
      id: crypto.randomUUID(),
      orderId: order.id,
      vehicleId: vehicle.id,
      driverId: driver.id,
      startTime: productionSchedule.endTime,
      estimatedArrival: format(
        addHours(parse(productionSchedule.endTime, "yyyy-MM-dd'T'HH:mm:ss", new Date()), 
        route.duration),
        "yyyy-MM-dd'T'HH:mm:ss"
      ),
      status: 'scheduled',
      route
    };

    set(state => ({
      deliverySchedules: [...state.deliverySchedules, schedule]
    }));

    return schedule;
  },

  optimizeDeliveryRoutes: () => {
    const { deliverySchedules } = get();
    
    // Group deliveries by area and optimize routes
    const optimizedSchedules = optimizeRoutes(deliverySchedules);
    
    set({ deliverySchedules: optimizedSchedules });
  },

  getProductionEfficiency: () => {
    const { productionSchedules } = get();
    return calculateProductionEfficiency(productionSchedules);
  },

  getDeliveryEfficiency: () => {
    const { deliverySchedules } = get();
    return calculateDeliveryEfficiency(deliverySchedules);
  }
}));

// Helper functions
function calculateProductionTime(order: Order): number {
  return order.requiredProductionTime;
}

function calculatePriority(order: Order): number {
  const priorityWeights = {
    high: 3,
    medium: 2,
    low: 1
  };
  return priorityWeights[order.priority];
}

function findAvailableProductionLine() {
  // Simplified for demo
  return { id: 'line-1', efficiency: 0.85 };
}

function calculateLineEfficiency(line: any): number {
  return line.efficiency;
}

function findOptimalVehicle(order: Order): Vehicle {
  // Simplified for demo
  return {
    id: 'vehicle-1',
    plateNumber: 'ABC123',
    type: 'truck',
    status: 'available'
  };
}

function findAvailableDriver() {
  // Simplified for demo
  return { id: 'driver-1' };
}

function calculateOptimalRoute(deliveryAddress: string) {
  // Simplified for demo
  return {
    distance: 50,
    duration: 2,
    waypoints: [[0, 0], [1, 1]]
  };
}

function optimizeRoutes(schedules: DeliverySchedule[]): DeliverySchedule[] {
  // Group by area and optimize
  return schedules;
}

function calculateProductionEfficiency(schedules: ProductionSchedule[]): number {
  if (schedules.length === 0) return 0;
  return schedules.reduce((acc, schedule) => acc + schedule.efficiency, 0) / schedules.length;
}

function calculateDeliveryEfficiency(schedules: DeliverySchedule[]): number {
  if (schedules.length === 0) return 0;
  // Calculate based on actual vs estimated delivery times
  return 0.85; // Simplified for demo
}

function getProductionDuration(orderId: string): number {
  // Simplified for demo
  return 4;
}