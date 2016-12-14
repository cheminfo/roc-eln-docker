#!/bin/bash

if [ -n "$(find /usr/local/var/lib/couchdb -prune -empty)" ]
then
    echo "Initialize CouchDB data"
    /bin/bash /create_db.sh
fi

/bin/bash /docker-entrypoint.sh couchdb
