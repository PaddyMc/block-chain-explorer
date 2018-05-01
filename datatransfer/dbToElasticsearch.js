
class DBToElasticSearch {
	constructor(CassandraDBUtils, ElasticSearchDBUtils) {
		this.cassandraDBUtils = CassandraDBUtils;
		this.elasticSearchDBUtils = ElasticSearchDBUtils;
	}

	putAllBlockDataIntoElasticSearch(){
		let that = this;

	    var dataPromise = this.cassandraDBUtils.getAllBlocks();
	    dataPromise.then(function(jsonData){
	        that.elasticSearchDBUtils.insertBlocks(jsonData);
	    });
	}

	putAllWitnessDataIntoElasticSearch(){
		let that = this;

	    var dataPromise = this.cassandraDBUtils.getAllWitnesses();
	    dataPromise.then(function(jsonData){
	        that.elasticSearchDBUtils.insertWitnesses(jsonData);
	    });
	}

	putAllNodeDataIntoElasticSearch(){
		let that = this;

	    var dataPromise = this.cassandraDBUtils.getAllNodes();
	    dataPromise.then(function(jsonData){
	        that.elasticSearchDBUtils.insertNodes(jsonData);
	    });
	}
}

module.exports = DBToElasticSearch;
