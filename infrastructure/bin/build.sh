#!/bin/bash
BASEDIR=$(dirname "$0")
cd $BASEDIR/..

(cd "env/staging/network" && terraform init && terraform apply -auto-approve)
(cd "env/staging/cdn" && terraform init && terraform apply -auto-approve)
(cd "env/staging/db" && terraform init && terraform apply -var "db_password=$DB_PASSWORD" -var "db_username=$DB_USERNAME" -auto-approve)
(cd "env/staging/server" && terraform init && terraform apply -auto-approve)

export DB_ADDRESS=$(cd env/staging/db && terraform output db_address)
