#!/bin/bash
BASEDIR=$(dirname "$0")
cd $BASEDIR
cd ./..

set -e

rm -rf dist
yarn
echo "{
  \"passphrase\": \"$JWT_SECRET_TOKEN\"
}" > secret.json
yarn build
