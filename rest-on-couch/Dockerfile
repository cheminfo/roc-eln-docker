FROM cheminfo/rest-on-couch:v6.0.0

COPY wait.sh /wait.sh
RUN chmod +x /wait.sh
COPY start.sh /start.sh
RUN chmod +x /start.sh
COPY create_db.sh /create_db.sh
RUN chmod +x /create_db.sh

COPY package.json package-lock.json /rest-on-couch/
RUN cd /rest-on-couch && npm ci
COPY home /rest-on-couch/

CMD ["/start.sh"]
