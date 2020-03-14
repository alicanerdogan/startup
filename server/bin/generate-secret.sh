#!/bin/bash

node -e "console.log(JSON.stringify({ \"passphrase\": require('crypto').randomBytes(256).toString('base64') }));" > secret.json
