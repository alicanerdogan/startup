#!/bin/bash
BASEDIR=$(dirname "$0")
cd $BASEDIR
cd ./..

set -e

rm -rf dist
yarn
yarn build
echo "{
  \"passphrase\": \"$JWT_SECRET_TOKEN\"
}" > secret.json
