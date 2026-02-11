#!/bin/bash

# 1. Initialize Directories
echo "Creating Project Structure..."
mkdir -p src/{config,controllers,middlewares,models,routes,utils}

# 2. Create Root Files
touch .env
echo "const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const app = require('./src/app');

const DB = process.env.DATABASE;
mongoose.connect(DB).then(() => console.log('DB Connection Successful!'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(\`App running on port \${port}...\`);
});" > src/server.js

echo "const express = require('express');
const app = express();
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

// Global Middlewares
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// 404 Handler
app.all('*', (req, res, next) => {
  next(new AppError(\`Can't find \${req.originalUrl} on this server!\`, 404));
});

// Error Handler
app.use(globalErrorHandler);

module.exports = app;" > src/app.js

# 3. Create Config
echo "module.exports = {
  // Database and Env configurations can go here if not using process.env directly
};" > src/config/database.js

# 4. Create Models (Schemas)
touch src/models/userModel.js
touch src/models/productModel.js
touch src/models/categoryModel.js
touch src/models/orderModel.js
touch src/models/reviewModel.js

# 5. Create Controllers (Business Logic)
touch src/controllers/authController.js
touch src/controllers/userController.js
touch src/controllers/productController.js
touch src/controllers/categoryController.js
touch src/controllers/orderController.js
touch src/controllers/cartController.js
touch src/controllers/reviewController.js
touch src/controllers/errorController.js
touch src/controllers/handlerFactory.js

# 6. Create Routes (Endpoints)
touch src/routes/userRoutes.js
touch src/routes/productRoutes.js
touch src/routes/categoryRoutes.js
touch src/routes/orderRoutes.js
touch src/routes/cartRoutes.js
touch src/routes/reviewRoutes.js

# 7. Create Middlewares
echo "// Protect routes, Restrict to Admin, etc." > src/middlewares/authMiddleware.js
echo "// Guest logic token generation" > src/middlewares/guestMiddleware.js
echo "// Validation logic" > src/middlewares/validationMiddleware.js

# 8. Create Utils
echo "class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = \`\${statusCode}\`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;" > src/utils/appError.js

echo "module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};" > src/utils/catchAsync.js

echo "class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() { return this; }
  sort() { return this; }
  limitFields() { return this; }
  paginate() { return this; }
}
module.exports = APIFeatures;" > src/utils/apiFeatures.js

echo "// Email sending logic" > src/utils/email.js

echo "✅ Project Structure Created Successfully!"