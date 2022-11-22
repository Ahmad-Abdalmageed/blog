require('dotenv').config();

const express = require('express');
const connectDB = require('./Config/config.db');
const errorHandler = require('./Middleware/errorHandler');
const authorize = require('./Middleware/auth');
const { userRouter } = require('./Routes/users');
const { postRouter } = require('./Routes/posts');
const { adminRouter } = require('./Routes/adminPanel');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 8000;
const app = express();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            description: 'Blog API Server Documentation',
            title: 'Blog API',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:8000',
            },
        ],
    },
    apis: ['./Routes/*.js'],
};

const specs = swaggerJsDoc(options);

// Routes and Middlewares

app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use('/user', userRouter);
app.use('/posts', authorize, postRouter);
app.use('/admin', authorize, adminRouter);

app.use(errorHandler);
// Server
app.get('/', (req, res) => {
    res.json({ message: 'Hello from DEAL !!' });
});

(async () => await connectDB())();
app.listen(PORT, () => {
    console.log(`Server Started on :${PORT}... `);
});

module.exports = app;
