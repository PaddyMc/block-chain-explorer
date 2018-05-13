require('babel-core/register');
require('babel-polyfill');
const CassandraDBUtils = require('./cassandra/dbUtils.js');
const ElasticSearchDBUtils = require('./elasticsearch/dbUtils.js');
const BlockChainData = require('./blockchaindata/explorer.js');
const BlockToDB = require("./datatransfer/blockToDB.js");
const DBToElasticSearch = require("./datatransfer/dbToElasticsearch.js");
const BlockToElastic = require("./datatransfer/blockToElastic.js");


//DBUtils
const cassandraSetup = { contactPoints: ['127.0.0.1'], keyspace: 'blockchainexplorer' };
const cassandraDBUtils = new CassandraDBUtils(cassandraSetup);

const elasticSearchSetup = {host: 'localhost:9200'};
const elasticSearchDBUtils = new ElasticSearchDBUtils(elasticSearchSetup);

//BlockChainData
const GRPC_HOSTNAME_PORT = {hostname:"127.0.0.1", port:"50051"};
const blockChainData = new BlockChainData(GRPC_HOSTNAME_PORT);

const geoLocationUrl = "https://ipapi.co/";

//DTO's
const blocktoDB = new BlockToDB(blockChainData, cassandraDBUtils, geoLocationUrl);
const dbToElasticSearch = new DBToElasticSearch(cassandraDBUtils, elasticSearchDBUtils);
const blockToElastic = new BlockToElastic(blockChainData, elasticSearchDBUtils);


function putAllDataIntoDB(){
	blocktoDB.putAllWitnessesIntoDB();
	blocktoDB.putAllNodesIntoDB();
	blocktoDB.putAllAccountsIntoDB();
	blocktoDB.putAllIssuedAssetsIntoDB();
}

function putAllDataIntoElastic(){
	dbToElasticSearch.putAllWitnessDataIntoElasticSearch();
	dbToElasticSearch.putAllAccountsDataIntoElasticSearch();
	dbToElasticSearch.putAllNodeDataIntoElasticSearch();
	dbToElasticSearch.putAllIssuedAssetsIntoElasticSearch();
	blockToElastic.putDynamicPropertiesIntoElastic();
	blockToElastic.putTotalTransactionIntoElastic();
}

// ToDo
//	Return More Than 5000 Records dbToElastic.js // 
//	Get last 100 Blocks // 30 seconds
//	From last 100 blocks update accounts

setInterval(function(){
	putAllDataIntoDB();
}, 600000);

setInterval(function(){
	blocktoDB.putAllBlockDataIntoDB();
}, 800000);

setInterval(function(){
	putAllDataIntoElastic();
}, 1000000);

setInterval(function(){
	dbToElasticSearch.putAllBlockDataIntoElasticSearch();
}, 1200000);

// add get tronix price => https://api.coinmarketcap.com/v1/ticker/tronix/

//let dataPromise = blocktoDB.putBlockIntoDatabaseFromLocalNodeByNumber(129);
// dataPromise.then(function(dataFromLocalNode){
//     console.log(dataFromLocalNode);
// });

