const cassandra = require('cassandra-driver');

const cassandraClient = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'blockchainexplorer' });

const queryGetTransactionsFromBlock = 'SELECT JSON number, transactionsCount,transactions FROM block WHERE number = ?';
const queryGetAllBlocksFromDB = 'SELECT JSON parentHash, number, time, witnessAddress, transactionsCount, transactions FROM block';
const queryInsertBlock = 'INSERT INTO block (parentHash, number, time, witnessAddress, transactionsCount, transactions) VALUES (?, ?, ?, ?, ?, ?);';

const queryGetAllWitnesses = 'SELECT JSON address, votecount, pubkey, url, totalmissed, latestblocknum, latestslotnum, isjobs FROM witness';

class CassandraDBUtils {
	constructor(construction) {
		console.log(construction);
	}

	async getAllBlocks(){
		const result = await cassandraClient.execute(queryGetAllBlocksFromDB);
		return result;
	}

	getTransactionsFromBlockNumber(blockNum){
		cassandraClient.execute(queryGetTransactionsFromBlock, [ blockNum ], { prepare: true })
		.then(result => {
			const row = result.first();
			console.log(row);
		});
	}

	insertBlock(params){
		//const params = [parentHash, number, time, witnessAddress, transactionsCount, transactions];

		cassandraClient.execute(queryInsertBlock, params, { prepare: true })
	  		.then(result => console.log('Row updated on the cluster'));
	}
}

module.exports = CassandraDBUtils;
