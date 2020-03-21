# Infrastructure

## Setup

1. Execute `./bin/setup` and set app name and stage name.
2. Execute `./bin/setup_terraform` and set up terraform backend
3. OPTIONAL: Execute `./bin/ssh_key_generator` and create ssh keys to connect ec2 instance
4. Execute generated with some env vars. e.g: `DB_PASSWORD="password" DB_USERNAME="username" PUBLIC_SSH_KEY="$(<./bin/ssh_key.pub)" DOMAIN_CERTIFICATE_ARN="arn-foobar" BASE_DOMAIN="domain.xyz" SUBDOMAIN="subdomain" ./bin/build_STAGENAME` to set up infrastructure
