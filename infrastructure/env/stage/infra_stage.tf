terraform {
  required_version = ">= 0.12.0"

  backend "s3" {
    bucket = "[#_APP_NAME_#]-terraform-state-store"
    key    = "[#_STAGE_NAME_#]/terraform.tfstate"
    region = "eu-central-1"

    dynamodb_table = "[#_APP_NAME_#]-terraform-state-locks"
    encrypt        = true
  }
}

variable "public_ssh_key" {
  type        = string
  description = "Public ssh key to access server with ssh key"
}

variable "subdomain" {
  description = "Subdomain for domain"
  type        = string
}

variable "base_domain" {
  description = "Base domain"
  type        = string
}

variable "db_username" {
  type = string
}

variable "db_password" {
  type = string
}

variable "domain_certificate_arn" {
  description = "ARN of domain certificate"
  type        = string
}

module "resources" {
  source      = "../../modules"
  environment = "[#_STAGE_NAME_#]"

  name           = "server-[#_APP_NAME_#]-[#_STAGE_NAME_#]"
  app_name       = "[#_APP_NAME_#]-[#_STAGE_NAME_#]"
  public_ssh_key = var.public_ssh_key

  base_domain            = var.base_domain
  subdomain              = var.subdomain
  domain_certificate_arn = var.domain_certificate_arn

  db_name           = "db${replace("[#_APP_NAME_#]", "-", "")}[#_STAGE_NAME_#]"
  identifier        = "db${replace("[#_APP_NAME_#]", "-", "")}[#_STAGE_NAME_#]"
  apply_immediately = true
  username          = var.db_username
  password          = var.db_password
  api_name          = "[#_APP_NAME_#]-[#_STAGE_NAME_#]-api"
}

output "server_private_ip" {
  value = module.resources.private_ip
}

output "server_public_ip" {
  value = module.resources.public_ip
}

output "name" {
  value = module.resources.name
}

output "app_name" {
  value = module.resources.app_name
}

output "instance_id" {
  value = module.resources.instance_id
}

output "deployment_bucket" {
  value = module.resources.deployment_bucket
}

output "public_subnet_id" {
  value       = module.resources.public_subnet_id
  description = "The public subnet id"
}

output "vpc_public_security_group_ids" {
  value       = module.resources.vpc_public_security_group_ids
  description = "The vpc public security group ids"
}

output "vpc_db_security_group_ids" {
  value       = module.resources.vpc_db_security_group_ids
  description = "The vpc db security group ids"
}

output "private_db_subnet_group_id" {
  value       = module.resources.private_db_subnet_group_id
  description = "The private db subnet id"
}

output "server_port" {
  value       = module.resources.server_port
  description = "The public server port"
}

output "db_name" {
  value = module.resources.db_name
}

output "db_port" {
  value = module.resources.db_port
}

output "db_address" {
  value       = module.resources.db_address
  description = "db address"
}

output "s3_arn" {
  value       = module.resources.s3_arn
  description = "The ARN of the S3 bucket"
}

output "s3_bucket_regional_domain_name" {
  value       = module.resources.s3_bucket_regional_domain_name
  description = "The Bucket Regional Domain Name of the S3 bucket"
}

output "s3_id" {
  value       = module.resources.s3_id
  description = "The id of the S3 bucket"
}

output "cdn_arn" {
  value       = module.resources.cdn_arn
  description = "The ARN of the cdn"
}

output "cdn_domain_name" {
  value       = module.resources.cdn_domain_name
  description = "The domain name of the cdn"
}

output "cdn_hosted_zone_id" {
  value       = module.resources.cdn_hosted_zone_id
  description = "The hosted zone id of the cdn"
}

output "api_gateway_invoke_url" {
  value       = module.resources.api_gateway_invoke_url
  description = "API Gateway Invoke URL"
}

output "api_gateway_stage_invoke_url" {
  value       = module.resources.api_gateway_stage_invoke_url
  description = "API Gateway Stage Invoke URL"
}
