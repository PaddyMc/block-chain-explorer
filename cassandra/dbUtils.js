const cassandra = require('cassandra-driver');

const cassandraClient = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'blockchainexplorer' });

const queryGetAllBlocksFromDB = 'SELECT json parentHash, number, time, witnessAddress, transactionsCount, transactions FROM block';
const queryGetTransactionsFromBlock = 'SELECT json number, transactionsCount,transactions FROM block WHERE number = ?';
const queryInsertBlock = 'INSERT INTO block (parentHash, number, time, witnessAddress, transactionsCount, transactions) VALUES (?, ?, ?, ?, ?, ?);';

class CassandraDBUtils {
	constructor(construction) {
		console.log(construction);
	}

	getAllBlocks(){
		cassandraClient.execute(queryGetAllBlocksFromDB)
			.then(result => console.log(result));
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