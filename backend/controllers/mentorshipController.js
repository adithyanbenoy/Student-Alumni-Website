import MentorshipRequest from '../models/MentorshipRequest.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Get alumni mentors list with filters
// @route   GET /api/mentorship/mentors
export const getMentors = async (req, res) => {
  try {
    const { topic, company, department, search } = req.query;
    let query = {
      role: 'alumni',
      isMentorAvailable: true,
      status: { $ne: 'suspended' }
    };

    if (department && department !== 'all') {
      query.department = department;
    }
    if (company) {
      query.company = { $regex: company, $options: 'i' };
    }
    if (topic && topic !== 'all') {
      query.mentorTopics = { $in: [new RegExp(topic, 'i')] };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
        { mentorTopics: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const mentors = await User.find(query).select(
      'name avatar role company designation department batchYear experienceYears bio skills mentorTopics isVerifiedAlumni linkedinUrl githubUrl'
    );

    res.json({ success: true, count: mentors.length, mentors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch mentors' });
  }
};

// @desc    Student sends mentorship request to an alumnus
// @route   POST /api/mentorship/request
export const sendMentorshipRequest = async (req, res) => {
  try {
    const { alumniId, topic, message, preferredTiming } = req.body;

    if (!alumniId || !topic || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide alumniId, topic, and message'
      });
    }

    const alumni = await User.findById(alumniId);
    if (!alumni || alumni.role !== 'alumni') {
      return res.status(404).json({ success: false, message: 'Alumnus mentor not found' });
    }

    // Check if there is already an active pending or accepted request
    const existing = await MentorshipRequest.findOne({
      student: req.user._id,
      alumni: alumniId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `You already have an active ${existing.status} mentorship session with this mentor.`
      });
    }

    const request = await MentorshipRequest.create({
      student: req.user._id,
      alumni: alumniId,
      topic,
      message,
      preferredTiming: preferredTiming || 'Flexible / Weekends'
    });

    // Notify the alumnus
    await Notification.create({
      recipient: alumniId,
      sender: req.user._id,
      type: 'mentorship_request',
      title: 'New Mentorship Request',
      message: `${req.user.name} (${req.user.department}) requested mentorship on "${topic}".`,
      link: '/mentorship'
    });

    const populatedRequest = await MentorshipRequest.findById(request._id)
      .populate('student', 'name avatar department batchYear registerNumber email')
      .populate('alumni', 'name avatar company designation department isVerifiedAlumni');

    res.status(201).json({ success: true, request: populatedRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error sending request' });
  }
};

// @desc    Get mentorship requests for the logged in user (as student or alumni)
// @route   GET /api/mentorship/my-requests
export const getMyRequests = async (req, res) => {
  try {
    const isAlumni = req.user.role === 'alumni';
    const query = isAlumni ? { alumni: req.user._id } : { student: req.user._id };

    const requests = await MentorshipRequest.find(query)
      .populate('student', 'name avatar department batchYear registerNumber email bio skills linkedinUrl githubUrl')
      .populate('alumni', 'name avatar company designation department batchYear isVerifiedAlumni email linkedinUrl')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch mentorship requests' });
  }
};

// @desc    Update request status (Accept / Reject / Schedule) by Alumnus
// @route   PUT /api/mentorship/requests/:id/status
export const updateRequestStatus = async (req, res) => {
  try {
    const { status, meetingLink, scheduledDate, mentorNotes } = req.body;
    const request = await MentorshipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Mentorship request not found' });
    }

    // Only designated alumni or admin can update
    if (request.alumni.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to manage this request' });
    }

    if (status) request.status = status;
    if (meetingLink !== undefined) request.meetingLink = meetingLink;
    if (scheduledDate) request.scheduledDate = scheduledDate;
    if (mentorNotes !== undefined) request.mentorNotes = mentorNotes;

    await request.save();

    // Notify the student
    await Notification.create({
      recipient: request.student,
      sender: req.user._id,
      type: 'mentorship_status',
      title: `Mentorship Request ${status.toUpperCase()}`,
      message: `Your mentorship request with ${req.user.name} has been ${status}.${meetingLink ? ' Meeting link is available.' : ''}`,
      link: '/mentorship'
    });

    const populatedRequest = await MentorshipRequest.findById(request._id)
      .populate('student', 'name avatar department batchYear registerNumber email')
      .populate('alumni', 'name avatar company designation department isVerifiedAlumni');

    res.json({ success: true, request: populatedRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update request' });
  }
};

// @desc    Complete mentorship session & leave rating/feedback
// @route   PUT /api/mentorship/requests/:id/complete
export const completeSession = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const request = await MentorshipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Mentorship request not found' });
    }

    request.status = 'completed';
    if (rating) request.rating = Number(rating);
    if (feedback) request.feedback = feedback;

    await request.save();

    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to complete session' });
  }
};
