
class DBToElasticSearch {
	constructor(CassandraDBUtils, ElasticSearchDBUtils) {
		this.cassandraDBUtils = CassandraDBUtils;
		this.elasticSearchDBUtils = ElasticSearchDBUtils;
	}

	putAllBlockDataIntoElasticSearch(){
		this.cassandraDBUtils.getAllBlocks();
	}

	putAllWitnessDataIntoElasticSearch(){
		let that = this;

	    var dataPromise = this.cassandraDBUtils.getAllWitnesses();
	    dataPromise.then(function(jsonData){
	        that.elasticSearchDBUtils.insertWitnesses(jsonData);
	    }).catch(function (err){
			console.log("Error pulling witnesses from DB and putting into Elastic");
		});
	}

	putAllNodeDataIntoElasticSearch(){
		let that = this;

	    var dataPromise = this.cassandraDBUtils.getAllNodes();
	    dataPromise.then(function(jsonData){
	        that.elasticSearchDBUtils.insertNodes(jsonData);
	    }).catch(function (err){
			console.log("Error pulling nodes from DB and putting into Elastic");
		});
	}

	putAllIssuedAssetsIntoElasticSearch(){
		let that = this;

		var dataPromise = this.cassandraDBUtils.getAllIssuedAssets();
		dataPromise.then(function(jsonData){
	        that.elasticSearchDBUtils.insertIssuedAssets(jsonData);
	    }).catch(function (err){
			console.log("Error pulling issued assets from DB and putting into Elastic");
		});
	}

	putAllAccountsDataIntoElasticSearch(){
		this.cassandraDBUtils.getAllAccounts();
	}
}

module.exports = DBToElasticSearch;
