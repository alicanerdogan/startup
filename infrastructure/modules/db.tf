locals {
  db_port = 5432
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
  vpc_security_group_ids = [aws_security_group.internal_postgresql.id]
  db_subnet_group_name   = aws_db_subnet_group.private_db_subnet_group.id
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
