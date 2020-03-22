# Infrastructure

## Required Variables

- DB_PASSWORD
- DB_USERNAME
- PUBLIC_SSH_KEY
- DOMAIN_CERTIFICATE_ARN
- BASE_DOMAIN
- SUBDOMAIN
- JWT_SECRET_TOKEN

## Setup

### Initial Setup

1. Execute `./infrastructure/bin/setup_app` and set app configuration.
2. Execute `./infrastructure/bin/setup_terraform` and set up terraform backend
3. Execute `./infrastructure/bin/setup_stage` and add a new stage.
4. OPTIONAL: Execute `./infrastructure/bin/ssh_key_generator` and create ssh keys to connect ec2 instance

### Recurring Tasks

1. Execute generated with some env vars. e.g: `DB_PASSWORD="password" DB_USERNAME="username" PUBLIC_SSH_KEY="$(<./infrastructure/bin/ssh_key.pub)" DOMAIN_CERTIFICATE_ARN="arn-foobar" BASE_DOMAIN="domain.xyz" SUBDOMAIN="subdomain" ./infrastructure/bin/build_STAGENAME` to set up infrastructure

## Deployment

### Server

1. Execute `JWT_SECRET_TOKEN="TOKEN" ./server/bin/build.sh`
2. Execute `./infrastructure/bin/deploy_STAGENAME`

### Client

1. Execute `./client/bin/build.sh`
2. Execute `./infrastructure/bin/deploy_client_STAGENAME`
