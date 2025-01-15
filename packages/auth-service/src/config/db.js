const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Auth Service: Connected to MongoDB');
    } catch (err) {
        console.error('Auth Service: MongoDB Connection Error', err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;