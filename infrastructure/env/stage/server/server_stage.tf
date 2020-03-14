terraform {
  required_version = ">= 0.12.0"

  backend "s3" {
    bucket = "[#_APP_NAME_#]-terraform-state-store"
    key    = "[#_STAGE_NAME_#]/server/terraform.tfstate"
    region = "eu-central-1"

    dynamodb_table = "[#_APP_NAME_#]-terraform-state-locks"
    encrypt        = true
  }
}

variable "public_ssh_key" {
  type        = string
  description = "Public ssh key to access server with ssh key"
}

module "server" {
  source      = "../../../modules/server"
  environment = "[#_STAGE_NAME_#]"

  name                 = "server-[#_STAGE_NAME_#]"
  app_name             = "[#_APP_NAME_#]-[#_STAGE_NAME_#]"
  public_ssh_key       = var.public_ssh_key
  network_state_bucket = "[#_APP_NAME_#]-terraform-state-store"
  network_state_key    = "[#_STAGE_NAME_#]/network/terraform.tfstate"
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
