require('dotenv').config();

const express = require('express');
const connectDB = require('./Config/config.db');
const errorHandler = require('./Middleware/errorHandler');
const { userRouter } = require('./Routes/users');
const { postRouter } = require('./Routes/posts');
const authorize = require('./Middleware/auth');

const PORT = process.env.PORT || 8000;
const app = express();

// Routes and Middlewares

app.use(express.json());

app.use('/user', userRouter);
app.use('/posts', authorize, postRouter);

app.use(errorHandler);
// Server
app.get('/', (req, res) => {
    res.json({ message: 'Hello from DEAL !!' });
});

(async () => await connectDB())();
app.listen(PORT, () => {
    console.log(`Server Started on :${PORT}... `);
});
