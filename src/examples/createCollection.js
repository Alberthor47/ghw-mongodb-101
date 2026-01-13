const { connect, getDb, close } = require('../lib/mongo');

async function run() {
    const dbName = process.env.DB_NAME || 'ghw_workshop';
    const collName = 'hackers';

    try {
        const client = await connect();
        const db = getDb(dbName);

        // Create collection if it doesn't exist with a simple schema validation example
        const collections = await db.listCollections({ name: collName }).toArray();
        if (collections.length === 0) {
        console.log(`Creating collection: ${collName}`);
        await db.createCollection(collName, {
            validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['name', 'email'],
                properties: {
                name: { bsonType: 'string' },
                email: { bsonType: 'string' }
                }
            }
            }
        });
        console.log('Collection created with basic validation.');
        } else {
        console.log(`Collection '${collName}' already exists.`);
        }
    } catch (err) {
        console.error('Error in createCollection example:', err);
    } finally {
        await close();
    }
}

if (require.main === module) run();

module.exports = { run };
