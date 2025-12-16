const express = require('express');
const router = express.Router();
const { createInvoice, getMyInvoices } = require('../controllers/invoiceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createInvoice);
router.route('/my').get(protect, getMyInvoices);

module.exports = router;