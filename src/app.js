import express from 'express'

// import error handlers
// import globalErrorHandler from './controllers/errorController.js'
// import AppError from './utils/appError.js'

// Import Routes 
// import userRoutes from './routes/userRoutes.js'
// import productRoutes from './routes/productRoutes.js'
// import categoryRoutes from './routes/categoryRoutes.js'
// import orderRoutes from './routes/orderRoutes.js'
// import cartRoutes from './routes/cartRoutes.js'
// import reviewRoutes from './routes/reviewRoutes.js'

const app = express();

// Global Middlewares
app.use(express.json());

// Routes
// app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/reviews', reviewRoutes);

// 404 Handler
// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// Error Handler
// app.use(globalErrorHandler);

export default app;
