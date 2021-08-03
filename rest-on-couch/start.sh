#!/usr/bin/env sh

/create_db.sh
cd /rest-on-couch/eln && npm i;
node /rest-on-couch-source/bin/rest-on-couch-server.js
