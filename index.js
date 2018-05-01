require('babel-core/register');
require('babel-polyfill');
const CassandraDBUtils = require('./cassandra/dbUtils.js');
const ElasticSearchDBUtils = require('./elasticsearch/dbUtils.js');
const BlockChainData = require('./blockchaindata/explorer.js');
const BlockToDB = require("./datatransfer/blockToDB.js");
const DBToElasticSearch = require("./datatransfer/dbToElasticsearch.js");
const RestEndpoints = require("./datatransfer/RestEndpoints.js");

//DBUtils
var cassandraDBUtils = new CassandraDBUtils("Cassandra DBUtils created");
var elasticSearchDBUtils = new ElasticSearchDBUtils("ElasticSearch DBUtils created");

//BlockChainData
const GRPC_HOSTNAME_PORT = {hostname:"127.0.0.1", port:"50051"};
var blockChainData = new BlockChainData(GRPC_HOSTNAME_PORT);

//DTO's
var blocktoDB = new BlockToDB(blockChainData, cassandraDBUtils);
var dbToElasticSearch = new DBToElasticSearch(cassandraDBUtils, elasticSearchDBUtils);
var restEndpoints = new RestEndpoints(blockChainData);

// Put data into DB
//blocktoDB.putAllBlockDataIntoDB();      //   0-100
//blocktoDB.putAllWitnessesIntoDB();
//blocktoDB.putAllNodesIntoDB();
//blocktoDB.putAllAccountsIntoDB();
//blocktoDB.putAllIssuedAssetsIntoDB();

// Insert into elastic search
//dbToElasticSearch.putAllBlockDataIntoElasticSearch();
//dbToElasticSearch.putAllWitnessDataIntoElasticSearch();
//dbToElasticSearch.putAllAddressDataIntoElasticSearch();
//dbToElasticSearch.putAllNodeDataIntoElasticSearch();
//dbToElasticSearch.putAllIssuedAssetsIntoElasticSearch();

// let dataPromise = blockChainData.getTotalTransaction();
// dataPromise.then(function(dataFromNode){
//     let jsonData = JSON.parse(JSON.stringify(dataFromNode));
//     console.log(jsonData.num);
// });

// add get tronix price => https://api.coinmarketcap.com/v1/ticker/tronix/

// let dataPromise = blockChainData.getAssetIssueList();
//
// dataPromise.then(function(dataFromLocalNode){
//     console.log(dataFromLocalNode);
// });
