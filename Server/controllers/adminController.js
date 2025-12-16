const Invoice = require("../models/Invoice");
const User = require("../models/User");

// @desc    Get dashboard stats (Total Sales per Employee)
// @route   GET /api/admin/stats
const getEmployeeStats = async (req, res) => {
  try {
    // 1. Aggregate sales by employee
    const stats = await Invoice.aggregate([
      {
        $group: {
          _id: "$createdBy",
          totalSales: { $sum: "$totalAmount" },
          invoiceCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users", // Collection name in MongoDB (usually lowercase plural)
          localField: "_id",
          foreignField: "_id",
          as: "employeeDetails",
        },
      },
      {
        $unwind: "$employeeDetails",
      },
      {
        $project: {
          employeeName: "$employeeDetails.name",
          employeeEmail: "$employeeDetails.email",
          totalSales: 1,
          invoiceCount: 1,
        },
      },
    ]);

    // 2. Calculate Grand Total for the company
    const grandTotal = stats.reduce((acc, curr) => acc + curr.totalSales, 0);

    res.json({
      grandTotal,
      employeeStats: stats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching admin stats" });
  }
};

// @desc    Get ALL invoices from everyone
// @route   GET /api/admin/invoices
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({})
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEmployeeStats, getAllInvoices };
