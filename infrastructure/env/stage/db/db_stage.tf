terraform {
  required_version = ">= 0.12.0"

  backend "s3" {
    bucket = "[#_APP_NAME_#]-terraform-state-store"
    key    = "[#_STAGE_NAME_#]/db/terraform.tfstate"
    region = "eu-central-1"

    dynamodb_table = "[#_APP_NAME_#]-terraform-state-locks"
    encrypt        = true
  }
}

variable "db_username" {
  type = string
}

variable "db_password" {
  type = string
}

module "db" {
  source               = "../../../modules/db"
  environment          = "[#_STAGE_NAME_#]"
  network_state_bucket = "[#_APP_NAME_#]-terraform-state-store"
  network_state_key    = "[#_STAGE_NAME_#]/network/terraform.tfstate"

  db_name           = "db[#_STAGE_NAME_#]"
  identifier        = "db[#_STAGE_NAME_#]"
  apply_immediately = true
  username          = var.db_username
  password          = var.db_password
}

output "db_name" {
  value = module.db.db_name
}

output "db_port" {
  value = module.db.db_port
}

output "db_address" {
  value       = module.db.db_address
  description = "db address"
}
