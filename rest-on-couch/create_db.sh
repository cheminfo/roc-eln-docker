#!/bin/bash

set -e

/wait.sh

response=$(curl --write-out %{http_code} --silent --output /dev/null http://couchdb:5984/_users)

if [ ${response} == "404" ]
then

echo "Database is not instantiated. Create it."

curl -X POST -H "Content-Type: application/json" http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/_cluster_setup -d '{"action": "finish_cluster"}'

# Create rest-on-couch users and databases
curl -X POST http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/_users \
     -H 'Content-Type: application/json' \
     -d '{ "_id": "org.couchdb.user:rest-on-couch", "name": "rest-on-couch", "type": "user", "roles": [], "password": "'${COUCHDB_ROC_SERVER_PASSWORD}'" }'

curl -X POST http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/_users \
     -H 'Content-Type: application/json' \
     -d '{ "_id": "org.couchdb.user:admin@cheminfo.org", "name": "admin@cheminfo.org", "type": "user", "roles": [], "password": "'${COUCHDB_ROC_ADMIN_PASSWORD}'" }'

curl -X POST http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/_users \
     -H 'Content-Type: application/json' \
     -d '{ "_id": "org.couchdb.user:printer@cheminfo.org", "name": "printer@cheminfo.org", "type": "user", "roles": [], "password": "'${COUCHDB_PRINTER_PASSWORD}'" }'


curl -X PUT http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/printers
curl -X PUT http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/printers/_security \
     -H 'Content-Type: application/json' \
     -d '{ "admins": { "names": ["rest-on-couch"], "roles": [] }, "members": { "names": ["rest-on-couch"], "roles": [] } }'
curl -X PUT http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/printers/rights \
     -H 'Content-Type: application/json' \
     -d '{"_id": "rights","$type": "db","read": ["anyuser"], "create": ["admin@cheminfo.org", "printer@cheminfo.org"]}'
curl -X POST http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/printers \
     -H 'Content-Type: application/json' \
     -d '{"$type": "group", "$owners": ["admin@cheminfo.org"], "name": "printerAdmin", "users": ["admin@cheminfo.org", "printer@cheminfo.org"], "rights": ["read", "write"], "$lastModification": "admin@cheminfo.org", "$modificationDate": 0, "$creationDate": 0}';

curl -X PUT http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/eln
curl -X POST http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/eln \
     -H 'Content-Type: application/json' \
     -d '{"$type": "group", "$owners": ["admin@cheminfo.org"], "name": "anonymousRead", "users": [], "rights": ["read"], "$lastModification": "admin@cheminfo.org", "$modificationDate": 0, "$creationDate": 0}';
curl -X POST http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/eln \
     -H 'Content-Type: application/json' \
     -d '{"$type": "group", "$owners": ["admin@cheminfo.org"], "name": "anyuserRead", "users": [], "rights": ["read"], "$lastModification": "admin@cheminfo.org", "$modificationDate": 0, "$creationDate": 0}';
curl -X PUT http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/eln/defaultGroups \
     -H 'Content-Type: application/json' \
     -d '{"_id": "defaultGroups","$type": "db","anonymous": ["anonymousRead"],"anyuser": ["anyuserRead"]}'
curl -X PUT http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/eln/_security \
     -H 'Content-Type: application/json' \
     -d '{ "admins": { "names": ["rest-on-couch"], "roles": [] }, "members": { "names": ["rest-on-couch"], "roles": [] } }'

curl -X PUT http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/visualizer
curl -X POST http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/visualizer \
     -H 'Content-Type: application/json' \
     -d '{"$type": "group", "$owners": ["admin@cheminfo.org"], "name": "anonymousRead", "users": [], "rights": ["read"], "$lastModification": "admin@cheminfo.org", "$modificationDate": 0, "$creationDate": 0}';
curl -X POST http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/visualizer \
     -H 'Content-Type: application/json' \
     -d '{"$type": "group", "$owners": ["admin@cheminfo.org"], "name": "anyuserRead", "users": [], "rights": ["read"], "$lastModification": "admin@cheminfo.org", "$modificationDate": 0, "$creationDate": 0}';
curl -X PUT http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/visualizer/defaultGroups \
     -H 'Content-Type: application/json' \
     -d '{"_id": "defaultGroups","$type": "db","anonymous": ["anonymousRead"],"anyuser": ["anyuserRead"]}'
curl -X PUT http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb:5984/visualizer/_security \
     -H 'Content-Type: application/json' \
     -d '{ "admins": { "names": ["rest-on-couch"], "roles": [] }, "members": { "names": ["rest-on-couch"], "roles": [] } }'

node /init-views/copy-views.js

else

echo "Response: ${response}"
echo "CouchDB is already initialized"

fi
