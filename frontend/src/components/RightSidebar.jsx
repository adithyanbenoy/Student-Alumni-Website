import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import {
  Calendar,
  Sparkles,
  ChevronRight,
  Shield,
  Briefcase,
  Award,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

const RightSidebar = () => {
  const [mentors, setMentors] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [mentorRes, eventRes] = await Promise.all([
          API.get('/mentorship/mentors?limit=3'),
          API.get('/events')
        ]);
        if (mentorRes.data.success) {
          setMentors(mentorRes.data.mentors.slice(0, 3));
        }
        if (eventRes.data.success) {
          setEvents(eventRes.data.events.slice(0, 2));
        }
      } catch (err) {
        console.error('Sidebar fetch error', err);
      }
    };
    fetchSidebarData();
  }, []);

  return (
    <aside className="w-full lg:w-72 space-y-4">
      {/* Recommended Mentors Widget */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
            Featured Alumni Mentors
          </h4>
          <Link to="/mentorship" className="text-[11px] font-bold text-brand-800 hover:underline">
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {mentors.length === 0 ? (
            <p className="text-xs text-slate-400">Loading top mentors...</p>
          ) : (
            mentors.map((mentor) => (
              <div key={mentor._id} className="flex items-start space-x-2.5 pb-2.5 border-b border-slate-100 last:border-0 last:pb-0">
                <img
                  src={mentor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.name}`}
                  alt={mentor.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{mentor.name}</p>
                    {mentor.isVerifiedAlumni && (
                      <CheckCircle2 className="w-3 h-3 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">
                    {mentor.designation}
                  </p>
                  <p className="text-[10px] font-semibold text-brand-800 truncate">
                    @{mentor.company}
                  </p>
                  <Link
                    to="/mentorship"
                    className="inline-block mt-1 text-[10px] font-bold text-brand-800 bg-brand-50 hover:bg-brand-100 px-2 py-0.5 rounded border border-brand-200"
                  >
                    Request 1-on-1
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upcoming Events Widget */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            Webinars & Talks
          </h4>
          <Link to="/events" className="text-[11px] font-bold text-brand-800 hover:underline">
            See Events
          </Link>
        </div>

        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-xs text-slate-400">No upcoming events scheduled</p>
          ) : (
            events.map((ev) => (
              <div key={ev._id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[9px] font-bold uppercase bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                  {ev.category}
                </span>
                <h5 className="text-xs font-bold text-slate-800 mt-1 line-clamp-1">{ev.title}</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Speaker: <span className="font-semibold">{ev.speaker?.name}</span> ({ev.speaker?.company})
                </p>
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200 text-[10px] text-slate-600">
                  <span>{new Date(ev.date).toLocaleDateString()}</span>
                  <Link to="/events" className="font-bold text-brand-800 hover:underline flex items-center gap-0.5">
                    RSVP <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Platform Values Card */}
      <div className="bg-gradient-to-br from-slate-900 to-brand-900 rounded-xl p-4 text-white shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-accent-gold" />
          <h5 className="text-xs font-bold uppercase tracking-wider text-accent-gold">
            Network Impact
          </h5>
        </div>
        <p className="text-xs font-semibold text-slate-200">
          Centralized Student-Alumni Bridge
        </p>
        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
          Connecting verified alumni leaders across top tier technology companies directly with ambitious students for career mentorship and internal job referrals.
        </p>
      </div>
    </aside>
  );
};

export default RightSidebar;
