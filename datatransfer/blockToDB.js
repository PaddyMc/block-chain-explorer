const http = require('http')
const {base64DecodeFromString, byteArray2hexStr, bytesToString} = require("@tronprotocol/wallet-api/src/utils/bytes");
const {getBase58CheckAddress, signTransaction, passwordToAddress} = require("@tronprotocol/wallet-api/src/utils/crypto");


class BlockToDB {

	constructor(BlockChainData , CassandraDBUtils, GeoLocationUrl) {
		this.blockChainData = BlockChainData;
		this.cassandraDBUtils = CassandraDBUtils;
		this.geoLocationUrl = GeoLocationUrl;
		this.geoLocationDataType = "?access_key=81e80d40e299e6d0e0be641b8fbaf086&format=1";
	}

	// WITNESSES
	putAllWitnessesIntoDB(){
		let that = this;

	    var allWitnessPromise = this.blockChainData.listWitnesses()
	    allWitnessPromise.then(function(dataFromNode){
	        for (var i = 0; i < dataFromNode.witnessesList.length; i++) {
	        	if(i === dataFromNode.witnessesList.length - 1){
	        		console.log("Last Witness Added To Cluster: "+dataFromNode.witnessesList.length);
	        	}
	            let params = that._buildParamsForWitnessInsertStatment(dataFromNode.witnessesList[i]);
	            that.cassandraDBUtils.insertWitness(params)
	        }
	    }).catch(function (err){
			console.log("Error adding witnesses to DB");
		});
	}

	// NODES
	putAllNodesIntoDB(){
		let that = this;

	    let allNodesPromise = this.blockChainData.listNodes()
	    allNodesPromise.then(function(dataFromNode){
			for (let i = 0; i < dataFromNode.nodesList.length; i++) {
				let tempDataFromNode = dataFromNode;
				let decodedHost = new Buffer(tempDataFromNode.nodesList[i].address.host, 'base64').toString();
			    let fullUrl = that.geoLocationUrl+decodedHost+that.geoLocationDataType;

		    	let nodeInfo = that._getLocationFromIp(fullUrl);
				nodeInfo.then(function(geoLocationInfo){
					if(i === tempDataFromNode.nodesList.length - 1){
		        		console.log("Last Node Added To Cluster: "+tempDataFromNode.nodesList.length);
		        	}
					let params = that._buildParamsForNodeInsertStatment(decodedHost, tempDataFromNode.nodesList[i].address, geoLocationInfo);
					that.cassandraDBUtils.insertNode(params);
				}).catch(function(error){
					let params = [decodedHost, tempDataFromNode.nodesList[i].address.port.toString(), "err", "err", 0, 0, "err", "err", "err", "err", "err", "err"];
					that.cassandraDBUtils.insertNode(params);
				});
			}
	    }).catch(function (err){
			console.log("Error adding nodes to DB");
		});
	}

	// ISSUEDASSETS
	putAllIssuedAssetsIntoDB(){
		var that = this;

		var allIssuedAssetsPromise = this.blockChainData.getAssetIssueList();
		allIssuedAssetsPromise.then(function(dataFromNode){
			for (var i = 0; i < dataFromNode.assetissueList.length; i++) {
				if(i === dataFromNode.assetissueList.length - 1){
	        		console.log("Last AssetIssue Added To Cluster: "+dataFromNode.assetissueList.length);
	        	}
				let params = that._buildParamsForIssuedAssetsInsertStatment(dataFromNode.assetissueList[i]);
				that.cassandraDBUtils.insertAssetIssue(params);
			}
	    }).catch(function (err){
			console.log("Error adding issued assets to DB");
		});
	}

	// ACCOUNTS
	putAllAccountsIntoDB(){
		let that = this;

	    let allAccountsPromise = this.blockChainData.listAccounts()
	    allAccountsPromise.then(function(dataFromNode){
	        for(let i = 0;i<dataFromNode.accountsList.length;i++){
	        	if(i === dataFromNode.accountsList.length - 1){
	        		console.log("Last Account Added To Cluster: "+ dataFromNode.accountsList.length);
	        	}
	        	let params = that._buildParamsForAccountInsertStatment(dataFromNode.accountsList[i]);
	        	that.cassandraDBUtils.insertAccount(params);
	        }
	    })/*.catch(function (err){
			console.log("Error adding accounts to DB");
		});*/
	}

