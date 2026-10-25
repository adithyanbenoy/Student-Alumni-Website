import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Building2,
  Lock,
  Mail,
  User,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const DEPARTMENTS = [
  'CSE (Cyber Security)',
  'CSE',
  'CSE (AI & ML)',
  'Information Technology',
  'ECE',
  'EEE',
  'Mechanical Engineering',
  'Civil Engineering'
];

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('student'); // 'student' | 'alumni'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('CSE (Cyber Security)');
  const [batchYear, setBatchYear] = useState('2026');
  const [registerNumber, setRegisterNumber] = useState('');

  // Alumni fields
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [experienceYears, setExperienceYears] = useState('2');
  const [isMentorAvailable, setIsMentorAvailable] = useState(true);
  const [mentorTopics, setMentorTopics] = useState('Cyber Security, Placement Preparation, Mock Interviews');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      name,
      email,
      password,
      role,
      department,
      batchYear: Number(batchYear),
      registerNumber,
      company,
      designation,
      experienceYears: Number(experienceYears),
      isMentorAvailable,
      mentorTopics: mentorTopics.split(',').map((t) => t.trim())
    };

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      navigate('/feed');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="max-w-xl w-full space-y-6">
        {/* Branding */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-800 to-brand-900 flex items-center justify-center text-accent-gold font-black text-2xl shadow-lg border border-brand-700 mb-3">
            E
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Join the SRM Easwari Community
          </h2>
          <p className="text-xs font-bold text-brand-800 uppercase tracking-widest mt-0.5">
            Integrated Alumni-Student Mentorship & Job Portal
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                role === 'student'
                  ? 'bg-brand-50 border-brand-700 text-brand-900 shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-brand-800" />
              <span>I am a Student</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('alumni')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                role === 'alumni'
                  ? 'bg-brand-50 border-brand-700 text-brand-900 shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4 text-brand-800" />
              <span>I am an Alumnus</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Adithyan Benoy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-brand-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {role === 'student' ? 'College Email Address' : 'Corporate / Personal Email'}
              </label>
              <input
                type="email"
                placeholder={
                  role === 'student'
                    ? 'studentname@student.srmrmp.edu.in'
                    : 'alumni@company.com'
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-brand-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-brand-700"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {role === 'student' ? 'Graduation Batch' : 'Passout Year'}
                </label>
                <input
                  type="number"
                  value={batchYear}
                  onChange={(e) => setBatchYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            {role === 'student' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  SRM Easwari Register Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 310624149003"
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  required
                />
              </div>
            )}

            {role === 'alumni' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                    <input
                      type="text"
                      placeholder="e.g. Palo Alto Networks, Google, Zoho"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Cloud Security Architect"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-brand-50 rounded-xl border border-brand-200 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="mentorToggle"
                      checked={isMentorAvailable}
                      onChange={(e) => setIsMentorAvailable(e.target.checked)}
                      className="w-4 h-4 text-brand-800 rounded"
                    />
                    <label htmlFor="mentorToggle" className="text-xs font-bold text-brand-900">
                      Enable Mentorship Offerings for Students
                    </label>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-900 mb-1">
                      Mentoring Areas (comma separated)
                    </label>
                    <input
                      type="text"
                      value={mentorTopics}
                      onChange={(e) => setMentorTopics(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-brand-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-sm transition-colors mt-2"
            >
              {loading ? 'Registering Account...' : 'Join SRM Easwari Network'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            <span>Already registered? </span>
            <Link to="/login" className="font-bold text-brand-800 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
