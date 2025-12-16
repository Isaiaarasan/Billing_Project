const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Get all products and create a new one (Employee or Admin)
router.route("/").post(protect, createProduct).get(protect, getProducts);

// Update or delete a product (Admin Only for management/control)
router
  .route("/:id")
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

module.exports = router;
