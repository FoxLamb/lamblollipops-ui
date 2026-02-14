# Variables for LambLollipops UI Infrastructure

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "lamblollipops-ui"
}

variable "owner" {
  description = "Owner of the infrastructure"
  type        = string
  default     = "rondo"
}

variable "domain_name" {
  description = "Domain name for the site"
  type        = string
  default     = "lamblollipops.com"
}

variable "github_repo" {
  description = "GitHub repository (org/repo)"
  type        = string
  default     = "FoxLamb/lamblollipops-ui"
}
