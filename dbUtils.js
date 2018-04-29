const cassandra = require('cassandra-driver');

const cassandraClient = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'blockchainexplorer' });

const queryGetAllBlocksFromDB = 'SELECT JSON parentHash, number, time, witnessAddress, transactionsCount, transactions FROM block';
const queryGetTransactionsFromBlock = 'SELECT number, transactionsCount,transactions FROM block WHERE number = ?';
const queryInsertBlock = 'INSERT INTO block (parentHash, number, time, witnessAddress, transactionsCount, transactions) VALUES (?, ?, ?, ?, ?, ?);';

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
		//var transaction1 = { blocknum: 1, fromAddress: 'val2', toAddress: 'val3', amount: 100 };
		//var transaction2 = { blocknum: 1, fromAddress: 'val1', toAddress: 'val0', amount: 100 };
		//const params = ['0000000000000004FC3D510BC1661E4E5905A4C197B07FEC05DC8D4784F0A898', 11, 0, '27YkUVSuvCK3K84DbnFnxYUxozpi793PTqZ', 0, { "qwresd": transaction1, "sdagf":transaction2 }]
		//const params = [parentHash, number, time, witnessAddress, transactionsCount, transactions];

		//{ "qwresd": transaction1, "sdagf":transaction2 }

		cassandraClient.execute(queryInsertBlock, params, { prepare: true })
	  		.then(result => console.log('Row updated on the cluster'));
	}
}

module.exports = CassandraDBUtils;

//getAllBlocks();
//insertBlock();
//getTransactionsFromBlockNumber(10);
