# block-chain-explorer
<h2>Prerequisites</h2>
<h3>Download and Unzip:</h3> 
<ul>
  <li>http://cassandra.apache.org/download/</li>
  <li>https://www.elastic.co/products/elasticsearch</li>
  <li>https://www.elastic.co/products/kibana</li>
</ul>

<h3>To Run:</h3>
<h4>Start tron-java node</h4>
<ul>
  <li>./gradlew build</li>
  <li>./gradlew run -Pwitness</li>
</ul>

<h4>Start elastic search</h4>
<ul>
 <li>run .\elasticsearch in \elasticsearch-x.x.x\bin directory</li>
</ul>

<h4>Start cassandra</h4>
<ul>
  <li>service cassandra start</li>
  <li>cassandra -f</li>
  <li>run cass.sh in cassandra directory</li>
</ul>

<h4>Navigate to block-chain-explorer directory</h4> 
<ul>
  <li>npm install</li>
  <li>node ./index.js</li>
</ul>

<h4>To cleanup elasticsearch data:</h4>
<ul>
  <li>curl -X DELETE 'http://localhost:9200/_all'</li>
</ul>

docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container_name_or_id

docker run -p 50051:50051 -it tronnode /bin/bash -c 'cd build/libs; java -jar java-tron.jar'

install google protobuffer
protoc --proto_path= --js_out=import_style=commonjs,binary:build/gen api/api.proto
protoc --proto_path= --js_out=import_style=commonjs,binary:build/gen core/Tron.proto
protoc --proto_path= --js_out=import_style=commonjs,binary:build/gen core/Contract.proto
protoc --proto_path= --js_out=import_style=commonjs,binary:build/gen core/Discover.proto
protoc --proto_path= --js_out=import_style=commonjs,binary:build/gen core/TronInventoryItems.proto
protoc --proto_path= --js_out=import_style=commonjs,binary:build/gen google/api/annotations.proto

GRPC pb
npm config set unsafe-perm true
sudo npm install protoc-gen-grpc -g
protoc-gen-grpc --js_out=import_style=commonjs,binary:./build --grpc_out=./build --proto_path= api/api.proto

elasticdump --input=./accounts.json --output=http://localhost:9200/accounts

