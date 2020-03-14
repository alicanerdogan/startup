terraform {
  required_version = ">= 0.12.0"

  backend "s3" {
    bucket = "ae-firestarter-demo-terraform-state-store"
    key    = "staging/db/terraform.tfstate"
    region = "eu-central-1"

    dynamodb_table = "ae-firestarter-demo-terraform-state-locks"
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
  environment          = "staging"
  network_state_bucket = "ae-firestarter-demo-terraform-state-store"
  network_state_key    = "staging/network/terraform.tfstate"

  db_name           = "dbstaging"
  identifier        = "dbstaging"
  apply_immediately = true
  username          = var.db_username
  password          = var.db_password
}

output "db_address" {
  value       = module.db.db_address
  description = "db address"
}
