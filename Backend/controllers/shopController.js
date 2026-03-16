// backend/controllers/shopController.js
import Vendor from '../models/Vendor.js';
import Product from '../models/Product.js';

// @route GET /api/shops/:slug
// @desc Get public vendor details and their available products
// @access Public (No JWT required)
export const getShopDetails = async (req, res) => {
  try {
    const { slug } = req.params;

    // 1. Find the vendor by their unique slug
    // We use .select() to hide sensitive info like passwords and emails from the public!
    const vendor = await Vendor.findOne({ shopSlug: slug }).select(
      'name shopName shopSlug whatsappNumber minimumOrderValue deliveryFee isOpen shopFrontImage'
    );

    if (!vendor) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // 2. Fetch only the products that belong to this vendor AND are marked as available
    const products = await Product.find({ 
      vendor: vendor._id,
      isAvailable: true 
    }).sort({ createdAt: -1 });

    // 3. Return everything the frontend needs to build the shop page
    return res.json({
      vendor,
      products
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};