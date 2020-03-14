#!/bin/bash

DATABASE_CONTAINER_NAME="nails-db"
DB_NAME="nails-db"
DB_TEST_NAME="naild-db-test"
DB_PASSWORD="postgres"
DB_PORT="5400"

docker run --name $DATABASE_CONTAINER_NAME -p $DB_PORT:5432 -e POSTGRES_PASSWORD=$DB_PASSWORD -e POSTGRES_DB=$DB_NAME -d postgres:12
sleep 5
docker exec -it -u postgres $DATABASE_CONTAINER_NAME sh -c "psql -U postgres -tc \"SELECT 1 FROM pg_database WHERE datname = '$DB_TEST_NAME'\" | grep -q 1 || psql -U postgres -c 'CREATE DATABASE \"$DB_TEST_NAME\"'"
