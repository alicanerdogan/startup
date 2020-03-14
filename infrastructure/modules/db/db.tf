variable "environment" {
  description = "Target environment"
  type        = string
}

variable "apply_immediately" {
  default = false
  type    = bool
}

variable "db_name" {
  type = string
}

variable "identifier" {
  type = string
}

variable "username" {
  type = string
}

variable "password" {
  type = string
}

variable "publicly_accessible" {
  default = false
  type    = bool
}

variable "instance_class" {
  type    = string
  default = "db.t2.micro"
}

variable "network_state_bucket" {
  description = "The name of the S3 bucket for the network's remote state"
  type        = string
}

variable "network_state_key" {
  description = "The path for the network's remote state in S3"
  type        = string
}

locals {
  db_port = 5432
}

provider "aws" {
  region  = "eu-central-1"
  version = ">= 2.52.0"
}

data "terraform_remote_state" "network" {
  backend = "s3"

  config = {
    bucket = var.network_state_bucket
    key    = var.network_state_key
    region = "eu-central-1"
  }
}

resource "aws_db_instance" "db" {
  allocated_storage      = 20
  storage_type           = "gp2"
  engine                 = "postgres"
  engine_version         = "11.5"
  apply_immediately      = var.apply_immediately
  identifier             = var.identifier
  instance_class         = var.instance_class
  name                   = var.db_name
  username               = var.username
  password               = var.password
  publicly_accessible    = var.publicly_accessible
  skip_final_snapshot    = true
  vpc_security_group_ids = data.terraform_remote_state.network.outputs.vpc_db_security_group_ids
  db_subnet_group_name   = data.terraform_remote_state.network.outputs.private_db_subnet_group_id
  port                   = local.db_port
}

output "db_name" {
  value = var.db_name
}

output "db_port" {
  value = local.db_port
}

output "db_address" {
  value = aws_db_instance.db.address
}
