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

// @desc    Get ALL invoices (Admin View)
// @route   GET /api/invoices/all
const getAllInvoices = async (req, res) => {
  try {
    // Populate createdBy to show employee name
    const invoices = await Invoice.find({})
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all invoices" });
  }
};

module.exports = { createInvoice, getMyInvoices, getAllInvoices };
