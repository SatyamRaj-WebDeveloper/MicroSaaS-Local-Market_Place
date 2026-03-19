import express from 'express';
import { protect , isAdmin} from '../middleware/authMiddleware.js';
import { getPendingVendors, approveVendor, rejectVendor } from '../controllers/adminController.js';

const router = express.Router();


router.get('/vendors/pending', protect, isAdmin , getPendingVendors);
router.put('/vendors/:id/approve', protect, isAdmin ,approveVendor);
router.put('/vendors/:id/reject', protect, isAdmin , rejectVendor);

export default router;