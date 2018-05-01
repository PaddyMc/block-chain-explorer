require('babel-core/register');
require('babel-polyfill');
const CassandraDBUtils = require('./cassandra/dbUtils.js');
const ElasticSearchDBUtils = require('./elasticsearch/dbUtils.js');
const BlockChainData = require('./blockchaindata/explorer.js');
const BlockToDB = require("./datatransfer/blockToDB.js");
const DBToElasticSearch = require("./datatransfer/dbToElasticsearch.js");

//DBUtils
var cassandraDBUtils = new CassandraDBUtils("Cassandra DBUtils created");
var elasticSearchDBUtils = new ElasticSearchDBUtils("ElasticSearch DBUtils created");

//BlockChainData
const GRPC_HOSTNAME_PORT = {hostname:"127.0.0.1", port:"50051"};
var blockChainData = new BlockChainData(GRPC_HOSTNAME_PORT);

//DTO's
var blocktoDB = new BlockToDB(blockChainData, cassandraDBUtils);
var dbToElasticSearch = new DBToElasticSearch(cassandraDBUtils, elasticSearchDBUtils);


// BLOCK DATA
//blocktoDB.putAllBlockDataIntoDB();      //   0-100
//dbToElasticSearch.putAllBlockDataIntoElasticSearch();


// WITNESSES
//blocktoDB.putAllWitnessesIntoDB();
dbToElasticSearch.putAllWitnessDataIntoElasticSearch();


// ADDRESSES
//blocktoDB.putAllAccountsIntoDB();
//dbToElasticSearch.putAllAddressDataIntoElasticSearch();

// add get tronix price => https://api.coinmarketcap.com/v1/ticker/tronix/