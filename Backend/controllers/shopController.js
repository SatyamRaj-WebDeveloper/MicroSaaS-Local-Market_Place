// backend/controllers/shopController.js
import Vendor from '../models/VendorModel.js';
import Product from '../models/ProductModel.js';

export const getShopDetails = async (req, res) => {
  try {
    const { slug } = req.params;

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