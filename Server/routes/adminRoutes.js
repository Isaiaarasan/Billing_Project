const express = require("express");
const router = express.Router();
const {
  getEmployeeStats,
  getAllInvoices,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// All routes here are protected AND require Admin role
router.get("/stats", protect, adminOnly, getEmployeeStats);
router.get("/all-invoices", protect, adminOnly, getAllInvoices);

// User management routes
router
  .route("/users")
  .get(protect, adminOnly, getAllUsers)
  .post(protect, adminOnly, createUser);
router
  .route("/users/:id")
  .put(protect, adminOnly, updateUser)
  .delete(protect, adminOnly, deleteUser);

module.exports = router;
