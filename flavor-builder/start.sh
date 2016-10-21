#!/bin/bash

printenv | sed 's/^\(.*\)$/export \1/g' > /env.sh

service apache2 start
service cron start
echo "started services"

tail -f /dev/null
