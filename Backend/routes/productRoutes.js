// backend/routes/productRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createProduct, getMyProducts, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

// All product routes require the vendor to be logged in
router.route('/')
  .post(protect, createProduct);
  
router.get('/my-products', protect, getMyProducts);

router.route('/:id')
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

export default router;