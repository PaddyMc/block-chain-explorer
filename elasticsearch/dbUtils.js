const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({host: 'localhost:9200'});

class ElasticSearchDBUtils {
	constructor(construction) {
		console.log(construction);
	}

	insertBulk(jsonData){
		var bulkRequest = _prepareBulkRequest(jsonData);

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
	}
}

function _prepareBulkRequest(jsonData){
	let blockData;
	let bulkRequest = [];

	for(var k in jsonData["rows"]) {
		var row = JSON.parse(jsonData["rows"][k]['[json]']);
		blockData = {
			parentHash: row.parenthash,
			number: row.number,
			time: row.time,
			witnessAddress: row.witnessaddress,
			transactions: row.transactions,
			transactionsCount: row.transactionscount
		};
		bulkRequest.push({index: {_index: 'blocks', _type: 'block', _id: row.number}});
		bulkRequest.push(blockData);
	}
	return bulkRequest;
}

module.exports = ElasticSearchDBUtils;
