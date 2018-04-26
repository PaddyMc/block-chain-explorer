require('babel-core/register');
require('babel-polyfill');
const BlockChainData = require('./explorer.js');

var blockChainData = new BlockChainData("ThisIsOurDataObject");
blockChainData.getAllBlocks()

console.log("Hope");