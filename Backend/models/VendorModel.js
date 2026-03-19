import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    shopName: { type: String, required: true },
    shopSlug: { type: String, required: true, unique: true },
    whatsappNumber: { type: String, required: true },
    minimumOrderValue: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    isOpen: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    shopFrontImage: { type: String, default: '' },
    idProofImage: { type: String, default: '' },
    role: { 
        type: String, 
        enum: ['vendor', 'admin'], 
        default: 'vendor' 
      },
}, { timestamps: true });

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;