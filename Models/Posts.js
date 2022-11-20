const mongoose = require('mongoose');
const JOI = require('joi');

function validatePost(newPost) {
    const schema = JOI.object({
        title: JOI.string().optional(),
        body: JOI.string().required(),
        status: JOI.string()
            .valid('APPROVED', 'PENDING', 'REJECTED')
            .optional(),
    });

    const { error } = schema.validate(newPost);
    return error;
}

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            default: ' ',
        },
        body: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['APPROVED', 'PENDING', 'REJECTED'],
            default: 'PENDING',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model('posts', postSchema);
module.exports = { Post, validatePost };