	// BLOCKS
	putBlockIntoDatabaseFromLocalNodeByLatest(){
		var that = this;

	    var dataPromise = this.blockChainData.getLatestBlockFromLocalNode();
	    dataPromise.then(function(dataFromLocalNode){
	        const params = that._buildParamsForBlockInsertStatment(dataFromLocalNode);
	        that.cassandraDBUtils.insertBlock(params);
	    }).catch(function (err){
			console.log("Error adding latest block to DB");
		});
	}

	_addBlockNumberToTransactions(transactions, number){
		for(let i=0;i<transactions.length;i++){
			transactions[i].blockNum = number;
			transactions[i].transactionNum = i;
		}
		return transactions;
	}

	putAllBlockDataIntoDatabase(number){
		var that = this;
		console.log("Syncing "+ number + " Blocks");

        var paramBatch = [];
        var transactionBatch =[];
		var batchIntervalCount = 0;
		for(let i = 0; i<=number; i++){
			setTimeout(function(){
				if(i == number){
					console.log("Last Block Added To Cluster: "+ number);
				}

				let dataPromiseByNumber = that.blockChainData.getBlockFromLocalNode(i);
				dataPromiseByNumber.then(function(dataFromLocalNode){
					let params = that._buildParamsForBlockInsertStatment(dataFromLocalNode);

					if(dataFromLocalNode.transactions.length>=1){
			        	let transactionsOnBlock = that._addBlockNumberToTransactions(dataFromLocalNode.transactions, i);
		        		transactionBatch.push(transactionsOnBlock);
	        		}

					paramBatch.push(params);

					if(i%5 == 0 || i == number) {
						batchIntervalCount++;
						that.cassandraDBUtils.batchInsertTransactions(transactionBatch);
						that.cassandraDBUtils.batchInsertBlock(paramBatch);
						paramBatch = [];
						transactionBatch =[];
				    }

				}).catch(function (err){
					console.log("Error adding block:" + i);
				});

			}, batchIntervalCount*10);
		}
	}

	putAllBlockDataIntoDB(){
		var that = this;
	    var dataPromise = this.blockChainData.getLatestBlockFromLocalNode();

	    dataPromise.then(function(dataFromLocalNode){
	      	that.putAllBlockDataIntoDatabase(dataFromLocalNode.number);
	    }).catch(function (err){
			console.log("Error adding initial block to DB");
		});
	}

	putLatestBlockDataIntoDatabase(latestAmount, number){
		var that = this;
		console.log("Syncing latest "+ latestAmount + " Blocks");

		var paramBatch = [];
		var transactionBatch =[];
		var batchIntervalCount = 0;
		for(let i = (number - latestAmount + 1); i<=number; i++){
			setTimeout(function(){
				if(i == number){
					console.log("Last Block Added To Cluster: "+ number);
				}

				let dataPromiseByNumber = that.blockChainData.getBlockFromLocalNode(i);
				dataPromiseByNumber.then(function(dataFromLocalNode){
					let params = that._buildParamsForBlockInsertStatment(dataFromLocalNode);

					if(dataFromLocalNode.transactions.length>=1){
						let transactionsOnBlock = that._addBlockNumberToTransactions(dataFromLocalNode.transactions, i);
						transactionBatch.push(transactionsOnBlock);
					}

					paramBatch.push(params);

					if(i%3 == 0 || i == number) {
						batchIntervalCount++;
						that.cassandraDBUtils.batchInsertTransactions(transactionBatch);
						that.cassandraDBUtils.batchInsertBlock(paramBatch);
						paramBatch = [];
						transactionBatch =[];
					}

				}).catch(function (err){
					console.log("Error adding block:" + i);
				});

			}, batchIntervalCount*10);
		}
	}

	putLatestBlockDataIntoDB(latestAmount){
		var that = this;
	    var dataPromise = this.blockChainData.getLatestBlockFromLocalNode();

	    dataPromise.then(function(dataFromLocalNode){
	      	that.putLatestBlockDataIntoDatabase(latestAmount, dataFromLocalNode.number);
	    }).catch(function (err){
			console.log("Error adding latest blocks to DB");
		});
	}

