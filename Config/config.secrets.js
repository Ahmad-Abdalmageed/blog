module.exports = {
    bcrypt_pass: process.env.bcrypt_pass,
    bcrypt_salt: process.env.bcrypt_salt,
    jwt_password: process.env.token_secret,
    db_uri: process.env.db,
    db_uri_test: process.env.db_test,
    node_env: process.env.node_env,
};
