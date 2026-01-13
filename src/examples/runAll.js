const createCollection = require('./createCollection');
const crud = require('./crud');
const find = require('./find');

async function runAll() {
    console.log('Running MongoDB examples in sequence. Make sure MONGODB_URI is set in your environment.');

    await createCollection.run();
    await crud.runCrudExample();
    await find.runFindExample();

    console.log('All examples finished.');
}

if (require.main === module) runAll();

module.exports = { runAll };
