const express = require('express');
const app = express();
app.use(express.json());

const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
require('dotenv').config();

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  }));

app.use(express.static(path.join(__dirname, 'pages')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'html', 'index.html'));
});

const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
