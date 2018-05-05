#!/bin/bash

docker-compose -f docker-compose.yml up -d

sleep 40

#sudo docker cp ./cassandra/cass.sql docker_cassandra-1_1:./cass.sql

sudo docker exec docker_cassandra-1_1 ./cass.sh
echo "SETUP DB TABLES ON CASSANDRA CLUSTER"