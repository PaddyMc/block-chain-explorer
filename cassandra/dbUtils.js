const cassandra = require('cassandra-driver');

const QUERY_LIMIT = 5000;

const queryGetTransactionsFromBlock = 	'SELECT JSON number, transactionsCount,transactions FROM block WHERE number = ?';

// BLOCKS
const queryGetFirstBlocksPartition =		'SELECT JSON uuid, parentHash, number, time, contracttype, witnessAddress, transactionsCount, transactions, size FROM block LIMIT ' + QUERY_LIMIT;
const queryGetBlocksPartition 	 =		'SELECT JSON uuid, parentHash, number, time, contracttype, witnessAddress, transactionsCount, transactions, size FROM block WHERE token(uuid) > token(?) LIMIT ' + QUERY_LIMIT;
const queryInsertBlock			=		'INSERT INTO block (uuid, parentHash, number, time, contracttype, witnessAddress, transactionsCount, transactions, size) VALUES (uuid(), ?, ?, ?, ?, ?, ?, ?, ?);';

// WITNESSES
const queryGetAllWitnesses		=		'SELECT JSON address, votecount, pubkey, url, totalproduced, totalmissed, latestblocknum, latestslotnum, isjobs FROM witness LIMIT ' + QUERY_LIMIT;
const queryInsertWitness 		=		'INSERT INTO witness (address, votecount, pubkey, url, totalproduced, totalmissed, latestblocknum, latestslotnum, isjobs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);'

// NODES
const queryGetAllNodes 			=		'SELECT JSON host, port, city, region, latitude, longitude, continentcode, countryname, country, regioncode, currency, org FROM nodes LIMIT ' + QUERY_LIMIT;
const queryInsertNode 			=		'INSERT INTO nodes (host, port, city, region, latitude, longitude, continentcode, countryname, country, regioncode, currency, org) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'

// ASSETISSUES
const queryGetAllAssetIssue 	=		'SELECT JSON ownerAddress, name, totalsupply, trxnum, num, starttime, endtime, decayratio, votescore, description, url FROM assetissues LIMIT ' + QUERY_LIMIT;
const queryInsertAssetIssue 	=		'INSERT INTO assetissues (ownerAddress, name, totalsupply, trxnum, num, starttime, endtime, decayratio, votescore, description, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';

// ACCOUNTS
const queryGetAllAccounts 	=			'SELECT JSON uuid, accountname, type, address, balance, voteslist, assetmap, latestoprationtime, frozenlist, bandwidth, createtime, allowance, latestwithdrawtime, code FROM accounts LIMIT ' + QUERY_LIMIT;
const queryGetFirstAccountsPartition 		=		'SELECT JSON uuid, accountname, type, address, balance, voteslist, assetmap, latestoprationtime, frozenlist, bandwidth, createtime, allowance, latestwithdrawtime, code FROM accounts LIMIT ' + QUERY_LIMIT;
const queryGetAccountsPartition 		=		'SELECT JSON uuid, accountname, type, address, balance, voteslist, assetmap, latestoprationtime, frozenlist, bandwidth, createtime, allowance, latestwithdrawtime, code FROM accounts WHERE token(uuid) > token(?) LIMIT ' + QUERY_LIMIT;
const queryInsertAccount 		=		'INSERT INTO accounts (uuid, accountname, type, address, balance, voteslist, assetmap, latestoprationtime, frozenlist, bandwidth, createtime, allowance, latestwithdrawtime, code) VALUES (uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';

class CassandraDBUtils {
	constructor(cassandraSetup, elasticSearchDBUtils) {
		this.cassandraClient = new cassandra.Client(cassandraSetup);
		this.elasticSearchDBUtils = elasticSearchDBUtils;
	}

	async getAll(query){
		const result = await this.cassandraClient.execute(query);
		return result;
	}

	async getAllBlocks(){
		let that = this;
		var dataPromise = that.getAll(queryGetFirstBlocksPartition);
		dataPromise.then(function(dataFromLocalNode){
			if(dataFromLocalNode["rows"][0]){
				that.elasticSearchDBUtils.insertBlocks(dataFromLocalNode);
			}
			if(dataFromLocalNode["rows"][QUERY_LIMIT-1]){
				var row = JSON.parse(dataFromLocalNode["rows"][QUERY_LIMIT-1]['[json]']);
				let latestUuid = row.uuid;
				that._getBlocksPartition(latestUuid)
			} else {
				console.log("All blocks are read");
			}
		});
	}

	_getBlocksPartition(latestUuid){
		let that = this;
		let dataPromise = this.cassandraClient.execute(queryGetBlocksPartition, [latestUuid], { prepare: true });
		dataPromise.then(async function(dataFromLocalNode){
			if(dataFromLocalNode["rows"][QUERY_LIMIT-1]){
				let row = JSON.parse(dataFromLocalNode["rows"][QUERY_LIMIT-1]['[json]']);
				let latestUuid = row.uuid;
				that.elasticSearchDBUtils.insertBlocks(dataFromLocalNode);
				that._getBlocksPartition(latestUuid)
			} else if(dataFromLocalNode["rows"][0]){
				that.elasticSearchDBUtils.insertBlocks(dataFromLocalNode);
				console.log("All blocks are read");
			}
		});
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
		let that = this;
		var dataPromise = that.getAll(queryGetFirstAccountsPartition);
		dataPromise.then(function(dataFromLocalNode){
			if(dataFromLocalNode["rows"][0]){
				that.elasticSearchDBUtils.insertAccounts(dataFromLocalNode);
			}
			if(dataFromLocalNode["rows"][QUERY_LIMIT-1]){
				var row = JSON.parse(dataFromLocalNode["rows"][QUERY_LIMIT-1]['[json]']);
				let latestUuid = row.uuid;
				that._getAccountsPartition(latestUuid)
			} else {
				console.log("All accounts are read");
			}
		});
  	}

	_getAccountsPartition(latestUuid){
		let that = this;
		let dataPromise = this.cassandraClient.execute(queryGetAccountsPartition, [latestUuid], { prepare: true });
		dataPromise.then(async function(dataFromLocalNode){
			if(dataFromLocalNode["rows"][QUERY_LIMIT-1]){
				let row = JSON.parse(dataFromLocalNode["rows"][QUERY_LIMIT-1]['[json]']);
				let latestUuid = row.uuid;
				that.elasticSearchDBUtils.insertAccounts(dataFromLocalNode);
				that._getAccountsPartition(latestUuid)
			} else if(dataFromLocalNode["rows"][0]){
				that.elasticSearchDBUtils.insertAccounts(dataFromLocalNode);
				console.log("All accounts are read");
			}
		});
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
