const { connect, getDb, close } = require('../lib/mongo');

async function runAggregations() {
    const dbName = 'sample_mflix';
    const collName = 'movies';

    try {
        await connect();
        const db = getDb(dbName);
        const coll = db.collection(collName);

        const agg = [
            {
                '$match': {
                'imdb.rating': {
                    '$gte': 8
                }
                }
            }, {
                '$project': {
                '_id': 0, 
                'title': 1, 
                'imdb.rating': 1, 
                'plot': 1
                }
            }, {
                '$sort': {
                'imdb.rating': -1
                }
            }, {
                '$limit': 5
            }
        ];

        console.log('\n--- Aggregation: on Movies ---');
        const aggCursor1 = coll.aggregate(agg);
        const aggResults1 = await aggCursor1.toArray();
        console.log('Aggregation Results:', aggResults1);
    } catch (err) {
        console.error('Error in Aggregation example:', err);
    } finally {
        await close();
    }
}

if (require.main === module) runAggregations();

module.exports = { runAggregations };
