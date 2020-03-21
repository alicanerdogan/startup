#!/bin/sh
BASEDIR=$(dirname "$0")
cd /opt/nails

NODE_ENV=production yarn migrate
