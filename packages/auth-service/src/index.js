require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Connect to the database
connectDB();

// Routes
app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
