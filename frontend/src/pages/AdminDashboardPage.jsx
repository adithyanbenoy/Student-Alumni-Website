import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Megaphone,
  Trash2,
  Search,
  Filter,
  BarChart3,
  Building2,
  PlusCircle,
  Sparkles
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tabs: 'overview' | 'verifications' | 'users' | 'announcements'
  const [adminTab, setAdminTab] = useState('overview');

  // Filter & Search
  const [searchUser, setSearchUser] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // New announcement modal
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState('high');
  const [annCategory, setAnnCategory] = useState('Placement');

  useEffect(() => {
    fetchAdminData();
  }, [roleFilter]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, annRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get(`/admin/users${roleFilter !== 'all' ? `?role=${roleFilter}` : ''}`),
        API.get('/admin/announcements')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (usersRes.data.success) {
        setUsers(usersRes.data.users);
      }
      if (annRes.data.success) {
        setAnnouncements(annRes.data.announcements);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerification = async (userId) => {
    try {
      const res = await API.put(`/admin/users/${userId}/verify`);
      if (res.data.success) {
        setUsers(
          users.map((u) => {
            if (u._id === userId) {
              return { ...u, isVerifiedAlumni: !u.isVerifiedAlumni };
            }
            return u;
          })
        );
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to update verification status');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await API.put(`/admin/users/${userId}/status`, {
        status: newStatus
      });
      if (res.data.success) {
        setUsers(
          users.map((u) => {
            if (u._id === userId) {
              return { ...u, status: newStatus };
            }
            return u;
          })
        );
      }
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    try {
      const res = await API.post('/admin/announcements', {
        title: annTitle,
        content: annContent,
        priority: annPriority,
        category: annCategory
      });
      if (res.data.success) {
        alert('Official announcement broadcasted across the platform!');
        setShowAnnModal(false);
        setAnnTitle('');
        setAnnContent('');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to publish announcement');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to remove this announcement?')) return;
    try {
      const res = await API.delete(`/admin/announcements/${id}`);
      if (res.data.success) {
        setAnnouncements(announcements.filter((a) => a._id !== id));
      }
    } catch (err) {
      alert('Failed to delete announcement');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchUser) return true;
    const q = searchUser.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q) ||
      u.company?.toLowerCase().includes(q)
    );
  });

  const pendingAlumni = users.filter(
    (u) => u.role === 'alumni' && !u.isVerifiedAlumni
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-amber-900/30">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-accent-gold mb-2 border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-gold" />
            <span>Institutional Governance Control Room</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Admin Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Oversee user registrations, verify alumnus credentials, audit placement opportunities, and broadcast college-wide notices.
          </p>
        </div>

        <button
          onClick={() => setShowAnnModal(true)}
          className="bg-accent-gold hover:bg-amber-400 text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-1.5 flex-shrink-0"
        >
          <Megaphone className="w-4 h-4" />
          <span>Broadcast Official Bulletin</span>
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            adminTab === 'overview'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Platform Analytics
        </button>
        <button
          onClick={() => setAdminTab('verifications')}
          className={`px-4 py-2 rounded-lg transition-colors relative ${
            adminTab === 'verifications'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Alumni Verifications
          {pendingAlumni.length > 0 && (
            <span className="ml-1.5 bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {pendingAlumni.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            adminTab === 'users'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          User Directory ({users.length})
        </button>
        <button
          onClick={() => setAdminTab('announcements')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            adminTab === 'announcements'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Campus Bulletins ({announcements.length})
        </button>
      </div>

      {/* Tab: Overview & Analytics */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Students
                </span>
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{stats?.totalStudents || 0}</p>
              <p className="text-[11px] text-slate-400 mt-1">Undergraduate mentees</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Alumni
                </span>
                <Users className="w-5 h-5 text-brand-800" />
              </div>
              <p className="text-2xl font-black text-slate-900">{stats?.totalAlumni || 0}</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                {stats?.verifiedAlumni || 0} Verified Alumni
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Mentorships
                </span>
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-slate-900">{stats?.totalMentorships || 0}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                {stats?.activeMentorships || 0} In Progress • {stats?.completedMentorships || 0} Done
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Job Applications
                </span>
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{stats?.totalApplications || 0}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Across {stats?.totalJobs || 0} posted positions
              </p>
            </div>
          </div>

          {/* Department Breakdown & Top Companies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-brand-800" />
                Department Enrollment Distribution
              </h3>
              <div className="space-y-2.5">
                {stats?.departmentStats?.map((dept, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                      <span>{dept._id || 'General'}</span>
                      <strong className="text-slate-900">{dept.count} users</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-800 h-full rounded-full"
                        style={{ width: `${Math.min(dept.count * 20, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Top Alumni Employers Represented
              </h3>
              <div className="space-y-2">
                {stats?.companyStats?.map((comp, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-slate-800">{comp._id}</span>
                    <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      {comp.count} Alumni
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Alumni Verifications */}
      {adminTab === 'verifications' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Alumni Identity Verification Queue
              </h3>
              <p className="text-xs text-slate-500">
                Grant official "Verified Alumni" badge to protect students from unverified profiles.
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              {pendingAlumni.length} Pending
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="p-4">Alumnus Name</th>
                  <th className="p-4">Department & Batch</th>
                  <th className="p-4">Current Company & Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users
                  .filter((u) => u.role === 'alumni')
                  .map((alumnus) => (
                    <tr key={alumnus._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 flex items-center space-x-3">
                        <img
                          src={alumnus.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${alumnus.name}`}
                          alt={alumnus.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{alumnus.name}</p>
                          <p className="text-[11px] text-slate-400">{alumnus.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-slate-800">{alumnus.department}</p>
                        <p className="text-[10px] text-slate-400">Batch {alumnus.batchYear}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-brand-800">@{alumnus.company || 'Not set'}</p>
                        <p className="text-[11px] text-slate-500">{alumnus.designation || 'Alumnus'}</p>
                      </td>
                      <td className="p-4">
                        {alumnus.isVerifiedAlumni ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[10px] animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Pending Verification
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleVerification(alumnus._id)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors ${
                            alumnus.isVerifiedAlumni
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {alumnus.isVerifiedAlumni ? 'Revoke Badge' : 'Verify Credentials'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Users Management */}
      {adminTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-4 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search user by name, email, register no, department..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-700"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs py-2 px-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="alumni">Alumni</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Department & Reg No</th>
                  <th className="p-3">Account Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80">
                    <td className="p-3 flex items-center space-x-2.5">
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="capitalize font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-slate-800">{u.department}</p>
                      {u.registerNumber && (
                        <p className="text-[10px] font-mono text-slate-400">
                          Reg: {u.registerNumber}
                        </p>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          u.status === 'suspended'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(u._id, u.status)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                          u.status === 'active'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Campus Bulletins */}
      {adminTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Active College Bulletins & Placement Notices
            </h3>
            <button
              onClick={() => setShowAnnModal(true)}
              className="bg-brand-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              New Notice
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      {ann.priority} Priority
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {ann.category} • {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                </div>

                <button
                  onClick={() => handleDeleteAnnouncement(ann._id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded"
                  title="Remove announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Broadcast Announcement Modal */}
      {showAnnModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Broadcast Official Platform Notice
              </h3>
              <button
                onClick={() => setShowAnnModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notice Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Annual Placement Drive - Registration Open"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={annPriority}
                    onChange={(e) => setAnnPriority(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="urgent">Urgent</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50"
                  >
                    <option value="Placement">Placement</option>
                    <option value="Alumni Meet">Alumni Meet</option>
                    <option value="Academic">Academic</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notice Message Content
                </label>
                <textarea
                  rows="4"
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Write the full announcement text that will pin to student and alumni feeds..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                  required
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAnnModal(false)}
                  className="text-xs font-semibold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs font-bold bg-brand-800 hover:bg-brand-900 text-white px-5 py-2 rounded-lg shadow-sm"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
