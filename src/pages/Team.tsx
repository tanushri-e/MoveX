import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Truck,
  Star,
  Trash2,
  Clock
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: 'driver' | 'manager' | 'admin';
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'on-delivery' | 'off-duty';
  joinDate: string;
  performance: number;
  deliveriesCompleted: number;
  currentTask?: string;
  avatar: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'driver',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8901',
    location: 'North Route',
    status: 'on-delivery',
    joinDate: '2023-01-15',
    performance: 4.8,
    deliveriesCompleted: 1234,
    currentTask: 'Delivering order #5678',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'manager',
    email: 'jane.smith@example.com',
    phone: '+1 234 567 8902',
    location: 'HQ',
    status: 'active',
    joinDate: '2022-11-20',
    performance: 4.9,
    deliveriesCompleted: 0,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    role: 'driver',
    email: 'mike.johnson@example.com',
    phone: '+1 234 567 8903',
    location: 'South Route',
    status: 'off-duty',
    joinDate: '2023-03-10',
    performance: 4.6,
    deliveriesCompleted: 956,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

function StatusBadge({ status }: { status: TeamMember['status'] }) {
  const colors = {
    'active': 'bg-green-100 text-green-800',
    'on-delivery': 'bg-blue-100 text-blue-800',
    'off-duty': 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}>
      {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </span>
  );
}

function PerformanceStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
}

function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);
  const handleDeleteMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
    setDeleteMemberId(null);
  };

  const [newMember, setNewMember] = useState<TeamMember>({
  id: '',
  name: '',
  role: '',
  email: '',
  phone: '',
  location: '',
  status: 'active',
  joinDate: new Date().toISOString().split('T')[0],
  performance: 5.0,
  deliveriesCompleted: 0,
  avatar: 'https://via.placeholder.com/150'
});
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { 
  if (e.target.files && e.target.files[0]) { 
    const reader = new FileReader(); 
    reader.onload = () => { 
      setNewMember({ ...newMember, avatar: reader.result as string }); 
    }; 
    reader.readAsDataURL(e.target.files[0]); 
  } 
};
const handleAddMember = () => {
  if (!newMember.name || !newMember.email || !newMember.phone) return; // Prevent empty inputs

  setTeamMembers([...teamMembers, { ...newMember, id: (teamMembers.length + 1).toString() }]);
  setNewMember({
    id: '',
    name: '',
    role: 'driver',
    email: '',
    phone: '',
    location: '',
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
    performance: 5.0,
    deliveriesCompleted: 0,
    avatar: 'https://via.placeholder.com/150'
  });
  setIsModalOpen(false);
};
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<TeamMember['role'] | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TeamMember['status'] | 'all'>('all');

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
            {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Team Member</h2>
            
            <input 
              type="text" 
              placeholder="Name" 
              className="w-full border p-2 rounded mb-2" 
              value={newMember.name} 
              onChange={(e) => setNewMember({...newMember, name: e.target.value})} 
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full border p-2 rounded mb-2" 
              value={newMember.email} 
              onChange={(e) => setNewMember({...newMember, email: e.target.value})} 
            />
            <input 
              type="text" 
              placeholder="Phone" 
              className="w-full border p-2 rounded mb-2" 
              value={newMember.phone} 
              onChange={(e) => setNewMember({...newMember, phone: e.target.value})} 
            />

            <input type="text" placeholder="Enter Location" 
            className="w-full border p-2 rounded mb-2" 
            value={newMember.location} onChange={(e) => setNewMember({ ...newMember, location: e.target.value  })} />
            <select
            className="w-full border p-2 rounded mb-2 text-gray-500"
            value={newMember.role || "default"} 
            onChange={(e) => setNewMember({ ...newMember, role: e.target.value as TeamMember['role'] })}>

            <option value="default" disabled hidden>Select Role</option>
            <option value="driver">Driver</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
            </select>

            <label className="block mb-2 text-sm font-medium text-gray-900">Upload Image:</label>
            <input type="file" 
            accept="image/*" 
            className="w-full border p-2 rounded mb-2" 
            onChange={handleImageUpload} />

            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-400 px-4 py-2 rounded">Cancel</button>
              <button onClick={handleAddMember} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
        
        <button 
        onClick={() => {
          setNewMember({  // Reset form fields when opening modal
            id: '',
            name: '',
            role: '',
            email: '',
            phone: '',
            location: '',
            status: 'active',
            joinDate: new Date().toISOString().split('T')[0],
            performance: 5.0,
            deliveriesCompleted: 0,
            avatar: 'https://via.placeholder.com/150'
          });
          setIsModalOpen(true); // Open modal
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>

      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Members</p>
              <p className="text-2xl font-semibold mt-1">{teamMembers.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Now</p>
              <p className="text-2xl font-semibold mt-1">
                {mockTeamMembers.filter(m => m.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">On Delivery</p>
              <p className="text-2xl font-semibold mt-1">
                {mockTeamMembers.filter(m => m.status === 'on-delivery').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <Truck className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <p className="text-2xl font-semibold mt-1">4.8</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as TeamMember['role'] | 'all')}
            >
              <option value="all">All Roles</option>
              <option value="driver">Drivers</option>
              <option value="manager">Managers</option>
              <option value="admin">Admins</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TeamMember['status'] | 'all')}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on-delivery">On Delivery</option>
              <option value="off-duty">Off Duty</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-white border rounded-lg p-6 relative group">
              <div className="flex items-start justify-between">

                {/* Delete Icon */}

                <button
                onClick={() => setDeleteMemberId(member.id)}
                className="absolute bottom-4 right-4 text-red-600 opacity-0 group-hover:opacity-100 transition">
                  <Trash2 className="w-5 h-5" />
                  </button>

                <div className="flex items-start space-x-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-20 h-20 object-cover rounded-full border-2 border-gray-300 shadow-md"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="w-4 h-4 mr-2" />
                        {member.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-2" />
                        {member.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {member.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        Joined {member.joinDate}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={member.status} />
                  <div className="mt-2">
                    <PerformanceStars rating={member.performance} />
                  </div>
                  {member.role === 'driver' && (
                    <p className="text-sm text-gray-500 mt-2">
                      {member.deliveriesCompleted} deliveries
                    </p>
                  )}
                </div>
              </div>
              {member.currentTask && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Current Task: {member.currentTask}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Delete Confirmation Modal */}
        {
        deleteMemberId && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this member?</p>
            <div className="flex justify-center space-x-4 mt-4">
              
              {/* Cancel Button of deletion */}
              <button
              onClick={() => setDeleteMemberId(null)}  
              className="bg-gray-400 px-4 py-2 rounded"
              >
              Cancel
              </button>

            
              {/* Cancel Button of add new member */}
              <button
              onClick={() => {
              setNewMember({  // Reset form fields when clicking Cancel
              id: '',
              name: '',
              role: '',
              email: '',
              phone: '',
              location: '',
              status: 'active',
              joinDate: new Date().toISOString().split('T')[0],
              performance: 5.0,
              deliveriesCompleted: 0,
              avatar: 'https://via.placeholder.com/150'
            });
          setIsModalOpen(false); 
  }} 
>
</button>

              <button
              onClick={() => handleDeleteMember(deleteMemberId!)}
              className="bg-red-600 text-white px-5 py-2 rounded-lg flex items-center"
              >
              Delete
              <Trash2 className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default Team;