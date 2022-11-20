const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['LIKE', 'DISLIKE', 'SAD', 'ANGRY'],
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'posts',
            default: undefined,
            required: false,
        },
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comments',
            default: undefined,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const Interactions = mongoose.model('interactions', interactionSchema);

module.exports = { Interactions };
