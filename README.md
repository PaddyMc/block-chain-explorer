# block-chain-explorer
<h2>Prerequisites</h2>
<h3>Download and Unzip:</h3> 
<ul>
  <li>http://cassandra.apache.org/download/</li>
  <li>https://www.elastic.co/products/elasticsearch</li>
  <li>https://www.elastic.co/products/kibana</li>
</ul>

<h3>To Run:</h3>
<p>Start elastic search ( run .\elasticsearch in \elasticsearch-x.x.x\bin directory )</p>

<h4>Start cassandra</h4>
<ul>
  <li>service cassandra start</li>
  <li>bin/cqlsh localhost</li>
  <li>Copy contents of cass.sql in sql cmd interface</li>
</ul>

<h4>Navigate to block-chain-explorer directory</h4> 
<ul>
  <li>npm install</li>
  <li>node ./index.js</li>
</ul>

<h2>To cleanup elasticsearch data:</h2>
<ul>
  <li>curl -X DELETE 'http://localhost:9200/_all</li>
</ul>


