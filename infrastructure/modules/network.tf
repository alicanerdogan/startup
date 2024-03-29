locals {
  # Availability zone for eu-central-1c
  availability_zone_id_1 = "euc1-az1"
  # Availability zone for eu-central-1a
  availability_zone_id_2 = "euc1-az2"
}

resource "aws_vpc" "vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "vpc-${var.app_name}"
  }
}

resource "aws_subnet" "subnet_public" {
  availability_zone_id = local.availability_zone_id_1
  cidr_block           = "10.0.0.0/24"
  vpc_id               = aws_vpc.vpc.id

  tags = {
    Name = "subnet_public_${var.app_name}"
  }
}

resource "aws_subnet" "subnet_private_1" {
  availability_zone_id = local.availability_zone_id_1
  cidr_block           = "10.0.1.0/24"
  vpc_id               = aws_vpc.vpc.id

  tags = {
    Name = "subnet_private_1_${var.app_name}"
  }
}

resource "aws_subnet" "subnet_private_2" {
  availability_zone_id = local.availability_zone_id_2
  cidr_block           = "10.0.2.0/24"
  vpc_id               = aws_vpc.vpc.id

  tags = {
    Name = "subnet_private_2_${var.app_name}"
  }
}

resource "aws_db_subnet_group" "private_db_subnet_group" {
  name       = "private_db_subnet_group_${var.app_name}"
  subnet_ids = [aws_subnet.subnet_private_1.id, aws_subnet.subnet_private_2.id]

  tags = {
    Name = "private_db_subnet_group"
  }
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "internet_gateway_${var.app_name}"
  }
}

resource "aws_route_table" "route_table_public" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }

  tags = {
    Name = "route_table_public_${var.app_name}"
  }
}

resource "aws_route_table_association" "route_table_association" {
  subnet_id      = aws_subnet.subnet_public.id
  route_table_id = aws_route_table.route_table_public.id
}

resource "aws_route_table_association" "private_route_table_association" {
  subnet_id      = aws_subnet.subnet_private_1.id
  route_table_id = aws_route_table.route_table_public.id
}

resource "aws_security_group" "internal_http" {
  name        = "internal_http_${var.app_name}"
  description = "Allow internal http requests"

  vpc_id = aws_vpc.vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.vpc.cidr_block]
  }

  tags = {
    Name = "internal_http_${var.app_name}"
  }
}

resource "aws_security_group" "internal_postgresql" {
  name        = "internal_postgresql_${var.app_name}"
  description = "Allow internal postgresql requests"

  vpc_id = aws_vpc.vpc.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.vpc.cidr_block]
  }

  tags = {
    Name = "internal_postgresql_${var.app_name}"
  }
}

resource "aws_security_group" "http" {
  name        = "http_${var.app_name}"
  description = "Allow outbound http requests"

  vpc_id = aws_vpc.vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "http_${var.app_name}"
  }
}

resource "aws_security_group" "https" {
  name        = "https_${var.app_name}"
  description = "Allow outbound https requests"

  vpc_id = aws_vpc.vpc.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "http_${var.app_name}"
  }
}

resource "aws_security_group" "ssh" {
  name        = "ssh_${var.app_name}"
  description = "Allow outbound ssh requests"

  vpc_id = aws_vpc.vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ssh_${var.app_name}"
  }
}

resource "aws_security_group" "outbound" {
  name        = "outbound_${var.app_name}"
  description = "Allow all outbound requests"

  vpc_id = aws_vpc.vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "outbound_${var.app_name}"
  }
}

data "aws_route53_zone" "domain" {
  name = "${var.base_domain}."
}

resource "aws_route53_record" "route_record" {
  zone_id = data.aws_route53_zone.domain.zone_id
  name    = "${var.subdomain}.${var.base_domain}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}

output "public_subnet_id" {
  value       = aws_subnet.subnet_public.id
  description = "The public subnet id"
}

output "vpc_public_security_group_ids" {
  value = [
    aws_security_group.http.id,
    aws_security_group.https.id,
    aws_security_group.ssh.id,
    aws_security_group.outbound.id
  ]
  description = "The vpc public security group ids"
}

output "vpc_db_security_group_ids" {
  value       = [aws_security_group.internal_postgresql.id]
  description = "The vpc db security group ids"
}

output "private_db_subnet_group_id" {
  value       = aws_db_subnet_group.private_db_subnet_group.id
  description = "The public subnet id"
}

output "server_port" {
  value       = 80
  description = "The public server port"
}
