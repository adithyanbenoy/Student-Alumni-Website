import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // New event modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:30 AM - 12:00 PM IST');
  const [location, setLocation] = useState('Online via Google Meet');
  const [meetingUrl, setMeetingUrl] = useState('https://meet.google.com/easwari-session');
  const [category, setCategory] = useState('Webinar');
  const [speakerName, setSpeakerName] = useState(user?.name || '');
  const [speakerRole, setSpeakerRole] = useState(user?.designation || 'Alumnus');
  const [speakerCompany, setSpeakerCompany] = useState(user?.company || 'Industry Leader');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await API.get('/events');
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId) => {
    try {
      const res = await API.put(`/events/${eventId}/rsvp`);
      if (res.data.success) {
        setEvents(
          events.map((ev) => {
            if (ev._id === eventId) {
              const currentAttendees = ev.attendees || [];
              const isNowAttending = res.data.isAttending;
              return {
                ...ev,
                attendees: isNowAttending
                  ? [...currentAttendees, user]
                  : currentAttendees.filter(
                      (a) => (typeof a === 'object' ? a._id : a) !== user?._id
                    )
              };
            }
            return ev;
          })
        );
      }
    } catch (err) {
      alert('Failed to update RSVP');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/events', {
        title,
        description,
        date: date || new Date(Date.now() + 86400000 * 7),
        time,
        location,
        meetingUrl,
        category,
        speaker: {
          name: speakerName,
          role: speakerRole,
          company: speakerCompany
        }
      });
      if (res.data.success) {
        alert('Event scheduled successfully!');
        setShowModal(false);
        fetchEvents();
      }
    } catch (err) {
      alert('Failed to create event');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-800 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-accent-gold mb-2 border border-white/20">
            <Calendar className="w-3.5 h-3.5" />
            <span>Campus Placement & Alumni Webinars</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            SRM Easwari Conclaves & Tech Talks
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 mt-1 max-w-xl">
            Live technical sessions, placement interview series, and alumni keynotes designed to prepare students for top tier industry careers.
          </p>
        </div>

        {(user?.role === 'alumni' || user?.role === 'admin') && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-accent-gold hover:bg-amber-400 text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-1.5 flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Host an Alumni Session</span>
          </button>
        )}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="animate-spin w-8 h-8 border-4 border-brand-800 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-xs text-slate-500 font-medium">Loading upcoming events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
          <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="text-base font-bold text-slate-800">No scheduled sessions</p>
          <p className="text-xs text-slate-400 mt-1">Check back soon for new webinar announcements!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => {
            const isAttending = ev.attendees?.some(
              (att) => (typeof att === 'object' ? att._id : att) === user?._id
            );

            return (
              <div
                key={ev._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200 uppercase">
                      {ev.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {ev.time}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {ev.title}
                  </h3>

                  <div className="flex items-center space-x-2 my-3 text-xs text-slate-600">
                    <Calendar className="w-4 h-4 text-brand-800" />
                    <span className="font-semibold">
                      {new Date(ev.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span>•</span>
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{ev.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {ev.description}
                  </p>

                  {/* Speaker Card */}
                  {ev.speaker && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center space-x-3 mb-4">
                      <img
                        src={ev.speaker.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${ev.speaker.name}`}
                        alt={ev.speaker.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{ev.speaker.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {ev.speaker.role} @ <strong className="text-brand-800">{ev.speaker.company}</strong>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer / RSVP / Join */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Users className="w-4 h-4 text-slate-400" />
                    {ev.attendees?.length || 0} Attending
                  </span>

                  <div className="flex items-center space-x-2">
                    {ev.meetingUrl && (
                      <a
                        href={ev.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5 text-brand-800" />
                        Join Link
                      </a>
                    )}

                    <button
                      onClick={() => handleRSVP(ev._id)}
                      className={`text-xs font-bold px-4 py-1.5 rounded-lg shadow-xs transition-colors flex items-center gap-1 ${
                        isAttending
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-brand-800 hover:bg-brand-900 text-white'
                      }`}
                    >
                      {isAttending ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          RSVP Confirmed
                        </>
                      ) : (
                        'RSVP Now'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Host Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Schedule an SRM Easwari Alumni Session
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Session Title</label>
                <input
                  type="text"
                  placeholder="e.g. Masterclass on Cloud Security & DevSecOps"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50"
                >
                  <option value="Webinar">Webinar</option>
                  <option value="Tech Talk">Tech Talk</option>
                  <option value="Alumni Reunion">Alumni Reunion</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Mock Interview">Mock Interview Session</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Meeting URL (Google Meet / Zoom)
                </label>
                <input
                  type="url"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline what students will learn from this session..."
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                  required
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-xs font-semibold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs font-bold bg-brand-800 hover:bg-brand-900 text-white px-5 py-2 rounded-lg shadow-sm"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
