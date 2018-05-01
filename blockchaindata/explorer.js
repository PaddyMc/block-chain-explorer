import {HttpClient, GrpcClient} from "@tronprotocol/wallet-api";
const {base64DecodeFromString, byteArray2hexStr, bytesToString} = require("@tronprotocol/wallet-api/src/utils/bytes");
const deserializeTransaction = require("@tronprotocol/wallet-api/src/protocol/serializer").deserializeTransaction;
const {Block, Transaction, Account} = require("@tronprotocol/wallet-api/src/protocol/core/Tron_pb");
const {getBase58CheckAddress, signTransaction, passwordToAddress} = require("@tronprotocol/wallet-api/src/utils/crypto");
const {Address ,EmptyMessage, NumberMessage} = require("@tronprotocol/wallet-api/src/protocol/api/api_pb");

const {WalletClient, DatabaseClient} = require("@tronprotocol/wallet-api/src/protocol/api/api_grpc_pb");
const caller = require('grpc-caller');

const Client = new HttpClient();


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

	async getAccount() {
		let newAccount = new Account();
    	newAccount.setAccountName("hope");
		let account = await this.GRPCClient.getAccount(newAccount);
		return account.toObject();
	}

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
		let nodes = await this.GRPCClient.api.listNodes(new EmptyMessage())
		return nodes.toObject();
	}

	async createAccount(accountData){
		let newAccount = new Account();
    	newAccount.setAccountName("hope");
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

    	for (let transaction of nativeBlock.getTransactionsList()) {
      		transactions = transactions.concat(deserializeTransaction(transaction));
    	}

  		let tronJsonBlock =  {
		      //size: recentBlock.length,
		      parentHash: byteArray2hexStr(nativeBlock.getBlockHeader().getRawData().getParenthash()),
		      number: nativeBlock.getBlockHeader().getRawData().getNumber(),
		      witnessAddress: getBase58CheckAddress(Array.from(nativeBlock.getBlockHeader().getRawData().getWitnessAddress())),
		      time: nativeBlock.getBlockHeader().getRawData().getTimestamp(),
		      transactionsCount: nativeBlock.getTransactionsList().length,
		      contractType: Transaction.Contract.ContractType,
		      transactions,
    	};

    	return tronJsonBlock;
  	}
}

module.exports = BlockChainData;
