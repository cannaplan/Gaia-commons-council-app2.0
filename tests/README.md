# Testing Guide

This directory contains all automated tests for the Gaia Commons API.

## Test Structure

```
tests/
├── api-endpoints.test.ts  # API endpoint integration tests (14 tests)
├── health.test.ts         # Health endpoint tests (5 tests)
├── storage.test.ts        # Storage layer tests (10 tests)
└── README.md             # This file
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage Report

```bash
npm run test:coverage
```

## Test Coverage

Current coverage:

- **Storage Layer**: ~46% (10 tests)
- **Health Endpoint**: 100% (5 tests)
- **API Endpoints**: Integration tests (14 tests)
- **Total**: 29 tests passing

Target: 80%+ code coverage

## Writing Tests

### Example Test Structure

```typescript
import { storage } from '../storage';

describe('Feature Name', () => {
  describe('Specific Functionality', () => {
    it('should do something specific', async () => {
      const result = await storage.getExample();
      expect(result).toBeDefined();
    });
  });
});
```

### Testing Guidelines

1. **Use descriptive test names** - "should return 200 OK" not "test1"
2. **Test one thing per test** - Keep tests focused
3. **Use async/await** - All storage operations are async
4. **Clean up after tests** - Use afterEach/afterAll when needed
5. **Mock external dependencies** - Don't test database in unit tests

## Test Categories

### Unit Tests

- Test individual functions and modules
- Mock all external dependencies
- Fast execution (< 1 second)

### Integration Tests (Future)

- Test API endpoints end-to-end
- Use test database
- Test request/response flow

### E2E Tests (Future)

- Test complete user workflows
- Use test database with seed data
- Validate business logic

## CI/CD Integration

Tests run automatically on:

- Every push to GitHub
- Every pull request
- Via GitHub Actions workflow

## Troubleshooting

### Tests Failing Locally

1. **Ensure dependencies are installed**:

   ```bash
   npm install
   ```

2. **Rebuild TypeScript**:

   ```bash
   npm run build
   ```

3. **Check test output** for specific errors

### Coverage Not Generating

Run with verbose output:

```bash
npm run test:coverage -- --verbose
```

## Next Steps

- [ ] Add integration tests for all 40 API endpoints
- [ ] Add database mock tests
- [ ] Increase coverage to 80%+
- [ ] Add E2E tests
- [ ] Add performance tests

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
