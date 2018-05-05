#!/bin/bash

docker-compose -f docker-compose.yml up -d

sleep 10

# docker exec -it elasticsearch bash ./elastic.sh
# echo "CORS REMOVED FROM ELASTIC SEARCH"

sleep 20

docker exec docker_cassandra-1_1 ./cass.sh
echo "SETUP DB TABLES ON CASSANDRA CLUSTER"