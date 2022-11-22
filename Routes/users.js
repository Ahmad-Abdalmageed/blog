const express = require('express');
const { authenticateUser, createUser } = require('../Controllers/users');
const { tryCatchWrapExpress } = require('../Utils/wrappers');
const secrets = require('../Config/config.secrets');
const jwt = require('jsonwebtoken');

const userRouter = express.Router();

const routerCreateUser = tryCatchWrapExpress(async (req, res) => {
    // Create New User from Controller
    const newUser = await createUser(req.body);
    res.status(200).json({
        message: 'User Created !!',
        user: {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
        },
    });
});

const routerAuthUser = tryCatchWrapExpress(async (req, res) => {
    // Authenticate user from Controller
    const authUser = await authenticateUser(req.body);

    const genToken = jwt.sign(
        { _id: authUser._id, email: authUser.email },
        secrets.jwt_password
    );

    res.status(200).json(genToken);
});

userRouter.route('/signup').post(routerCreateUser);
userRouter.route('/login').post(routerAuthUser);

module.exports = { userRouter };
