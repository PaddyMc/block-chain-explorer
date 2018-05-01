

class BlockToDB {

	constructor(BlockChainData , CassandraDBUtils) {
		this.blockChainData = BlockChainData;
		this.cassandraDBUtils = CassandraDBUtils;
	}

	putAllWitnessesIntoDB(){
		let that = this;

	    var allWitnessPromise = this.blockChainData.listWitnesses()
	    allWitnessPromise.then(function(dataFromNode){
	        var jsonData = JSON.parse(JSON.stringify(dataFromNode));
	        for (var i = 0; i < jsonData.witnessesList.length; i++) {
	            let params = that._buildParamsForWitnessInsertStatment(jsonData.witnessesList[i]);
	            that.cassandraDBUtils.insertWitness(params)
	        }
	    });
	}

	// NODES
	putAllNodesIntoDB(){
		let that = this;

	    var allNodesPromise = this.blockChainData.listNodes()
	    allNodesPromise.then(function(dataFromNode){
	        var jsonData = JSON.parse(JSON.stringify(dataFromNode));
			for (var i = 0; i < jsonData.nodesList.length; i++) {
				let params = that._buildParamsForNodeInsertStatment(jsonData.nodesList[i].address);
				that.cassandraDBUtils.insertNode(params);
			}
	    });
	}

	//ISSUEDASSETS
	putAllIssuedAssetsIntoDB(){
		var that = this;

		var allIssuedAssetsPromise = this.blockChainData.getAssetIssueList();
		allIssuedAssetsPromise.then(function(dataFromNode){
	        var jsonData = JSON.parse(JSON.stringify(dataFromNode));
	        
			for (var i = 0; i < jsonData.assetissueList.length; i++) {
				let params = that._buildParamsForIssuedAssetsInsertStatment(jsonData.assetissueList[i]);
				that.cassandraDBUtils.insertAssetIssue(params);
			}
	    });
	}

	//ACCOUNTS
	putAllAccountsIntoDB(){
		let that = this;

	    let allAccountsPromise = this.blockChainData.listAccounts()
	    allAccountsPromise.then(function(jsonData){
	        console.log(jsonData);

	        // ToDo : Build table for accounts

	    });
	}

	putBlockIntoDatabaseFromLocalNodeByLatest(){
		var that = this;

	    var dataPromise = this.blockChainData.getLatestBlockFromLocalNode();
	    dataPromise.then(function(dataFromLocalNode){
	        const params = that._buildParamsForBlockInsertStatment(dataFromLocalNode);
	        that.cassandraDBUtils.insertBlock(params);
	    });
	}

	putBlockIntoDatabaseFromLocalNodeByNumber(number){
		var that = this;

	    var dataPromiseByNumber = this.blockChainData.getBlockFromLocalNode(number);
	    dataPromiseByNumber.then(function(dataFromLocalNode){
	        const params = that._buildParamsForBlockInsertStatment(dataFromLocalNode);
	        //console.log(params);
	        that.cassandraDBUtils.insertBlock(params);
	    });
	}

	putAllBlockDataIntoDB(){
		var that = this;

	    var dataPromise = this.blockChainData.getLatestBlockFromLocalNode();
	    dataPromise.then(function(dataFromLocalNode){
	    	//dataFromLocalNode.number
	        for(let i = 0; i<2500; i++){
	            that.putBlockIntoDatabaseFromLocalNodeByNumber(i);
	        }
	    });
	}

	_buildParamsForBlockInsertStatment(dataFromLocalNode){
	    let transactions = {};

	    for (let i = 0; i < dataFromLocalNode.transactions.length; i++) {
	        let replaceFrom = JSON.stringify(dataFromLocalNode.transactions[i]).replace(/from/, 'fromaddress');
	        let replaceTo = replaceFrom.replace(/to/, 'toaddress');
	        let newArray = JSON.parse(replaceTo);
	        transactions[i] = newArray;
	    }

	    let params = [dataFromLocalNode.parentHash, dataFromLocalNode.number, dataFromLocalNode.time, dataFromLocalNode.witnessAddress, dataFromLocalNode.transactionsCount, transactions];
	    return params;
	}

	_buildParamsForWitnessInsertStatment(dataFromNode){
	    let params = [dataFromNode.address, dataFromNode.votecount, dataFromNode.pubkey, dataFromNode.url, dataFromNode.totalmissed, dataFromNode.latestblocknum, dataFromNode.latestslotnum, dataFromNode.isjobs];
	    return params;
	}

	_buildParamsForNodeInsertStatment(dataFromNode){
		let decodedHost = new Buffer(dataFromNode.host, 'base64').toString('ascii');
	    let params = [decodedHost, dataFromNode.port.toString()];
	    return params;
	}

	_buildParamsForIssuedAssetsInsertStatment(dataFromNode){
		dataFromNode.name = new Buffer(dataFromNode.name, 'base64').toString();
		dataFromNode.description = new Buffer(dataFromNode.description, 'base64').toString();
		dataFromNode.url = new Buffer(dataFromNode.url, 'base64').toString();
		//console.log(dataFromNode.ownerAddress);
		let params = [dataFromNode.ownerAddress, dataFromNode.name, dataFromNode.totalSupply, dataFromNode.trxNum, dataFromNode.num, dataFromNode.startTime, dataFromNode.endTime, dataFromNode.decayRatio, dataFromNode.voteScore, dataFromNode.description, dataFromNode.url]
		return params;
	}
}

module.exports = BlockToDB;
