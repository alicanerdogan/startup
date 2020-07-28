resource "aws_api_gateway_account" "account" {
  cloudwatch_role_arn = aws_iam_role.cloudwatch.arn
}

resource "aws_iam_role" "cloudwatch" {
  name = "${var.api_name}_gateway_cloudwatch_global"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "cloudwatch" {
  name = "${var.api_name}_cloudwatch_policy"
  role = aws_iam_role.cloudwatch.id

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams",
                "logs:PutLogEvents",
                "logs:GetLogEvents",
                "logs:FilterLogEvents"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}


resource "aws_api_gateway_rest_api" "api" {
  depends_on         = [aws_api_gateway_account.account]
  name               = var.api_name
  description        = "Proxy to handle requests to our API"
  binary_media_types = ["multipart/form-data", "image/png", "image/jpeg"]
}

resource "aws_api_gateway_resource" "resource" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.resource.id
  http_method   = "ANY"
  authorization = "NONE"
  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.resource.id
  http_method             = aws_api_gateway_method.method.http_method
  integration_http_method = "ANY"
  type                    = "HTTP_PROXY"
  uri                     = "http://${aws_eip.server_eip.public_ip}/{proxy}"

  request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }
}

resource "aws_api_gateway_method_settings" "settings" {
  depends_on  = [aws_api_gateway_stage.active_stage]
  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = var.api_gateway_stage_name
  method_path = "*/*"

  settings {
    metrics_enabled = false
    logging_level   = "INFO"
  }
}

resource "aws_api_gateway_deployment" "stage_deployment" {
  # This should also depend on the other components like aws_api_gateway_rest_api
  # to trigger deployment whenever any of the things that result in a different
  # behavior of the api gw. Otherwise, deployment will stay the same and the changes
  # will not be active.
  depends_on  = [aws_api_gateway_integration.integration, aws_api_gateway_rest_api.api]
  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = ""
}

resource "aws_api_gateway_stage" "active_stage" {
  depends_on    = [aws_cloudwatch_log_group.log_group]
  stage_name    = var.api_gateway_stage_name
  rest_api_id   = aws_api_gateway_rest_api.api.id
  deployment_id = aws_api_gateway_deployment.stage_deployment.id

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.log_group.arn

    format = jsonencode(
      {
        caller         = "$context.identity.caller"
        httpMethod     = "$context.httpMethod"
        ip             = "$context.identity.sourceIp"
        protocol       = "$context.protocol"
        requestId      = "$context.requestId"
        requestTime    = "$context.requestTime"
        resourcePath   = "$context.resourcePath"
        responseLength = "$context.responseLength"
        status         = "$context.status"
    })
  }
}

resource "aws_cloudwatch_log_group" "log_group" {
  name              = "API-Gateway-Execution-Logs_${aws_api_gateway_rest_api.api.id}/${var.api_gateway_stage_name}"
  retention_in_days = 7
}

output "api_gateway_invoke_url" {
  value = aws_api_gateway_deployment.stage_deployment.invoke_url
}

output "api_gateway_stage_invoke_url" {
  value = aws_api_gateway_stage.active_stage.invoke_url
}

output "api_gateway_stage_name" {
  value = var.api_gateway_stage_name
}
