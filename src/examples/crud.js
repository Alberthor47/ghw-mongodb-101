const { connect, getDb, close } = require('../lib/mongo');

async function runCrudExample() {
    const dbName = process.env.DB_NAME || 'ghw_workshop';
    const collName = 'hackers';

    try {
        await connect();
        const db = getDb(dbName);
        const coll = db.collection(collName);

        // console.log('--- Insert one document ---');
        // const insertResult = await coll.insertOne({
        // name: 'Ada Lovelace',
        // email: 'ada@example.com',
        // isActive: true,
        // tags: ['vip', 'beta'],
        // address: { city: 'London', country: 'UK' },
        // createdAt: new Date()
        // });
        // console.log('Inserted id:', insertResult.insertedId);

        // console.log('\n--- Insert many documents ---');
        // const manyResult = await coll.insertMany([
        // { name: 'Grace Hopper', email: 'grace@example.com' },
        // { name: 'Alan Turing', email: 'alan@example.com' }
        // ]);
        // console.log('Inserted count:', manyResult.insertedCount);

        console.log('\n--- Find documents (tags vip) ---');
        const cursor = coll.find({
            $or: [
                { tags: 'vip' },
                { tags: 'admin' }
            ]
        });
        const docs = await cursor.toArray();
        console.log('Documents:', docs);
        console.log('Found docs:', docs.length);

        console.log('\n--- Update a document ---');
        const updateResult = await coll.updateOne({ email: 'ada@example.com' }, { $set: { isActive: "active" } });
        console.log('Modified count:', updateResult.modifiedCount);

        console.log('\n--- Replace a document ---');
        const replaceResult = await coll.replaceOne(
            { email: "grace@example.com" },
            {
                name: "Grace Brewster Murray Hopper",
                email: "grace@example.com",
                isActive: true,
                tags: ['vip', 'admin'],
                address: { city: 'Arlington', country: 'USA' },
                createdAt: new Date('2020-01-01')
            }
        );
        console.log('Replaced count:', replaceResult.modifiedCount);

        console.log('\n--- Delete a document ---');
        const deleteResult = await coll.deleteOne({ email: 'alan@example.com' });
        console.log('Deleted count:', deleteResult.deletedCount);

    } catch (err) {
        console.error('Error in CRUD example:', err);
    } finally {
        await close();
    }
}

if (require.main === module) runCrudExample();

module.exports = { runCrudExample };
