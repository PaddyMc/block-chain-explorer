const elasticsearch = require('elasticsearch');


class ElasticSearchDBUtils {
	constructor(elasticSearchSetup) {
		this.client = new elasticsearch.Client(elasticSearchSetup);
	}

	insertBlocks(jsonData){
		let bulkData;
		let bulkRequest = [];
		for(var i in jsonData["rows"]) {
			var row = JSON.parse(jsonData["rows"][i]['[json]']);
			bulkData = {
				hash: row.hash,
 				parentHash: row.parenthash,
				number: row.number,
				time: row.time,
				witnessAddress: row.witnessaddress,
				transactions: row.transactions,
				contractType: row.contracttype,
				transactionsCount: row.transactionscount,
				size: row.size,
				transactionsTotal: row.transactionstotal
			};
			bulkRequest.push({index: {_index: 'blocks', _type: 'block', _id: row.number}});
			bulkRequest.push(bulkData);
		}
		this._insertBulk(bulkRequest, this.client, "blocks")
	}

	insertWitnesses(jsonData){
		let bulkData;
		let bulkRequest = [];
		for(var i in jsonData["rows"]) {
			var row = JSON.parse(jsonData["rows"][i]['[json]']);
			bulkData = {
				address: row.address,
				voteCount: row.votecount,
				pubKey: row.pubkey,
				url: row.url,
				totalProduced: row.totalproduced,
				totalMissed: row.totalmissed,
				latestBlockNum: row.latestblocknum,
				latestsLotNum: row.latestslotnum,
				isJobs: row.isjobs
			};
			bulkRequest.push({index: {_index: 'witnesses', _type: 'witness', _id: row.address}});
			bulkRequest.push(bulkData);
		}
		this._insertBulk(bulkRequest, this.client, "witnesses")
	}

	insertNodes(jsonData){
		let bulkData;
		let bulkRequest = [];
		for(var i in jsonData["rows"]) {
			var row = JSON.parse(jsonData["rows"][i]['[json]']);
		    bulkData = {
		    	num: index,
				host: row.host,
				port: row.port,
				city: row.city,
				region: row.region,
				location: {
					lat: row.latitude,
					lon: row.longitude
				},
				continentcode: row.continentcode,
				countryname: row.countryname,
				country: row.country,
				regioncode: row.regioncode,
				currency: row.currency,
				org: row.org
			};
			bulkRequest.push({index: {_index: 'nodes', _type: 'node', _id: row.host}});
			bulkRequest.push(bulkData);
		}
		this._insertBulk(bulkRequest, this.client, "nodes")
	}

	insertIssuedAssets(jsonData){
		let bulkData;
		let bulkRequest = [];
		for(var i in jsonData["rows"]) {
			var row = JSON.parse(jsonData["rows"][i]['[json]']);
			bulkData = {
				ownerAddress: row.owneraddress,
				name: row.name,
				totalSupply: row.totalsupply,
				trxNum: row.trxnum,
				num: row.num,
				startTime: row.starttime,
				endTime: row.endtime,
				decayRatio: row.decayratio,
				voteScore: row.votescore,
				description: row.description,
				url: row.url,
			};
			bulkRequest.push({index: {_index: 'issuedassets', _type: 'issuedasset', _id: row.owneraddress}});
			bulkRequest.push(bulkData);
		}
		this._insertBulk(bulkRequest, this.client, "assets")
	}

	insertAccounts(jsonData){
		let bulkData;
		let bulkRequest = [];
		for(var i in jsonData["rows"]) {
			var row = JSON.parse(jsonData["rows"][i]['[json]']);
			bulkData = {
				accountName: row.accountname,
				type: row.type,
				address: row.address,
				balance: row.balance,
				votesList: row.voteslist,
				assetMap: row.assetmap,
				latestOprationTime: row.latestoprationtime,
				frozenList: row.frozenlist,
				bandwidth: row.bandwidth,
				createTime: row.createtime,
				allowance: row.allowance,
				latestWithdrawTime: row.latestwithdrawtime,
				code: row.code,
			};
			bulkRequest.push({index: {_index: 'accounts', _type: 'account', _id: row.address}});
			bulkRequest.push(bulkData);
		}
		this._insertBulk(bulkRequest, this.client, "accounts")
	}


// uuid, blocknum, transactionnum, fromaddress, toaddress, amount
	insertTransactions(jsonData){
		let bulkData;
		let bulkRequest = [];
		for(var i in jsonData["rows"]) {
			var row = JSON.parse(jsonData["rows"][i]['[json]']);
			bulkData = {
				blockNum: row.blocknum,
				fromAddress: row.fromaddress,
				toAddress: row.toaddress,
				amount: row.amount,
			};
			let id = row.blocknum.toString() + row.transactionnum.toString();
			bulkRequest.push({index: {_index: 'transactions', _type: 'transaction', _id: id}});
			bulkRequest.push(bulkData);
		}
		this._insertBulk(bulkRequest, this.client, "transactions")
	}

	insertTotalTransaction(jsonData){
		let bulkData = {
			num: jsonData.num,
		};
		let bulkRequest = [];
		bulkRequest.push({index: {_index: 'transactions', _type: 'transaction', _id: "totalTransaction"}});
		bulkRequest.push(bulkData);

		this._insertBulk(bulkRequest, this.client, "total trans")
	}

	insertDynamicProperties(jsonData){
		let bulkData = {
			lastSolidityBlockNum: jsonData.lastSolidityBlockNum,
		};
		let bulkRequest = [];
		bulkRequest.push({index: {_index: 'properties', _type: 'dynamicProperty', _id: "lastSolidityBlockNum"}});
		bulkRequest.push(bulkData);

		this._insertBulk(bulkRequest, this.client, "dynamic properties")
	}

	_insertBulk(bulkRequest, client, type){
		var insertData = function(){
			var busy = false;
			var callback = function(error, response) {
				if (error) {
					console.log(error);
				}
				busy = false;
			};

			if (!busy) {
				busy = true;
				client.bulk({
					body: bulkRequest.slice(0, 1000)
				}, callback);
				bulkRequest = bulkRequest.slice(1000);
			}

			if (bulkRequest.length > 0) {
				setTimeout(insertData, 10);
			} else {
				console.log('Inserted all '+ type +' into elasticsearch.');
			}
		};
		insertData();
	}
}

module.exports = ElasticSearchDBUtils;
