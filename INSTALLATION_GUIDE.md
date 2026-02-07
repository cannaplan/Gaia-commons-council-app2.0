# Gaia Commons Council App 2.0 - Quick Installation Guide

## What You Need

To run this application, you need:

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **PostgreSQL 14+** - [Download here](https://www.postgresql.org/download/)
3. **npm** (comes with Node.js)

## Installation (5 Minutes)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up PostgreSQL Database

```bash
# Login to PostgreSQL
sudo -u postgres psql

# Run these commands:
CREATE DATABASE gaia_commons;
CREATE USER gaia_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE gaia_commons TO gaia_user;
\q
```

### Step 3: Load Database Schema

```bash
psql -U gaia_user -d gaia_commons -f schema.sql
```

### Step 4: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and set your database password
nano .env
```

### Step 5: Build and Run

```bash
npm run build
npm start
```

The server will start at **http://localhost:3000**

## Verify Installation

Test the health endpoint:

```bash
curl http://localhost:3000/api/health
```

You should see:

```json
{
  "status": "healthy",
  "timestamp": "2026-02-04T...",
  "database": "connected"
}
```

## Troubleshooting

**Database connection failed?**

- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify credentials in `.env` match your database user/password

**Port 3000 already in use?**

- Change `PORT=3001` in `.env`

**Build errors?**

- Ensure Node.js 18+: `node --version`
- Delete `node_modules` and `package-lock.json`, then `npm install` again

## Next Steps

- Read **REQUIREMENTS.md** for comprehensive documentation
- Read **README.md** for API endpoint reference
- Read **DATABASE_SETUP.md** for advanced database configuration
- Explore the 40 API endpoints listed in README.md

## API Endpoints

Once running, try these endpoints:

```bash
# Core stats
curl http://localhost:3000/api/pilot
curl http://localhost:3000/api/endowment
curl http://localhost:3000/api/financials
curl http://localhost:3000/api/climate

# Education
curl http://localhost:3000/api/schools
curl http://localhost:3000/api/school-clusters

# Environment
curl http://localhost:3000/api/environmental-impact
curl http://localhost:3000/api/regenerative-agriculture

# ...and 32 more endpoints!
```

See README.md for the complete list of 40 endpoints.

---

**Need help?** Check REQUIREMENTS.md for detailed troubleshooting guide.
