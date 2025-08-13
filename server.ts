import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/order';
import adminRoutes from './routes/admin';
import contactRoutes from './routes/contact';
import newsletterRoutes from './routes/newsletter';
import emailRoutes from './routes/email';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/email', emailRoutes);
app.use('/images', express.static('public/images'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;