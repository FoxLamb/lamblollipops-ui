# Outputs for LambLollipops UI Infrastructure

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.frontend.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "s3_bucket_name" {
  description = "S3 bucket name for frontend"
  value       = aws_s3_bucket.frontend.id
}

output "certificate_arn" {
  description = "ACM certificate ARN"
  value       = aws_acm_certificate.frontend.arn
}

output "domain_url" {
  description = "Live site URL"
  value       = "https://${var.domain_name}"
}

output "github_actions_role_arn" {
  description = "IAM role ARN for GitHub Actions (set as AWS_ROLE_ARN secret)"
  value       = aws_iam_role.github_actions.arn
}
