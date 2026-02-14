# LambLollipops UI

Retro 90s vaporwave website for [lamblollipops.com](https://lamblollipops.com).

## Development

```bash
npm install
npm run dev    # http://localhost:3002
npm run build  # Production build
```

## Deployment

### First-time setup

1. Apply Terraform to create AWS infrastructure:
   ```bash
   cd terraform
   terraform init
   terraform apply
   ```

2. Note the outputs — set these in the GitHub repo:
   - **Secret** `AWS_ROLE_ARN` = the `github_actions_role_arn` output
   - **Variable** `S3_BUCKET` = the `s3_bucket_name` output
   - **Variable** `CLOUDFRONT_DISTRIBUTION_ID` = the `cloudfront_distribution_id` output

3. Push to `main` — GitHub Actions handles the rest.

### How it works

- Push to `main` (src/public changes) → builds with Vite → syncs to S3 → invalidates CloudFront
- Push to `main` (terraform changes) → applies Terraform infrastructure changes
- Authentication via GitHub OIDC (no stored AWS keys)

## Music

The Vibe Zone section embeds a YouTube vaporwave radio stream. No local audio files are used.
