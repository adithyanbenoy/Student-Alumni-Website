import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  MessageSquare,
  Search,
  Filter,
  Check,
  X,
  Star,
  Sparkles,
  Building2,
  UserCheck
} from 'lucide-react';

const DEPARTMENTS = [
  'All Departments',
  'CSE (Cyber Security)',
  'CSE',
  'CSE (AI & ML)',
  'Information Technology',
  'ECE'
];

const MentorshipPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' | 'my-sessions'

  // Mentors state
  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');

  // Requests state
  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Request modal state
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestTopic, setRequestTopic] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [requestTiming, setRequestTiming] = useState('Weekends (Saturday / Sunday evening)');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Schedule modal state (for alumni accepting requests)
  const [activeSchedulingRequest, setActiveSchedulingRequest] = useState(null);
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/');
  const [scheduledDate, setScheduledDate] = useState('');
  const [mentorNotes, setMentorNotes] = useState('');

  // Rating modal state
  const [ratingRequest, setRatingRequest] = useState(null);
  const [stars, setStars] = useState(5);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchMentors();
    fetchMyRequests();
  }, [selectedDept]);

  const fetchMentors = async () => {
    setLoadingMentors(true);
    try {
      const deptQuery = selectedDept !== 'All Departments' ? `&department=${encodeURIComponent(selectedDept)}` : '';
      const res = await API.get(`/mentorship/mentors?${deptQuery}`);
      if (res.data.success) {
        setMentors(res.data.mentors);
      }
    } catch (err) {
      console.error('Failed to load mentors', err);
    } finally {
      setLoadingMentors(false);
    }
  };

  const fetchMyRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await API.get('/mentorship/my-requests');
      if (res.data.success) {
        setMyRequests(res.data.requests);
      }
    } catch (err) {
      console.error('Failed to load my requests', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!selectedMentor || !requestTopic.trim() || !requestMessage.trim()) return;

    setSubmittingRequest(true);
    try {
      const res = await API.post('/mentorship/request', {
        alumniId: selectedMentor._id,
        topic: requestTopic,
        message: requestMessage,
        preferredTiming: requestTiming
      });

      if (res.data.success) {
        alert('Mentorship request submitted successfully!');
        setSelectedMentor(null);
        setRequestTopic('');
        setRequestMessage('');
        setActiveTab('my-sessions');
        fetchMyRequests();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit mentorship request');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleAcceptRequest = async (reqId) => {
    try {
      const res = await API.put(`/mentorship/requests/${reqId}/status`, {
        status: 'accepted',
        meetingLink: meetingLink || 'https://meet.google.com/easwari-mentorship',
        scheduledDate: scheduledDate || new Date(Date.now() + 86400000 * 2),
        mentorNotes: mentorNotes || 'Looking forward to our session!'
      });
      if (res.data.success) {
        setActiveSchedulingRequest(null);
        fetchMyRequests();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleRejectRequest = async (reqId) => {
    if (!window.confirm('Are you sure you want to decline this request?')) return;
    try {
      const res = await API.put(`/mentorship/requests/${reqId}/status`, {
        status: 'rejected'
      });
      if (res.data.success) {
        fetchMyRequests();
      }
    } catch (err) {
      alert('Failed to decline request');
    }
  };

  const handleCompleteAndRate = async (e) => {
    e.preventDefault();
    if (!ratingRequest) return;
    try {
      const res = await API.put(`/mentorship/requests/${ratingRequest._id}/complete`, {
        rating: stars,
        feedback
      });
      if (res.data.success) {
        setRatingRequest(null);
        fetchMyRequests();
      }
    } catch (err) {
      alert('Failed to complete session');
    }
  };

  const filteredMentors = mentors.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.company?.toLowerCase().includes(q) ||
      m.designation?.toLowerCase().includes(q) ||
      m.skills?.some((s) => s.toLowerCase().includes(q)) ||
      m.mentorTopics?.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-800 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-accent-gold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SRM Easwari Engineering College Mentorship Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Connect 1-on-1 with Easwari Alumni Leaders
          </h1>
          <p className="text-sm text-brand-100 mt-2 leading-relaxed">
            Gain invaluable career advice, mock interview training, and guidance directly from seniors working at Google, Palo Alto Networks, Zoho, Amazon, and Cisco.
          </p>

          <div className="mt-5 flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                activeTab === 'discover'
                  ? 'bg-accent-gold text-slate-900'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              Explore Mentors ({filteredMentors.length})
            </button>
            <button
              onClick={() => setActiveTab('my-sessions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                activeTab === 'my-sessions'
                  ? 'bg-accent-gold text-slate-900'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              My Mentorship Sessions ({myRequests.length})
            </button>
          </div>
        </div>
      </div>

      {/* Discover Mentors Tab */}
      {activeTab === 'discover' && (
        <div className="space-y-6">
          {/* Search & Department Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search mentors by name, company (Google, Palo Alto, Zoho), domain, or skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-700"
                />
              </div>

              <div className="flex items-center space-x-2 w-full md:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full md:w-60 text-xs py-2 px-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium focus:ring-1 focus:ring-brand-700"
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

          {/* Mentors Grid */}
          {loadingMentors ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <div className="animate-spin w-8 h-8 border-4 border-brand-800 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-xs text-slate-500 font-medium">Fetching verified alumni mentors...</p>
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
              <GraduationCap className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-base font-bold text-slate-800">No alumni mentors found</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting your search query or department filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <div
                  key={mentor._id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Mentor Header */}
                    <div className="flex items-start space-x-3 pb-3 border-b border-slate-100">
                      <img
                        src={mentor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`}
                        alt={mentor.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500/20 shadow-sm flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <h3 className="font-bold text-slate-900 text-sm truncate">{mentor.name}</h3>
                          {mentor.isVerifiedAlumni && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" title="Verified Easwari Alumnus" />
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-700 truncate">
                          {mentor.designation}
                        </p>
                        <p className="text-xs font-bold text-brand-800 truncate flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          @{mentor.company}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {mentor.department} • Batch {mentor.batchYear}
                        </p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-600 my-3 line-clamp-3 leading-relaxed">
                      {mentor.bio || 'Passionate about giving back to juniors at SRM Easwari through mentorship.'}
                    </p>

                    {/* Mentorship Focus Topics */}
                    {mentor.mentorTopics && mentor.mentorTopics.length > 0 && (
                      <div className="mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Mentorship Areas:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {mentor.mentorTopics.map((topic, idx) => (
                            <span
                              key={idx}
                              className="bg-brand-50 text-brand-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-brand-200"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills Chips */}
                    {mentor.skills && mentor.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {mentor.skills.slice(0, 4).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Open for Mentoring
                    </span>

                    <button
                      onClick={() => {
                        setSelectedMentor(mentor);
                        setRequestTopic(mentor.mentorTopics?.[0] || 'Career Guidance & Interview Prep');
                      }}
                      className="bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors flex items-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Request 1-on-1
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Mentorship Sessions Tab */}
      {activeTab === 'my-sessions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              {user?.role === 'alumni' ? 'Incoming Student Requests' : 'My Requested Sessions'}
            </h2>
            <span className="text-xs text-slate-500">
              Total: <strong className="text-slate-800">{myRequests.length}</strong>
            </span>
          </div>

          {loadingRequests ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
              <div className="animate-spin w-6 h-6 border-2 border-brand-800 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-xs text-slate-500 font-medium">Loading your sessions...</p>
            </div>
          ) : myRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
              <GraduationCap className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-base font-bold text-slate-800">No mentorship sessions yet</p>
              <p className="text-xs text-slate-400 mt-1">
                {user?.role === 'alumni'
                  ? 'Incoming student requests will appear here.'
                  : 'Browse verified alumni and send your first mentorship request!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((req) => {
                const isAlumniUser = user?.role === 'alumni';
                const otherParty = isAlumniUser ? req.student : req.alumni;

                return (
                  <div
                    key={req._id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3.5">
                      <img
                        src={otherParty?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParty?.name}`}
                        alt={otherParty?.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-sm">{otherParty?.name}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              req.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : req.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : req.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800 animate-pulse'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500">
                          {isAlumniUser
                            ? `${req.student?.department} • Reg No: ${req.student?.registerNumber || 'N/A'}`
                            : `${req.alumni?.designation} @ ${req.alumni?.company}`}
                        </p>

                        <div className="mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                          <p className="font-bold text-slate-800">
                            Topic: <span className="font-semibold text-brand-800">{req.topic}</span>
                          </p>
                          <p className="text-slate-600 mt-1 italic">"{req.message}"</p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Preferred Timing: {req.preferredTiming}
                          </p>
                        </div>

                        {req.status === 'accepted' && (
                          <div className="mt-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                            {req.meetingLink && (
                              <div className="flex items-center gap-2">
                                <Video className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                                <span className="font-bold text-emerald-900">Meeting Link:</span>
                                <a
                                  href={req.meetingLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-brand-800 font-semibold underline truncate max-w-xs"
                                >
                                  {req.meetingLink}
                                </a>
                              </div>
                            )}
                            {req.mentorNotes && (
                              <p className="text-[11px] text-emerald-800">
                                <strong>Mentor Note:</strong> {req.mentorNotes}
                              </p>
                            )}
                          </div>
                        )}

                        {req.status === 'completed' && req.rating && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-amber-500">
                            {[...Array(req.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                            <span className="text-slate-600 ml-1 text-[11px]">
                              "{req.feedback || 'Completed successfully'}"
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      {isAlumniUser && req.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setActiveSchedulingRequest(req);
                              setScheduledDate(new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16));
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" /> Accept & Schedule
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req._id)}
                            className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" /> Decline
                          </button>
                        </div>
                      )}

                      {/* Chat / Direct Message Button */}
                      <button
                        onClick={() => navigate('/messages')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-brand-800" />
                        <span>Chat</span>
                      </button>

                      {/* Complete / Rate button */}
                      {!isAlumniUser && req.status === 'accepted' && (
                        <button
                          onClick={() => setRatingRequest(req)}
                          className="bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
                        >
                          <Star className="w-3.5 h-3.5 text-accent-gold" />
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Request Mentorship Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedMentor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedMentor.name}`}
                  alt={selectedMentor.name}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Request Mentorship with {selectedMentor.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedMentor.designation} @ {selectedMentor.company}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMentor(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendRequest} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mentorship Area / Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cyber Security Career Roadmap, Resume Review, Placement Prep"
                  value={requestTopic}
                  onChange={(e) => setRequestTopic(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Message / What would you like guidance on?
                </label>
                <textarea
                  rows="3"
                  placeholder="Introduce yourself, your current year, what you have worked on, and the specific questions you have for the mentor..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-700"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Time Slot
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekends after 5:00 PM IST"
                  value={requestTiming}
                  onChange={(e) => setRequestTiming(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="text-xs font-semibold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRequest}
                  className="text-xs font-bold bg-brand-800 hover:bg-brand-900 text-white px-5 py-2 rounded-lg shadow-sm"
                >
                  {submittingRequest ? 'Sending Request...' : 'Confirm Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal (For Alumni accepting student request) */}
      {activeSchedulingRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              Schedule Mentorship Call with {activeSchedulingRequest.student?.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add your meeting details to confirm the session.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Meeting Link (Google Meet / Zoom)
                </label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Scheduled Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes for Student (optional)
                </label>
                <textarea
                  rows="2"
                  value={mentorNotes}
                  onChange={(e) => setMentorNotes(e.target.value)}
                  placeholder="e.g. Please bring your resume and GitHub profile link"
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveSchedulingRequest(null)}
                  className="text-xs font-semibold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAcceptRequest(activeSchedulingRequest._id)}
                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg shadow-sm"
                >
                  Confirm & Send Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating & Feedback Modal */}
      {ratingRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              Rate Mentorship Session
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              With {ratingRequest.alumni?.name} ({ratingRequest.alumni?.company})
            </p>

            <form onSubmit={handleCompleteAndRate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setStars(val)}
                      className={`text-2xl transition-transform hover:scale-110 ${
                        val <= stars ? 'text-amber-400' : 'text-slate-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Feedback & Testimonial
                </label>
                <textarea
                  rows="3"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="How did this session help your career guidance or placement preparation?"
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRatingRequest(null)}
                  className="text-xs font-semibold text-slate-600 px-3 py-1.5 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs font-bold bg-brand-800 hover:bg-brand-900 text-white px-4 py-1.5 rounded-lg shadow-sm"
                >
                  Submit & Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorshipPage;
