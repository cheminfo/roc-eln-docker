FROM cheminfo/rest-on-couch:v7.0.0

# Install useful packages
RUN apt-get update && apt-get install -y vim

# Copy ROC scripts
COPY wait.sh start.sh create_db.sh /
RUN chmod +x /wait.sh /start.sh /create_db.sh

# Install dependencies
COPY init-views/package.json init-views/package-lock.json /init-views/
RUN cd /init-views && npm ci
COPY package.json package-lock.json /rest-on-couch/
RUN cd /rest-on-couch && npm ci

# Script used to initialize views on the first start
COPY init-views /init-views/

# ROC home directory
COPY home /rest-on-couch/

CMD ["/start.sh"]
