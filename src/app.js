import express from 'express'
import morgan from 'morgan'

// import error handlers
import globalErrorHandler from './controllers/errorController.js'
import AppError from './utils/appError.js'

// Swagger
import setupSwagger from './swagger.js'

// Import Routes 
import userRoutes from './routes/userRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

const app = express();

// Global Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Swagger Docs
setupSwagger(app);

// Routes
app.use(userRoutes);
app.use(cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin',adminRoutes);

// 404 Handler
app.use(
    (req, res, next) => {
        next(new AppError(`Invalid path. are sure they told you it is ${req.originalUrl} ?`, 404));
    }
);

// Error Handler
app.use(globalErrorHandler);

export default app;
