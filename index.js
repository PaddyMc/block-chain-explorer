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

function putDataIntoElasticSearch(){
    var allBlocksPromise = cassandraDBUtils.getAllBlocks();
    allBlocksPromise.then(function(jsonData){
        elasticSearchDBUtils.insertBulk(jsonData);
    });
}

function putAllWitnessesIntoDB(){
    var allWitnessPromise = blockChainData.listWitnesses()
    allWitnessPromise.then(function(jsonData){
        console.log(jsonData);

        // ToDo : Parse json data in to witness tables
        // ToDo : //cassandraDBUtils.insertWitness(params);


        //console.log(JSON.parse(jsonData));
        //for(let i = 0; i<jsonData; i++){
            //console.log(i)
            //console.log(jsonData[i]);
            
        //}
    });  
}

function putAllAccountsIntoDB(){
    var allAccountsPromise = blockChainData.listAccounts()
    allAccountsPromise.then(function(jsonData){
        console.log(jsonData);
        
        // ToDo : Build table for accounts

    });  
}

//putAllWitnessesIntoDB();
//putAllAccountsIntoDB();

//putAllBlockDataIntoDB();
//putDataIntoElasticSearch();

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

function _buildParamsForWitnessStatement(){

}
