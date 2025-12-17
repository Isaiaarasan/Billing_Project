const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who added this product
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
