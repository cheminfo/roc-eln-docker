#!/bin/bash

# Start couchdb in the background
/usr/local/bin/couchdb -b

while [ -z `cat /usr/local/var/run/couchdb/couchdb.pid` ]; do
	sleep 1
done

# Create rest-on-couch users and databases
curl -X POST http://localhost:5984/_users \
     -H 'Content-Type: application/json' \
     -d '{ "_id": "org.couchdb.user:rest-on-couch", "name": "rest-on-couch", "type": "user", "roles": [], "password": "'$COUCHDB_PASSWORD'" }'

curl -X POST http://localhost:5984/_users \
     -H 'Content-Type: application/json' \
     -d '{ "_id": "org.couchdb.user:admin@cheminfo.org", "name": "admin@cheminfo.org", "type": "user", "roles": [], "password": "'$COUCHDB_PASSWORD'" }'

curl -X PUT http://localhost:5984/eln
curl -X POST http://localhost:5984/eln \
     -H 'Content-Type: application/json' \
     -d '{"$type": "group", "$owners": ["admin@cheminfo.org"], "name": "anonymousRead", "users": [], "rights": ["read"], "$lastModification": "admin@cheminfo.org", "$modificationDate": 0, "$creationDate": 0}';
curl -X POST http://localhost:5984/eln \
     -H 'Content-Type: application/json' \
     -d '{"$type": "group", "$owners": ["admin@cheminfo.org"], "name": "anyuserRead", "users": [], "rights": ["read"], "$lastModification": "admin@cheminfo.org", "$modificationDate": 0, "$creationDate": 0}';
curl -X PUT http://localhost:5984/eln/defaultGroups \
     -H 'Content-Type: application/json' \
     -d '{"_id": "defaultGroups","$type": "db","anonymous": ["anonymousRead"],"anyuser": ["anyuserRead"]}'
curl -X PUT http://localhost:5984/eln/_security \
     -H 'Content-Type: application/json' \
     -d '{ "admins": { "names": ["rest-on-couch"], "roles": [] }, "members": { "names": ["rest-on-couch"], "roles": [] } }'

curl -X PUT http://localhost:5984/visualizer
curl -X POST http://localhost:5984/visualizer \
     -H 'Content-Type: application/json' \
     -d '{"$type": "group", "$owners": ["admin@cheminfo.org"], "name": "anonymousRead", "users": [], "rights": ["read"], "$lastModification": "admin@cheminfo.org", "$modificationDate": 0, "$creationDate": 0}';
curl -X POST http://localhost:5984/visualizer \
     -H 'Content-Type: application/json' \
     -d '{"$type": "group", "$owners": ["admin@cheminfo.org"], "name": "anyuserRead", "users": [], "rights": ["read"], "$lastModification": "admin@cheminfo.org", "$modificationDate": 0, "$creationDate": 0}';
curl -X PUT http://localhost:5984/visualizer/defaultGroups \
     -H 'Content-Type: application/json' \
     -d '{"_id": "defaultGroups","$type": "db","anonymous": ["anonymousRead"],"anyuser": ["anyuserRead"]}'
curl -X PUT http://localhost:5984/visualizer/_security \
     -H 'Content-Type: application/json' \
     -d '{ "admins": { "names": ["rest-on-couch"], "roles": [] }, "members": { "names": ["rest-on-couch"], "roles": [] } }'

sleep 1

# Stop couchdb
/usr/local/bin/couchdb -d
