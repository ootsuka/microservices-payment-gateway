const express = require('express');
const router = express.Router();
const { createTransaction, getTransactionsByUser, handleWebhook, createTransactionIntent } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect the routes with authentication middleware
router.post('/create', authMiddleware, createTransaction);
router.post('/createByIntent', authMiddleware, createTransactionIntent)
router.get('/history', authMiddleware, getTransactionsByUser);
router.post('/webhook', express.raw({ type: '/application/json' }), handleWebhook)

module.exports = router;
