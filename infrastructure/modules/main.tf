provider "aws" {
  region  = "eu-central-1"
  version = ">= 2.52.0"
}

variable "environment" {
  description = "Target environment"
  type        = string
}

variable "bucket_name_postfix" {
  description = "To avoid clashes"
  type        = string
  default     = ""
}

variable "iam_instance_profile" {
  type    = string
  default = ""
}

variable "instance_type" {
  default = "t2.micro"
  type    = string

}

variable "name" {
  type = string
}

variable "public_ssh_key" {
  type = string
}

variable "private_ip" {
  default = ""
  type    = string

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

variable "app_name" {
  description = "App name"
  type        = string
}

variable "subdomain" {
  description = "Subdomain for domain"
  type        = string
}

variable "base_domain" {
  description = "Base domain"
  type        = string
}

variable "domain_certificate_arn" {
  description = "ARN of domain certificate"
  type        = string
}

variable "api_gateway_stage_name" {
  description = "API Gateway Stage Name"
  type        = string
  default     = "stage"
}

variable "api_name" {
  description = "API Name"
  type        = string
}
