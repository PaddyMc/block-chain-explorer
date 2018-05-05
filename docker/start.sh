#!/bin/bash

docker-compose -f docker-compose.yml up -d

sleep 30

docker exec docker_cassandra-1_1 ./cass.sh
echo "SETUP DB TABLES ON CASSANDRA CLUSTER"