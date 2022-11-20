const { Post } = require('../Models/Posts');
const { Comment } = require('../Models/Comments');
const { Interactions } = require('../Models/Interactions');

const stats = async () => {
    const postTypesCountAgg = [
        {
            $sortByCount: '$status',
        },
        {
            $group: {
                _id: null,
                typesCount: {
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
                    $arrayToObject: '$typesCount',
                },
            },
        },
    ];
    const interactionsOnPostsAgg = [
        {
            $match: {
                post: {
                    $ne: null,
                },
            },
        },
        {
            $count: 'interactionsOnPosts',
        },
    ];
    const interactionsOnCommentsAgg = [
        {
            $match: {
                comment: {
                    $ne: null,
                },
            },
        },
        {
            $count: 'interactionsOnComments',
        },
    ];

    const postTypesCount = await Post.aggregate(postTypesCountAgg);
    const postAllCounts = await Post.count();

    const totalNumberOfComments = await Comment.count();

    const interactionsOnPosts = await Interactions.aggregate(
        interactionsOnPostsAgg
    );
    const interactionOnComments = await Interactions.aggregate(
        interactionsOnCommentsAgg
    );
    const interactionsAllCount = await Interactions.count();

    return {
        posts: {
            ...postTypesCount[0],
            total: postAllCounts,
        },
        comments: { total: totalNumberOfComments },
        interactions: {
            ...interactionsOnPosts[0],
            ...interactionOnComments[0],
            total: interactionsAllCount,
        },
    };
};

module.exports = { stats };
