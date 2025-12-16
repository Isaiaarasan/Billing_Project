const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema(
  {
    customerName: { type: String, required: true },
    items: [
      {
        name: String,
        qty: Number,
        rate: Number,
        total: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["paid", "pending"], default: "paid" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Link to Employee
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
