// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';   
import productRoutes from './routes/productRoutes.js'; 
import shopRoutes from './routes/shopRoutes.js'

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);   
app.use('/api/products', productRoutes); 
app.use('/api/shops', shopRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running correctly with ES6!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});