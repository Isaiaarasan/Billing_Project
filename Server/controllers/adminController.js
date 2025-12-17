const Invoice = require("../models/Invoice");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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

    // 2. Aggregate sales by Category (using unnested items)
    // Note: Items in Invoice schema is an array of objects. We need to unwind it first if we want strict category tracking,
    // BUT the Invoice Item currently does not have 'category' stored in it snapshot. 
    // We only stored name, qty, rate, total. 
    // To solve this properly, we should modify the Invoice Item schema to include category OR look up the product.
    // However, looking up products might be slow. 
    // A better approach for the future is to store category in the invoice item.
    // For now, let's assuming we might not have it in old invoices, but we can try to $lookup products if names match?
    // OR simpler: The user just asked for "charts to analyze category wise sales". 
    // The previous step was adding Category to Product. 
    // So we can Join Invoices -> Items -> Products -> Category.

    const categoryStats = await Invoice.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          let: { itemName: "$items.name" },
          pipeline: [
            { $match: { $expr: { $eq: ["$name", "$$itemName"] } } }
          ],
          as: "productData"
        }
      },
      { $unwind: "$productData" },
      {
        $group: {
          _id: "$productData.category",
          totalSales: { $sum: "$items.total" },
          count: { $sum: "$items.qty" }
        }
      }
    ]);

    // 3. Calculate Grand Total for the company
    const grandTotal = stats.reduce((acc, curr) => acc + curr.totalSales, 0);

    res.json({
      grandTotal,
      employeeStats: stats,
      categoryStats,
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

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new user
// @route   POST /api/admin/users
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "employee",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  const { name, email, role } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.role = role || user.role;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.remove();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEmployeeStats,
  getAllInvoices,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
