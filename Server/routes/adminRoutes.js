const express = require("express");
const router = express.Router();
const {
  getEmployeeStats,
  getAllInvoices,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// All routes here are protected AND require Admin role
router.get("/stats", protect, adminOnly, getEmployeeStats);
router.get("/all-invoices", protect, adminOnly, getAllInvoices);

module.exports = router;
