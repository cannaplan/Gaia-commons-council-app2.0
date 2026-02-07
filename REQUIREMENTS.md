# Gaia Commons Council App 2.0 - Requirements

This document outlines everything the Gaia Commons Council App 2.0 needs to function properly.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Software Dependencies](#software-dependencies)
3. [Database Requirements](#database-requirements)
4. [Environment Configuration](#environment-configuration)
5. [Installation Steps](#installation-steps)
6. [Build & Run](#build--run)
7. [Deployment Requirements](#deployment-requirements)
8. [Network & Security](#network--security)

---

## System Requirements

### Hardware (Minimum)

- **CPU**: 2+ cores
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 500MB for application + database storage
- **Network**: Internet connection for package installation

### Operating Systems Supported

- **Linux**: Ubuntu 20.04+, Debian 11+, RHEL 8+, CentOS 8+
- **macOS**: 11 (Big Sur) or later
- **Windows**: 10/11 with WSL2 for best compatibility

---

## Software Dependencies

### Runtime Requirements

#### 1. Node.js

- **Version**: 18.0.0 or higher (LTS recommended)
- **Why**: Application runtime for the Express.js server
- **Install**:

  ```bash
  # macOS (Homebrew)
  brew install node@18

  # Ubuntu/Debian
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs

  # Windows
  # Download from https://nodejs.org/
  ```

#### 2. PostgreSQL

- **Version**: 14.0 or higher
- **Why**: Primary database for persistent data storage (39 tables)
- **Install**:

  ```bash
  # macOS (Homebrew)
  brew install postgresql@14
  brew services start postgresql@14

  # Ubuntu/Debian
  sudo apt-get update
  sudo apt-get install postgresql-14 postgresql-contrib-14
  sudo systemctl start postgresql

  # Windows
  # Download from https://www.postgresql.org/download/windows/
  ```

#### 3. npm

- **Version**: 8.0+ (usually bundled with Node.js)
- **Why**: Package manager for installing JavaScript dependencies
- **Verify**: `npm --version`

### Build-Time Dependencies

#### TypeScript Compiler

- **Version**: 5.7.3 (installed via npm)
- **Why**: Compiles TypeScript source files to JavaScript
- **Auto-installed**: Yes, via `npm install`

---

## Database Requirements

### PostgreSQL Database Setup

#### 1. Create Database

```sql
CREATE DATABASE gaia_commons;
```

#### 2. Create Database User

```sql
CREATE USER gaia_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE gaia_commons TO gaia_user;
```

#### 3. Load Database Schema

```bash
psql -U gaia_user -d gaia_commons -f schema.sql
```

This creates **39 tables** across 8 categories:

- Core Stats (4 tables)
- Timeline & Planning (3 tables)
- Education (4 tables)
- Economics (4 tables)
- Environment (6 tables)
- Employment (3 tables)
- Governance (5 tables)
- Analysis & Modeling (8 tables)
- Global Metrics (2 tables)

#### 4. Database Storage

- **Estimated Size**: ~100MB for full seed data
- **Growth**: ~10MB per 1,000 schools added

---

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the project root with these variables:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (REQUIRED)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gaia_commons
DB_USER=gaia_user
DB_PASSWORD=your_secure_password

# Connection Pool Settings (OPTIONAL - defaults shown)
DB_POOL_MAX=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000

# API Configuration (OPTIONAL - defaults shown)
API_RATE_LIMIT=100
API_RATE_WINDOW=900000

# Security (OPTIONAL - defaults shown)
CORS_ORIGIN=*
```

### Configuration Notes

| Variable                | Required | Description             | Default         |
| ----------------------- | -------- | ----------------------- | --------------- |
| `PORT`                  | No       | Server port             | 3000            |
| `NODE_ENV`              | No       | Environment mode        | development     |
| `DB_HOST`               | **Yes**  | PostgreSQL host         | localhost       |
| `DB_PORT`               | No       | PostgreSQL port         | 5432            |
| `DB_NAME`               | **Yes**  | Database name           | gaia_commons    |
| `DB_USER`               | **Yes**  | Database username       | gaia_user       |
| `DB_PASSWORD`           | **Yes**  | Database password       | -               |
| `DB_POOL_MAX`           | No       | Max DB connections      | 20              |
| `DB_IDLE_TIMEOUT`       | No       | Idle timeout (ms)       | 30000           |
| `DB_CONNECTION_TIMEOUT` | No       | Connection timeout (ms) | 2000            |
| `API_RATE_LIMIT`        | No       | Requests per window     | 100             |
| `API_RATE_WINDOW`       | No       | Rate limit window (ms)  | 900000 (15 min) |
| `CORS_ORIGIN`           | No       | CORS allowed origins    | \* (all)        |

---

## Installation Steps

### Quick Start (Development)

```bash
# 1. Clone the repository
git clone https://github.com/cannaplan/Gaia-commons-council-app2.0.git
cd Gaia-commons-council-app2.0

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# 4. Set up PostgreSQL database
sudo -u postgres psql -c "CREATE DATABASE gaia_commons;"
sudo -u postgres psql -c "CREATE USER gaia_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE gaia_commons TO gaia_user;"

# 5. Load database schema
psql -U gaia_user -d gaia_commons -f schema.sql

# 6. Build the application
npm run build

# 7. Start the server
npm start
```

### Verification

After starting the server, verify it's working:

```bash
# Health check
curl http://localhost:3000/api/health

# Should return:
# {"status":"healthy","timestamp":"2026-02-04T...","database":"connected"}
```

---

## Build & Run

### NPM Scripts

| Command             | Purpose                     | When to Use                        |
| ------------------- | --------------------------- | ---------------------------------- |
| `npm install`       | Install dependencies        | First setup, after pulling updates |
| `npm run build`     | Compile TypeScript          | Before running, after code changes |
| `npm start`         | Run server                  | Production mode                    |
| `npm run dev`       | Build + Run                 | Development mode                   |
| `npm run typecheck` | Type check without building | Verify types before commit         |

### Development Workflow

```bash
# Make code changes
vim index.ts

# Type check
npm run typecheck

# Build and run
npm run dev

# Server starts at http://localhost:3000
```

### Production Build

```bash
# Build optimized production bundle
NODE_ENV=production npm run build

# Run in production
NODE_ENV=production npm start
```

---

## Deployment Requirements

### Cloud Platform Options

#### Option 1: Railway (Recommended)

```bash
npm install -g @railway/cli
railway login
railway init
railway add --database postgres
railway up
```

**Requirements**: Railway account, Railway CLI

#### Option 2: Render

1. Connect GitHub repository
2. Add PostgreSQL database service
3. Configure environment variables
4. Deploy automatically
   **Requirements**: Render account, GitHub integration

#### Option 3: Docker

```bash
# Build Docker image
docker build -t gaia-commons-api .

# Run with environment file
docker run -p 3000:3000 --env-file .env gaia-commons-api
```

**Requirements**: Docker 20.10+, Dockerfile (not included, needs creation)

#### Option 4: Traditional Server

- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+ installed
- PostgreSQL 14+ installed
- Nginx/Apache for reverse proxy (recommended)
- SSL certificate for HTTPS (recommended)
- Process manager (PM2 recommended):
  ```bash
  npm install -g pm2
  pm2 start dist/index.js --name gaia-api
  pm2 save
  pm2 startup
  ```

---

## Network & Security

### Firewall Configuration

**Inbound Rules Required**:

- Port 3000 (API server) - or configured PORT
- Port 5432 (PostgreSQL) - only if database is remote

**Outbound Rules Required**:

- Port 443 (HTTPS) - for npm package downloads
- Port 80 (HTTP) - for npm package downloads

### Security Checklist

- [ ] Use strong database passwords (16+ characters)
- [ ] Enable PostgreSQL SSL connections in production
- [ ] Restrict CORS origins in production (change from `*`)
- [ ] Use environment variables, never commit `.env`
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Set up database backups (pg_dump cron job)
- [ ] Monitor connection pool usage
- [ ] Configure rate limiting appropriately
- [ ] Use a firewall (ufw, iptables, cloud provider firewall)
- [ ] Keep Node.js and PostgreSQL updated
- [ ] Regular security audits: `npm audit`

### API Security Features

Built-in security features:

- **Helmet.js**: Security headers (XSS, clickjacking protection)
- **CORS**: Cross-origin request control
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Body Size Limits**: 10MB maximum request body
- **Input Validation**: Type-safe with TypeScript

---

## Dependencies Summary

### Runtime Dependencies (Production)

```json
{
  "express": "4.22.1", // Web framework
  "cors": "2.8.6", // CORS middleware
  "helmet": "7.2.0", // Security headers
  "morgan": "1.10.1", // HTTP request logger
  "dotenv": "16.6.1", // Environment variables
  "pg": "8.18.0", // PostgreSQL client
  "express-rate-limit": "7.5.1" // Rate limiting
}
```

### Development Dependencies

```json
{
  "@types/express": "4.17.25", // TypeScript types
  "@types/cors": "2.8.17", // TypeScript types
  "@types/morgan": "1.9.9", // TypeScript types
  "@types/node": "20.19.31", // TypeScript types
  "@types/pg": "8.11.0", // TypeScript types
  "@types/jest": "30.0.0", // TypeScript types for Jest
  "@types/supertest": "6.0.3", // TypeScript types for Supertest
  "jest": "30.2.0", // Testing framework
  "supertest": "7.2.2", // HTTP testing
  "ts-jest": "29.4.6", // Jest TypeScript preprocessor
  "typescript": "5.7.3" // TypeScript compiler
}
```

**Total Package Count**: ~110 packages (including transitive dependencies)

---

## Quick Reference Card

### Minimum Requirements to Function

✅ **Must Have**:

1. Node.js 18+ installed
2. PostgreSQL 14+ installed and running
3. Database `gaia_commons` created
4. Database user `gaia_user` with access
5. `schema.sql` loaded into database
6. `.env` file configured with database credentials
7. Dependencies installed: `npm install`
8. Application built: `npm run build`

✅ **Must Configure**:

- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` in `.env`

✅ **Then Run**:

```bash
npm start
```

### Verification Endpoints

Once running, these should work:

- `GET http://localhost:3000/api/health` - Health check
- `GET http://localhost:3000/api/pilot` - Pilot program stats
- `GET http://localhost:3000/api/schools` - List of schools

---

## Troubleshooting

### Common Issues

**Issue**: "Cannot start server without database connection"

- **Solution**: Verify PostgreSQL is running and credentials in `.env` are correct

**Issue**: "npm install fails"

- **Solution**: Ensure Node.js 18+ is installed: `node --version`

**Issue**: "Port 3000 already in use"

- **Solution**: Change PORT in `.env` or kill process using port 3000

**Issue**: "Tables not found"

- **Solution**: Run `psql -U gaia_user -d gaia_commons -f schema.sql`

**Issue**: "Type errors during build"

- **Solution**: Ensure TypeScript 5.3+ is installed: `npm install typescript@latest`

---

## Additional Resources

- **README.md**: Project overview and quick start
- **DATABASE_SETUP.md**: Detailed database setup guide
- **HANDOFF.md**: Project handoff documentation
- **API Documentation**: See README.md for all 40 endpoints
- **GitHub**: https://github.com/cannaplan/Gaia-commons-council-app2.0

---

**Last Updated**: 2026-02-04  
**Version**: 5.0.0  
**Dependencies Last Updated**: 2026-02-04
