#!/bin/bash

DATABASE_CONTAINER_NAME="nails-mysql-db"
DB_NAME="nails-db"
DB_PASSWORD="mysql"
DB_PORT="3300"

docker run --name $DATABASE_CONTAINER_NAME -p $DB_PORT:3306 -e MYSQL_ROOT_PASSWORD=$DB_PASSWORD -e MYSQL_DATABASE=$DB_NAME -d mysql:8
