const express = require('express');
const { tryCatchWrapExpress } = require('../Utils/wrappers');
const { isAdmin } = require('../Controllers/users');
const { listPosts, createNewPost } = require('../Controllers/posts');
const { apiError } = require('../Errors/apiError');

const postRouter = express.Router();

const routerCreatePost = tryCatchWrapExpress(async (req, res) => {
    const isUser = !(await isAdmin(req.userID));
    if (!isUser) throw new apiError(400, 'Users only can Create Posts');

    const newPost = await createNewPost(req.body, req.userID);
    res.status(200).json({ message: 'Post Created', newPost });
});

const routerListPosts = tryCatchWrapExpress(async (req, res) => {
    const approvedOnly = !(await isAdmin(req.userID));
    const page = req.body.page ? req.body.page : 1;
    const limit = req.body.limit ? req.body.limit : 10;
    const allPosts = await listPosts(approvedOnly, page, limit);

    if (!allPosts) throw new apiError(204, 'No Posts Found');
    res.status(200).json(allPosts);
});

postRouter.route('/').get(routerListPosts).post(routerCreatePost);

module.exports = { postRouter };
