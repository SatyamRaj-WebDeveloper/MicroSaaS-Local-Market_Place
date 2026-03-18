import Vendor from '../models/VendorModel.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

export const registerVendor = async (req, res) => {
  try {
    const { name, email, password, shopName, whatsappNumber } = req.body;

    const vendorExists = await Vendor.findOne({ email });
    if (vendorExists) return res.status(400).json({ message: 'Vendor already exists' });

    const shopSlug = shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const slugExists = await Vendor.findOne({ shopSlug });
    if (slugExists) return res.status(400).json({ message: 'Shop name too similar to another. Try a different name.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const vendor = await Vendor.create({
      name, email, shopName, shopSlug, whatsappNumber, password: hashedPassword
    });

    return res.status(201).json({
      _id: vendor._id,
      shopSlug: vendor.shopSlug,
      token: generateToken(vendor._id)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (vendor && (await bcrypt.compare(password, vendor.password))) {
      return res.json({
        _id: vendor._id,
        shopSlug: vendor.shopSlug,
        token: generateToken(vendor._id)
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};