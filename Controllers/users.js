const { User, validateUser } = require('../Models/Users');
const { apiError } = require('../Errors/apiError');
const secrets = require('../Config/config.secrets');
const bcrypt = require('bcrypt');

function validateNewUser(newUser) {
    const isNotValid = validateUser(newUser);
    if (isNotValid) throw new apiError(400, isNotValid.details[0].message);
}

const createUser = async (newUser) => {
    // Validate Request Data
    validateNewUser(newUser);

    // Check for Duplicate Users
    const isDuplicate = await User.findOne({ email: newUser.email });
    if (isDuplicate) throw new apiError(400, 'User already Exists !!');

    // Encrypt User Password
    const passHash = bcrypt.hashSync(
        newUser.password + secrets.bcrypt_pass,
        parseInt(secrets.bcrypt_salt)
    );
    // Create New User
    return await new User({
        ...newUser,
        password: passHash,
    }).save();
};

const authenticateUser = async (userLogin) => {
    // Validate Request Data
    validateNewUser(userLogin);

    // Find Requested USer
    const user = await User.findOne({ email: userLogin.email });
    if (!user) throw new apiError(400, 'User does not exist !!');

    // Authenticate USer
    const authenticated = bcrypt.compareSync(
        userLogin.password + secrets.bcrypt_pass,
        user.password
    );
    if (!authenticated) throw new apiError(400, 'Password is Wrong !!');
    return user;
};

module.exports = {
    authenticateUser,
    createUser,
};
