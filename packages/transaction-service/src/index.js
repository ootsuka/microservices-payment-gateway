require('dotenv').config();
const express = require('express');
const app = express();
const transactionRoutes = require('./routes/transactionRoutes');
const cors = require('cors');

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.static('public'));
// Set up the routes
app.use('/api/transactions', transactionRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Transaction service running on port ${port}`);
});
