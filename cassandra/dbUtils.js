const cassandra = require('cassandra-driver');

const QUERY_LIMIT = 5000;

const queryGetTransactionsFromBlock 	= 		'SELECT JSON number, transactionsCount,transactions FROM block WHERE number = ?';

// BLOCKS
const queryGetFirstBlocksPartition 		=		'SELECT JSON uuid, hash, parentHash, number, time, contracttype, witnessAddress, transactionsCount, transactions, size, transactionsTotal FROM block LIMIT ' + QUERY_LIMIT;
const queryGetBlocksPartition 	 		=		'SELECT JSON uuid, hash, parentHash, number, time, contracttype, witnessAddress, transactionsCount, transactions, size, transactionsTotal FROM block WHERE token(uuid) > token(?) LIMIT ' + QUERY_LIMIT;
const queryInsertBlock					=		'INSERT INTO block (uuid, hash, parentHash, number, time, contracttype, witnessAddress, transactionsCount, transactions, size, transactionsTotal) VALUES (uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';

// WITNESSES
const queryGetAllWitnesses				=		'SELECT JSON address, votecount, pubkey, url, totalproduced, totalmissed, latestblocknum, latestslotnum, isjobs FROM witness LIMIT ' + QUERY_LIMIT;
const queryInsertWitness 				=		'INSERT INTO witness (address, votecount, pubkey, url, totalproduced, totalmissed, latestblocknum, latestslotnum, isjobs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);'

// NODES
const queryGetAllNodes 					=		'SELECT JSON host, port, city, region, latitude, longitude, continentcode, countryname, country, regioncode, currency, org FROM nodes LIMIT ' + QUERY_LIMIT;
const queryInsertNode 					=		'INSERT INTO nodes (host, port, city, region, latitude, longitude, continentcode, countryname, country, regioncode, currency, org) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'

// ASSETISSUES
const queryGetAllAssetIssue 			=		'SELECT JSON ownerAddress, name, totalsupply, trxnum, num, starttime, endtime, decayratio, votescore, description, url FROM assetissues LIMIT ' + QUERY_LIMIT;
const queryInsertAssetIssue 			=		'INSERT INTO assetissues (ownerAddress, name, totalsupply, trxnum, num, starttime, endtime, decayratio, votescore, description, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';

// ACCOUNTS
const queryGetFirstAccountsPartition 	=		'SELECT JSON uuid, accountname, type, address, balance, voteslist, assetmap, latestoprationtime, frozenlist, bandwidth, createtime, allowance, latestwithdrawtime, code FROM accounts LIMIT ' + QUERY_LIMIT;
const queryGetAccountsPartition 		=		'SELECT JSON uuid, accountname, type, address, balance, voteslist, assetmap, latestoprationtime, frozenlist, bandwidth, createtime, allowance, latestwithdrawtime, code FROM accounts WHERE token(uuid) > token(?) LIMIT ' + QUERY_LIMIT;
const queryInsertAccount 				=		'INSERT INTO accounts (uuid, accountname, type, address, balance, voteslist, assetmap, latestoprationtime, frozenlist, bandwidth, createtime, allowance, latestwithdrawtime, code) VALUES (uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';

// TRANSACTIONS
const queryGetFirstTransactionsPartition 	=		'SELECT JSON uuid, blocknum, transactionnum, fromaddress, toaddress, amount FROM transactions LIMIT ' + QUERY_LIMIT;
const queryGetTransactionsPartition 		=		'SELECT JSON uuid, blocknum, transactionnum, fromaddress, toaddress, amount FROM transactions WHERE token(uuid) > token(?) LIMIT ' + QUERY_LIMIT;
const queryInsertTransaction 			=		'INSERT INTO transactions (uuid, blocknum, transactionnum, fromaddress, toaddress, amount) VALUES (uuid(), ?, ?, ?, ?, ?);';

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

  	async getAllTransactions(){
		let that = this;
		var dataPromise = that.getAll(queryGetFirstTransactionsPartition);
		dataPromise.then(function(dataFromLocalNode){
			if(dataFromLocalNode["rows"][0]){
				that.elasticSearchDBUtils.insertTransactions(dataFromLocalNode);
			}
			if(dataFromLocalNode["rows"][QUERY_LIMIT-1]){
				var row = JSON.parse(dataFromLocalNode["rows"][QUERY_LIMIT-1]['[json]']);
				let latestUuid = row.uuid;
				that._getTransactionsPartition(latestUuid)
			} else {
				console.log("All transactions are read");
			}
		});

		return this.getAll(queryGetAllTransactions);
  	}

	_getTransactionsPartition(latestUuid){
		let that = this;
		let dataPromise = this.cassandraClient.execute(queryGetTransactionsPartition, [latestUuid], { prepare: true });
		dataPromise.then(async function(dataFromLocalNode){
			if(dataFromLocalNode["rows"][QUERY_LIMIT-1]){
				let row = JSON.parse(dataFromLocalNode["rows"][QUERY_LIMIT-1]['[json]']);
				let latestUuid = row.uuid;
				that.elasticSearchDBUtils.insertTransactions(dataFromLocalNode);
				that._getTransactionsPartition(latestUuid)
			} else if(dataFromLocalNode["rows"][0]){
				that.elasticSearchDBUtils.insertTransactions(dataFromLocalNode);
				console.log("All transactions are read");
			}
		});
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
				that._getAccountsPartition(latestUuid);
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
		// const params2 = [accountname, type, address, balance, voteslist, assetmap, latestoprationtime, frozenlist, bandwidth, createtime, allowance, latestwithdrawtime, code];
		this.insert(queryInsertAccount, params, 'Account');
	}

	insertTransaction(params){
		//const params = [number, toaddress, fromaddress, amount]
		this.insert(queryInsertTransaction, params, 'Transaction');
	}

	batchInsertBlock(params){
		const queries = []

		for(let i=0; i<params.length; i++){
			let singleQuery = {
			    query: queryInsertBlock,
			    params: params[i]
		  	}
		  	queries.push(singleQuery);
		}

		this.cassandraClient.batch(queries, { prepare: true })
  			.catch(error => console.log('Error adding blocks to cluster'));
	}

	batchInsertTransactions(params){
		const queries = [];
		if(params.length>=1){
			for(let i=0; i<params[0].length; i++){
				let singleTransaction = {
				    query: queryInsertTransaction,
				    params: [params[0][i].blockNum, params[0][i].transactionNum, params[0][i].from, params[0][i].to, params[0][i].amount]
			  	}
			  	queries.push(singleTransaction);
			}
		}

		if(queries.length>=1){
			this.cassandraClient.batch(queries, { prepare: true })
  				.catch(error => console.log('Error adding transactions to cluster'));
		}
	}
}

module.exports = CassandraDBUtils;
