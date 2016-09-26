# roc-eln-docker

## Commands

```
docker run -d -p 5984:5984 -v $(pwd):/usr/local/var/lib/couchdb --name couchdb couchdb

docker run -d -v /usr/local/rest-on-couch:/rest-on-couch -p 4444:3005 -e 'DEBUG=couch:error,couch:warn,couch:debug' --name rest-on-couch cheminfo/rest-on-couch pm2-docker start /git/rest-on-couch/node_modules/rest-on-couch/bin/rest-on-couch-server.js

docker run -d -v /usr/local/rest-on-couch:/rest-on-couch -e 'DEBUG=couch:error,couch:warn,couch:debug' --name rest-on-couch-import cheminfo/rest-on-couch pm2-docker start /git/rest-on-couch/node_modules/rest-on-couch/bin/rest-on-couch-import.js

docker run -d --name flavor-builder cheminfo/eln-flavor-builder
```
