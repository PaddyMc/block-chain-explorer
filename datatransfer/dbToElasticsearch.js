
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
	    }).catch(function (err){
			console.log("Error pulling blocks from DB and putting into Elastic");
		});
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
		let that = this;

		var dataPromise = this.cassandraDBUtils.getAllAccounts();
		dataPromise.then(function(jsonData){
	        that.elasticSearchDBUtils.insertAccounts(jsonData);
	    }).catch(function (err){
			console.log("Error pulling accounts from DB and putting into Elastic");
		});
	}
}

module.exports = DBToElasticSearch;
