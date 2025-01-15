const redisClient = require('../redis');
const Transaction = require('../models/transaction');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
/**
 * Helper function to handle unexpected errors consistently
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 */
const handleError = (res, error) => {
    console.error('Error:', error.message);
    res.status(500).json({
        error: 'Internal Server Error',
        details: error.message,
    });
};

// Create a new transaction
const createTransaction = async (req, res) => {

    const { userId, amount, type } = req.body;

    // Validate input
    if (!userId || !amount || !type) {
        return res.status(400).json({ error: 'Missing required fields: userId, amount, or type' });
    }

    // Additional validation for transaction type and amount
    if (!['credit', 'debit'].includes(type)) {
        return res.status(400).json({ error: 'Invalid transaction type. Must be "credit" or "debit".' });
    }

    if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than zero.' });
    }

    try {
        // Create transaction
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: 'price_1Qh49uAxd8KJKZKwLyVuwr11',
                    quantity: 1, // 数量
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success.html`,
            cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
            metadata: {
                description: 'test'
            }
        })
        res.json({ sessionId: session.id });
    } catch (error) {
        handleError(res, error);
    }
};

// Get transactions for a specific user
const getTransactionsByUser = async (req, res) => {

    const { userId } = req.params;

    // Validate input
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    const cacheKey = `transaction:${userId}`

    try {
        const cachedData = await redisClient.get(cacheKey)
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData))
        }

        // Fetch transactions
        const transactions = await Transaction.findAll({ where: { userId } });
        if (!transactions.length) {
            return res.status(404).json({ message: 'No transactions found for the user.' });
        }

        await redisClient.set(cacheKey, JSON.stringify(transactions), 'EX', 3600)
        res.status(200).json(transactions);
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve transactions' });
    }
}


const handleWebhook = async (req, res) => {
    console.log('webhoolk')
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // 验证 Webhook 签名
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 处理事件类型
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // 确保支付成功
        if (session.payment_status === 'paid') {
            // 更新 MySQL 数据库
            try {
                await Transaction.create({
                    userId: session.metadata.userId, // 从 metadata 中提取用户 ID
                    amount: session.amount_total / 100, // Stripe 返回的金额单位是最小货币单位
                    currency: session.currency,
                    status: 'success',
                    description: session.metadata.description,
                });


                const cacheKey = `transcations:${session.metadata.userId}`
                await redisClient.del(cacheKey)
                res.status(201).json({
                    message: 'Transaction created successfully',
                    transaction,
                });

                console.log('Transaction recorded in database successfully.');
            } catch (error) {
                console.error('Error saving transaction:', error);
            }
        }
    }

    res.status(200).json({ received: true });
};


module.exports = {
    createTransaction,
    getTransactionsByUser,
    handleWebhook
};
