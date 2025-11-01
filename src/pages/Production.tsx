import React, { useState } from 'react';
import {
  Factory,
  Clock,
  AlertTriangle,
  CheckCircle,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ProductionLine {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'maintenance' | 'completed';
  efficiency: number;
  currentBatch: string;
  startTime: string;
  estimatedCompletion: string;
  unitsCompleted: number;
  targetUnits: number;
}

const mockProductionLines: ProductionLine[] = [
  {
    id: '1',
    name: 'Assembly Line A',
    status: 'running',
    efficiency: 95,
    currentBatch: 'BATCH-001',
    startTime: '2024-03-15 08:00',
    estimatedCompletion: '2024-03-15 16:00',
    unitsCompleted: 150,
    targetUnits: 200
  },
  {
    id: '2',
    name: 'Assembly Line B',
    status: 'paused',
    efficiency: 0,
    currentBatch: 'BATCH-002',
    startTime: '2024-03-15 08:00',
    estimatedCompletion: '2024-03-15 17:00',
    unitsCompleted: 75,
    targetUnits: 180
  },
  {
    id: '3',
    name: 'Packaging Line',
    status: 'maintenance',
    efficiency: 0,
    currentBatch: 'BATCH-003',
    startTime: '2024-03-15 09:00',
    estimatedCompletion: '2024-03-15 18:00',
    unitsCompleted: 100,
    targetUnits: 300
  }
];

const productionData = [
  { hour: '08:00', output: 45 },
  { hour: '09:00', output: 52 },
  { hour: '10:00', output: 48 },
  { hour: '11:00', output: 55 },
  { hour: '12:00', output: 43 },
  { hour: '13:00', output: 50 },
];

function StatusBadge({ status }: { status: ProductionLine['status'] }) {
  const statusConfig = {
    running: { color: 'bg-green-100 text-green-800', icon: PlayCircle },
    paused: { color: 'bg-yellow-100 text-yellow-800', icon: PauseCircle },
    maintenance: { color: 'bg-red-100 text-red-800', icon: RotateCcw },
    completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle }
  };

  const { color, icon: Icon } = statusConfig[status];

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${color} flex items-center space-x-1`}>
      <Icon className="w-4 h-4" />
      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </span>
  );
}

function Production() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProductionLine['status'] | 'all'>('all');

  const filteredLines = mockProductionLines.filter(line => {
    const matchesSearch = line.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         line.currentBatch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || line.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Production Overview</h1>
      </div>

      {/* Production Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Lines</p>
              <p className="text-2xl font-semibold mt-1">3/4</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Factory className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Output</p>
              <p className="text-2xl font-semibold mt-1">325 units</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Efficiency</p>
              <p className="text-2xl font-semibold mt-1">92%</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Issues</p>
              <p className="text-2xl font-semibold mt-1">2</p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Production Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Hourly Production Output</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="output" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Production;
