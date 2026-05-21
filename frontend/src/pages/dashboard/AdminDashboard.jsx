import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Loader2, Users, ShieldAlert, Server, CheckCircle, XCircle, Search, RefreshCw, KeyRound } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const fetchAdminData = async () => {
    try {
      const response = await api.get('/users/admin/data');
      setData(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load administrative details');
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    setLoading(true);
    await fetchAdminData();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);
      await api.put(`/users/admin/users/${userId}/role`, { role: newRole });
      await fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleStatusToggle = async (userId, isActive, isLocked) => {
    try {
      setUpdatingUserId(userId);
      await api.put(`/users/admin/users/${userId}/status`, {
        is_active: isActive,
        is_locked: isLocked
      });
      await fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update user status');
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center p-12 bg-[#140e0d] min-h-screen text-stone-100">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-rose-500 mx-auto mb-4" />
          <p className="text-stone-400">Loading system management data...</p>
        </div>
      </div>
    );
  }

  const filteredUsers = data?.users.filter(u =>
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="p-6 space-y-6 text-stone-100 bg-[#140e0d] min-h-screen">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-stone-100 to-rose-300 bg-clip-text text-transparent">System Administration</h2>
          <p className="text-stone-400 text-sm">Monitor system accounts, user privileges, and active connections.</p>
        </div>
        <button
          onClick={handleManualRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-[#1c1412] border border-[#2d211f] hover:bg-[#2d211f] hover:border-stone-700/50 text-stone-300 hover:text-stone-100 px-4 py-2 rounded-xl transition-all text-sm font-medium shadow-md"
        >
          <RefreshCw className={`w-4 h-4 text-rose-450 ${loading ? 'animate-spin' : ''}`} />
          Reload Live Data
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#1c1412]/50 border border-[#2d211f]/60 backdrop-blur-sm p-5 rounded-2xl flex items-center gap-4 hover:border-rose-500/20 transition-all duration-300 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-inner">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wider font-semibold">Total Accounts</p>
            <p className="text-2xl font-bold text-stone-200">{data?.stats.total_users || 0}</p>
          </div>
        </div>

        <div className="bg-[#1c1412]/50 border border-[#2d211f]/60 backdrop-blur-sm p-5 rounded-2xl flex items-center gap-4 hover:border-rose-500/20 transition-all duration-300 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 flex items-center justify-center shadow-inner">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wider font-semibold">Active Sessions</p>
            <p className="text-2xl font-bold text-stone-200">{data?.stats.active_users || 0}</p>
          </div>
        </div>

        <div className="bg-[#1c1412]/50 border border-[#2d211f]/60 backdrop-blur-sm p-5 rounded-2xl flex items-center gap-4 hover:border-rose-500/20 transition-all duration-300 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-450 flex items-center justify-center shadow-inner">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wider font-semibold">Locked Accounts</p>
            <p className="text-2xl font-bold text-stone-200">{data?.stats.locked_users || 0}</p>
          </div>
        </div>

        <div className="bg-[#1c1412]/50 border border-[#2d211f]/60 backdrop-blur-sm p-5 rounded-2xl flex items-center gap-4 hover:border-rose-500/20 transition-all duration-300 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-450 flex items-center justify-center shadow-inner">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wider font-semibold">Database Status</p>
            <p className="text-2xl font-bold text-emerald-450">{data?.stats.db_status || 'Healthy'}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area - Users Table */}
      <div className="bg-[#1c1412]/40 border border-[#2d211f]/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-[#2d211f]/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-semibold text-lg text-stone-100 flex items-center gap-2">
            User Accounts Directory
            {loading && <Loader2 className="w-4 h-4 animate-spin text-rose-500" />}
          </h3>
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search user email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#140e0d] border border-[#2d211f] rounded-xl text-stone-200 placeholder-stone-555 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-sm transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2d211f]/60 bg-[#1c1412]/30 text-xs font-semibold uppercase tracking-wider text-stone-400">
                <th className="py-4 px-6">User Account</th>
                <th className="py-4 px-6">Database ID</th>
                <th className="py-4 px-6">Privileges (Role)</th>
                <th className="py-4 px-6">Verification Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d211f]/45 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 px-6 text-center text-stone-500">
                    No users matching criteria were found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-850/20 transition-all duration-200">
                    {/* User profile identifier */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500/10 to-mocha-500/10 border border-rose-500/20 flex items-center justify-center font-bold text-rose-400">
                          {user.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-stone-200">{user.full_name}</div>
                          <div className="text-xs text-stone-450">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* ID */}
                    <td className="py-4 px-6 text-stone-400 font-mono">
                      #{user.id}
                    </td>

                    {/* Role dropdown */}
                    <td className="py-4 px-6">
                      <div className="relative inline-block">
                        <select
                          value={user.role}
                          disabled={updatingUserId === user.id}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-[#140e0d] border border-[#2d211f] text-stone-200 px-3 py-1.5 rounded-lg text-xs font-medium focus:ring-2 focus:ring-rose-500/50 focus:outline-none transition-all cursor-pointer disabled:opacity-50"
                        >
                          <option value="employee">Employee</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>

                    {/* Status badges */}
                    <td className="py-4 px-6 space-x-2">
                      {user.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 border border-rose-500/30 text-rose-400">
                          <XCircle className="w-3.5 h-3.5" />
                          Suspended
                        </span>
                      )}

                      {user.is_locked ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-450">
                          <KeyRound className="w-3.5 h-3.5" />
                          Locked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1c1412] border border-[#2d211f] text-stone-400">
                          Unlocked
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleStatusToggle(user.id, !user.is_active, user.is_locked)}
                        disabled={updatingUserId === user.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          user.is_active
                            ? 'bg-rose-500/10 hover:bg-rose-500 border-rose-500/30 hover:border-transparent text-rose-400 hover:text-white'
                            : 'bg-emerald-500/10 hover:bg-emerald-500 border-emerald-500/30 hover:border-transparent text-emerald-450 hover:text-white'
                        }`}
                      >
                        {user.is_active ? 'Suspend' : 'Activate'}
                      </button>

                      <button
                        onClick={() => handleStatusToggle(user.id, user.is_active, !user.is_locked)}
                        disabled={updatingUserId === user.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          user.is_locked
                            ? 'bg-rose-500/10 hover:bg-rose-500 border-rose-500/30 hover:border-transparent text-rose-400 hover:text-white'
                            : 'bg-amber-500/10 hover:bg-amber-500 border-amber-500/30 hover:border-transparent text-amber-450 hover:text-white'
                        }`}
                      >
                        {user.is_locked ? 'Unlock' : 'Lock'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
