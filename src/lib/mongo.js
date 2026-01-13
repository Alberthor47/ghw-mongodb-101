const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;
let _client = null;

async function connect(customUri) {
    const connUri = customUri || uri;
    if (!connUri) throw new Error('MONGODB_URI is not set. Provide it via environment or pass into connect().');

    if (_client && _client.topology && _client.topology.isConnected()) {
        return _client;
    }

    _client = new MongoClient(connUri, { useNewUrlParser: true, useUnifiedTopology: true });
    await _client.connect();
    return _client;
}

function getDb(dbName) {
    if (!_client) throw new Error('Client not connected. Call connect() first.');
    return _client.db(dbName);
}

async function close() {
    if (_client) {
        await _client.close();
        _client = null;
    }
}

module.exports = { connect, getDb, close };
