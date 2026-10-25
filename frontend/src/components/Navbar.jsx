import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  GraduationCap,
  Briefcase,
  Users,
  Calendar,
  MessageSquare,
  ShieldCheck,
  LogOut,
  User as UserIcon,
  ChevronDown,
  CheckCircle2,
  Building2
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top organization bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold tracking-wider text-white">STUDENT ALUMNI PORTAL</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-medium">Centralized Career & Mentorship Network</span>
        </div>
        <div className="text-[11px] text-slate-400 hidden sm:block">
          Connecting Students, Industry Alumni & Recruiters
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/feed" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-800 to-slate-900 flex items-center justify-center text-accent-gold font-black text-xl shadow-md border border-brand-700 group-hover:scale-105 transition-transform">
                A
              </div>
              <div className="leading-tight">
                <span className="font-black text-slate-900 text-base tracking-tight flex items-center gap-1.5">
                  Alumni<span className="text-brand-800 font-extrabold">Hub</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                    Portal
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Student & Alumni Professional Network
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Items (LinkedIn-style tabs) */}
          <nav className="flex items-center space-x-1 md:space-x-2">
            <Link
              to="/feed"
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive('/feed')
                  ? 'text-brand-800 border-b-2 border-brand-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span className="hidden sm:inline">Feed</span>
            </Link>

            <Link
              to="/mentorship"
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive('/mentorship')
                  ? 'text-brand-800 border-b-2 border-brand-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-5 h-5 mb-0.5" />
              <span className="hidden sm:inline">Mentorship</span>
            </Link>

            <Link
              to="/jobs"
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive('/jobs')
                  ? 'text-brand-800 border-b-2 border-brand-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-5 h-5 mb-0.5" />
              <span className="hidden sm:inline">Jobs</span>
            </Link>

            <Link
              to="/network"
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive('/network')
                  ? 'text-brand-800 border-b-2 border-brand-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-5 h-5 mb-0.5" />
              <span className="hidden sm:inline">Directory</span>
            </Link>

            <Link
              to="/events"
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive('/events')
                  ? 'text-brand-800 border-b-2 border-brand-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-5 h-5 mb-0.5" />
              <span className="hidden sm:inline">Events</span>
            </Link>

            <Link
              to="/messages"
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors relative ${
                isActive('/messages')
                  ? 'text-brand-800 border-b-2 border-brand-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-5 h-5 mb-0.5" />
              <span className="hidden sm:inline">Messages</span>
              <span className="absolute top-1 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive('/admin')
                    ? 'text-amber-700 border-b-2 border-amber-700 bg-amber-50'
                    : 'text-amber-800 hover:bg-amber-50'
                }`}
              >
                <ShieldCheck className="w-5 h-5 mb-0.5 text-amber-600" />
                <span className="hidden sm:inline font-bold">Admin Panel</span>
              </Link>
            )}
          </nav>

          {/* Profile & User Dropdown */}
          <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-brand-600 shadow-sm"
                  />
                  <div className="hidden lg:block text-left text-xs leading-tight">
                    <p className="font-bold text-slate-800 flex items-center gap-1">
                      {user.name.split(' ')[0]}
                      {user.isVerifiedAlumni && user.role === 'alumni' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 inline" title="Verified Alumni" />
                      )}
                    </p>
                    <span className="capitalize text-[10px] text-slate-500 font-semibold bg-slate-100 px-1 py-0.2 rounded">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 divide-y divide-slate-100">
                    <div className="px-4 py-2.5">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1 text-[10px]">
                        <span className="bg-brand-50 text-brand-800 font-bold px-1.5 py-0.5 rounded uppercase">
                          {user.role}
                        </span>
                        {user.company && (
                          <span className="text-slate-600 truncate">@{user.company}</span>
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>View Full Profile</span>
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-brand-800 hover:bg-brand-50 px-3 py-2 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold bg-brand-800 text-white hover:bg-brand-900 px-3 py-2 rounded-lg shadow-sm"
                >
                  Join Portal
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
