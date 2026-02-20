import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

import { swaggerUi, specs } from './swagger.js'; 

const app = express();
app.use(express.json());

// Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

// MongoDB connection
const DB = 'mongodb://127.0.0.1:27017/nodemart'; 
mongoose
  .connect(DB) // بدون options
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
