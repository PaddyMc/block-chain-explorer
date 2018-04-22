import {HttpClient} from "@tronprotocol/wallet-api";
//const async = require("async");
//const a = require("@tronprotocol/wallet-api");
const Client = new HttpClient();

async function f1() {
  let latestBlock = await Client.getLatestBlock();
  console.log(latestBlock); // 10
}
//let latestBlock = await Client.getLatestBlock();
f1()
//console.log(Client);