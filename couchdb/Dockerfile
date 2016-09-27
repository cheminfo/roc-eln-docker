FROM klaemo/couchdb:1.6.1

MAINTAINER Michaël Zasso <targos@protonmail.com>

COPY create_db.sh /create_db.sh
RUN /bin/bash /create_db.sh

COPY start_db.sh /start_db.sh
RUN chmod +x /start_db.sh

CMD ["/start_db.sh"]
