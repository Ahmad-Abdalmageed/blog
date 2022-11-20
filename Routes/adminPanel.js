const { tryCatchWrapExpress } = require('../Utils/wrappers');
const { isAdmin } = require('../Controllers/users');
const { stats } = require('../Controllers/adminPanel');
const { apiError } = require('../Errors/apiError');

const express = require('express');

const adminRouter = express.Router();

const routerGetStats = tryCatchWrapExpress(async (req, res) => {
    // Check is Admin
    if (!(await isAdmin(req.userID)))
        throw new apiError(400, 'Admin Access Only');

    const statsData = await stats();
    res.status(200).json(statsData);
});

adminRouter.route('/statistics').get(routerGetStats);

module.exports = { adminRouter };