FROM cheminfo/rest-on-couch:v5.1.0

COPY start.sh /start.sh
RUN chmod +x /start.sh
COPY create_db.sh /create_db.sh
RUN chmod +x /create_db.sh

CMD ["/start.sh"]