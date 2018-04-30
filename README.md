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
  <li>brew services cassandra start</li>
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


