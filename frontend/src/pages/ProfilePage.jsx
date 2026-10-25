import React, { useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Building2,
  GraduationCap,
  MapPin,
  CheckCircle2,
  Linkedin,
  Github,
  Globe,
  FileText,
  Edit3,
  Save,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [company, setCompany] = useState(user?.company || '');
  const [designation, setDesignation] = useState(user?.designation || '');
  const [location, setLocation] = useState(user?.location || 'Chennai, India');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(user?.skills ? user.skills.join(', ') : '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || '');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [isMentorAvailable, setIsMentorAvailable] = useState(user?.isMentorAvailable || false);
  const [mentorTopics, setMentorTopics] = useState(
    user?.mentorTopics ? user.mentorTopics.join(', ') : ''
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put('/auth/profile', {
        name,
        company,
        designation,
        location,
        bio,
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        linkedinUrl,
        githubUrl,
        resumeUrl,
        isMentorAvailable,
        mentorTopics: mentorTopics.split(',').map((t) => t.trim()).filter(Boolean)
      });

      if (res.data.success) {
        updateUser(res.data.user);
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Banner with SRM Easwari Gradient */}
        <div className="h-36 bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-700 relative">
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
            {user.role} • SRM Easwari
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-4 gap-4">
            <div className="flex items-end space-x-4">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className="w-28 h-28 rounded-3xl border-4 border-white shadow-lg object-cover bg-white"
              />
              <div className="pb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
                  {user.isVerifiedAlumni && user.role === 'alumni' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      Verified Alumnus
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
                  {user.role === 'alumni'
                    ? `${user.designation || 'Alumnus'} @ ${user.company || 'Enterprise'}`
                    : `${user.department} • Batch ${user.batchYear}`}
                </p>
                {user.registerNumber && (
                  <p className="text-xs font-mono text-slate-400">
                    Register Number: <strong className="text-slate-700">{user.registerNumber}</strong>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>

          {/* Edit Form */}
          {isEditing ? (
            <form onSubmit={handleSave} className="mt-6 pt-6 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Edit Your Public Profile</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {user.role === 'alumni' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bio / Summary</label>
                <textarea
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Resume / CV Link (Google Drive / PDF URL)
                </label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              {user.role === 'alumni' && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="mentorAvailable"
                      checked={isMentorAvailable}
                      onChange={(e) => setIsMentorAvailable(e.target.checked)}
                      className="w-4 h-4 text-brand-800 rounded focus:ring-brand-700"
                    />
                    <label htmlFor="mentorAvailable" className="text-xs font-bold text-emerald-900">
                      I am open to mentoring SRM Easwari students 1-on-1
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-900 mb-1">
                      Mentorship Areas / Topics (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cyber Security Roadmap, Placement Prep, System Design"
                      value={mentorTopics}
                      onChange={(e) => setMentorTopics(e.target.value)}
                      className="w-full text-xs p-2 border border-emerald-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
              {/* About */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  About
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {user.bio || 'No bio provided yet.'}
                </p>
              </div>

              {/* Skills */}
              {user.skills && user.skills.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Skills & Competencies
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {user.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mentorship Focus (for alumni) */}
              {user.role === 'alumni' && user.mentorTopics && user.mentorTopics.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Mentorship Offerings
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {user.mentorTopics.map((topic, tIdx) => (
                      <span
                        key={tIdx}
                        className="bg-brand-50 text-brand-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-brand-200"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
                {user.linkedinUrl && (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-700 hover:underline"
                  >
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {user.githubUrl && (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-slate-800 hover:underline"
                  >
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
                {user.resumeUrl && (
                  <a
                    href={user.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-brand-800 hover:underline"
                  >
                    <FileText className="w-4 h-4" /> View Resume
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
