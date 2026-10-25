import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  GraduationCap,
  ShieldCheck,
  Building2,
  ChevronRight
} from 'lucide-react';

const LoginPage = () => {
  const { login, quickLoginAs } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/feed');
    } else {
      setError(res.message);
    }
  };

  const handleQuickLogin = async (targetEmail) => {
    setLoading(true);
    const res = await quickLoginAs(targetEmail);
    setLoading(false);
    if (res.success) {
      navigate('/feed');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-6">
        {/* Institutional Branding */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-800 to-brand-900 flex items-center justify-center text-accent-gold font-black text-2xl shadow-lg border border-brand-700 mb-3">
            E
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            SRM Easwari Engineering College
          </h2>
          <p className="text-xs font-bold text-brand-800 uppercase tracking-widest mt-0.5">
            Integrated Alumni-Student Mentorship & Job Portal
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Department of Computer Science & Engineering (Cyber Security)
          </p>
        </div>

        {/* 1-Click Evaluation / Demo Accounts Switcher */}
        <div className="bg-gradient-to-br from-slate-900 to-brand-900 text-white rounded-2xl p-4 shadow-md border border-brand-700">
          <div className="flex items-center space-x-1.5 text-accent-gold text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Presentation Demo Logins</span>
          </div>
          <p className="text-[11px] text-slate-300 mb-3">
            Click any role to test the platform instantly:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('adithyan.benoy@student.srmrmp.edu.in')}
              className="text-left bg-white/10 hover:bg-white/20 p-2.5 rounded-xl border border-white/15 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold block text-white">🎓 Adithyan Benoy</span>
                <span className="text-[10px] text-brand-200">Presenter (Student)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-accent-gold" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('kavitha.s@paloaltonetworks.com')}
              className="text-left bg-white/10 hover:bg-white/20 p-2.5 rounded-xl border border-white/15 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold block text-white">🛡️ Kavitha Sridhar</span>
                <span className="text-[10px] text-brand-200">Alumni @ Palo Alto</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-accent-gold" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('divyanjali@easwari.srmrmp.edu.in')}
              className="text-left bg-white/10 hover:bg-white/20 p-2.5 rounded-xl border border-white/15 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold block text-white">👩‍🏫 Ms. Divyanjali</span>
                <span className="text-[10px] text-brand-200">Faculty Guide (Trainer)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-accent-gold" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@easwari.srmrmp.edu.in')}
              className="text-left bg-white/10 hover:bg-white/20 p-2.5 rounded-xl border border-white/15 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold block text-white">🏛️ Admin Office</span>
                <span className="text-[10px] text-brand-200">Placement & Admin</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-accent-gold" />
            </button>
          </div>
        </div>

        {/* Standard Login Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                College or Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  placeholder="e.g. adithyan.benoy@student.srmrmp.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-brand-700 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-brand-700 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-sm transition-colors mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            <span>New student or alumnus? </span>
            <Link to="/register" className="font-bold text-brand-800 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
