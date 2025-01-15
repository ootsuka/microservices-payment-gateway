const { Sequelize } = require('sequelize');

// Set up your MySQL connection
let sequelize
console.log("~~~~~~~~~~~~~~~~~~~~~~~mysq", process.env.MYSQL_HOST)
try {
    sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
        host: 'mysql',
        dialect: 'mysql',
        logging: console.log,
    });
    console.log('sequelize success')
} catch (error) {
    console.log('~~~~~~~~~~~~err', error)
}


module.exports = sequelize;
