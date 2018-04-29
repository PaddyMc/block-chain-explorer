require('babel-core/register');
require('babel-polyfill');

<<<<<<< HEAD
//Cassandra DBUtils
const CassandraDBUtils = require('./cassandra/dbUtils.js');
=======
//DBUtils
const CassandraDBUtils = require('./dbUtils.js');
const ElasticSearchDBUtils = require('./elasticsearch/dbUtils.js');
>>>>>>> origin/master

// add get tronix price => https://api.coinmarketcap.com/v1/ticker/tronix/

const BlockChainData = require('./explorer.js');

var blockChainData = new BlockChainData("GetDataFromBC");
var cassandraDBUtils = new CassandraDBUtils("PersistDataInDB");
var elasticSearchDBUtils = new ElasticSearchDBUtils("ElasticSearch DBUtils created");

<<<<<<< HEAD
function putBlockIntoDatabaseFromLocalNodeByLatest(){
    var dataPromise = blockChainData.getLatestBlockFromLocalNode();
    dataPromise.then(function(dataFromLocalNode){
        const params = _buildParamsForBlockInsertStatment(dataFromLocalNode);
        cassandraDBUtils.insertBlock(params);
=======
function putDataIntoDatabase(){
    //grpc
    // var dataPromise = blockChainData.getLatestBlockFromLocalNode();
    // dataPromise.then(function(dataFromLocalNode){
    //     console.log(dataFromLocalNode);
    // });

    var blocksAsBulkRequestPromise = cassandraDBUtils.getAllBlocks();
    blocksAsBulkRequestPromise.then(function(jsonData){
        elasticSearchDBUtils.insertBulk(jsonData);
>>>>>>> origin/master
    });
}

function putBlockIntoDatabaseFromLocalNodeByNumber(number){
    var dataPromiseByNumber = blockChainData.getBlockFromLocalNode(number);
    dataPromiseByNumber.then(function(dataFromLocalNode){
        const params = _buildParamsForBlockInsertStatment(dataFromLocalNode);
        cassandraDBUtils.insertBlock(params);
    });
}

<<<<<<< HEAD
function putAllBlockDataIntoDB(){
    var dataPromise = blockChainData.getLatestBlockFromLocalNode();
    dataPromise.then(function(dataFromLocalNode){
        for(let i = 0; i<dataFromLocalNode.number; i++){
            console.log(i);
            putBlockIntoDatabaseFromLocalNodeByNumber(i);
        }
    });
=======
    const params = ['0000000000000004FC3D510BC1661E4E5905A4C197B07FEC05DC8D4784F0A898', 11, 0, '27YkUVSuvCK3K84DbnFnxYUxozpi793PTqZ', 0, { "qwresd": transaction1, "sdagf":transaction2 }]
    // cassandraDBUtils.insertBlock(params);
    // cassandraDBUtils.getAllBlocks();
    //blockChainData.getBlockFromLocalNode(0);
>>>>>>> origin/master

}
//putAllBlockDataIntoDB();
cassandraDBUtils.getAllBlocks();



<<<<<<< HEAD
function _buildParamsForBlockInsertStatment(dataFromLocalNode){
    let transactions = {};

    for (let i = 0; i < dataFromLocalNode.transactions.length; i++) {
        let replaceFrom = JSON.stringify(dataFromLocalNode.transactions[i]).replace(/from/, 'fromaddress');
        let replaceTo = replaceFrom.replace(/to/, 'toaddress');
        let newArray = JSON.parse(replaceTo);
        transactions[i] = newArray;
    }

    let params = [dataFromLocalNode.parentHash, dataFromLocalNode.number, 0, dataFromLocalNode.witnessAddress, dataFromLocalNode.transactionsCount, transactions];
    return params;
}

=======
//insertDataFromTronBCIntoElasticSearch();
>>>>>>> origin/master
