class BlockToElastic {

	constructor(BlockChainData, ElasticDBUtils) {
		this.blockChainData = BlockChainData;
		this.elasticDBUtils = ElasticDBUtils;
	}

	putTotalTransactionIntoElastic(){
		let that = this;

	    var promise = this.blockChainData.getTotalTransaction()
	    promise.then(function(dataFromNode){
	        let jsonData = JSON.parse(JSON.stringify(dataFromNode));
			that.elasticDBUtils.insertTotalTransaction(jsonData);
	    });
	}

	putDynamicPropertiesIntoElastic(){
		let that = this;

	    var promise = this.blockChainData.getDynamicProperties()
	    promise.then(function(dataFromNode){
	        let jsonData = JSON.parse(JSON.stringify(dataFromNode));
			that.elasticDBUtils.insertDynamicProperties(jsonData);
	    });
	}
}

module.exports = BlockToElastic;
