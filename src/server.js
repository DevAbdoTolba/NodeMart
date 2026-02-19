import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";


dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Mount user routes
app.use("/api/v1/users", userRouter);

// Root route
app.get("/", (req, res) => {
  res.send("NodeMart API is running");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

// Environment variables
const PORT = process.env.PORT || 3000;
const DB = process.env.DATABASE_CONNECTION_STRING;

if (!DB) {
  console.error("DATABASE_CONNECTION_STRING is not defined in .env");
  process.exit(1);
}

// Connect to MongoDB and start server
mongoose
  .connect(DB)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error", err);
    process.exit(1);
  });
