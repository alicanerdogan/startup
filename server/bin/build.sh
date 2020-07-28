#!/bin/bash
BASEDIR=$(dirname "$0")
cd $BASEDIR
cd ./..

set -e

file="./src/config.prod.json"
if [ -f "$file" ]
then
	echo "$file found."
else
	echo "$file not found."
  exit 1
fi

echo "{
  \"passphrase\": \"$JWT_SECRET_TOKEN\"
}" > secret.json

rm -rf dist
yarn
yarn build
cp "$file" ./dist/src/
