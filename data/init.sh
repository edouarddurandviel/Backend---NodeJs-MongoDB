#!/bin/bash
set -e

echo "Importing MongoDB archive..."

mongorestore \
  --archive=/docker-entrypoint-initdb.d/archive.gz \
  --gzip \
  --username "$MONGO_INITDB_ROOT_USERNAME" \
  --password "$MONGO_INITDB_ROOT_PASSWORD" \
  --authenticationDatabase admin

echo "MongoDB initialization finished"
