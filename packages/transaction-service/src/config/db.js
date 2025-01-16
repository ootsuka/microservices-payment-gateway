const { Sequelize } = require('sequelize');

// Set up your MySQL connection
let sequelize
try {
    sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
        host: 'mysql',
        dialect: 'mysql',
        logging: console.log,
    });
} catch (error) {
    console.log(error)
}


module.exports = sequelize;
