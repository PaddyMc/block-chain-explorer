DROP KEYSPACE blockchainexplorer;
CREATE KEYSPACE IF NOT EXISTS blockchainexplorer WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 3 };
USE blockchainexplorer;

CREATE TYPE IF NOT EXISTS transaction (
    fromaddress text,
    toaddress text,
    amount bigint,
);

CREATE TYPE IF NOT EXISTS contracttype (
    accountcreatecontract int,
    transfercontract int,
    transferassetcontract int,
    voteassetcontract int,
    votewitnesscontract int,
    witnesscreatecontract int,
    assetissuecontract int,
    deploycontract int,
    witnessupdatecontract int,
    participateassetissuecontract int,
);

CREATE TABLE IF NOT EXISTS block (
    parentHash text,
    number int,
    time bigint,
    contracttype map<text, frozen<contracttype>>,
    witnessAddress text,
    transactionsCount int,
    transactions map<text, frozen<transaction>>,
    PRIMARY KEY (number)
);

CREATE TABLE IF NOT EXISTS witness (
    address text,
    votecount bigint,
    pubkey text,
    url text,
    totalproduced bigint,
    totalmissed bigint,
    latestblocknum bigint,
    latestslotnum bigint,
    isjobs boolean,
    PRIMARY KEY (address)
);

CREATE TABLE IF NOT EXISTS nodes (
    host text,
    port text,
    PRIMARY KEY (host)
);

CREATE TABLE IF NOT EXISTS assetissues (
    ownerAddress text,
    name text,
    totalSupply bigint,
    trxNum bigint,
    num bigint,
    startTime bigint,
    endTime bigint,
    decayRatio bigint,
    voteScore bigint,
    description text,
    url text,
    PRIMARY KEY (ownerAddress)
);

-- INSERT INTO assetissues (ownerAddress, name, totalSupply, trxNum, num, startTime, endTime, decayRatio, voteScore, description, url) VALUES ('oEeI3RNeKFjDe0jFJXI9Zgt6YydY', 'VFJY', 10000, 1000000000, 0, 0, 0, 0, 0, 'VHJvbml4', 'aHR0cHM6Ly90d2l0dGVyLmNvbS9Ba29zY2kx');

-- INSERT INTO witness (address, votecount, pubkey, url, totalmissed, latestblocknum, latestslotnum, isjobs) VALUES ('oJKLwolvslTgX8KfI2M41RMJKt9u', 0, '', 'https://www.cryptobitkings.com/', 0, 0, 0, false);

-- INSERT INTO block (parentHash, number, time, contracttype, witnessAddress, transactionsCount, transactions) VALUES ('0000000000000004FC3D510BC1661E4E5905A4C197B07FEC05DC8D4784F0A898', 2, 0, { 'contracttypes': { accountcreatecontract: 0, transfercontract: 1, transferassetcontract: 2, voteassetcontract: 3,votewitnesscontract: 4,witnesscreatecontract: 5, assetissuecontract: 6, deploycontract: 7, witnessupdatecontract: 8, participateassetissuecontract: 9 } }, '27YkUVSuvCK3K84DbnFnxYUxozpi793PTqZ', 3, {'asd' :{ fromAddress: 'val1',
-- toAddress: 'val0', amount: 100 }, 'asdwqe' :{ fromAddress: 'val2', toAddress: 'val3', amount: 100 }});



