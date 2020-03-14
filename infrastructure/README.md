# Infrastructure

## Setup

1. Execute `./bin/setup` and set app name and stage name.
2. Execute `./bin/setup_terraform` and set up terraform backend
3. Execute generated with some env vars. e.g: `$DB_PASSWORD=password $DB_USERNAME=username $PUBLIC_SSH_KEY=$(<./bin/ssh_key) ./bin/build_STAGENAME` to set up infrastructure
