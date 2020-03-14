terraform {
  required_version = ">= 0.12.0"
}

provider "aws" {
  region  = "eu-central-1"
  version = ">= 2.52.0"
}

resource "aws_s3_bucket" "terraform_state" {
  # Set up a unique name
  bucket = "ae-firestarter-demo-terraform-state-store"

  # Prevent deletion of this S3 bucket
  lifecycle {
    prevent_destroy = true
  }

  # Enable versioning for state files
  versioning {
    enabled = true
  }

  # Enable server-side encryption by default
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "ae-firestarter-demo-terraform-state-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
