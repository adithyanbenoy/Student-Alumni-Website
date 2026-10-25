import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Building2,
  GraduationCap,
  MessageSquare,
  Linkedin,
  Github,
  Mail,
  ExternalLink
} from 'lucide-react';

const DEPARTMENTS = [
  'All Departments',
  'CSE (Cyber Security)',
  'CSE',
  'CSE (AI & ML)',
  'Information Technology',
  'ECE',
  'EEE'
];

const NetworkPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'alumni' | 'student'
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, selectedDept]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let params = [];
      if (roleFilter !== 'all') params.push(`role=${roleFilter}`);
      if (selectedDept !== 'All Departments') params.push(`department=${encodeURIComponent(selectedDept)}`);
      const qStr = params.length > 0 ? `?${params.join('&')}` : '';

      const res = await API.get(`/auth/users${qStr}`);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.company?.toLowerCase().includes(q) ||
      u.designation?.toLowerCase().includes(q) ||
      u.skills?.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-brand-800" />
              Student & Alumni Directory Network
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Connect with fellow classmates, discover seniors in tier-1 organizations, and expand your professional circle.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                roleFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Members
            </button>
            <button
              onClick={() => setRoleFilter('alumni')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                roleFilter === 'alumni'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Alumni
            </button>
            <button
              onClick={() => setRoleFilter('student')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                roleFilter === 'student'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Students
            </button>
          </div>
        </div>

        {/* Search & Department Filters */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, company (Google, Palo Alto, Zoho), role, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-700"
            />
          </div>

          <div className="w-full md:w-auto">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full md:w-60 text-xs py-2 px-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Directory Cards Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="animate-spin w-8 h-8 border-4 border-brand-800 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-xs text-slate-500 font-medium">Loading community directory...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
          <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="text-base font-bold text-slate-800">No community members found</p>
          <p className="text-xs text-slate-400 mt-1">Try modifying your search or department filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((person) => (
            <div
              key={person._id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Banner */}
                <div className="h-16 bg-gradient-to-r from-brand-800 via-emerald-700 to-teal-600 relative">
                  <span className="absolute top-2 right-2 bg-white/20 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                    {person.role}
                  </span>
                </div>

                {/* Profile Header */}
                <div className="px-5 pb-3 pt-0 relative">
                  <div className="-mt-8 mb-2 flex justify-between items-end">
                    <img
                      src={person.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`}
                      alt={person.name}
                      className="w-16 h-16 rounded-2xl border-4 border-white shadow-md object-cover bg-white"
                    />
                    {person.isVerifiedAlumni && person.role === 'alumni' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full mb-1">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                        Verified
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{person.name}</h3>

                  <p className="text-xs text-slate-600 font-medium">
                    {person.role === 'alumni'
                      ? `${person.designation || 'Alumnus'} @ ${person.company || 'Enterprise'}`
                      : `${person.department} • Batch ${person.batchYear}`}
                  </p>

                  {person.registerNumber && (
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                      Reg No: {person.registerNumber}
                    </p>
                  )}

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {person.bio || 'Member of the Student Alumni network.'}
                  </p>

                  {/* Skills */}
                  {person.skills && person.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {person.skills.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons & Links */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-400">
                  {person.linkedinUrl && (
                    <a
                      href={person.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {person.githubUrl && (
                    <a
                      href={person.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-slate-800 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  <a
                    href={`mailto:${person.email}`}
                    className="hover:text-brand-800 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>

                <button
                  onClick={() => navigate('/messages')}
                  className="bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NetworkPage;
