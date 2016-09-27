#!/bin/bash

if [ -n "$(find /usr/local/var/lib/couchdb -prune -empty)" ]
then
    echo "Initialize CouchDB data"
    cp /couchdb-initial-data/* /usr/local/var/lib/couchdb/
fi

/bin/bash /docker-entrypoint.sh couchdb
