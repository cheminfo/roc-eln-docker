FROM klaemo/couchdb:1.6.1

COPY create_db.sh /create_db.sh
RUN chmod +x /create_db.sh

COPY ./eln-entrypoint.sh /
RUN chmod +x /eln-entrypoint.sh

ENTRYPOINT ["tini", "--", "/eln-entrypoint.sh"]
CMD ["couchdb"]
