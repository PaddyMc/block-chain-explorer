# block-chain-explorer
<h2>Prerequisites</h2>
<h3>Download and Unzip:</h3> 
<ul>
  <li>https://www.elastic.co/products/elasticsearch</li>
  <li>https://www.elastic.co/products/kibana</li>
</ul>

<h3>To Run:</h3>
<p>Start elastic search ( run .\elasticsearch.bat in \elasticsearch-x.x.x\bin directory )</p>
<div></div>
<h4>Navigate to block-chain-explorer directory</h4> 
<ul>
  <li>npm install</li>
  <li>node ./index.js</li>
</ul>

<h3>To cleanup elasticsearch data:</h3>
  <li>curl -X DELETE 'http://localhost:9200/_all'</li>
