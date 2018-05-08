require('babel-core/register');
require('babel-polyfill');
const CassandraDBUtils = require('./cassandra/dbUtils.js');
const ElasticSearchDBUtils = require('./elasticsearch/dbUtils.js');
const BlockChainData = require('./blockchaindata/explorer.js');
const BlockToDB = require("./datatransfer/blockToDB.js");
const DBToElasticSearch = require("./datatransfer/dbToElasticsearch.js");
const BlockToElastic = require("./datatransfer/blockToElastic.js");


//DBUtils
var cassandraSetup = { contactPoints: ['127.0.0.1'], keyspace: 'blockchainexplorer' };
var cassandraDBUtils = new CassandraDBUtils(cassandraSetup);

var elasticSearchSetup = {host: 'localhost:9200'};
var elasticSearchDBUtils = new ElasticSearchDBUtils(elasticSearchSetup);

//BlockChainData
const GRPC_HOSTNAME_PORT = {hostname:"127.0.0.1", port:"50051"};
var blockChainData = new BlockChainData(GRPC_HOSTNAME_PORT);

const geoLocationUrl = "https://ipapi.co/";

//DTO's
var blocktoDB = new BlockToDB(blockChainData, cassandraDBUtils, geoLocationUrl);
var dbToElasticSearch = new DBToElasticSearch(cassandraDBUtils, elasticSearchDBUtils);
var blockToElastic = new BlockToElastic(blockChainData, elasticSearchDBUtils);


function putAllDataIntoDB(){
	//blocktoDB.putAllBlockDataIntoDB();
	blocktoDB.putAllWitnessesIntoDB();
	blocktoDB.putAllNodesIntoDB();
	blocktoDB.putAllAccountsIntoDB();
	blocktoDB.putAllIssuedAssetsIntoDB();
}

function putAllDataIntoElastic(){
	//dbToElasticSearch.putAllBlockDataIntoElasticSearch();
	dbToElasticSearch.putAllWitnessDataIntoElasticSearch();
	dbToElasticSearch.putAllAccountsDataIntoElasticSearch();
	dbToElasticSearch.putAllNodeDataIntoElasticSearch();
	dbToElasticSearch.putAllIssuedAssetsIntoElasticSearch();

	blockToElastic.putDynamicPropertiesIntoElastic();
	blockToElastic.putTotalTransactionIntoElastic();
}

//putAllDataIntoDB();
//blocktoDB.putAllBlockDataIntoDB();

//putAllDataIntoElastic();
//dbToElasticSearch.putAllBlockDataIntoElasticSearch();

// add get tronix price => https://api.coinmarketcap.com/v1/ticker/tronix/
let dataPromise = blockChainData.getLatestBlockFromLocalNode();

dataPromise.then(function(dataFromLocalNode){
    console.log(dataFromLocalNode);
});