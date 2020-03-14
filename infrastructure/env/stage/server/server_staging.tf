terraform {
  required_version = ">= 0.12.0"

  backend "s3" {
    bucket = "ae-firestarter-demo-terraform-state-store"
    key    = "staging/server/terraform.tfstate"
    region = "eu-central-1"

    dynamodb_table = "ae-firestarter-demo-terraform-state-locks"
    encrypt        = true
  }
}

module "server" {
  source      = "../../../modules/server"
  environment = "staging"

  name                 = "server-staging"
  app_name             = "ae-firestarter-demo-staging"
  key_pair_filepath    = "${path.module}/server.pem"
  network_state_bucket = "ae-firestarter-demo-terraform-state-store"
  network_state_key    = "staging/network/terraform.tfstate"
}

output "server_private_ip" {
  value = module.server.private_ip

}

output "server_public_ip" {
  value = module.server.public_ip
}

output "name" {
  value = module.server.name
}

output "instance_id" {
  value = module.server.instance_id
}

output "deployment_bucket" {
  value = module.server.deployment_bucket
}
