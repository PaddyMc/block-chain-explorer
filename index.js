require('babel-core/register');
require('babel-polyfill');

//DBUtils
const CassandraDBUtils = require('./dbUtils.js');
const ElasticSearchDBUtils = require('./elasticsearch/dbUtils.js');

// add get tronix price => https://api.coinmarketcap.com/v1/ticker/tronix/

const BlockChainData = require('./explorer.js');

var blockChainData = new BlockChainData("GetDataFromBC");
var cassandraDBUtils = new CassandraDBUtils("PersistDataInDB");
var elasticSearchDBUtils = new ElasticSearchDBUtils("ElasticSearch DBUtils created");

function putDataIntoDatabase(){
    //grpc
    // var dataPromise = blockChainData.getLatestBlockFromLocalNode();
    // dataPromise.then(function(dataFromLocalNode){
    //     console.log(dataFromLocalNode);
    // });

    var blocksAsBulkRequestPromise = cassandraDBUtils.getAllBlocks();
    blocksAsBulkRequestPromise.then(function(jsonData){
        elasticSearchDBUtils.insertBulk(jsonData);
    });

    var transaction1 = { blocknum: 1, fromAddress: 'val2', toAddress: 'val3', amount: 100 };
    var transaction2 = { blocknum: 1, fromAddress: 'val1', toAddress: 'val0', amount: 100 };

    const params = ['0000000000000004FC3D510BC1661E4E5905A4C197B07FEC05DC8D4784F0A898', 11, 0, '27YkUVSuvCK3K84DbnFnxYUxozpi793PTqZ', 0, { "qwresd": transaction1, "sdagf":transaction2 }]
    // cassandraDBUtils.insertBlock(params);
    // cassandraDBUtils.getAllBlocks();
    //blockChainData.getBlockFromLocalNode(0);

    //http
    //blockChainData.getBlockByNum(0)
    //blockChainData.getLatestBlock();
}

putDataIntoDatabase();



//insertDataFromTronBCIntoElasticSearch();
