#!/usr/bin/env sh

/create_db.sh
pm2-docker start /pm2-rest-on-couch.yaml
