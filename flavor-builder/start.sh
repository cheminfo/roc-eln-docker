#!/bin/bash

service apache2 start
service cron start
echo "started services"

tail -f /dev/null
