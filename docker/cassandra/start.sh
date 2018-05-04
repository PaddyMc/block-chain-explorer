#!/bin/bash

docker-compose -f docker-compose.yml up -d

sleep 20

docker exec cassandra_cassandra-1_1 ./cass.sh