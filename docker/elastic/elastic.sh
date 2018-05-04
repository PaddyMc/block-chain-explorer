echo "# CORS settings." >> /usr/share/elasticsearch/config/elasticsearch.yml
echo "http.cors.enabled: true" >> /usr/share/elasticsearch/config/elasticsearch.yml
echo "http.cors.allow-origin: \"*\"" >> /usr/share/elasticsearch/config/elasticsearch.yml
echo "http.cors.allow-methods : OPTIONS, HEAD, GET, POST" >> /usr/share/elasticsearch/config/elasticsearch.yml
