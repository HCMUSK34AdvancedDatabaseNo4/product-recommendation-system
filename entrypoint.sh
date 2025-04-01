#!/bin/bash
set -e

echo "Waiting for Neo4j to be ready..."
until nc -z neo4j 7687; do
  sleep 2
done
echo "Neo4j is up - running import script"
node dist/import-data.js

echo "Starting the application..."
exec npm start
