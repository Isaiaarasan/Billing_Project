const Invoice = require("../models/Invoice");

// @desc    Create new invoice
// @route   POST /api/invoices
const createInvoice = async (req, res) => {
  const { customerName, items, totalAmount, paymentMode, cashDetails } = req.body;

  try {
    const invoice = new Invoice({
      customerName,
      items,
      totalAmount,
      paymentMode,
      cashDetails,
      createdBy: req.user._id, // Taken from auth middleware
    });

    const createdInvoice = await invoice.save();
    res.status(201).json(createdInvoice);
  } catch (error) {
    res.status(500).json({ message: "Failed to create invoice" });
  }
};

// @desc    Get logged in user's invoices (Employee View)
// @route   GET /api/invoices/my
const getMyInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices" });
  }
};

module.exports = { createInvoice, getMyInvoices };
