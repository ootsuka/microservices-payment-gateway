const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // assuming you have a separate database config

const Transaction = sequelize.define('Transaction', {
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending' // default status
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'Transaction', // Explicitly set the table name
    freezeTableName: true,
    timestamps: true,  // Will create createdAt and updatedAt fields automatically
});

module.exports = Transaction;
