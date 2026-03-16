// backend/routes/vendorRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { submitVerificationDocs, getVendorProfile } from '../controllers/vendorController.js';
import upload from '../utils/cloudinary.js';

const router = express.Router();

router.get('/me', protect, getVendorProfile);

// This route expects two files named 'shopFrontImage' and 'idProofImage'
router.put('/verify', protect, upload.fields([
  { name: 'shopFrontImage', maxCount: 1 }, 
  { name: 'idProofImage', maxCount: 1 }
]), submitVerificationDocs);

export default router;