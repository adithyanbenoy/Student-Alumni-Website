import Job from '../models/Job.js';
import Notification from '../models/Notification.js';

// @desc    Get all active jobs/internships
// @route   GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    const { type, workplaceType, department, search } = req.query;
    let query = { status: 'active' };

    if (type && type !== 'all') {
      query.type = type;
    }
    if (workplaceType && workplaceType !== 'all') {
      query.workplaceType = workplaceType;
    }
    if (department && department !== 'all') {
      query.$or = [
        { departmentEligibility: { $in: [department] } },
        { departmentEligibility: { $in: ['All Departments'] } }
      ];
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requirements: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'name avatar company designation department role isVerifiedAlumni')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name avatar company designation department email linkedinUrl isVerifiedAlumni')
      .populate('applicants.student', 'name email avatar department batchYear registerNumber skills resumeUrl');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch job details' });
  }
};

// @desc    Post a new Job or Internship (Alumni & Admin)
// @route   POST /api/jobs
export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      workplaceType,
      departmentEligibility,
      description,
      requirements,
      salaryOrStipend,
      applyDeadline,
      externalApplyUrl
    } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job title, company, and description'
      });
    }

    const job = await Job.create({
      title,
      company,
      location: location || 'Chennai, India',
      type: type || 'Full-time',
      workplaceType: workplaceType || 'Hybrid',
      departmentEligibility: Array.isArray(departmentEligibility)
        ? departmentEligibility
        : departmentEligibility
        ? departmentEligibility.split(',').map((d) => d.trim())
        : ['All Departments'],
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : requirements
        ? requirements.split(',').map((r) => r.trim())
        : [],
      salaryOrStipend: salaryOrStipend || 'Competitive / As per industry standards',
      applyDeadline: applyDeadline || null,
      externalApplyUrl: externalApplyUrl || '',
      postedBy: req.user._id,
      companyLogo: `https://logo.clearbit.com/${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
    });

    const populatedJob = await Job.findById(job._id).populate(
      'postedBy',
      'name avatar company designation department role isVerifiedAlumni'
    );

    res.status(201).json({ success: true, job: populatedJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error posting job' });
  }
};

// @desc    Apply for a Job / Internship (Student)
// @route   POST /api/jobs/:id/apply
export const applyForJob = async (req, res) => {
  try {
    const { coverNote, resumeUrl } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This job posting is no longer active' });
    }

    // Check if student already applied
    const hasApplied = job.applicants.some(
      (app) => app.student.toString() === req.user._id.toString()
    );

    if (hasApplied) {
      return res.status(400).json({ success: false, message: 'You have already applied for this opportunity' });
    }

    job.applicants.push({
      student: req.user._id,
      coverNote: coverNote || '',
      resumeUrl: resumeUrl || req.user.resumeUrl || '',
      appliedAt: new Date(),
      status: 'applied'
    });

    await job.save();

    // Notify the job poster
    await Notification.create({
      recipient: job.postedBy,
      sender: req.user._id,
      type: 'job_alert',
      title: 'New Job Application',
      message: `${req.user.name} applied for "${job.title}" at ${job.company}.`,
      link: `/jobs`
    });

    res.json({ success: true, message: 'Application submitted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error submitting application' });
  }
};

// @desc    Get jobs posted by the logged-in user (Alumni/Admin) with applicant details
// @route   GET /api/jobs/my/postings
export const getMyPostings = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate('applicants.student', 'name email avatar department batchYear registerNumber skills resumeUrl linkedinUrl')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your postings' });
  }
};

// @desc    Get applications submitted by the logged in student
// @route   GET /api/jobs/my/applications
export const getMyApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ 'applicants.student': req.user._id })
      .populate('postedBy', 'name company designation avatar')
      .sort({ createdAt: -1 });

    const applications = jobs.map((job) => {
      const myApp = job.applicants.find(
        (app) => app.student.toString() === req.user._id.toString()
      );
      return {
        jobId: job._id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        workplaceType: job.workplaceType,
        salaryOrStipend: job.salaryOrStipend,
        postedBy: job.postedBy,
        appliedAt: myApp?.appliedAt,
        status: myApp?.status || 'applied',
        notes: myApp?.notes
      };
    });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your applications' });
  }
};

// @desc    Update applicant status (Shortlist, Accept, Reject)
// @route   PUT /api/jobs/:id/applicants/:studentId/status
export const updateApplicantStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to manage applicants' });
    }

    const applicant = job.applicants.find(
      (app) => app.student.toString() === req.params.studentId
    );

    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant not found' });
    }

    if (status) applicant.status = status;
    if (notes !== undefined) applicant.notes = notes;

    await job.save();

    // Notify the student
    await Notification.create({
      recipient: req.params.studentId,
      sender: req.user._id,
      type: 'application_status',
      title: 'Job Application Status Updated',
      message: `Your application status for "${job.title}" at ${job.company} is now: ${status.toUpperCase()}.`,
      link: '/jobs'
    });

    res.json({ success: true, message: 'Applicant status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update applicant status' });
  }
};

// @desc    Delete or Close a job posting
// @route   DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.json({ success: true, message: 'Job posting deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete job' });
  }
};
