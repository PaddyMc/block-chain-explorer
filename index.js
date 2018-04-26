require('babel-core/register');
require('babel-polyfill');
const BlockChainData = require('./explorer.js');

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200'
});

var blockChainData = new BlockChainData("ThisIsOurDataObject");
// blockChainData.getAllBlocks()

console.log("Hope");

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
