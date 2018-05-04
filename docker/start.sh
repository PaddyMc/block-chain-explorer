#!/bin/bash

docker-compose -f docker-compose.yml up -d

sleep 10

#docker exec elasticsearch ./elastic.sh

sleep 20

docker exec docker_cassandra-1_1 ./cass.sh