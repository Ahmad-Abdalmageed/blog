const { Post, validatePost } = require('../Models/Posts');
const { apiError } = require('../Errors/apiError');

function validateNewPost(newPost) {
    const isNotValid = validatePost(newPost);
    if (isNotValid) throw new apiError(400, isNotValid.details[0].message);
}

const createNewPost = async (newPost, userID) => {
    // Validate newPost Data
    validateNewPost(newPost);

    // Create Post from Models
    return await new Post({
        ...newPost,
        createdBy: userID,
    }).save();
};

const listPosts = async (approvedOnly, page, limit) => {
    // Get all Posts using Aggregation
    const aggregation = [
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy',
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            email: 1,
                            role: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: 'interactions',
                localField: '_id',
                foreignField: 'post',
                as: 'interactions',
                pipeline: [
                    {
                        $sortByCount: '$type',
                    },
                    {
                        $group: {
                            _id: null,
                            counts: {
                                $push: {
                                    k: '$_id',
                                    v: '$count',
                                },
                            },
                        },
                    },
                    {
                        $replaceRoot: {
                            newRoot: {
                                $arrayToObject: '$counts',
                            },
                        },
                    },
                ],
            },
        },
        {
            $project: {
                _id: 0,
                title: 1,
                body: 1,
                status: 1,
                createdBy: {
                    $first: '$createdBy',
                },
                interactions: {
                    $first: '$interactions',
                },
                createdAt: 1,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
    ];
    if (approvedOnly) aggregation.push({ $match: { status: 'APPROVED' } });

    const allPosts = await Post.aggregate(aggregation)
        .limit(limit)
        .skip((page - 1) * limit);
    const postsCount = await Post.count();
    const totalPages = Math.ceil(postsCount / limit);
    return {
        data: allPosts,
        total: allPosts.length,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
};

module.exports = {
    listPosts,
    createNewPost,
};