	_buildParamsForBlockInsertStatment(dataFromLocalNode){
	    let transactions = {};
	    let contractType = {};
	    let totalAmountTransactionsPerBlock = 0;

	    for (let i = 0; i < dataFromLocalNode.transactions.length; i++) {
	        let replaceFrom = JSON.stringify(dataFromLocalNode.transactions[i]).replace(/from/, 'fromaddress');
	        let replaceTo = replaceFrom.replace(/to/, 'toaddress');
	        let newArray = JSON.parse(replaceTo);
	        transactions[i] = newArray;
	        totalAmountTransactionsPerBlock += transactions[i].amount;
	    }

	    let contractTypeToLower = JSON.stringify(dataFromLocalNode.contractType).toLowerCase();
	    let contractTypesParsed= JSON.parse(contractTypeToLower);

	    contractType['types'] = contractTypesParsed;

	    let params = [dataFromLocalNode.hash, dataFromLocalNode.parentHash, dataFromLocalNode.number, dataFromLocalNode.time, contractType, dataFromLocalNode.witnessAddress, dataFromLocalNode.transactionsCount, transactions, dataFromLocalNode.size, totalAmountTransactionsPerBlock];
	    return params;
	}

	_buildParamsForWitnessInsertStatment(dataFromNode){
		let decodedAddress = getBase58CheckAddress(base64DecodeFromString(dataFromNode.address));
	    let params = [decodedAddress, dataFromNode.votecount, dataFromNode.pubkey, dataFromNode.url, dataFromNode.totalproduced, dataFromNode.totalmissed, dataFromNode.latestblocknum, dataFromNode.latestslotnum, dataFromNode.isjobs];
	    return params;
	}

	_buildParamsForNodeInsertStatment(decodedHost, dataFromNode, geoLocationInfo){
		let params = [];
		if(Object.keys(geoLocationInfo).length > 3){
			params = [decodedHost, dataFromNode.port.toString(), geoLocationInfo.city, geoLocationInfo.region, geoLocationInfo.latitude, geoLocationInfo.longitude, geoLocationInfo.continent_code, geoLocationInfo.country_name, geoLocationInfo.country_name, geoLocationInfo.region_code, "geoLocationInfo.currency", "geoLocationInfo.org"];
		} else {
			params = [decodedHost, dataFromNode.port.toString(), "", "", 0, 0, "", "", "", "", "", ""];
		}

		return params;
	}

	_buildParamsForIssuedAssetsInsertStatment(dataFromNode){
		dataFromNode.name = new Buffer(dataFromNode.name, 'base64').toString();
		dataFromNode.description = new Buffer(dataFromNode.description, 'base64').toString();
		dataFromNode.url = new Buffer(dataFromNode.url, 'base64').toString();

		let decodedAddress = getBase58CheckAddress(base64DecodeFromString(dataFromNode.ownerAddress));
		let params = [decodedAddress, dataFromNode.name, dataFromNode.totalSupply, dataFromNode.trxNum, dataFromNode.num, dataFromNode.startTime, dataFromNode.endTime, dataFromNode.decayRatio, dataFromNode.voteScore, dataFromNode.description, dataFromNode.url]
		return params;
	}

	_buildParamsForAccountInsertStatment(dataFromNode){
		let votesList = {};
		let assetMap = {};
		let frozenList = {};

		for (let i = 0; i < dataFromNode.votesList.length; i++) {
	        votesList[i] = dataFromNode.votesList[i];
	    }
	    for (let i = 0; i < dataFromNode.assetMap.length; i++) {
	        assetMap[dataFromNode.assetMap[i][0]] = dataFromNode.assetMap[i][1];
	    }

		for (let i = 0; i < dataFromNode.frozenList.length; i++) {
			let frozenAccount = {};
			frozenAccount["frozenBalance"] = dataFromNode.frozenList[i]["frozenBalance"];
			frozenAccount["expireTime"] = dataFromNode.frozenList[i]["expireTime"];
			frozenList[i] = frozenAccount;
		}
		let decodedAddress = getBase58CheckAddress(base64DecodeFromString(dataFromNode.address));

		let params = [dataFromNode.accountName, dataFromNode.type, decodedAddress, dataFromNode.balance, votesList, assetMap, dataFromNode.latestOprationTime, frozenList, dataFromNode.bandwidth, dataFromNode.createTime, dataFromNode.allowance, dataFromNode.latestWithdrawTime, dataFromNode.code];
		return params;
	}

	async _getLocationFromIp(urlForIpConversion){
		return new Promise((resolve, reject) => {
			let request = http.get(urlForIpConversion, (response) => {
				response.setEncoding('utf8');
				response.on('data', (body) => {
					if(body.includes("Request throttled")){
						reject("Node Location Query Limit Reached");
						console.log("Node Location Query Limit Reached");
					} else {
						resolve(JSON.parse(body));
					}
				});
			});
			request.on('error', (err) =>{
				reject(err);
			});
		});
	}
}

module.exports = BlockToDB;
