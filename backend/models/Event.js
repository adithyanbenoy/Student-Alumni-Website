import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    location: {
      type: String,
      default: 'Online - Google Meet'
    },
    meetingUrl: {
      type: String,
      default: ''
    },
    speaker: {
      name: String,
      role: String,
      company: String,
      avatar: String
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    bannerUrl: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      enum: ['Webinar', 'Tech Talk', 'Alumni Reunion', 'Workshop', 'Mock Interview'],
      default: 'Webinar'
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;
