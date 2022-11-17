require('dotenv').config();


const express = require('express');
const connectDB = require('./Config/config.db');


const PORT = process.env.PORT || 8000;
const app = express();


// Routes and Middlewares

app.use(express.json());


// Server
app.get('/', (req, res) => {
    res.json({ message: 'Hello from DEAL !!' });
});

(async () => await connectDB())();
app.listen(PORT, () => {
    console.log(`Server Started on :${PORT}... `);
});

