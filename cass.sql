CREATE KEYSPACE blockchainexplorer WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 3 };
USE blockchainexplorer;

CREATE TYPE transaction (
  blocknum int,
  fromAddress text,
  toAddress text,
  amount int,
);

CREATE TABLE block (
    parentHash text,
    number int,
    time int,
    witnessAddress text,
    transactionsCount int,
    transactions map<text, frozen<transaction>>,
    PRIMARY KEY (number)
);

INSERT INTO block (parentHash, number, time, witnessAddress, transactionsCount, transactions) VALUES ('0000000000000004FC3D510BC1661E4E5905A4C197B07FEC05DC8D4784F0A898', 1, 0, '27YkUVSuvCK3K84DbnFnxYUxozpi793PTqZ', 3, {'asd' :{ blocknum: 1, fromAddress: 'val1', 
toAddress: 'val0', amount: 100 }, 'asdwqe' :{ blocknum: 1, fromAddress: 'val2', toAddress: 'val3', amount: 100 }});

INSERT INTO block (parentHash, number, time, witnessAddress, transactionsCount, transactions) VALUES ('0000000000000004FC3D510BC1661E4E5905A4C197B07FEC05DC8D4784F0A898', 2, 0, '27YkUVSuvCK3K84DbnFnxYUxozpi793PTqZ', 3, {'asd' :{ blocknum: 2, fromAddress: 'val1', 
toAddress: 'val0', amount: 100 }, 'asdwqe' :{ blocknum: 1, fromAddress: 'val2', toAddress: 'val3', amount: 100 }});

INSERT INTO block (parentHash, number, time, witnessAddress, transactionsCount, transactions) VALUES ('0000000000000004FC3D510BC1661E4E5905A4C197B07FEC05DC8D4784F0A898', 3, 0, '27YkUVSuvCK3K84DbnFnxYUxozpi793PTqZ', 3, {'asd' :{ blocknum: 3, fromAddress: 'val1', 
toAddress: 'val0', amount: 100 }, 'asdwqe' :{ blocknum: 1, fromAddress: 'val2', toAddress: 'val3', amount: 100 }});

INSERT INTO block (parentHash, number, time, witnessAddress, transactionsCount, transactions) VALUES ('0000000000000004FC3D510BC1661E4E5905A4C197B07FEC05DC8D4784F0A898', 4, 0, '27YkUVSuvCK3K84DbnFnxYUxozpi793PTqZ', 3, {'asd' :{ blocknum: 4, fromAddress: 'val1', 
toAddress: 'val0', amount: 100 }, 'asdwqe' :{ blocknum: 1, fromAddress: 'val2', toAddress: 'val3', amount: 100 }});
