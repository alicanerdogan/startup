resource "aws_key_pair" "server_key_pair" {
  key_name   = "server_key_pair_${var.app_name}"
  public_key = var.public_ssh_key
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
  depends_on           = [aws_codedeploy_deployment_group.deployment_group]
  ami                  = "ami-0df0e7600ad0913a9"
  iam_instance_profile = aws_iam_instance_profile.iam_instance_profile.name
  instance_type        = var.instance_type
  key_name             = aws_key_pair.server_key_pair.key_name
  private_ip           = var.private_ip
  subnet_id            = aws_subnet.subnet_public.id
  vpc_security_group_ids = [
    aws_security_group.http.id,
    aws_security_group.ssh.id,
    aws_security_group.outbound.id
  ]

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

resource "aws_iam_role_policy" "ec2_logs_policy" {
  name = "ec2_logs_${var.app_name}"
  role = aws_iam_role.ec2_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams"
    ],
    "Resource": [
      "*"
    ]
  }
 ]
}
EOF
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
  deployment_group_name = "deployment_group_${var.app_name}"
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
