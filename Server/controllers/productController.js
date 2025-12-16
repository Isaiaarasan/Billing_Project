const Product = require("../models/Product");

// @desc    Create new product
// @route   POST /api/products
const createProduct = async (req, res) => {
  const { name, price } = req.body;

  try {
    const product = new Product({
      name,
      price,
      addedBy: req.user._id, // Taken from auth middleware
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to create product" });
  }
};

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  const { name, price } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update product" });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.remove();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

module.exports = { createProduct, getProducts, updateProduct, deleteProduct };
