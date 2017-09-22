#!/bin/bash

printenv | sed 's/^\(.*\)$/export \1/g' > /env.sh

service cron start
echo "started services"

node /git/flavor-builder/node_modules/visualizer-on-tabs/bin/build.js --outDir=/var/www/html/on-tabs/ --config=/on-tabs-config.json

tail -f /dev/null
