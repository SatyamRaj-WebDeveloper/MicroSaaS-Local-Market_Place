
import Vendor from '../models/VendorModel.js';

export const submitVerificationDocs = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    
    const shopFrontImage = req.files['shopFrontImage'] ? req.files['shopFrontImage'][0].path : null;
    const idProofImage = req.files['idProofImage'] ? req.files['idProofImage'][0].path : null;

    if (!shopFrontImage || !idProofImage) {
      return res.status(400).json({ message: 'Both Shop Front and ID Proof images are required.' });
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      {
        shopFrontImage: shopFrontImage,
        idProofImage: idProofImage,
      },
      { new: true }
    ).select('-password');

    return res.json(updatedVendor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route GET /api/vendors/me
// @desc Get current vendor profile
export const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor._id).select('-password');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    return res.json(vendor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};