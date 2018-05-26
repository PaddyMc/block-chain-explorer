const {base64DecodeFromString, byteArray2hexStr, bytesToString} = require("@tronprotocol/wallet-api/src/utils/bytes");
const deserializeTransaction = require("@tronprotocol/wallet-api/src/protocol/serializer").deserializeTransaction;
const {Block, Transaction, Account} = require("../protos/core/Tron_pb");
const {getBase58CheckAddress, signTransaction, passwordToAddress} = require("@tronprotocol/wallet-api/src/utils/crypto");
const {Address ,EmptyMessage, NumberMessage} = require("../protos/api/api_pb");

const {WalletClient, DatabaseClient} = require("../protos/api/api_grpc_pb");
const caller = require('grpc-caller');


class BlockChainData {
	constructor(hostnameAndPort) {
		this.hostname = hostnameAndPort.hostname;
    	this.port = hostnameAndPort.port;

		//this.GRPCClient = new GrpcClient(hostnameAndPort);
		this.TronDatabaseClient = caller(`${this.hostname}:${this.port}`, DatabaseClient);
		this.GRPCClient = caller(`${this.hostname}:${this.port}`, WalletClient);
	}

  	//     GRPC FUNCTIONS

	async getBlockFromLocalNode(number){
		let message = new NumberMessage();
    	message.setNum(number);
		let nativeBlock = await this.GRPCClient.getBlockByNum(message);
		return this._returnParsedBlockData(nativeBlock);
	}

	async getLatestBlockFromLocalNode(){
		let getNowBlock = await this.getNowBlock();
		return this._returnParsedBlockData(getNowBlock);
	}

	async getNowBlock() {
		return await this.GRPCClient.getNowBlock(new EmptyMessage());
	}

	async getAccount(number) {
		let newAccount = new Account();
    	//newAccount.setName("Devaccount");
    	//newAccount.setAddress("27VfsTtB9L36veRxqf8ipNZ2q9uBtw6XrNh");
    	//newAccount.setType(0);
    	// newAccount.setName("Devaccount");
    	// newAccount.setName("Devaccount");
    	// newAccount.setName("Devaccount");
    	// newAccount.setName("Devaccount");
		let account = await this.GRPCClient.getAccount(newAccount);
		return account;
	}

	// async getAccountNet(top,skip) {
	// 	let accountNetMessage = new AccountNet();
 //    	//accountNetMessage.setFreeNetUsed("Devaccount");
 //    	//accountNetMessage.setFreeNetLimit("27VfsTtB9L36veRxqf8ipNZ2q9uBtw6XrNh");
 //    	//accountNetMessage.setNetUsed(0);
 //    	//accountNetMessage.setNetLimit(0);
 //    	// assetNetUsed
 //    	// assetNetLimit

	// 	let account = await this.GRPCClient.getAccountNet(newAccount);
	// 	return account;
	// }

	async listAccounts() {
		let accounts = await this.GRPCClient.listAccounts(new EmptyMessage())
		return accounts.toObject();
	}

	async listWitnesses(){
		let witnesses = await this.GRPCClient.listWitnesses(new EmptyMessage())
		return witnesses.toObject();
	}

	async getAssetIssueList(){
		let assetIssueList = await this.GRPCClient.getAssetIssueList(new EmptyMessage());
		return assetIssueList.toObject();
  	}

	async listNodes(){
		let nodes = await this.GRPCClient.listNodes(new EmptyMessage())
		return nodes.toObject();
	}

	async getTotalTransaction(){
		let nodes = await this.GRPCClient.totalTransaction(new EmptyMessage())
		return nodes.toObject();
	}

	async createAccount(accountData){
		let newAccount = new Account();
    	newAccount.setAccountName("");
		let account = await this.GRPCClient.createAccount(newAccount);
	}

	//     DATABASE FUNCTIONS

	async getDynamicProperties(){
		let dynamicProperties = await this.TronDatabaseClient.getDynamicProperties(new EmptyMessage())
		return dynamicProperties.toObject();
	}

	async getBlockReference(){
		let blockReference = await this.TronDatabaseClient.getBlockReference(new EmptyMessage())
		return blockReference.toObject();
	}

	async getBlockFromTronDataBaseByNumber(number){
		let message = new NumberMessage();
    	message.setNum(number);
		let block = await this.TronDatabaseClient.getBlockByNum(message);
		return block.toObject();
	}

	//     END DATABASE

  	_returnParsedBlockData(nativeBlock){
  		let transactions = [];

  		let recentBlock = base64DecodeFromString(JSON.stringify(nativeBlock));

    	for (let transaction of nativeBlock.getTransactionsList()) {
      		transactions = transactions.concat(deserializeTransaction(transaction));
    	}

  		let tronJsonBlock =  {
  			hash: byteArray2hexStr(nativeBlock.getBlockHeader().getRawData().getTxtrieroot()),
			parentHash: byteArray2hexStr(nativeBlock.getBlockHeader().getRawData().getParenthash()),
			number: nativeBlock.getBlockHeader().getRawData().getNumber(),
			witnessAddress: getBase58CheckAddress(Array.from(nativeBlock.getBlockHeader().getRawData().getWitnessAddress())),
			time: nativeBlock.getBlockHeader().getRawData().getTimestamp(),
			transactionsCount: nativeBlock.getTransactionsList().length,
			contractType: Transaction.Contract.ContractType,
			transactions,
			size: recentBlock.length,
     	};

    	return tronJsonBlock;
  	}

  	_returnParsedIssuedAssetData(nativeBlock){
  		// ToDo

  		let tronJsonBlock =  {

     	};

    	return tronJsonBlock;
  	}
}

module.exports = BlockChainData;
