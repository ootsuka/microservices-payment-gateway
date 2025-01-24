require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(errorHandler)

// Connect to the database
connectDB();

// Routes
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
    res.status(200).send('OK!! alive~~~~~~');
});

app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
