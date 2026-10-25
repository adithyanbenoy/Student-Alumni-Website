import User from '../models/User.js';
import Post from '../models/Post.js';
import Job from '../models/Job.js';
import MentorshipRequest from '../models/MentorshipRequest.js';
import Announcement from '../models/Announcement.js';

// @desc    Get Admin Dashboard Overview & Analytics
// @route   GET /api/admin/stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAlumni = await User.countDocuments({ role: 'alumni' });
    const verifiedAlumni = await User.countDocuments({ role: 'alumni', isVerifiedAlumni: true });
    const pendingVerifications = await User.countDocuments({ role: 'alumni', isVerifiedAlumni: false });
    const activeMentors = await User.countDocuments({ role: 'alumni', isMentorAvailable: true });

    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });

    // Count all applications across all jobs
    const jobs = await Job.find().select('applicants');
    const totalApplications = jobs.reduce((acc, j) => acc + (j.applicants ? j.applicants.length : 0), 0);

    const totalMentorships = await MentorshipRequest.countDocuments();
    const activeMentorships = await MentorshipRequest.countDocuments({ status: 'accepted' });
    const completedMentorships = await MentorshipRequest.countDocuments({ status: 'completed' });
    const pendingMentorships = await MentorshipRequest.countDocuments({ status: 'pending' });

    const totalPosts = await Post.countDocuments();
    const totalAnnouncements = await Announcement.countDocuments();

    // Department breakdown
    const departmentStats = await User.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Top companies
    const companyStats = await User.aggregate([
      { $match: { role: 'alumni', company: { $ne: '' } } },
      { $group: { _id: '$company', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalAlumni,
        verifiedAlumni,
        pendingVerifications,
        activeMentors,
        totalJobs,
        activeJobs,
        totalApplications,
        totalMentorships,
        activeMentorships,
        completedMentorships,
        pendingMentorships,
        totalPosts,
        totalAnnouncements,
        departmentStats,
        companyStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to aggregate dashboard analytics' });
  }
};

// @desc    Get all users for management
// @route   GET /api/admin/users
export const getAllUsersAdmin = async (req, res) => {
  try {
    const { role, verified, department, search } = req.query;
    let query = {};

    if (role && role !== 'all') {
      query.role = role;
    }
    if (verified === 'pending') {
      query.role = 'alumni';
      query.isVerifiedAlumni = false;
    } else if (verified === 'verified') {
      query.role = 'alumni';
      query.isVerifiedAlumni = true;
    }
    if (department && department !== 'all') {
      query.department = department;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { registerNumber: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

// @desc    Verify or Unverify Alumni
// @route   PUT /api/admin/users/:id/verify
export const toggleAlumniVerification = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isVerifiedAlumni = !user.isVerifiedAlumni;
    await user.save();

    res.json({
      success: true,
      message: `Alumni verification status updated to ${user.isVerifiedAlumni ? 'Verified' : 'Unverified'}`,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update verification status' });
  }
};

// @desc    Change user status (active / suspended) or role
// @route   PUT /api/admin/users/:id/status
export const updateUserStatusOrRole = async (req, res) => {
  try {
    const { status, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (status) user.status = status;
    if (role) user.role = role;

    await user.save();
    res.json({ success: true, message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

// @desc    Admin announcements
// @route   GET /api/admin/announcements
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .populate('author', 'name avatar role')
      .sort({ createdAt: -1 });
    res.json({ success: true, announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch announcements' });
  }
};

// @desc    Create official college announcement
// @route   POST /api/admin/announcements
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, priority, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const announcement = await Announcement.create({
      title,
      content,
      priority: priority || 'medium',
      category: category || 'General',
      author: req.user._id
    });

    const populated = await Announcement.findById(announcement._id).populate(
      'author',
      'name avatar role'
    );

    res.status(201).json({ success: true, announcement: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to post announcement' });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/admin/announcements/:id
export const deleteAnnouncement = async (req, res) => {
  try {
    const item = await Announcement.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    await item.deleteOne();
    res.json({ success: true, message: 'Announcement removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove announcement' });
  }
};
