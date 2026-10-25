import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Briefcase,
  Award,
  CheckCircle2,
  Bookmark,
  Shield,
  Layers,
  Building,
  UserCheck
} from 'lucide-react';

const LeftSidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <aside className="w-full lg:w-64 space-y-4">
      {/* User Quick Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Banner with Easwari Gradient */}
        <div className="h-20 bg-gradient-to-r from-brand-800 via-brand-700 to-emerald-600 relative">
          <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
            {user.role}
          </div>
        </div>

        {/* Profile Avatar & Info */}
        <div className="p-4 pt-0 relative text-center border-b border-slate-100">
          <div className="flex justify-center -mt-10 mb-2">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-18 h-18 rounded-full border-4 border-white shadow-md object-cover bg-white"
            />
          </div>

          <Link to="/profile" className="group">
            <h3 className="font-bold text-slate-900 group-hover:text-brand-800 transition-colors flex items-center justify-center gap-1.5 text-sm">
              {user.name}
              {user.isVerifiedAlumni && user.role === 'alumni' && (
                <CheckCircle2 className="w-4 h-4 text-blue-600 inline" title="Verified Easwari Alumnus" />
              )}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {user.role === 'alumni'
              ? `${user.designation || 'Alumnus'} @ ${user.company || 'Tech Leader'}`
              : `${user.department} • Batch ${user.batchYear}`}
          </p>

          {user.registerNumber && (
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Reg No: {user.registerNumber}
            </p>
          )}

          {user.role === 'alumni' && user.isMentorAvailable && (
            <div className="mt-2 inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Open for Mentorship</span>
            </div>
          )}
        </div>

        {/* Quick Statistics */}
        <div className="p-3 text-xs divide-y divide-slate-100">
          <Link
            to="/mentorship"
            className="flex items-center justify-between py-1.5 text-slate-600 hover:text-brand-800 font-medium group"
          >
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-slate-400 group-hover:text-brand-800" />
              Mentorships
            </span>
            <span className="font-bold text-brand-800 bg-brand-50 px-1.5 py-0.2 rounded">Active</span>
          </Link>

          <Link
            to="/jobs"
            className="flex items-center justify-between py-1.5 text-slate-600 hover:text-brand-800 font-medium group"
          >
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-400 group-hover:text-brand-800" />
              Job Portal
            </span>
            <span className="font-bold text-slate-600">Explore</span>
          </Link>
        </div>

        {/* Institutional Affiliation Badge */}
        <div className="bg-slate-50 p-2.5 text-[11px] text-slate-500 text-center border-t border-slate-100">
          <span className="font-semibold text-brand-900">SRM Easwari Autonomous</span>
          <p className="text-[10px] text-slate-400">Department of CSE (Cyber Security)</p>
        </div>
      </div>

      {/* Quick Navigation / Shortcuts */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Campus Fast Tracks
        </h4>
        <ul className="space-y-1.5 text-xs">
          <li>
            <Link
              to="/mentorship"
              className="flex items-center space-x-2 text-slate-700 hover:text-brand-800 hover:bg-slate-50 p-1.5 rounded-lg transition-colors font-medium"
            >
              <UserCheck className="w-4 h-4 text-brand-700" />
              <span>Find Alumni Mentors</span>
            </Link>
          </li>
          <li>
            <Link
              to="/jobs"
              className="flex items-center space-x-2 text-slate-700 hover:text-brand-800 hover:bg-slate-50 p-1.5 rounded-lg transition-colors font-medium"
            >
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Campus & Alumni Referrals</span>
            </Link>
          </li>
          <li>
            <Link
              to="/events"
              className="flex items-center space-x-2 text-slate-700 hover:text-brand-800 hover:bg-slate-50 p-1.5 rounded-lg transition-colors font-medium"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Placement Webinars</span>
            </Link>
          </li>
          <li>
            <Link
              to="/network"
              className="flex items-center space-x-2 text-slate-700 hover:text-brand-800 hover:bg-slate-50 p-1.5 rounded-lg transition-colors font-medium"
            >
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Department Batch Directory</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default LeftSidebar;
