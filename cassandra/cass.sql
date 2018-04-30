DROP KEYSPACE blockchainexplorer;
CREATE KEYSPACE IF NOT EXISTS blockchainexplorer WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 3 };
USE blockchainexplorer;

CREATE TYPE IF NOT EXISTS transaction (
  fromaddress text,
  toaddress text,
  amount bigint,
);

CREATE TABLE IF NOT EXISTS block (
    parentHash text,
    number int,
    time bigint,
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

INSERT INTO witness (address, votecount, pubkey, url, totalmissed, latestblocknum, latestslotnum, isjobs) VALUES ('oJKLwolvslTgX8KfI2M41RMJKt9u', 0, '', 'https://www.cryptobitkings.com/', 0, 0, 0, false);

INSERT INTO block (parentHash, number, time, witnessAddress, transactionsCount, transactions) VALUES ('0000000000000004FC3D510BC1661E4E5905A4C197B07FEC05DC8D4784F0A898', 1, 0, '27YkUVSuvCK3K84DbnFnxYUxozpi793PTqZ', 3, {'asd' :{ fromAddress: 'val1', 
toAddress: 'val0', amount: 100 }, 'asdwqe' :{ fromAddress: 'val2', toAddress: 'val3', amount: 100 }});

INSERT INTO block (parentHash, number, time, witnessAddress, transactionsCount, transactions) VALUES ('0000000000000004FC3D510BC1661E4E5905A4C197B07FEC05DC8D4784F0A898', 2, 0, '27YkUVSuvCK3K84DbnFnxYUxozpi793PTqZ', 3, {'asd' :{ fromAddress: 'val1', 
toAddress: 'val0', amount: 100 }, 'asdwqe' :{ fromAddress: 'val2', toAddress: 'val3', amount: 100 }});

INSERT INTO block (parentHash, number, time, witnessAddress, transactionsCount, transactions) VALUES ('0000000000000004FC3D510BC1661E4E5905A4C197B07FEC05DC8D4784F0A898', 3, 0, '27YkUVSuvCK3K84DbnFnxYUxozpi793PTqZ', 3, {'asd' :{ fromAddress: 'val1', 
toAddress: 'val0', amount: 100 }, 'asdwqe' :{ fromAddress: 'val2', toAddress: 'val3', amount: 100 }});

INSERT INTO block (parentHash, number, time, witnessAddress, transactionsCount, transactions) VALUES ('0000000000000004FC3D510BC1661E4E5905A4C197B07FEC05DC8D4784F0A898', 4, 0, '27YkUVSuvCK3K84DbnFnxYUxozpi793PTqZ', 3, {'asd' :{ fromAddress: 'val1', 
toAddress: 'val0', amount: 100 }, 'asdwqe' :{ fromAddress: 'val2', toAddress: 'val3', amount: 100 }});
