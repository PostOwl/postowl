#!/bin/sh

# Script to run when deploying to fly.io
# This creates or migrates the database on your fly volume and then starts the app
set -e

FOLDER=/data
if [ ! -d "$FOLDER" ]
then
    echo "$FOLDER is not a directory, initializing database" 
    mkdir /data
    touch $DB_PATH
fi

sqlite3 $DB_PATH < /app/scripts/schema.sql
node build
