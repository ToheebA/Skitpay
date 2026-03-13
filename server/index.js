const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db/connect');

const app = express();


app.use(express.json());
app.use(cors());

connectDB();

app.listen(5000,() => {
    console.log('Server running on port 5000....');
} );