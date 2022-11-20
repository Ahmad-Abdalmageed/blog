const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'posts',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model('comments', commentSchema);
module.exports = { Comment };
