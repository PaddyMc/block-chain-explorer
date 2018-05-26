class TronExTimer {
	constructor(blocktoDB, dbToElasticSearch, blockToElastic){
		this.blocktoDB = blocktoDB;
		this.dbToElasticSearch = dbToElasticSearch;
		this.blockToElastic = blockToElastic;
	}

	start(){
		setInterval(function(){
			this.putLatestBlocksInDB();
		}, 60000);

		setInterval(function(){
			this.putAllDataIntoDB();
		}, 600000);

		setInterval(function(){
			this.blocktoDB.putAllBlockDataIntoDB();
		}, 800000);

		setInterval(function(){
			this.putAllDataIntoElastic();
		}, 1000000);

		setInterval(function(){
			this.dbToElasticSearch.putAllBlockDataIntoElasticSearch();
		}, 1200000);

	}

	putLatestBlocksInDB(){
		//this.blockt
	}

	putAllBlockDataIntoDB(){
		this.blocktoDB.putAllBlockDataIntoDB();
	}

	putAllBlockDataIntoElasticSearch(){
		this.dbToElasticSearch.putAllBlockDataIntoElasticSearch();
	}

	putAllDataIntoDB(){
		this.blocktoDB.putAllWitnessesIntoDB();
		this.blocktoDB.putAllNodesIntoDB();
		this.blocktoDB.putAllAccountsIntoDB();
		this.blocktoDB.putAllIssuedAssetsIntoDB();
	}

	putAllDataIntoElastic(){
		this.dbToElasticSearch.putAllWitnessDataIntoElasticSearch();
		this.dbToElasticSearch.putAllAccountsDataIntoElasticSearch();
		this.dbToElasticSearch.putAllNodeDataIntoElasticSearch();
		this.dbToElasticSearch.putAllIssuedAssetsIntoElasticSearch();

		this.dbToElasticSearch.putAllTransactionsIntoElasticSearch();

		this.blockToElastic.putDynamicPropertiesIntoElastic();
		this.blockToElastic.putTotalTransactionIntoElastic();
	}

}

module.exports = TronExTimer;
