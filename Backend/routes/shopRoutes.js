// backend/routes/shopRoutes.js
import express from 'express';
import { getShopDetails } from '../controllers/shopController.js';

const router = express.Router();

// Notice there is no 'protect' middleware here. Anyone can access this!
router.get('/:slug', getShopDetails);

export default router;