import {HttpClient, GrpcClient} from "@tronprotocol/wallet-api";

const Client = new HttpClient();

var hostnameAndPort = {hostname:"127.0.0.1", port:"50051"};
// const GRPCClient = new GrpcClient(hostnameAndPort);

class BlockChainData {
  constructor(construction) {
		console.log(construction);
  }

	async getAllBlocks() {
		let latestBlock = await Client.getLatestBlock();
		//console.log(latestBlock.number)

		//let nativeBlock = await grpcClient.getBlockByNumber(0);
		//console.log(nativeBlock);

		/*let latestBlock1 = await Client.getBlockByNum(0);
		console.log(latestBlock1)*/
		//let nodes = await Client.getNodes();
		for (var i = 0; i <= latestBlock.number; i++) {
			let latestBlock = await Client.getBlockByNum(i);
			//let nativeBlock = await GRPCClient.getBlockByNum();
			console.log(latestBlock);
		}
	}

	async getNodes(){
		let allNodes = await Client.getNodes();
		return allNodes
	}

	async getAllBlocksAsBulkRequest(){
		let latestBlock = await Client.getLatestBlock();

		let blockData;
		let bulkRequest = [];

		for(var i = 10; i < 20; i++){
			let currentBlock = await Client.getBlockByNum(i);
			blockData = {
		    	parentHash: currentBlock.parentHash,
		    	number: currentBlock.number,
		    	time: currentBlock.time,
		    	witnessAddress: currentBlock.witnessAddress,
		    	transactions: currentBlock.transactions,
		    	transactionsCount: currentBlock.transactionsCount
		    };
		    bulkRequest.push({index: {_index: 'blocks', _type: 'block', _id: currentBlock.number}});
		    bulkRequest.push(blockData);
		}

		return bulkRequest;
  }
}

module.exports = BlockChainData;
