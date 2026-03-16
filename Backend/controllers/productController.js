// backend/controllers/productController.js
import Product from '../models/Product.js';

// @route POST /api/products
// @desc Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    
    const product = await Product.create({
      vendor: req.vendor._id,
      name,
      description,
      price
    });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/products/my-products
// @desc Get all products for logged-in vendor
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.vendor._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/products/:id
// @desc Update a product (e.g., toggle isAvailable or change price)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    // Ensure the vendor owns this product
    if (product.vendor.toString() !== req.vendor._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this product' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/products/:id
// @desc Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.vendor.toString() !== req.vendor._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};