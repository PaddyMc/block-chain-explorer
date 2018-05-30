require('babel-core/register');
require('babel-polyfill');
const CassandraDBUtils = require('./cassandra/dbUtils.js');
const ElasticSearchDBUtils = require('./elasticsearch/dbUtils.js');
const BlockChainData = require('./blockchaindata/explorer.js');
const BlockToDB = require("./datatransfer/blockToDB.js");
const DBToElasticSearch = require("./datatransfer/dbToElasticsearch.js");
const BlockToElastic = require("./datatransfer/blockToElastic.js");
const TronExTimer = require("./tronexservice/tronExTimer.js");

const geoLocationUrl = "http://api.ipstack.com/";

//DBUtils
const elasticSearchSetup = { host: '172.18.0.3:9200' };
const elasticSearchDBUtils = new ElasticSearchDBUtils(elasticSearchSetup);

const cassandraSetup = { contactPoints: ['172.18.0.5'], keyspace: 'blockchainexplorer' };
const cassandraDBUtils = new CassandraDBUtils(cassandraSetup, elasticSearchDBUtils);

//BlockChainData
const GRPC_HOSTNAME_PORT = { hostname:"172.18.0.4", port:"50051" };
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

tronExTimer.start();

//  ToDo
//	Fix accounts


