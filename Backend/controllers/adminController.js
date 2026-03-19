import Vendor from '../models/VendorModel.js';

export const getPendingVendors = async (req, res) => {
  try {
    const pendingVendors = await Vendor.find({
      isVerified: false,
      shopFrontImage: { $ne: null },
      idProofImage: { $ne: null }
    }).select('-password');

    return res.json(pendingVendors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password');
    
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    return res.json({ message: 'Vendor approved successfully', vendor });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const rejectVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { shopFrontImage: null, idProofImage: null },
      { new: true }
    ).select('-password');

    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    return res.json({ message: 'Vendor rejected. Documents cleared.', vendor });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};