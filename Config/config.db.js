require('dotenv').config();

const { mongoose } = require('mongoose');
const secrets = require('./config.secrets');

module.exports = async function connectDB() {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        const uri =
            secrets.node_env === 'dev' ? secrets.db_uri : secrets.db_uri_test;
        await mongoose.connect(uri, options);
        console.log(`Connected to ${secrets.node_env} DB ...`);
    } catch (error) {
        console.log('Could not Connect to DB', error);
    }
};
