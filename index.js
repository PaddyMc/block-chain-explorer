require('babel-core/register');
require('babel-polyfill');

//Cassandra DBUtils
const CassandraDBUtils = require('./dbUtils.js');

// add get tronix price => https://api.coinmarketcap.com/v1/ticker/tronix/

const BlockChainData = require('./explorer.js');
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'localhost:9200'
});

var blockChainData = new BlockChainData("GetDataFromBC");
var cassandraDBUtils = new CassandraDBUtils("PersistDataInDB");

function putDataIntoDatabase(){
    //grpc
    var dataPromise = blockChainData.getLatestBlockFromLocalNode();
    dataPromise.then(function(dataFromLocalNode){
        console.log(dataFromLocalNode);
        //cassandraDBUtils.getAllBlocks();
    });

    var transaction1 = { blocknum: 1, fromAddress: 'val2', toAddress: 'val3', amount: 100 };
    var transaction2 = { blocknum: 1, fromAddress: 'val1', toAddress: 'val0', amount: 100 };

    const params = ['0000000000000004FC3D510BC1661E4E5905A4C197B07FEC05DC8D4784F0A898', 11, 0, '27YkUVSuvCK3K84DbnFnxYUxozpi793PTqZ', 0, { "qwresd": transaction1, "sdagf":transaction2 }]
    cassandraDBUtils.insertBlock(params);
    //cassandraDBUtils.getAllBlocks();
    //blockChainData.getBlockFromLocalNode(0);

    //http
    //blockChainData.getBlockByNum(0)
    //blockChainData.getLatestBlock();
}

putDataIntoDatabase();

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

//insertDataFromTronBCIntoElasticSearch();

