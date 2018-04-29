const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({host: 'localhost:9200'});

class ElasticSearchDBUtils {
	constructor(construction) {
		console.log(construction);
	}

	insertBulk(bulkRequest){
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

module.exports = ElasticSearchDBUtils;
