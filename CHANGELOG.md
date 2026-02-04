# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- API endpoint integration tests (14 tests for core endpoints)
- Response format validation tests
- Data structure validation tests
- Testing infrastructure with Jest and Supertest
- 29 automated tests total (storage layer + health + API endpoints)
- Test scripts: `npm test`, `npm run test:watch`, `npm run test:coverage`
- Jest configuration (jest.config.js)
- Test documentation (tests/README.md)
- Coverage reporting (46.21% coverage)
- Docker support with Dockerfile and docker-compose.yml
- GitHub Actions CI/CD pipeline with test execution
- NEXT_STEPS.md comprehensive roadmap
- .dockerignore for optimized Docker builds
- CHANGELOG.md for tracking changes
- SUMMARY.md project overview
- CONTRIBUTING.md contribution guidelines

### Changed
- Updated CI/CD workflow to run tests (removed continue-on-error)
- Updated package.json with test scripts
- Updated NEXT_STEPS.md to reflect completed items (Phase 2.2 complete)
- Improved test coverage from 42.85% to 46.21%

## [5.0.0] - 2026-02-04

### Added
- Complete Express.js API with 40 REST endpoints
- PostgreSQL database integration with 39 tables
- TypeScript support with full type safety
- 39 TypeScript interfaces for data models
- In-memory storage implementation (MemStorage)
- PostgreSQL storage implementation (PgStorage)
- Security middleware (Helmet.js, CORS, rate limiting)
- Database connection pooling
- Comprehensive documentation:
  - REQUIREMENTS.md - System requirements and dependencies
  - INSTALLATION_GUIDE.md - Quick setup guide
  - DATABASE_SETUP.md - Database configuration
  - README.md - Project overview and API reference
  - HANDOFF.md - Project handoff documentation
- Environment configuration with .env support
- Automated database seeding
- Health check endpoint
- Morgan HTTP request logging

### Technical Details
- Node.js 18+ runtime
- PostgreSQL 14+ database
- Express.js 4.18.2 web framework
- TypeScript 5.3.3 compiler
- 110+ npm packages (0 vulnerabilities)

### API Endpoints
- Core Stats: /api/health, /api/pilot, /api/endowment, /api/financials, /api/climate
- Timeline: /api/timeline, /api/implementation-timeline, /api/political-roadmap
- Education: /api/schools, /api/school-clusters, /api/k12-curriculum, /api/slides
- Economics: /api/scale-projections, /api/historical-financials, /api/endowment-projections, /api/funding-sources
- Environment: /api/environmental-impact, /api/regenerative-agriculture, /api/tiered-carbon-pricing, /api/nationwide-food-security, /api/planetary-boundaries, /api/historical-climate-data
- Employment: /api/job-creation, /api/expanded-jobs, /api/labor-transition
- Governance: /api/legal-framework, /api/coalition-partners, /api/tribal-partnerships, /api/transparency-features, /api/accountability-mechanisms
- Analysis: /api/stress-tests, /api/monte-carlo-simulations, /api/scenario-comparisons, /api/sensitivity-analysis, /api/optimization-params, /api/calibration-targets, /api/model-maturity
- Global: /api/global-regeneration-summary, /api/political-coalition, /api/mining-alternatives

### Database Schema
- 39 PostgreSQL tables across 8 categories
- Singleton tables for core stats
- List tables for collections
- JSONB support for complex data
- Timestamps on all tables

### Security
- Helmet.js security headers
- CORS middleware
- Rate limiting (100 requests per 15 minutes)
- Environment variable protection
- Input size limits (10MB)
- PostgreSQL connection pooling

[Unreleased]: https://github.com/cannaplan/Gaia-commons-council-app2.0/compare/v5.0.0...HEAD
[5.0.0]: https://github.com/cannaplan/Gaia-commons-council-app2.0/releases/tag/v5.0.0
