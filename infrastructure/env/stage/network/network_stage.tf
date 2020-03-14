terraform {
  required_version = ">= 0.12.0"

  backend "s3" {
    bucket = "[#_APP_NAME_#]-terraform-state-store"
    key    = "[#_STAGE_NAME_#]/network/terraform.tfstate"
    region = "eu-central-1"

    dynamodb_table = "[#_APP_NAME_#]-terraform-state-locks"
    encrypt        = true
  }
}

module "network" {
  source      = "../../../modules/network"
  environment = "[#_STAGE_NAME_#]"
}

output "public_subnet_id" {
  value       = module.network.public_subnet_id
  description = "The public subnet id"
}

output "vpc_public_security_group_ids" {
  value       = module.network.vpc_public_security_group_ids
  description = "The vpc public security group ids"
}

output "vpc_db_security_group_ids" {
  value       = module.network.vpc_db_security_group_ids
  description = "The vpc db security group ids"
}

output "private_db_subnet_group_id" {
  value       = module.network.private_db_subnet_group_id
  description = "The private db subnet id"
}
