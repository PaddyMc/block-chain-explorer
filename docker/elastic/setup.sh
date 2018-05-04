docker-compose -f docker-compose.yml up -d

sleep 10

docker exec elasticsearch ./elastic.sh
