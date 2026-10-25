import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['student', 'alumni', 'admin'],
      default: 'student'
    },
    avatar: {
      type: String,
      default: ''
    },
    department: {
      type: String,
      required: true,
      default: 'CSE (Cyber Security)'
    },
    batchYear: {
      type: Number,
      required: true
    },
    registerNumber: {
      type: String,
      trim: true,
      default: ''
    },
    // Alumni specific fields
    company: {
      type: String,
      default: ''
    },
    designation: {
      type: String,
      default: ''
    },
    experienceYears: {
      type: Number,
      default: 0
    },
    location: {
      type: String,
      default: 'Chennai, India'
    },
    bio: {
      type: String,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    linkedinUrl: {
      type: String,
      default: ''
    },
    githubUrl: {
      type: String,
      default: ''
    },
    portfolioUrl: {
      type: String,
      default: ''
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    isVerifiedAlumni: {
      type: Boolean,
      default: false
    },
    isMentorAvailable: {
      type: Boolean,
      default: false
    },
    mentorTopics: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'pending'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
