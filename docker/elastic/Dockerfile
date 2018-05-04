FROM docker.elastic.co/elasticsearch/elasticsearch:6.2.4
# package manager yum

RUN echo "# CORS settings." >> /usr/share/elasticsearch/config/elasticsearch.yml
RUN echo "http.cors.enabled: true" >> /usr/share/elasticsearch/config/elasticsearch.yml
RUN echo "http.cors.allow-origin: \"*\"" >> /usr/share/elasticsearch/config/elasticsearch.yml
RUN echo "http.cors.allow-methods : OPTIONS, HEAD, GET, POST" >> /usr/share/elasticsearch/config/elasticsearch.yml
