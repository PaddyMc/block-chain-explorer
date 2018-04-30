const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({host: 'localhost:9200'});

class ElasticSearchDBUtils {
	constructor(construction) {
		console.log(construction);
	}

	insertBlocks(jsonData){
		let bulkData;
		let bulkRequest = [];

		for(var i in jsonData["rows"]) {
			var row = JSON.parse(jsonData["rows"][i]['[json]']);
			bulkData = {
				parentHash: row.parenthash,
				number: row.number,
				time: row.time,
				witnessAddress: row.witnessaddress,
				transactions: row.transactions,
				transactionsCount: row.transactionscount
			};
			bulkRequest.push({index: {_index: 'blocks', _type: 'block', _id: row.number}});
			bulkRequest.push(bulkData);
		}
		_insertBulk(bulkRequest)
	}

	insertWitnesses(jsonData){
		let bulkData;
		let bulkRequest = [];

		for(var i in jsonData["rows"]) {
			var row = JSON.parse(jsonData["rows"][i]['[json]']);
			bulkData = {
				address: row.address,
				votecount: row.votecount,
				pubkey: row.pubkey,
				url: row.url,
				totalmissed: row.totalmissed,
				latestblocknum: row.latestblocknum,
				latestslotnum: row.latestslotnum,
				isjobs: row.isjobs
			};
			bulkRequest.push({index: {_index: 'witnesses', _type: 'witness', _id: row.address}});
			bulkRequest.push(bulkData);
		}
		_insertBulk(bulkRequest)
	}
}

function _insertBulk(bulkRequest){
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

module.exports = ElasticSearchDBUtils;
