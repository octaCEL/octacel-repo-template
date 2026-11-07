terraform {
  required_version = "= 1.16.6"
}

variable "service_name" {
  type        = string
  description = "Name used by downstream infrastructure modules."
  default     = "example-service"
}

output "service_name" {
  value = var.service_name
}
