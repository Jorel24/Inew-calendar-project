const mysql = require('mysql2');
require('dotenv').config();

const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

dbConnection.connect((err) => {
    if(err){
        console.log("Database connection failed: ",err.message);
        return;
    }
    console.log("Connection to the database successful!");
});

module.exports = dbConnection.promise();
