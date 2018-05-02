class BlockToElastic {

	constructor(BlockChainData, ElasticDBUtils) {
		this.blockChainData = BlockChainData;
		this.elasticDBUtils = ElasticDBUtils;
	}

	async putTotalTransactionIntoElastic(){
		let that = this;

	    var totalTransactionPromise = this.blockChainData.getTotalTransaction()
	    totalTransactionPromise.then(function(dataFromNode){
	        let jsonData = JSON.parse(JSON.stringify(dataFromNode));
			that.elasticDBUtils.insertTotalTransaction(jsonData.num);
	    });
	}
}

module.exports = BlockToElastic;
