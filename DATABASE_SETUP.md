# Gaia Commons API - Database Setup Guide

## Overview

The API now uses **PostgreSQL** for persistent data storage. This guide will help you set up the database.

---

## Prerequisites

- PostgreSQL 14+ installed
- Node.js 18+ installed

---

## Quick Setup

### 1. Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

---

### 2. Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE gaia_commons;

# Create user
CREATE USER gaia_user WITH PASSWORD 'gaia_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE gaia_commons TO gaia_user;

# Exit
\q
```

---

### 3. Run Schema

```bash
# From project root
psql -U gaia_user -d gaia_commons -f schema.sql
```

Or with password prompt:
```bash
psql -U gaia_user -d gaia_commons -W -f schema.sql
```

---

### 4. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

Example `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gaia_commons
DB_USER=gaia_user
DB_PASSWORD=gaia_password
```

---

### 5. Install Dependencies and Run

```bash
# Install dependencies
npm install --no-bin-links --ignore-scripts

# Compile TypeScript
node node_modules/typescript/bin/tsc

# Start server
node dist/index.js
```

---

## Database Schema

### Tables Created (39 total)

#### Core Stats (4 tables)
- `pilot_stats` - Pilot program statistics
- `endowment_stats` - Endowment fund metrics
- `financial_metrics` - Financial performance
- `climate_metrics` - Environmental impact metrics

#### Timeline & Planning (3 tables)
- `timeline_events` - Milestone events
- `implementation_timeline` - Rollout phases
- `political_roadmap` - Political milestones

#### Education (4 tables)
- `school_clusters` - Regional school groups
- `schools` - Individual schools
- `k12_curriculum` - Curriculum modules
- `slides` - Presentation slides

#### Economics (4 tables)
- `scale_projections` - Growth projections
- `historical_financials` - Past financial data
- `endowment_projections` - Endowment forecasts
- `funding_sources` - Funding breakdown

#### Environment (6 tables)
- `environmental_impact` - Impact metrics
- `regenerative_agriculture` - Farming practices
- `tiered_carbon_pricing` - Carbon pricing tiers
- `nationwide_food_security` - Food security data
- `planetary_boundaries` - Planetary health
- `historical_climate_data` - Climate history

#### Employment (3 tables)
- `job_creation` - Direct jobs
- `expanded_jobs` - Indirect jobs
- `labor_transition` - Sector transitions

#### Governance (5 tables)
- `legal_framework` - Legal structure
- `coalition_partners` - Partner organizations
- `tribal_partnerships` - Indigenous partnerships
- `transparency_features` - Transparency tools
- `accountability_mechanisms` - Accountability systems

#### Analysis (8 tables)
- `stress_tests` - Risk scenarios
- `monte_carlo_simulations` - Probability models
- `scenario_comparisons` - Policy scenarios
- `sensitivity_analysis` - Variable sensitivity
- `optimization_params` - Optimization settings
- `calibration_targets` - Performance targets
- `model_maturity` - Model validation
- `mining_alternatives` - Material alternatives

#### Global (2 tables)
- `global_regeneration_summary` - Global impact
- `political_coalition` - Political alignment

---

## Connection Pool Settings

Configure in `.env`:

```
DB_POOL_MAX=20              # Maximum connections
DB_IDLE_TIMEOUT=30000       # Close idle connections after 30s
DB_CONNECTION_TIMEOUT=2000  # Connection timeout 2s
```

---

## Troubleshooting

### Connection Refused
```bash
# Check if PostgreSQL is running
sudo service postgresql status  # Linux
brew services list | grep postgresql  # macOS
```

### Authentication Failed
```bash
# Reset password
sudo -u postgres psql -c "ALTER USER gaia_user WITH PASSWORD 'new_password';"
```

### Permission Denied
```bash
# Grant schema permissions
sudo -u postgres psql -d gaia_commons -c "GRANT ALL ON SCHEMA public TO gaia_user;"
```

### Tables Not Found
```bash
# Re-run schema
psql -U gaia_user -d gaia_commons -f schema.sql
```

---

## Switching Back to In-Memory Storage

If you need to run without PostgreSQL temporarily:

1. Edit `routes.ts`:
```typescript
// Change this:
import { pgStorage as storage } from "./pgStorage";

// To this:
import { storage } from "./storage";
```

2. Comment out database connection test in `index.ts`

---

## Production Considerations

1. **Use strong passwords** for database users
2. **Enable SSL** for database connections
3. **Set up backups** (pg_dump cron job)
4. **Monitor connection pool** usage
5. **Use connection string** instead of individual params:
   ```
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   ```

---

## Migration from In-Memory

The seeding logic in `routes.ts` will automatically populate the database on first run, just like it did with in-memory storage. No manual data migration needed.
