#!/bin/sh
BASEDIR=$(dirname "$0")
cd /opt/nails
export NODE_ENV=production

pm2 start --name nails dist/src/index.js -- --prod
