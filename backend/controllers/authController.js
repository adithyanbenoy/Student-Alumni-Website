import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'srm_easwari_alumni_secret_key_2026_secure', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user (Student or Alumni)
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      department,
      batchYear,
      registerNumber,
      company,
      designation,
      experienceYears,
      skills,
      bio,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      isMentorAvailable,
      mentorTopics
    } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const userData = {
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'student',
      department: department || 'CSE (Cyber Security)',
      batchYear: Number(batchYear) || 2026,
      registerNumber: registerNumber || '',
      company: company || '',
      designation: designation || '',
      experienceYears: Number(experienceYears) || 0,
      bio: bio || '',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      linkedinUrl: linkedinUrl || '',
      githubUrl: githubUrl || '',
      portfolioUrl: portfolioUrl || '',
      isMentorAvailable: Boolean(isMentorAvailable),
      mentorTopics: Array.isArray(mentorTopics) ? mentorTopics : (mentorTopics ? mentorTopics.split(',').map(t => t.trim()) : []),
      // Alumni need verification unless designated admin
      isVerifiedAlumni: role === 'alumni' ? false : true,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    };

    const user = await User.create(userData);
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        batchYear: user.batchYear,
        registerNumber: user.registerNumber,
        company: user.company,
        designation: user.designation,
        experienceYears: user.experienceYears,
        skills: user.skills,
        bio: user.bio,
        avatar: user.avatar,
        linkedinUrl: user.linkedinUrl,
        githubUrl: user.githubUrl,
        portfolioUrl: user.portfolioUrl,
        isVerifiedAlumni: user.isVerifiedAlumni,
        isMentorAvailable: user.isMentorAvailable,
        mentorTopics: user.mentorTopics,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended by the administrator.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        batchYear: user.batchYear,
        registerNumber: user.registerNumber,
        company: user.company,
        designation: user.designation,
        experienceYears: user.experienceYears,
        skills: user.skills,
        bio: user.bio,
        avatar: user.avatar,
        linkedinUrl: user.linkedinUrl,
        githubUrl: user.githubUrl,
        portfolioUrl: user.portfolioUrl,
        resumeUrl: user.resumeUrl,
        isVerifiedAlumni: user.isVerifiedAlumni,
        isMentorAvailable: user.isMentorAvailable,
        mentorTopics: user.mentorTopics,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updatableFields = [
      'name',
      'department',
      'batchYear',
      'registerNumber',
      'company',
      'designation',
      'experienceYears',
      'location',
      'bio',
      'skills',
      'linkedinUrl',
      'githubUrl',
      'portfolioUrl',
      'resumeUrl',
      'isMentorAvailable',
      'mentorTopics',
      'avatar'
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    const updatedUser = await user.save();
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error updating profile' });
  }
};

// @desc    Get all users (Directory search & filter)
// @route   GET /api/auth/users
export const getAllUsers = async (req, res) => {
  try {
    const { role, department, batchYear, company, search, mentorOnly } = req.query;
    let query = { status: { $ne: 'suspended' } };

    if (role && role !== 'all') {
      query.role = role;
    }
    if (department && department !== 'all') {
      query.department = department;
    }
    if (batchYear) {
      query.batchYear = Number(batchYear);
    }
    if (company) {
      query.company = { $regex: company, $options: 'i' };
    }
    if (mentorOnly === 'true') {
      query.isMentorAvailable = true;
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

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch directory users' });
  }
};

// @desc    Get user by ID
// @route   GET /api/auth/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};
