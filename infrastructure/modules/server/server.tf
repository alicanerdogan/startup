provider "aws" {
  region  = "eu-central-1"
  version = ">= 2.52.0"
}


variable "environment" {
  description = "Target environment"
  type        = string
}

variable "app_name" {
  description = "App name"
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

variable "network_state_bucket" {
  description = "The name of the S3 bucket for the network's remote state"
  type        = string
}

variable "network_state_key" {
  description = "The path for the network's remote state in S3"
  type        = string
}

resource "aws_key_pair" "server_key_pair" {
  key_name   = "server_key_pair_${var.environment}"
  public_key = var.public_ssh_key
}

data "terraform_remote_state" "network" {
  backend = "s3"

  config = {
    bucket = var.network_state_bucket
    key    = var.network_state_key
    region = "eu-central-1"
  }
}

data "template_file" "user_data" {
  template = file("${path.module}/user_data.sh")

  vars = {
  }
}

resource "aws_iam_instance_profile" "iam_instance_profile" {
  name = "${var.app_name}_iam_instance_profile_${var.environment}"
  role = aws_iam_role.ec2_role.name
}

resource "aws_instance" "server" {
  ami                    = "ami-0df0e7600ad0913a9"
  iam_instance_profile   = aws_iam_instance_profile.iam_instance_profile.name
  instance_type          = var.instance_type
  key_name               = aws_key_pair.server_key_pair.key_name
  private_ip             = var.private_ip
  subnet_id              = data.terraform_remote_state.network.outputs.public_subnet_id
  vpc_security_group_ids = data.terraform_remote_state.network.outputs.vpc_public_security_group_ids

  user_data = data.template_file.user_data.rendered

  tags = {
    Name        = var.name
    Environment = var.environment
  }
}

resource "aws_iam_role" "codedeploy_role" {
  name = "${var.app_name}_codedeploy_role_${var.environment}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "codedeploy.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_s3_bucket" "deployment_bucket" {
  bucket = "${var.app_name}${var.bucket_name_postfix}-deployment-${var.environment}"
}

resource "aws_iam_role_policy" "s3_deployment_policy" {
  name = "${var.app_name}_deployment_s3_${var.environment}"
  role = aws_iam_role.ec2_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:Get*",
        "s3:List*"
      ],
      "Resource": [
        "arn:aws:s3:::${aws_s3_bucket.deployment_bucket.id}/*",
        "arn:aws:s3:::aws-codedeploy-us-east-2/*",
        "arn:aws:s3:::aws-codedeploy-us-east-1/*",
        "arn:aws:s3:::aws-codedeploy-us-west-1/*",
        "arn:aws:s3:::aws-codedeploy-us-west-2/*",
        "arn:aws:s3:::aws-codedeploy-ca-central-1/*",
        "arn:aws:s3:::aws-codedeploy-eu-west-1/*",
        "arn:aws:s3:::aws-codedeploy-eu-west-2/*",
        "arn:aws:s3:::aws-codedeploy-eu-west-3/*",
        "arn:aws:s3:::aws-codedeploy-eu-central-1/*",
        "arn:aws:s3:::aws-codedeploy-ap-east-1/*",
        "arn:aws:s3:::aws-codedeploy-ap-northeast-1/*",
        "arn:aws:s3:::aws-codedeploy-ap-northeast-2/*",
        "arn:aws:s3:::aws-codedeploy-ap-southeast-1/*",        
        "arn:aws:s3:::aws-codedeploy-ap-southeast-2/*",
        "arn:aws:s3:::aws-codedeploy-ap-south-1/*",
        "arn:aws:s3:::aws-codedeploy-sa-east-1/*"
      ]
    }
  ]
}
EOF
}

resource "aws_iam_role" "ec2_role" {
  name = "${var.app_name}_ec2_role_${var.environment}"
  path = "/"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "aws-codedeploy-role" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole"
  role       = aws_iam_role.codedeploy_role.name
}

resource "aws_codedeploy_app" "codedeploy" {
  compute_platform = "Server"
  name             = var.app_name
}

resource "aws_codedeploy_deployment_group" "deployment_group" {
  app_name              = var.app_name
  deployment_group_name = "deployment_group_${var.environment}"
  service_role_arn      = aws_iam_role.codedeploy_role.arn

  ec2_tag_set {
    ec2_tag_filter {
      key   = "Name"
      type  = "KEY_AND_VALUE"
      value = var.name
    }
  }
}

resource "aws_eip" "server_eip" {
  instance = aws_instance.server.id
}

output "instance_id" {
  value = aws_instance.server.id
}

output "name" {
  value = var.name
}

output "app_name" {
  value = var.app_name
}

output "private_ip" {
  value = aws_instance.server.private_ip
}

output "public_ip" {
  value = aws_eip.server_eip.public_ip
}

output "deployment_bucket" {
  value = aws_s3_bucket.deployment_bucket.id
}
