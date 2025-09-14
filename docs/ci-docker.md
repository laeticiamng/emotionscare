# CI Security & Docker

The pipeline runs secret and vulnerability scans and produces a Docker image for the API.

## Security Scans
- **Gitleaks** detects committed secrets during the `quality-check` job.
- **CodeQL** analyzes the codebase on each push and on a weekly schedule to surface vulnerabilities.

## Docker Image
- The `docker-build` job builds `services/api/Dockerfile` with Node 20 and uploads the image as an artifact.

### Local build
```bash
docker build -t emotionscare-api -f services/api/Dockerfile .
```
