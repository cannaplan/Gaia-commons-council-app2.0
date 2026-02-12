# 🌿 Gaia Commons API v5.0

Transforming education through regenerative agriculture.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-blue)](https://www.postgresql.org/)
[![CI Status](https://img.shields.io/github/actions/workflow/status/cannaplan/Gaia-commons-council-app2.0/ci.yml?branch=main&label=CI)](https://github.com/cannaplan/Gaia-commons-council-app2.0/actions)
[![Security Scan](https://img.shields.io/github/actions/workflow/status/cannaplan/Gaia-commons-council-app2.0/security.yml?branch=main&label=Security)](https://github.com/cannaplan/Gaia-commons-council-app2.0/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Overview

The Gaia Commons API powers a revolutionary initiative to transform education through school-based regenerative agriculture. The platform manages:

- 🏫 **6 pilot schools** → **10,000 schools by 2030**
- 💰 **$5B endowment** generating $225M annually
- 🌱 **12,500 tons** carbon sequestered per year
- 👨‍🌾 **68+ direct jobs** created
- 📚 **K-12 curriculum** integrated with hands-on learning

## Features

- ⚡ **40+ REST API endpoints** for complete data access
- 🗄️ **PostgreSQL database** with 39 tables
- 🔐 **Security hardened** with Helmet, CORS, and rate limiting
- 📊 **Comprehensive seed data** for development
- 🐳 **Docker support** for easy deployment
- 📚 **Interactive API documentation** with Swagger UI
- 🧪 **Comprehensive test suite** with integration, security, and performance tests
- ✨ **Code quality tools** (ESLint, Prettier, TypeScript strict mode)
- 🔄 **CI/CD pipeline** with automated testing and security scanning
- 📈 **Monitoring endpoints** for health checks and metrics
- 🚀 **Production ready** with graceful shutdown and error handling

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/gaia-commons-api.git
cd gaia-commons-api
npm install
```

### 2. Set Up Database

```bash
# Create database and user
sudo -u postgres psql -c "CREATE DATABASE gaia_commons;"
sudo -u postgres psql -c "CREATE USER gaia_user WITH PASSWORD 'gaia_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE gaia_commons TO gaia_user;"

# Run schema
psql -U gaia_user -d gaia_commons -f schema.sql
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Build and Run

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Server starts at `http://localhost:3000`

## Quick verification (local)

Start the stack with Docker Compose and verify the health endpoint:

```bash
# Start app + postgres
docker compose up

# In another terminal (wait a few seconds for server to start):
curl http://localhost:3000/api/health
```

Run the smoke test locally (requires build step):

```bash
npm install
npm run build
# start server in background (or in a separate terminal)
node ./dist/index.js &
# run tests
npm test
```

## API Endpoints

### Core Stats

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| GET    | `/api/health`     | Health check        |
| GET    | `/api/pilot`      | Pilot program stats |
| GET    | `/api/endowment`  | Endowment metrics   |
| GET    | `/api/financials` | Financial metrics   |
| GET    | `/api/climate`    | Climate metrics     |

### Education

| Method | Endpoint               | Description        |
| ------ | ---------------------- | ------------------ |
| GET    | `/api/schools`         | All schools        |
| GET    | `/api/school-clusters` | School clusters    |
| GET    | `/api/k12-curriculum`  | Curriculum modules |
| GET    | `/api/slides`          | Slide deck data    |

### Economics

| Method | Endpoint                     | Description         |
| ------ | ---------------------------- | ------------------- |
| GET    | `/api/scale-projections`     | Growth projections  |
| GET    | `/api/funding-sources`       | Funding breakdown   |
| GET    | `/api/endowment-projections` | Endowment forecasts |

### Environment

| Method | Endpoint                        | Description       |
| ------ | ------------------------------- | ----------------- |
| GET    | `/api/environmental-impact`     | Impact metrics    |
| GET    | `/api/regenerative-agriculture` | Farming practices |
| GET    | `/api/planetary-boundaries`     | Planetary health  |

**...and 25+ more endpoints!**

See [API Documentation](#) for complete reference.

## Project Structure

```
gaia-commons-api/
├── index.ts              # Server entry point
├── routes.ts             # API routes (40 endpoints)
├── storage.ts            # TypeScript interfaces + in-memory storage
├── pgStorage.ts          # PostgreSQL storage implementation
├── db.ts                 # Database connection pool
├── schema.sql            # PostgreSQL schema (39 tables)
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
├── DATABASE_SETUP.md     # Database setup guide
└── README.md             # This file
```

## Database Schema

The API uses **39 PostgreSQL tables**:

- **Core Stats**: pilot_stats, endowment_stats, financial_metrics, climate_metrics
- **Timeline**: timeline_events, implementation_timeline, political_roadmap
- **Education**: schools, school_clusters, k12_curriculum, slides
- **Economics**: scale_projections, funding_sources, endowment_projections
- **Environment**: environmental_impact, planetary_boundaries, regenerative_agriculture
- **Employment**: job_creation, expanded_jobs, labor_transition
- **Governance**: legal_framework, coalition_partners, tribal_partnerships
- **Analysis**: stress_tests, monte_carlo_simulations, scenario_comparisons

## Environment Variables

| Variable      | Description       | Default      |
| ------------- | ----------------- | ------------ |
| `PORT`        | Server port       | 3000         |
| `DB_HOST`     | Database host     | localhost    |
| `DB_PORT`     | Database port     | 5432         |
| `DB_NAME`     | Database name     | gaia_commons |
| `DB_USER`     | Database user     | gaia_user    |
| `DB_PASSWORD` | Database password | -            |
| `DB_POOL_MAX` | Max connections   | 20           |

## Scripts

| Command                 | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | Build and run (development)                    |
| `npm run build`         | Compile TypeScript                             |
| `npm start`             | Run compiled server                            |
| `npm run typecheck`     | Type check without emit                        |
| `npm test`              | Run test suite                                 |
| `npm run test:watch`    | Run tests in watch mode                        |
| `npm run test:coverage` | Run tests with coverage report                 |
| `npm run lint`          | Lint code with ESLint                          |
| `npm run lint:fix`      | Lint and auto-fix issues                       |
| `npm run format`        | Format code with Prettier                      |
| `npm run format:check`  | Check code formatting                          |
| `npm run validate`      | Run all checks (typecheck, lint, format, test) |

## API Documentation

Interactive API documentation is available via Swagger UI:

- **Local**: `http://localhost:3000/api-docs`
- **Production**: `https://your-domain.com/api-docs`

The Swagger UI provides:

- Complete endpoint documentation for all 40 REST endpoints
- Request/response schemas
- Interactive "Try it out" functionality
- Example requests and responses

Alternatively, view the [OpenAPI specification](./openapi.yaml) directly.

## Code Quality

This project maintains high code quality standards:

### Linting

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

ESLint is configured with TypeScript support and follows recommended best practices.

### Formatting

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

Prettier ensures consistent code style across the project (2 spaces, single quotes, trailing commas).

### Type Safety

```bash
# Type check
npm run typecheck
```

TypeScript strict mode is enabled for maximum type safety.

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

The project includes:

- **67+ unit and integration tests**
- **60%+ code coverage**
- Tests for all 40 API endpoints
- Error handling and edge case testing

### Validation

Run all quality checks at once:

```bash
npm run validate
```

This runs typecheck, lint, format check, and tests in sequence.

## Deployment

### Railway (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway add --database postgres
railway up
```

### Render

1. Connect GitHub repo to Render
2. Add PostgreSQL database
3. Deploy automatically

### Docker

```bash
# Build image
docker build -t gaia-commons-api .

# Run container
docker run -p 3000:3000 --env-file .env gaia-commons-api
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines on:

- Code style and conventions
- Commit message standards (Conventional Commits)
- Pull request process
- Testing requirements
- Development workflow

Quick start:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our code standards
4. Run `npm run validate` to ensure all checks pass
5. Commit changes (`git commit -m 'feat: add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request using our PR template

## Quick Verification (Local)

### Using Docker Compose

```bash
# Start the services
docker compose up

# In another terminal, verify the health endpoint
curl http://localhost:3000/api/health
```

### Running Tests Locally

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the server in one terminal
npm start

# In another terminal, run the tests
npm test
```

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Built for the Gaia Commons Initiative
- Inspired by regenerative agriculture and educational equity
- Powered by open-source software

---

**🌱 Transforming education, one greenhouse at a time.**
