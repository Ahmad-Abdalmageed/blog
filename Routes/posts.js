/**
 * @swagger
 * components:
 *   securitySchemas:
 *     bearerAuth:
 *       type: http
 *       schema: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     posts:
 *        type: object
 *        required:
 *          - title
 *          - body
 *        properties:
 *          title:
 *            type: string
 *            description: Post Title
 *          body:
 *            type: string
 *            description: Post Body
 *        example:
 *          title: Hello World
 *          body: print('Hello World!!')
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Posts Endpoint
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Creates a New Post by an Authorized User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/posts'
 *     tags: [Posts]
 *     responses:
 *       401:
 *         description: Not Authenticated
 *       400:
 *         description: Users Only can Create Posts or User Does not Exist
 *       200:
 *         description : The List of the Posts
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Lists all Posts --> Approved Only for Users
 *     security:
 *       - bearerAuth: []
 *     tags: [Posts]
 *     responses:
 *       401:
 *         description: Not Authenticated
 *       204:
 *         description: Not Posts
 *       200:
 *         description : The List of the Posts
 */

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
