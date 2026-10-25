import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  applyForJob,
  getMyPostings,
  getMyApplications,
  updateApplicantStatus,
  deleteJob
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getJobs);
router.get('/my/postings', protect, authorize('alumni', 'admin'), getMyPostings);
router.get('/my/applications', protect, getMyApplications);
router.get('/:id', protect, getJobById);
router.post('/', protect, authorize('alumni', 'admin'), createJob);
router.post('/:id/apply', protect, applyForJob);
router.put('/:id/applicants/:studentId/status', protect, authorize('alumni', 'admin'), updateApplicantStatus);
router.delete('/:id', protect, deleteJob);

export default router;
