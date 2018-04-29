require('babel-core/register');
require('babel-polyfill');

//DBUtils
const CassandraDBUtils = require('./cassandra/dbUtils.js');
const ElasticSearchDBUtils = require('./elasticsearch/dbUtils.js');

// add get tronix price => https://api.coinmarketcap.com/v1/ticker/tronix/

const BlockChainData = require('./explorer.js');

var blockChainData = new BlockChainData("GetDataFromBC");
var cassandraDBUtils = new CassandraDBUtils("PersistDataInDB");
var elasticSearchDBUtils = new ElasticSearchDBUtils("ElasticSearch DBUtils created");

function putDataIntoElasticSearch(){
    var allBlocksPromise = cassandraDBUtils.getAllBlocks();
    allBlocksPromise.then(function(jsonData){
        elasticSearchDBUtils.insertBulk(jsonData);
    });
}

function putBlockIntoDatabaseFromLocalNodeByLatest(){
    var dataPromise = blockChainData.getLatestBlockFromLocalNode();
    dataPromise.then(function(dataFromLocalNode){
        const params = _buildParamsForBlockInsertStatment(dataFromLocalNode);
        cassandraDBUtils.insertBlock(params);
    });
}

function putBlockIntoDatabaseFromLocalNodeByNumber(number){
    var dataPromiseByNumber = blockChainData.getBlockFromLocalNode(number);
    dataPromiseByNumber.then(function(dataFromLocalNode){
        const params = _buildParamsForBlockInsertStatment(dataFromLocalNode);
        cassandraDBUtils.insertBlock(params);
    });
}

function putAllBlockDataIntoDB(){
    var dataPromise = blockChainData.getLatestBlockFromLocalNode();
    dataPromise.then(function(dataFromLocalNode){
        for(let i = 0; i<100; i++){
            putBlockIntoDatabaseFromLocalNodeByNumber(i);
        }
    });
}

// putAllBlockDataIntoDB();
putDataIntoElasticSearch();
var allBlocksPromise = cassandraDBUtils.getAllBlocks();
allBlocksPromise.then(function(jsonData){
    console.log(jsonData);
});

function _buildParamsForBlockInsertStatment(dataFromLocalNode){
    let transactions = {};

    for (let i = 0; i < dataFromLocalNode.transactions.length; i++) {
        let replaceFrom = JSON.stringify(dataFromLocalNode.transactions[i]).replace(/from/, 'fromaddress');
        let replaceTo = replaceFrom.replace(/to/, 'toaddress');
        let newArray = JSON.parse(replaceTo);
        transactions[i] = newArray;
    }

    let params = [dataFromLocalNode.parentHash, dataFromLocalNode.number, dataFromLocalNode.time, dataFromLocalNode.witnessAddress, dataFromLocalNode.transactionsCount, transactions];
    return params;
}
