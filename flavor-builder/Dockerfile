FROM node:6

MAINTAINER Michaël Zasso <targos@protonmail.com>

# Install Apache
RUN apt-get update && apt-get install -y apache2 cron
EXPOSE 80

# Get flavor-builder
WORKDIR /git/flavor-builder
COPY package.json package.json
RUN npm install

COPY crontab /etc/cron.d/flavor-cron
RUN chmod 744 /etc/cron.d/flavor-cron

COPY start.sh /start.sh
RUN chmod 744 /start.sh

COPY flavor-config.json /flavor-config.json

CMD /start.sh
