locals {
  s3_origin_id          = "s3-origin-id-${var.environment}"
  api_gateway_origin_id = "api-gateway-origin-id-${var.environment}"
}

resource "aws_s3_bucket" "s3" {
  bucket = "${var.app_name}-s3-bucket-${var.environment}"
  acl    = "public-read"

  # Prevent deletion of this S3 bucket
  lifecycle {
    prevent_destroy = true
  }

  # Enable versioning for state files
  versioning {
    enabled = true
  }
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.s3.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = ["${aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn}"]
    }
  }

  statement {
    actions   = ["s3:ListBucket"]
    resources = ["${aws_s3_bucket.s3.arn}"]

    principals {
      type        = "AWS"
      identifiers = ["${aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn}"]
    }
  }
}

resource "aws_s3_bucket_policy" "example" {
  bucket = aws_s3_bucket.s3.id
  policy = data.aws_iam_policy_document.s3_policy.json
}

resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.s3.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  origin {
    domain_name = trimsuffix(trimprefix(aws_api_gateway_deployment.deployment.invoke_url, "https://"), "/")
    origin_id   = local.api_gateway_origin_id
    origin_path = "/${var.api_gateway_stage_name}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
      origin_protocol_policy = "https-only"
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Some comment"
  default_root_object = "index.html"
  aliases             = ["${var.subdomain}.${var.base_domain}"]

  viewer_certificate {
    acm_certificate_arn = var.domain_certificate_arn
    ssl_support_method  = "sni-only"
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # Cache behavior with precedence 0
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.api_gateway_origin_id

    forwarded_values {
      query_string = true
      headers      = ["Authorization"]

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA", "GB", "DE"]
    }
  }

  tags = {
    Environment = var.environment
  }
}

output "s3_arn" {
  value       = aws_s3_bucket.s3.arn
  description = "The ARN of the S3 bucket"
}

output "s3_bucket_regional_domain_name" {
  value       = aws_s3_bucket.s3.bucket_regional_domain_name
  description = "The Bucket Regional Domain Name of the S3 bucket"
}

output "s3_id" {
  value       = aws_s3_bucket.s3.id
  description = "The id of the S3 bucket"
}

output "cdn_arn" {
  value       = aws_cloudfront_distribution.cdn.arn
  description = "The ARN of the cdn"
}

output "cdn_domain_name" {
  value       = aws_cloudfront_distribution.cdn.domain_name
  description = "The domain name of the cdn"
}

output "cdn_hosted_zone_id" {
  value       = aws_cloudfront_distribution.cdn.hosted_zone_id
  description = "The hosted zone id of the cdn"
}
