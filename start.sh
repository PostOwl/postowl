#!/bin/sh

set -e

FOLDER=/app/data
if [ ! -d "$FOLDER" ]
then
    echo "$FOLDER is not a directory, initializing database" 
    mkdir /app/data
    touch /app/data/db.sqlite3
fi

sqlite3 data/db.sqlite3 < schema.sql
node build
