require('babel-core/register');
require('babel-polyfill');
const CassandraDBUtils = require('./cassandra/dbUtils.js');
const ElasticSearchDBUtils = require('./elasticsearch/dbUtils.js');
const BlockChainData = require('./blockchaindata/explorer.js');
const BlockToDB = require("./datatransfer/blockToDB.js");
const DBToElasticSearch = require("./datatransfer/dbToElasticsearch.js");
const BlockToElastic = require("./datatransfer/blockToElastic.js");
const TronExTimer = require("./tronexservice/tronExTimer.js");

const geoLocationUrl = "https://ipapi.co/";

//DBUtils
const elasticSearchSetup = { host: '172.20.0.3:9200' };
const elasticSearchDBUtils = new ElasticSearchDBUtils(elasticSearchSetup);

const cassandraSetup = { contactPoints: ['172.18.0.3'], keyspace: 'blockchainexplorer' };
const cassandraDBUtils = new CassandraDBUtils(cassandraSetup, elasticSearchDBUtils);

//BlockChainData
const GRPC_HOSTNAME_PORT = { hostname:"172.18.0.2", port:"50051" };
const blockChainData = new BlockChainData(GRPC_HOSTNAME_PORT);

//DTO's
const blocktoDB = new BlockToDB(blockChainData, cassandraDBUtils, geoLocationUrl);
const dbToElasticSearch = new DBToElasticSearch(cassandraDBUtils, elasticSearchDBUtils);
const blockToElastic = new BlockToElastic(blockChainData, elasticSearchDBUtils);

//Timer
const tronExTimer = new TronExTimer(blocktoDB, dbToElasticSearch, blockToElastic);

// tronExTimer.putAllBlockDataIntoDB();
// tronExTimer.putAllBlockDataIntoElasticSearch();

// tronExTimer.putAllDataIntoDB();
// tronExTimer.putAllDataIntoElastic();

// let dataPromise = blockChainData.getAccount(1);
// dataPromise.then(function(dataFromLocalNode){
// 	console.log(dataFromLocalNode.toObject());
// });

tronExTimer.start();

//  ToDo
//	Fix accounts

// for(let i =0; i<10;i++){
// 	let dataPromise = blockChainData.getAccount(1);
// 	dataPromise.then(function(dataFromLocalNode){
//     	console.log(dataFromLocalNode.toObject());
// 	});
// }
	


