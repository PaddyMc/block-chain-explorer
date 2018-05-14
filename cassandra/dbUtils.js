const cassandra = require('cassandra-driver');

const queryGetTransactionsFromBlock = 	'SELECT JSON number, transactionsCount,transactions FROM block WHERE number = ?';

// BLOCKS
const queryGetAllBlocksFromDB 	=		'SELECT JSON parentHash, number, time, contracttype, witnessAddress, transactionsCount, transactions, size FROM block';
const queryInsertBlock			=		'INSERT INTO block (parentHash, number, time, contracttype, witnessAddress, transactionsCount, transactions, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';

// WITNESSES
const queryGetAllWitnesses		=		'SELECT JSON address, votecount, pubkey, url, totalmissed, latestblocknum, latestslotnum, isjobs FROM witness';
const queryInsertWitness 		=		'INSERT INTO witness (address, votecount, pubkey, url, totalmissed, latestblocknum, latestslotnum, isjobs) VALUES (?, ?, ?, ?, ?, ?, ?, ?);'

// NODES
const queryGetAllNodes 			=		'SELECT JSON host, port, city, region, latitude, longitude, continentcode, countryname, country, regioncode, currency, org FROM nodes';
const queryInsertNode 			=		'INSERT INTO nodes (host, port, city, region, latitude, longitude, continentcode, countryname, country, regioncode, currency, org) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'

// ASSETISSUES
const queryGetAllAssetIssue 	=		'SELECT JSON ownerAddress, name, totalsupply, trxnum, num, starttime, endtime, decayratio, votescore, description, url FROM assetissues';
const queryInsertAssetIssue 	=		'INSERT INTO assetissues (ownerAddress, name, totalsupply, trxnum, num, starttime, endtime, decayratio, votescore, description, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';

// ACCOUNTS
const queryGetAllAccounts 		=		'SELECT JSON accountname, type, address, balance, voteslist, assetmap, latestoprationtime, frozenlist, bandwidth, createtime, allowance, latestwithdrawtime, code FROM accounts';
const queryInsertAccount 		=		'INSERT INTO accounts (accountname, type, address, balance, voteslist, assetmap, latestoprationtime, frozenlist, bandwidth, createtime, allowance, latestwithdrawtime, code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';

class CassandraDBUtils {
	constructor(cassandraSetup) {
		this.cassandraClient = new cassandra.Client(cassandraSetup);
	}

	async getAll(query){
		const result = await this.cassandraClient.execute(query);
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
		this.cassandraClient.execute(queryGetTransactionsFromBlock, [ blockNum ], { prepare: true })
			.then(result => {
				const row = result.first();
			});
	}

	insert(query, params, message){
		this.cassandraClient.execute(query, params, { prepare: true })
			.catch(error => {
				console.log("Error adding "+ message + " to DB");
				console.log(params);
			});
	}

	insertBlock(params, number){
		this.insert(queryInsertBlock, params, 'Block');
	}


	insertWitness(params){
		//const params = [address, votecount, pubkey, url, totalmissed, latestblocknum, latestslotnum, isjobs]
		this.insert(queryInsertWitness, params, 'Witness');
	}

	insertNode(params){
		//const params = [host, port, city, org, latitude, longitude, countinentalcode, countryname, country, regioncode, currency, org]
		this.insert(queryInsertNode, params, 'Node');
	}

	insertAssetIssue(params){
		//const params = [ownerAddress, name, totalSupply, trxNum, num, startTime, endTime, decayRatio, voteScore, description, url];
		this.insert(queryInsertAssetIssue, params, 'Issued Asset');
	}

	insertAccount(params){
	// accountname, type, address, balance, voteslist, assetmap, latestoprationtime, frozenlist, bandwidth, createtime, allowance, latestwithdrawtime, code
		// const params2 = ['', 0, '27cR9nG28vFbES1wqmCLGymYxCmawqFHXck', 402789000000, {}, {}, 1525874976000, ['0': {expireTime: 0, dasnsjdf: 2}], 0, 1525867938000, 0, 0, ''];
		this.insert(queryInsertAccount, params, 'Account');
	}

	batchInsertBlock(params){
		const queries = [
		  {
		    query: queryInsertBlock,
		    params: params[0]
		  },
		  {
		    query: queryInsertBlock,
		    params: params[1]
		  },
		  {
		    query: queryInsertBlock,
		    params: params[2]
		  }
		];

		this.cassandraClient.batch(queries, { prepare: true })
  			.catch(error => console.log('Error adding blocks to cluster'));
	}
}

module.exports = CassandraDBUtils;
