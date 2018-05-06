const cassandra = require('cassandra-driver');

const cassandraClient = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'blockchainexplorer' });

const queryGetTransactionsFromBlock = 'SELECT JSON number, transactionsCount,transactions FROM block WHERE number = ?';

const queryGetAllBlocksFromDB = 'SELECT JSON parentHash, number, time, contracttype, witnessAddress, transactionsCount, transactions FROM block';
const queryInsertBlock = 'INSERT INTO block (parentHash, number, time, contracttype,  witnessAddress, transactionsCount, transactions) VALUES (?, ?, ?, ?, ?, ?, ?);';

const queryInsertWitness = 'INSERT INTO witness (address, votecount, pubkey, url, totalmissed, latestblocknum, latestslotnum, isjobs) VALUES (?, ?, ?, ?, ?, ?, ?, ?);'
const queryGetAllWitnesses = 'SELECT JSON address, votecount, pubkey, url, totalmissed, latestblocknum, latestslotnum, isjobs FROM witness';

const queryInsertNode = 'INSERT INTO nodes (host, port) VALUES (?, ?);'
const queryGetAllNodes = 'SELECT JSON host, port FROM nodes';

const queryGetAllAssetIssue = 'SELECT JSON ownerAddress, name, totalsupply, trxnum, num, starttime, endtime, decayratio, votescore, description, url FROM assetissues';
const queryInsertAssetIssue = 'INSERT INTO assetissues (ownerAddress, name, totalsupply, trxnum, num, starttime, endtime, decayratio, votescore, description, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';

const queryGetAllAccounts = 'SELECT JSON accountname, type, address, balance, voteslist, assetmap, latestoprationtime FROM accounts';
const queryInsertAccount = 'INSERT INTO accounts (accountname, type, address, balance, voteslist, assetmap, latestoprationtime) VALUES (?, ?, ?, ?, ?, ?, ?);';

class CassandraDBUtils {
	constructor(construction) {
		console.log(construction);
	}

	async getAll(query){
		const result = await cassandraClient.execute(query);
		return result;
	}

	async getAllBlocks(){
		return this.getAll(queryGetAllBlocksFromDB);
	}

	async getAllIssuedAssets(){
		return this.getAll(queryGetAllAssetIssue);
	}

	async getAllWitnesses(){
		return this.getAll(queryGetAllWitnesses);
	}

	async getAllNodes(){
		return this.getAll(queryGetAllNodes);
  	}

  	async getAllAccounts(){
		return this.getAll(queryGetAllAccounts);
  	}

	getTransactionsFromBlockNumber(blockNum){
		cassandraClient.execute(queryGetTransactionsFromBlock, [ blockNum ], { prepare: true })
		.then(result => {
			const row = result.first();
			console.log(row);
		});
	}

	insert(query, params, message){
		cassandraClient.execute(query, params, { prepare: true })
	  		.then(result => console.log(message));
	}

	insertBlock(params){
		//const params = [parentHash, number, time, contracttype, witnessAddress, transactionsCount, transactions];
		this.insert(queryInsertBlock, params, 'Block added to the cluster');
	}

	insertWitness(params){
		//const params = [address, votecount, pubkey, url, totalmissed, latestblocknum, latestslotnum, isjobs]
		this.insert(queryInsertWitness, params, 'Witness added to the cluster');
	}

	insertNode(params){
		this.insert(queryInsertNode, params, 'Node added to the cluster');
	}

	insertAssetIssue(params){
		//const params = [ownerAddress, name, totalSupply, trxNum, num, startTime, endTime, decayRatio, voteScore, description, url];
		this.insert(queryInsertAssetIssue, params, 'Node added to the cluster');
	}

	insertAccount(params){
		//const params = [ownerAddress, name, totalSupply, trxNum, num, startTime, endTime, decayRatio, voteScore, description, url];
		this.insert(queryInsertAccount, params, 'Account added to the cluster');
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
