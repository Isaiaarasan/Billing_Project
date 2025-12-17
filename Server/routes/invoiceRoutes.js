const express = require('express');
const router = express.Router();
const { createInvoice, getMyInvoices, getAllInvoices } = require('../controllers/invoiceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createInvoice);
router.route('/my').get(protect, getMyInvoices);
router.route('/all').get(protect, admin, getAllInvoices);

module.exports = router;