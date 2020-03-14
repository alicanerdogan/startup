#!/bin/sh
BASEDIR=$(dirname "$0")
cd /opt/nails
export NODE_ENV=production

yarn migrate
