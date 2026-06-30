import { useState, useEffect } from 'react';
import { Users, Activity, ShieldCheck, Search, ShieldAlert, CheckCircle } from 'lucide-react';
import { adminAPI } from '../services/api';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [sosHistory, setSosHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, usersRes, sosRes] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getAllUsers({ limit: 50 }),
        adminAPI.getAllSOS({ limit: 50 })
      ]);
      setStats(statsRes.data.analytics);
      setUsers(usersRes.data.users);
      setSosHistory(sosRes.data.sos);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      await adminAPI.toggleUser(id);
      toast.success('User status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  if (isLoading) return <Loader text="Loading Admin Dashboard..." />;

  return (
    <div className="page-container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-emergency-600" /> Admin Dashboard
          </h1>
          <p className="text-subtle text-sm">Manage users, monitor SOS requests, and view analytics.</p>
        </div>
        <Button variant="secondary" onClick={fetchData}>Refresh Data</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border pb-px">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={Activity} label="Overview" />
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={Users} label="Users" />
        <TabButton active={activeTab === 'sos'} onClick={() => setActiveTab('sos')} icon={ShieldAlert} label="SOS History" />
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={stats.users} icon={Users} color="text-blue-600" bg="bg-blue-50" />
          <StatCard title="Hospitals" value={stats.hospitals} icon={Activity} color="text-green-600" bg="bg-green-50" />
          <StatCard title="Blood Donors" value={stats.donors} icon={Activity} color="text-purple-600" bg="bg-purple-50" />
          <StatCard title="Total SOS" value={stats.sos} icon={ShieldAlert} color="text-emergency-600" bg="bg-emergency-50" />
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border text-sm text-subtle uppercase">
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-ink">{u.name}</td>
                    <td className="p-4 text-sm text-subtle">{u.email}</td>
                    <td className="p-4">
                      <span className={`badge ${u.role === 'admin' ? 'badge-red' : 'badge-gray'}`}>{u.role}</span>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? 'Active' : 'Banned'}</span>
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'admin' && (
                        <Button variant="secondary" size="sm" onClick={() => toggleUserStatus(u._id)}>
                          {u.isActive ? 'Ban' : 'Unban'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* SOS Tab */}
      {activeTab === 'sos' && (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border text-sm text-subtle uppercase">
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Notified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sosHistory.map(sos => (
                  <tr key={sos._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-ink">{sos.user?.name || 'Unknown'}</td>
                    <td className="p-4 text-sm capitalize">{sos.emergencyType}</td>
                    <td className="p-4">
                      <span className={`badge ${sos.status === 'active' ? 'badge-red animate-pulse' : 'badge-green'}`}>
                        {sos.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-subtle">{new Date(sos.createdAt).toLocaleString()}</td>
                    <td className="p-4 text-sm">
                      <span className="font-semibold">{sos.notifiedContacts?.filter(c=>c.success).length || 0}</span> contacts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
        active 
          ? 'border-emergency-600 text-emergency-700 bg-emergency-50' 
          : 'border-transparent text-subtle hover:text-ink hover:bg-slate-50'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs text-subtle uppercase font-semibold mb-1">{title}</p>
        <p className="text-2xl font-bold text-ink">{value || 0}</p>
      </div>
    </Card>
  );
}
