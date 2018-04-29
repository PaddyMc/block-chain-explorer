require('babel-core/register');
require('babel-polyfill');

//Cassandra DBUtils
const CassandraDBUtils = require('./cassandra/dbUtils.js');

// add get tronix price => https://api.coinmarketcap.com/v1/ticker/tronix/

const BlockChainData = require('./explorer.js');
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'localhost:9200'
});

var blockChainData = new BlockChainData("GetDataFromBC");
var cassandraDBUtils = new CassandraDBUtils("PersistDataInDB");

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
        for(let i = 0; i<dataFromLocalNode.number; i++){
            console.log(i);
            putBlockIntoDatabaseFromLocalNodeByNumber(i);
        }
    });

}
//putAllBlockDataIntoDB();
cassandraDBUtils.getAllBlocks();

function insertDataFromTronBCIntoElasticSearch(){
  var promiseWithTronData = blockChainData.getAllBlocksAsBulkRequest();

    promiseWithTronData.then(function(bulkRequest) {
        var insertData = function(){
            var busy = false;
            var callback = function(error, response) {
                if (error) {
                    console.log(error);
                }
                busy = false;
            };

            if (!busy) {
                busy = true;
                client.bulk({
                    body: bulkRequest.slice(0, 1000)
                }, callback);
                bulkRequest = bulkRequest.slice(1000);
            }

            if (bulkRequest.length > 0) {
                setTimeout(insertData, 10);
                } else {
                console.log('Inserted all blocks into elasticsearch.');
            }
        };

        insertData();
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

    let params = [dataFromLocalNode.parentHash, dataFromLocalNode.number, 0, dataFromLocalNode.witnessAddress, dataFromLocalNode.transactionsCount, transactions];
    return params;
}

