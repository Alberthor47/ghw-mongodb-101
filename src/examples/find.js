const { connect, getDb, close } = require('../lib/mongo');

async function runFindExample() {
    const dbName = process.env.DB_NAME || 'ghw_workshop';
    const collName = 'customers';

    try {
        await connect();
        const db = getDb(dbName);
        const coll = db.collection(collName);

        console.log('--- Find all documents ---');
        const all = await coll.find({}).limit(50).toArray();
        console.log(`Found ${all.length} documents (showing up to 50):`);
        console.dir(all, { depth: 2 });

        console.log('\n--- Find by nested field (address.city = London) ---');
        const london = await coll.find({ 'address.city': 'London' }).toArray();
        console.log(`Found ${london.length} documents from London`);

    } catch (err) {
        console.error('Error in find example:', err);
    } finally {
        await close();
    }
}

if (require.main === module) runFindExample();

module.exports = { runFindExample };
