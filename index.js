require('babel-core/register');
require('babel-polyfill');

//DBUtils
const CassandraDBUtils = require('./cassandra/dbUtils.js');
const ElasticSearchDBUtils = require('./elasticsearch/dbUtils.js');
const BlockChainData = require('./blockchaindata/explorer.js');

// add get tronix price => https://api.coinmarketcap.com/v1/ticker/tronix/

var blockChainData = new BlockChainData("GetDataFromBC");
var cassandraDBUtils = new CassandraDBUtils("PersistDataInDB");
var elasticSearchDBUtils = new ElasticSearchDBUtils("ElasticSearch DBUtils created");

function putAllBlockDataIntoElasticSearch(){
    var dataPromise = cassandraDBUtils.getAllBlocks();
    dataPromise.then(function(jsonData){
        elasticSearchDBUtils.insertBlocks(jsonData);
    });
}

function putAllWitnessDataIntoElasticSearch(){
    var dataPromise = cassandraDBUtils.getAllWitnesses();
    dataPromise.then(function(jsonData){
        elasticSearchDBUtils.insertWitnesses(jsonData);
    });
}

function putAllWitnessesIntoDB(){
    var allWitnessPromise = blockChainData.listWitnesses()
    allWitnessPromise.then(function(dataFromNode){
        var jsonData = JSON.parse(JSON.stringify(dataFromNode));
        for (var i = 0; i < jsonData.witnessesList.length; i++) {
            let params = _buildParamsForWitnessInsertStatment(jsonData.witnessesList[i]);
            cassandraDBUtils.insertWitness(params)
        }
    });
}

function putAllAccountsIntoDB(){
    var allAccountsPromise = blockChainData.listAccounts()
    allAccountsPromise.then(function(jsonData){
        console.log(jsonData);

        // ToDo : Build table for accounts

    });
}

// putAllWitnessesIntoDB();
// putAllWitnessDataIntoElasticSearch();
//putAllAccountsIntoDB();

// putAllBlockDataIntoDB();
putAllBlockDataIntoElasticSearch();

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
        console.log(params);
        cassandraDBUtils.insertBlock(params);
    });
}

function putAllBlockDataIntoDB(){
    var dataPromise = blockChainData.getLatestBlockFromLocalNode();
    dataPromise.then(function(dataFromLocalNode){
        for(let i = 1000; i<2000; i++){
            putBlockIntoDatabaseFromLocalNodeByNumber(i);
        }
    });
}

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

function _buildParamsForWitnessInsertStatment(dataFromNode){
    let params = [dataFromNode.address, dataFromNode.votecount, dataFromNode.pubkey, dataFromNode.url, dataFromNode.totalmissed, dataFromNode.latestblocknum, dataFromNode.latestslotnum, dataFromNode.isjobs];
    return params;
}

function _buildParamsForWitnessStatement(){

}
