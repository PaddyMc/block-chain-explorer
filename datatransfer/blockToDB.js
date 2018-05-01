

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
	        for(let i = 0; i<100; i++){
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
}

module.exports = BlockToDB;