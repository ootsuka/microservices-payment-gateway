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

    const userId = req.user.id;

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
        //simulate webhook handling logic cause webhook url needs to be public
        await Transaction.create({
            userId: userId,
            transactionId: session.id,
            amount: session.amount_total / 100,
            currency: session.currency,
            status: 'success', //assume it goes through
            description: "test transaction",
        });


        const cacheKey = `transcations:${userId}`
        await redisClient.del(cacheKey)
        res.status(201).json({
            message: 'Transaction created successfully',
            session
        });
    } catch (error) {
        handleError(res, error);
    }
};

// Get transactions for a specific user
const getTransactionsByUser = async (req, res) => {

    const userId = req.user.id;

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
        handleError(res, err)
    }
}


const handleWebhook = async (req, res) => {
    const userId = req.user.id;
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // handle event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // ensure paid
        if (session.payment_status === 'paid') {
            // update in database
            try {
                await Transaction.create({
                    userId: userId,
                    amount: session.amount_total / 100,
                    currency: session.currency,
                    status: 'success',
                    description: session.metadata.description,
                });


                const cacheKey = `transcations:${session.metadata.userId}`
                await redisClient.del(cacheKey)
                res.status(201).json({
                    message: 'Transaction created successfully',
                });
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
