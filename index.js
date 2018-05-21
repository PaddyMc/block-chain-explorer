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
const elasticSearchSetup = { host: 'localhost:9200' };
const elasticSearchDBUtils = new ElasticSearchDBUtils(elasticSearchSetup);

const cassandraSetup = { contactPoints: ['127.0.0.1'], keyspace: 'blockchainexplorer' };
const cassandraDBUtils = new CassandraDBUtils(cassandraSetup, elasticSearchDBUtils);

//BlockChainData
const GRPC_HOSTNAME_PORT = { hostname:"127.0.0.1", port:"50051" };
const blockChainData = new BlockChainData(GRPC_HOSTNAME_PORT);

//DTO's
const blocktoDB = new BlockToDB(blockChainData, cassandraDBUtils, geoLocationUrl);
const dbToElasticSearch = new DBToElasticSearch(cassandraDBUtils, elasticSearchDBUtils);
const blockToElastic = new BlockToElastic(blockChainData, elasticSearchDBUtils);

//Timer
const tronExTimer = new TronExTimer(blocktoDB, dbToElasticSearch, blockToElastic);

tronExTimer.start();

//  ToDo
//	Get last 100 Blocks // 30 seconds
//	Fix accounts

// let dataPromise = blockChainData.listAccounts();
// dataPromise.then(function(dataFromLocalNode){
//     console.log(dataFromLocalNode.toObject());
// });

