import mongoose from 'mongoose';

const mentorshipRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    topic: {
      type: String,
      required: [true, 'Please specify a mentorship topic/area'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Please provide details on what you would like guidance with']
    },
    preferredTiming: {
      type: String,
      default: 'Flexible / Weekends'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending'
    },
    meetingLink: {
      type: String,
      default: ''
    },
    scheduledDate: {
      type: Date
    },
    mentorNotes: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const MentorshipRequest = mongoose.model('MentorshipRequest', mentorshipRequestSchema);
export default MentorshipRequest;
