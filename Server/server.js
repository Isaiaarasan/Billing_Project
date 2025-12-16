const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/authRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("Billing App API is running...");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
