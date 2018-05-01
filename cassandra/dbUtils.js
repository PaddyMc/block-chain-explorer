const cassandra = require('cassandra-driver');

const cassandraClient = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'blockchainexplorer' });

const queryGetTransactionsFromBlock = 'SELECT JSON number, transactionsCount,transactions FROM block WHERE number = ?';
const queryGetAllBlocksFromDB = 'SELECT JSON parentHash, number, time, witnessAddress, transactionsCount, transactions FROM block';
const queryInsertBlock = 'INSERT INTO block (parentHash, number, time, witnessAddress, transactionsCount, transactions) VALUES (?, ?, ?, ?, ?, ?);';

const queryInsertWitness = 'INSERT INTO witness (address, votecount, pubkey, url, totalmissed, latestblocknum, latestslotnum, isjobs) VALUES (?, ?, ?, ?, ?, ?, ?, ?);'
const queryGetAllWitnesses = 'SELECT JSON address, votecount, pubkey, url, totalmissed, latestblocknum, latestslotnum, isjobs FROM witness';

const queryInsertNode = 'INSERT INTO nodes (host, port) VALUES (?, ?);'
const queryGetAllNodes = 'SELECT JSON host, port FROM nodes';

const queryGetAllAssetIssue = 'SELECT JSON ownerAddress, name, totalSupply, trxNum, num, startTime, endTime, decayRatio, voteScore, description, url FROM assetissues';
const queryInsertAssetIssue = 'INSERT INTO assetissues (ownerAddress, name, totalSupply, trxNum, num, startTime, endTime, decayRatio, voteScore, description, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';


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

	async getAllIssuedAssets(){
		const result = await cassandraClient.execute(queryGetAllAssetIssue);
		return result;
	}

	async getAllWitnesses(){
		const result = await cassandraClient.execute(queryGetAllWitnesses);
		return result;
	}

	insertWitness(params){
		//const params = [address, votecount, pubkey, url, totalmissed, latestblocknum, latestslotnum, isjobs]

		cassandraClient.execute(queryInsertWitness, params, { prepare: true })
	  		.then(result => console.log('Row updated on the cluster'));
	}

	insertNode(params){
		cassandraClient.execute(queryInsertNode, params, { prepare: true })
	  		.then(result => console.log('Node added to the cluster'));
	}

	insertAssetIssue(params){
		//const params = [ownerAddress, name, totalSupply, trxNum, num, startTime, endTime, decayRatio, voteScore, description, url];

		cassandraClient.execute(queryInsertAssetIssue, params, { prepare: true })
	  		.then(result => console.log('Node added to the cluster'));

	}

	async getAllNodes(){
		const result = await cassandraClient.execute(queryGetAllNodes);
		return result;
  	}

	batchInsertBlock(params){
		//iterate through data to build queries

/*		const queries = [
		  {
		    query: 'UPDATE user_profiles SET email=? WHERE key=?',
		    params: [ emailAddress, 'hendrix' ]
		  },
		  {
		    query: 'INSERT INTO user_track (key, text, date) VALUES (?, ?, ?)',
		    params: [ 'hendrix', 'Changed email', new Date() ]
		  }
		];*/

		client.batch(queries, { prepare: true })
  			.then(result => console.log('Data updated on cluster'));
	}
}

module.exports = CassandraDBUtils;
