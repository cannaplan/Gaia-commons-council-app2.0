# Deployment Guide

This guide covers deploying the Gaia Commons API to various environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Local Deployment](#local-deployment)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Cloud Deployments](#cloud-deployments)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **OS**: Linux, macOS, or Windows with WSL2
- **CPU**: 2+ cores recommended
- **RAM**: 4GB minimum, 8GB recommended
- **Disk**: 10GB free space

### Software Requirements

- **Node.js**: 18.x or higher
- **PostgreSQL**: 14.x or higher
- **Docker**: 20.10+ (for containerized deployment)
- **kubectl**: 1.24+ (for Kubernetes deployment)

## Environment Configuration

### Environment Variables

Create environment-specific configuration files:

#### `.env.development`

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gaia_commons_dev
DB_USER=gaia_user
DB_PASSWORD=gaia_dev_password

# Connection Pool
DB_POOL_MAX=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000
DB_QUERY_TIMEOUT=30000

# Request Settings
REQUEST_TIMEOUT=30000

# API
API_RATE_LIMIT=100
API_RATE_WINDOW=900000

# Security
CORS_ORIGIN=*
```

#### `.env.production`

```bash
# Server
PORT=3000
NODE_ENV=production

# Database (use secrets management in production)
DB_HOST=your-production-db.example.com
DB_PORT=5432
DB_NAME=gaia_commons_prod
DB_USER=gaia_prod_user
DB_PASSWORD=${DB_PASSWORD_SECRET}

# Connection Pool
DB_POOL_MAX=50
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=5000
DB_QUERY_TIMEOUT=60000

# Request Settings
REQUEST_TIMEOUT=60000

# API
API_RATE_LIMIT=100
API_RATE_WINDOW=900000

# Security
CORS_ORIGIN=https://your-domain.com,https://www.your-domain.com
```

### Secrets Management

**Never commit secrets to version control!**

Production options:

1. **Environment Variables**: Set directly in hosting platform
2. **Kubernetes Secrets**: Store in k8s secrets
3. **AWS Secrets Manager**: For AWS deployments
4. **HashiCorp Vault**: For enterprise deployments
5. **Azure Key Vault**: For Azure deployments

## Local Deployment

### 1. Install Dependencies

```bash
npm ci
```

### 2. Set Up Database

```bash
# Start PostgreSQL (if using Docker)
docker run -d \
  --name gaia-postgres \
  -e POSTGRES_DB=gaia_commons_dev \
  -e POSTGRES_USER=gaia_user \
  -e POSTGRES_PASSWORD=gaia_dev_password \
  -p 5432:5432 \
  postgres:14

# Apply schema
psql -U gaia_user -d gaia_commons_dev -f schema.sql
```

### 3. Build Application

```bash
npm run build
```

### 4. Start Server

```bash
# Development mode (with auto-rebuild)
npm run dev

# Production mode
npm start
```

### 5. Verify Deployment

```bash
# Health check
curl http://localhost:3000/api/health

# Metrics
curl http://localhost:3000/api/metrics

# API docs
open http://localhost:3000/api-docs
```

## Docker Deployment

### Using Docker Compose (Recommended)

#### 1. Build and Start

```bash
docker compose up -d
```

#### 2. View Logs

```bash
docker compose logs -f app
```

#### 3. Stop Services

```bash
docker compose down
```

### Manual Docker Deployment

#### 1. Build Image

```bash
docker build -t gaia-commons-api:latest .
```

#### 2. Run Container

```bash
docker run -d \
  --name gaia-api \
  -p 3000:3000 \
  -e DB_HOST=your-db-host \
  -e DB_PORT=5432 \
  -e DB_NAME=gaia_commons \
  -e DB_USER=gaia_user \
  -e DB_PASSWORD=your-password \
  gaia-commons-api:latest
```

#### 3. Health Check

```bash
docker exec gaia-api curl http://localhost:3000/api/health
```

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (1.24+)
- `kubectl` configured
- Container registry access

### 1. Build and Push Image

```bash
# Build
docker build -t your-registry/gaia-commons-api:v5.0.0 .

# Push
docker push your-registry/gaia-commons-api:v5.0.0
```

### 2. Create Namespace

```bash
kubectl create namespace gaia-commons
```

### 3. Create Secrets

```bash
kubectl create secret generic gaia-db-secret \
  --from-literal=DB_PASSWORD=your-secure-password \
  --namespace=gaia-commons
```

### 4. Apply Manifests

```bash
# ConfigMap
kubectl apply -f k8s/configmap.yaml

# Deployment
kubectl apply -f k8s/deployment.yaml

# Service
kubectl apply -f k8s/service.yaml

# Ingress (optional)
kubectl apply -f k8s/ingress.yaml
```

### 5. Verify Deployment

```bash
# Check pods
kubectl get pods -n gaia-commons

# Check logs
kubectl logs -f deployment/gaia-commons-api -n gaia-commons

# Check service
kubectl get svc -n gaia-commons

# Port forward for testing
kubectl port-forward svc/gaia-commons-api 3000:3000 -n gaia-commons
```

### 6. Scale Deployment

```bash
# Scale to 3 replicas
kubectl scale deployment gaia-commons-api --replicas=3 -n gaia-commons

# Auto-scaling
kubectl autoscale deployment gaia-commons-api \
  --min=2 --max=10 --cpu-percent=70 \
  -n gaia-commons
```

## Cloud Deployments

### AWS Elastic Beanstalk

#### 1. Install EB CLI

```bash
pip install awsebcli
```

#### 2. Initialize

```bash
eb init -p node.js gaia-commons-api
```

#### 3. Create Environment

```bash
eb create gaia-commons-prod \
  --database.engine postgres \
  --database.size 10 \
  --envvars NODE_ENV=production
```

#### 4. Deploy

```bash
eb deploy
```

### Google Cloud Run

#### 1. Build Image

```bash
gcloud builds submit --tag gcr.io/your-project/gaia-commons-api
```

#### 2. Deploy

```bash
gcloud run deploy gaia-commons-api \
  --image gcr.io/your-project/gaia-commons-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,DB_HOST=...
```

### Azure Container Instances

#### 1. Create Resource Group

```bash
az group create --name gaia-commons-rg --location eastus
```

#### 2. Deploy Container

```bash
az container create \
  --resource-group gaia-commons-rg \
  --name gaia-commons-api \
  --image your-registry/gaia-commons-api:latest \
  --dns-name-label gaia-commons \
  --ports 3000 \
  --environment-variables NODE_ENV=production
```

### Heroku

#### 1. Create App

```bash
heroku create gaia-commons-api
```

#### 2. Add PostgreSQL

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

#### 3. Deploy

```bash
git push heroku main
```

## Monitoring & Maintenance

### Health Monitoring

Set up health check monitoring:

```bash
# Readiness probe (Kubernetes)
kubectl describe pod <pod-name> -n gaia-commons | grep Readiness

# External monitoring
curl -f http://your-domain.com/api/ready || exit 1
```

### Log Aggregation

#### Docker Logs

```bash
docker logs -f --tail 100 gaia-api
```

#### Kubernetes Logs

```bash
kubectl logs -f deployment/gaia-commons-api -n gaia-commons
```

#### Centralized Logging

Consider integrating:

- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Grafana Loki**
- **AWS CloudWatch**
- **Google Cloud Logging**
- **Azure Monitor**

### Metrics Collection

Use `/api/metrics` endpoint with:

- **Prometheus**
- **Datadog**
- **New Relic**
- **Grafana**

Example Prometheus configuration:

```yaml
scrape_configs:
  - job_name: 'gaia-commons-api'
    static_configs:
      - targets: ['gaia-commons-api:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 30s
```

### Database Maintenance

#### Backup Strategy

```bash
# Daily backup
pg_dump -U gaia_user -d gaia_commons_prod > backup_$(date +%Y%m%d).sql

# Automated backup (cron)
0 2 * * * pg_dump -U gaia_user gaia_commons_prod | gzip > /backups/gaia_$(date +\%Y\%m\%d).sql.gz
```

#### Restore from Backup

```bash
psql -U gaia_user -d gaia_commons_prod < backup_20260212.sql
```

### Application Updates

#### Rolling Update (Kubernetes)

```bash
# Update image
kubectl set image deployment/gaia-commons-api \
  app=your-registry/gaia-commons-api:v5.1.0 \
  -n gaia-commons

# Check rollout status
kubectl rollout status deployment/gaia-commons-api -n gaia-commons

# Rollback if needed
kubectl rollout undo deployment/gaia-commons-api -n gaia-commons
```

#### Zero-Downtime Update

1. Start new version alongside old
2. Route 10% traffic to new version
3. Monitor metrics
4. Gradually increase to 100%
5. Shut down old version

## Troubleshooting

### Common Issues

#### Database Connection Fails

**Symptoms**: "Database connection failed" error

**Solutions**:

```bash
# Check database is running
pg_isready -h localhost -p 5432

# Check credentials
psql -U gaia_user -d gaia_commons -c "SELECT 1"

# Check network connectivity
nc -zv db-host 5432

# Check environment variables
env | grep DB_
```

#### Port Already in Use

**Symptoms**: "EADDRINUSE :::3000"

**Solutions**:

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Use different port
PORT=3001 npm start
```

#### High Memory Usage

**Symptoms**: Container OOM killed

**Solutions**:

```bash
# Increase memory limit (Docker)
docker run -m 2g gaia-commons-api

# Increase memory limit (Kubernetes)
kubectl set resources deployment gaia-commons-api \
  --limits=memory=2Gi --requests=memory=1Gi \
  -n gaia-commons

# Check memory usage
curl http://localhost:3000/api/metrics
```

#### Slow Response Times

**Symptoms**: Requests taking >1s

**Solutions**:

```bash
# Check database pool
curl http://localhost:3000/api/metrics | jq '.database.pool'

# Increase pool size
DB_POOL_MAX=50 npm start

# Check slow queries
tail -f logs/app.log | grep "Slow query"

# Add database indexes (see schema.sql)
```

### Health Check Failures

#### Readiness Probe Failing

```bash
# Check readiness endpoint
curl -v http://localhost:3000/api/ready

# Check database connection
psql -U gaia_user -d gaia_commons -c "SELECT 1"

# Increase timeout in k8s manifest
readinessProbe:
  timeoutSeconds: 5
  periodSeconds: 10
```

#### Liveness Probe Failing

```bash
# Check liveness endpoint
curl -v http://localhost:3000/api/live

# Check application logs
kubectl logs -f pod/<pod-name> -n gaia-commons

# Restart pod
kubectl delete pod <pod-name> -n gaia-commons
```

## Security Checklist

Before deploying to production:

- [ ] Use HTTPS/TLS
- [ ] Set strong database passwords
- [ ] Configure CORS appropriately
- [ ] Enable rate limiting
- [ ] Set up security headers (Helmet)
- [ ] Review and restrict network access
- [ ] Enable audit logging
- [ ] Set up monitoring alerts
- [ ] Regular security updates
- [ ] Database connection encryption

## Performance Optimization

### Application Level

```bash
# Increase connection pool
DB_POOL_MAX=50

# Adjust timeouts
REQUEST_TIMEOUT=60000
DB_QUERY_TIMEOUT=30000
```

### Database Level

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_pilot_stats_id ON pilot_stats(id);

-- Analyze tables regularly
ANALYZE pilot_stats;

-- Vacuum to reclaim space
VACUUM ANALYZE;
```

### Caching

Consider adding Redis for caching:

```bash
# Install Redis
docker run -d --name redis -p 6379:6379 redis:7

# Update code to use Redis
# (Future enhancement)
```

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [SECURITY.md](SECURITY.md) - Security best practices
- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Database configuration
- [README.md](README.md) - Getting started guide
