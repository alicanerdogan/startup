#!/bin/bash
BASEDIR=$(dirname "$0")
cd $BASEDIR/..

(cd "env/staging/server" && terraform destroy -auto-approve)
(cd "env/staging/db" && terraform destroy -var "db_password=$DB_PASSWORD" -var "db_username=$DB_USERNAME" -auto-approve)
(cd "env/staging/cdn" && terraform destroy -auto-approve)
(cd "env/staging/network" && terraform destroy -auto-approve)
