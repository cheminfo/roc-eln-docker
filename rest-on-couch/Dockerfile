FROM cheminfo/rest-on-couch:v8.3.0

COPY start.sh /start.sh
RUN chmod +x /start.sh
COPY wait.sh /wait.sh
RUN chmod +x /wait.sh
COPY create_db.sh /create_db.sh
RUN chmod +x /create_db.sh

# Install dependencies
COPY init-views/package.json init-views/package-lock.json /init-views/
RUN cd /init-views && npm ci

# Script used to initialize views on the first start
COPY init-views /init-views/

