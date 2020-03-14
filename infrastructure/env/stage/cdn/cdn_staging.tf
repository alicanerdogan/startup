terraform {
  required_version = ">= 0.12.0"

  backend "s3" {
    bucket = "ae-firestarter-demo-terraform-state-store"
    key    = "staging/cdn/terraform.tfstate"
    region = "eu-central-1"

    dynamodb_table = "ae-firestarter-demo-terraform-state-locks"
    encrypt        = true
  }
}

module "cdn" {
  source      = "../../../modules/cdn"
  environment = "staging"
}

output "s3_arn" {
  value       = module.cdn.s3_arn
  description = "The ARN of the S3 bucket"
}

output "s3_bucket_regional_domain_name" {
  value       = module.cdn.s3_bucket_regional_domain_name
  description = "The Bucket Regional Domain Name of the S3 bucket"
}

output "s3_id" {
  value       = module.cdn.s3_id
  description = "The id of the S3 bucket"
}

output "cdn_arn" {
  value       = module.cdn.cdn_arn
  description = "The ARN of the cdn"
}

output "cdn_domain_name" {
  value       = module.cdn.cdn_domain_name
  description = "The domain name of the cdn"
}

output "cdn_hosted_zone_id" {
  value       = module.cdn.cdn_hosted_zone_id
  description = "The hosted zone id of the cdn"
}

