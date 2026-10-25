import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    companyLogo: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: 'Chennai, India'
    },
    type: {
      type: String,
      enum: ['Full-time', 'Internship', 'Part-time', 'Contract'],
      default: 'Full-time'
    },
    workplaceType: {
      type: String,
      enum: ['On-site', 'Remote', 'Hybrid'],
      default: 'Hybrid'
    },
    departmentEligibility: {
      type: [String],
      default: ['All Departments']
    },
    description: {
      type: String,
      required: [true, 'Job description is required']
    },
    requirements: {
      type: [String],
      default: []
    },
    salaryOrStipend: {
      type: String,
      default: 'Competitive / As per industry standards'
    },
    applyDeadline: {
      type: Date
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'under_review'],
      default: 'active'
    },
    externalApplyUrl: {
      type: String,
      default: ''
    },
    applicants: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        resumeUrl: {
          type: String,
          default: ''
        },
        coverNote: {
          type: String,
          default: ''
        },
        appliedAt: {
          type: Date,
          default: Date.now
        },
        status: {
          type: String,
          enum: ['applied', 'under_review', 'shortlisted', 'accepted', 'rejected'],
          default: 'applied'
        },
        notes: {
          type: String,
          default: ''
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
