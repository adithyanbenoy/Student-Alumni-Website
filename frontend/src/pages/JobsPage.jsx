import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Send,
  PlusCircle,
  CheckCircle2,
  Users,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  FileText,
  Trash2,
  Sparkles
} from 'lucide-react';

const JobsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'my-applications' | 'posted-by-me'

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedWorkplace, setSelectedWorkplace] = useState('all');

  // Application tracker for student
  const [myApplications, setMyApplications] = useState([]);

  // Postings tracker for alumni/admin
  const [myPostings, setMyPostings] = useState([]);
  const [selectedJobApplicants, setSelectedJobApplicants] = useState(null);

  // Apply modal
  const [selectedJobToApply, setSelectedJobToApply] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [applying, setApplying] = useState(false);

  // Post new job modal
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState(user?.company || '');
  const [newLocation, setNewLocation] = useState('Chennai, India');
  const [newType, setNewType] = useState('Full-time');
  const [newWorkplaceType, setNewWorkplaceType] = useState('Hybrid');
  const [newDeptEligibility, setNewDeptEligibility] = useState('CSE (Cyber Security), CSE, IT');
  const [newSalary, setNewSalary] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRequirements, setNewRequirements] = useState('');
  const [submittingJob, setSubmittingJob] = useState(false);

  useEffect(() => {
    fetchJobs();
    if (user?.role === 'student') {
      fetchMyApplications();
    }
    if (user?.role === 'alumni' || user?.role === 'admin') {
      fetchMyPostings();
    }
  }, [selectedType, selectedWorkplace]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let query = [];
      if (selectedType !== 'all') query.push(`type=${encodeURIComponent(selectedType)}`);
      if (selectedWorkplace !== 'all') query.push(`workplaceType=${encodeURIComponent(selectedWorkplace)}`);
      const qStr = query.length > 0 ? `?${query.join('&')}` : '';

      const res = await API.get(`/jobs${qStr}`);
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await API.get('/jobs/my/applications');
      if (res.data.success) {
        setMyApplications(res.data.applications);
      }
    } catch (err) {
      console.error('Failed to load applications', err);
    }
  };

  const fetchMyPostings = async () => {
    try {
      const res = await API.get('/jobs/my/postings');
      if (res.data.success) {
        setMyPostings(res.data.jobs);
      }
    } catch (err) {
      console.error('Failed to load my postings', err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedJobToApply) return;

    setApplying(true);
    try {
      const res = await API.post(`/jobs/${selectedJobToApply._id}/apply`, {
        coverNote,
        resumeUrl
      });
      if (res.data.success) {
        alert('Application submitted successfully to the Easwari Alumni Recruiter!');
        setSelectedJobToApply(null);
        setCoverNote('');
        fetchJobs();
        fetchMyApplications();
        setActiveTab('my-applications');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!newTitle || !newCompany || !newDescription) return;

    setSubmittingJob(true);
    try {
      const res = await API.post('/jobs', {
        title: newTitle,
        company: newCompany,
        location: newLocation,
        type: newType,
        workplaceType: newWorkplaceType,
        departmentEligibility: newDeptEligibility,
        salaryOrStipend: newSalary,
        description: newDescription,
        requirements: newRequirements
      });

      if (res.data.success) {
        alert('Job opportunity published successfully to the SRM Easwari portal!');
        setShowPostJobModal(false);
        setNewTitle('');
        setNewDescription('');
        setNewRequirements('');
        fetchJobs();
        fetchMyPostings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post job');
    } finally {
      setSubmittingJob(false);
    }
  };

  const handleUpdateApplicantStatus = async (jobId, studentId, status) => {
    try {
      const res = await API.put(`/jobs/${jobId}/applicants/${studentId}/status`, {
        status,
        notes: `Status updated by recruiter to ${status}`
      });
      if (res.data.success) {
        fetchMyPostings();
        // Update local modal view
        if (selectedJobApplicants) {
          const updatedJob = { ...selectedJobApplicants };
          const app = updatedJob.applicants.find((a) => (a.student?._id || a.student) === studentId);
          if (app) app.status = status;
          setSelectedJobApplicants(updatedJob);
        }
      }
    } catch (err) {
      alert('Failed to update applicant status');
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      j.title?.toLowerCase().includes(q) ||
      j.company?.toLowerCase().includes(q) ||
      j.description?.toLowerCase().includes(q) ||
      j.requirements?.some((r) => r.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-brand-800 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-accent-gold mb-2 border border-white/20">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Campus & Alumni Referral Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Exclusive Jobs & Internships for SRM Easwari
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 mt-1 max-w-xl">
            Direct job openings and internship referrals posted by our alumni network and placement cell.
          </p>
        </div>

        {(user?.role === 'alumni' || user?.role === 'admin') && (
          <button
            onClick={() => setShowPostJobModal(true)}
            className="bg-accent-gold hover:bg-amber-400 text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-1.5 flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Career Opportunity</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('explore')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'explore'
              ? 'bg-brand-800 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Opportunities ({filteredJobs.length})
        </button>

        {user?.role === 'student' && (
          <button
            onClick={() => setActiveTab('my-applications')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'my-applications'
                ? 'bg-brand-800 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            My Applications ({myApplications.length})
          </button>
        )}

        {(user?.role === 'alumni' || user?.role === 'admin') && (
          <button
            onClick={() => setActiveTab('posted-by-me')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'posted-by-me'
                ? 'bg-brand-800 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            My Postings & Applicants ({myPostings.length})
          </button>
        )}
      </div>

      {/* Tab: Explore Opportunities */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, skills (e.g. Cyber Security, React, Python)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-700"
                />
              </div>

              <div className="flex items-center space-x-2 w-full md:w-auto">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="text-xs py-2 px-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium"
                >
                  <option value="all">All Job Types</option>
                  <option value="Internship">Internships</option>
                  <option value="Full-time">Full-time Roles</option>
                </select>

                <select
                  value={selectedWorkplace}
                  onChange={(e) => setSelectedWorkplace(e.target.value)}
                  className="text-xs py-2 px-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium"
                >
                  <option value="all">All Workplace Types</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job Listings Grid */}
          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <div className="animate-spin w-8 h-8 border-4 border-brand-800 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-xs text-slate-500 font-medium">Loading opportunities...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
              <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-base font-bold text-slate-800">No matching jobs found</p>
              <p className="text-xs text-slate-400 mt-1">Try broadening your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => {
                const hasApplied = job.applicants?.some(
                  (app) => (typeof app.student === 'object' ? app.student._id : app.student) === user?._id
                );

                return (
                  <div
                    key={job._id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Job Header */}
                      <div className="flex items-start space-x-3 pb-3 border-b border-slate-100">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-brand-800 text-base shadow-sm flex-shrink-0">
                          {job.company.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-slate-900 text-sm">{job.title}</h3>
                          <p className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {job.company}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {job.location} ({job.workplaceType})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Badges / Stipend */}
                      <div className="flex flex-wrap gap-1.5 my-3">
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-200">
                          {job.type}
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                          {job.salaryOrStipend}
                        </span>
                        {job.departmentEligibility?.map((dept, dIdx) => (
                          <span
                            key={dIdx}
                            className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded"
                          >
                            {dept}
                          </span>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                        {job.description}
                      </p>

                      {/* Requirements */}
                      {job.requirements && job.requirements.length > 0 && (
                        <div className="space-y-1 mb-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Key Requirements:
                          </p>
                          <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                            {job.requirements.slice(0, 2).map((req, rIdx) => (
                              <li key={rIdx} className="truncate">
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Footer / Apply action */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400">
                        Posted by{' '}
                        <strong className="text-slate-700">
                          {job.postedBy?.name || 'Alumni Cell'}
                        </strong>
                        {job.postedBy?.isVerifiedAlumni && (
                          <CheckCircle2 className="w-3 h-3 text-blue-600 inline ml-1" />
                        )}
                      </div>

                      {user?.role === 'student' ? (
                        hasApplied ? (
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedJobToApply(job)}
                            className="bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors flex items-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Easy Apply
                          </button>
                        )
                      ) : (
                        <span className="text-xs font-semibold text-slate-500">
                          {job.applicants?.length || 0} Applicants
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: My Applications (Student view) */}
      {activeTab === 'my-applications' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            My Submitted Applications & Tracking
          </h2>

          {myApplications.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
              <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-base font-bold text-slate-800">No applications submitted yet</p>
              <p className="text-xs text-slate-400 mt-1">Browse opportunities and apply with your profile!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myApplications.map((app, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{app.jobTitle}</h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {app.company} • {app.location}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                        app.status === 'accepted' || app.status === 'shortlisted'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : app.status === 'under_review'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : app.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      Status: {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: My Postings & Applicants (Alumni / Admin view) */}
      {activeTab === 'posted-by-me' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Job Postings Managed by You
            </h2>
          </div>

          {myPostings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
              <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-base font-bold text-slate-800">You haven't posted any jobs yet</p>
              <button
                onClick={() => setShowPostJobModal(true)}
                className="mt-3 bg-brand-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Post an Opportunity
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myPostings.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                    <p className="text-xs text-slate-600">
                      {job.company} • {job.location} ({job.type})
                    </p>
                    <p className="text-xs font-bold text-brand-800 mt-1">
                      {job.applicants?.length || 0} Student Applicants
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedJobApplicants(job)}
                      className="bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Review Applicants ({job.applicants?.length || 0})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Apply Modal */}
      {selectedJobToApply && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Apply for {selectedJobToApply.title}
                </h3>
                <p className="text-xs text-slate-500">
                  @{selectedJobToApply.company} • {selectedJobToApply.type}
                </p>
              </div>
              <button
                onClick={() => setSelectedJobToApply(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApply} className="mt-4 space-y-3.5">
              <div className="bg-brand-50 p-3 rounded-xl border border-brand-200 text-xs text-brand-900">
                <p className="font-bold">Applicant: {user?.name}</p>
                <p>Department: {user?.department} • Batch {user?.batchYear}</p>
                {user?.registerNumber && <p>Register No: {user?.registerNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Resume Link (Google Drive / GitHub / PDF URL)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/my-resume/view"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cover Note / Pitch to Alumnus Recruiter
                </label>
                <textarea
                  rows="4"
                  placeholder="Explain why you are interested in this position and highlight your key skills, projects, and relevant coursework..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-700"
                  required
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedJobToApply(null)}
                  className="text-xs font-semibold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="text-xs font-bold bg-brand-800 hover:bg-brand-900 text-white px-5 py-2 rounded-lg shadow-sm"
                >
                  {applying ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Applicants Drawer / Modal */}
      {selectedJobApplicants && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Applicants for "{selectedJobApplicants.title}"
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedJobApplicants.company} • {selectedJobApplicants.applicants?.length || 0} Total
                </p>
              </div>
              <button
                onClick={() => setSelectedJobApplicants(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto py-3 space-y-3 flex-1">
              {!selectedJobApplicants.applicants || selectedJobApplicants.applicants.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">
                  No applications received yet for this role.
                </p>
              ) : (
                selectedJobApplicants.applicants.map((app, aIdx) => (
                  <div
                    key={aIdx}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={app.student?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.student?.name}`}
                          alt={app.student?.name}
                          className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{app.student?.name}</h4>
                          <p className="text-slate-500">
                            {app.student?.department} • Batch {app.student?.batchYear}
                          </p>
                          {app.student?.registerNumber && (
                            <p className="text-[10px] font-mono text-slate-400">
                              Reg No: {app.student?.registerNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          app.status === 'shortlisted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-100">
                      "{app.coverNote || 'No cover note provided.'}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      {app.resumeUrl ? (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-800 hover:underline font-semibold flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View Resume
                        </a>
                      ) : (
                        <span className="text-slate-400">No resume attached</span>
                      )}

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() =>
                            handleUpdateApplicantStatus(
                              selectedJobApplicants._id,
                              app.student?._id || app.student,
                              'shortlisted'
                            )
                          }
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg text-[10px]"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateApplicantStatus(
                              selectedJobApplicants._id,
                              app.student?._id || app.student,
                              'rejected'
                            )
                          }
                          className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold px-2.5 py-1 rounded-lg text-[10px]"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Post a Job Modal (Alumni/Admin) */}
      {showPostJobModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Post an Opportunity for SRM Easwari Students
              </h3>
              <button
                onClick={() => setShowPostJobModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cyber Security Analyst Intern, SDE I, Cloud Engineer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Workplace</label>
                  <select
                    value={newWorkplaceType}
                    onChange={(e) => setNewWorkplaceType(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Salary / Stipend
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹40,000 / month or ₹8,00,000 - ₹12,00,000 CTC"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department Eligibility (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CSE (Cyber Security), CSE, IT or All Departments"
                  value={newDeptEligibility}
                  onChange={(e) => setNewDeptEligibility(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role Description
                </label>
                <textarea
                  rows="3"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the role responsibilities..."
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Key Requirements (comma separated)
                </label>
                <textarea
                  rows="2"
                  value={newRequirements}
                  onChange={(e) => setNewRequirements(e.target.value)}
                  placeholder="e.g. Strong problem solving, React, Python, Network security"
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="text-xs font-semibold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingJob}
                  className="text-xs font-bold bg-brand-800 hover:bg-brand-900 text-white px-5 py-2 rounded-lg shadow-sm"
                >
                  {submittingJob ? 'Publishing...' : 'Publish Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
