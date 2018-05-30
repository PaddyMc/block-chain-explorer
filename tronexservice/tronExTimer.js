class TronExTimer {
	constructor(blocktoDB, dbToElasticSearch, blockToElastic){
		this.blocktoDB = blocktoDB;
		this.dbToElasticSearch = dbToElasticSearch;
		this.blockToElastic = blockToElastic;
	}

	start(){
		var that = this;
		that.putAllNodesIntoDB();

		// 5 mins
		setInterval(function(){
			that.putLatestBlocksInDB();
		}, 300000);

		// 10 mins
		setInterval(function(){
			that.putAllDataIntoDB();
		}, 600000);

		// 15 mins
		setInterval(function(){
			that.putAllDataIntoElastic();
		}, 900000);

		// 20 mins
		setInterval(function(){
			that.dbToElasticSearch.putAllBlockDataIntoElasticSearch();
		}, 1200000);

		// 1 hr
		setInterval(function(){
			that.blocktoDB.putAllBlockDataIntoDB();
		}, 3600000);

		// 2 hr
		setInterval(function(){
			that.putAllNodesIntoDB();
		}, 7200000);

	}

	putLatestBlocksInDB(){
		this.blocktoDB.putLatestBlockDataIntoDB(300);
	}

	putAllBlockDataIntoDB(){
		this.blocktoDB.putAllBlockDataIntoDB();
	}

	putAllBlockDataIntoElasticSearch(){
		this.dbToElasticSearch.putAllBlockDataIntoElasticSearch();
	}

	putAllDataIntoDB(){
		this.blocktoDB.putAllWitnessesIntoDB();
		//this.blocktoDB.putAllAccountsIntoDB();
		this.blocktoDB.putAllIssuedAssetsIntoDB();
	}

	putAllDataIntoElastic(){
		this.dbToElasticSearch.putAllWitnessDataIntoElasticSearch();
		//this.dbToElasticSearch.putAllAccountsDataIntoElasticSearch();
		this.dbToElasticSearch.putAllNodeDataIntoElasticSearch();
		this.dbToElasticSearch.putAllIssuedAssetsIntoElasticSearch();

		this.dbToElasticSearch.putAllTransactionsIntoElasticSearch();

		this.blockToElastic.putDynamicPropertiesIntoElastic();
		this.blockToElastic.putTotalTransactionIntoElastic();
	}

	putAllNodesIntoDB(){
		this.blocktoDB.putAllNodesIntoDB();
	}

}

module.exports = TronExTimer;
