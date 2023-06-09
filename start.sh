#!/bin/sh

set -e

sqlite3 /data/db.sqlite3 < schema.sql
node ./build
