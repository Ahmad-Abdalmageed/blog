const mongoose = require('mongoose');
const JOI = require('joi');

function validateUser(newUser) {
    const schema = JOI.object({
        email: JOI.string().required(),
        password: JOI.string().required(),
        role: JOI.string().valid('ADMIN', 'USER').optional(),
    });

    const { error } = schema.validate(newUser);
    return error;
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'email is Required'],
        },
        password: {
            type: String,
            required: [true, 'Password is Required'],
        },
        role: {
            type: String,
            enum: ['ADMIN', 'USER'],
            default: 'USER',
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('users', userSchema);

module.exports = { User, validateUser };
