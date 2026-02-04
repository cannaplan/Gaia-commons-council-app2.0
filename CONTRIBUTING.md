# Contributing to Gaia Commons Council App 2.0

Thank you for your interest in contributing to the Gaia Commons Council App! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Gaia-commons-council-app2.0.git
   cd Gaia-commons-council-app2.0
   ```
3. **Set up the development environment**:
   ```bash
   npm install
   cp .env.example .env
   # Configure .env with your database credentials
   ```
4. **Set up the database**:
   ```bash
   # Using Docker (recommended)
   docker-compose up -d postgres
   
   # Or manually
   psql -U gaia_user -d gaia_commons -f schema.sql
   ```
5. **Run the application**:
   ```bash
   npm run dev
   ```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Actual behavior**
- **Environment details** (OS, Node.js version, etc.)
- **Screenshots** if applicable

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why this enhancement would be useful
- **Proposed solution** - how you envision this working
- **Alternatives considered**

### Pull Requests

1. Fork the repo and create your branch from `develop`
2. Make your changes
3. Add or update tests as needed
4. Ensure all tests pass
5. Update documentation
6. Submit a pull request

## Development Workflow

### Branch Naming

- `feature/description` - for new features
- `bugfix/description` - for bug fixes
- `hotfix/description` - for urgent production fixes
- `docs/description` - for documentation changes
- `refactor/description` - for code refactoring

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(api): add DELETE endpoint for schools

Implements soft-delete functionality for school records.
Includes cascade deletion of related records.

Closes #123
```

```
fix(db): correct connection pool timeout

The connection pool was timing out after 2 seconds.
Increased timeout to 5 seconds for slower networks.
```

## Coding Standards

### TypeScript

- **Use TypeScript** for all new code
- **Enable strict mode** - all code must pass strict type checking
- **Use interfaces** for data structures
- **Avoid `any` type** - use proper types or `unknown`
- **Export types** that are used across files

### Code Style

- **Use 2 spaces** for indentation
- **Use single quotes** for strings
- **Semicolons are required**
- **Max line length: 100 characters**
- **Use async/await** instead of callbacks
- **Use arrow functions** for inline functions

### File Organization

```
├── src/
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── db.ts             # Database connection
│   ├── storage.ts        # Storage interfaces
│   ├── pgStorage.ts      # PostgreSQL implementation
│   ├── middleware/       # Custom middleware
│   ├── models/           # Data models
│   ├── services/         # Business logic
│   └── utils/            # Utility functions
├── tests/
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
└── docs/                 # Additional documentation
```

### Naming Conventions

- **Files**: kebab-case (e.g., `user-service.ts`)
- **Classes**: PascalCase (e.g., `UserService`)
- **Functions**: camelCase (e.g., `getUserById`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
- **Interfaces**: PascalCase with 'I' prefix optional (e.g., `User` or `IUser`)

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- user.test.ts

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Writing Tests

- **Write tests for all new features**
- **Maintain test coverage above 80%**
- **Use descriptive test names**
- **Follow AAA pattern**: Arrange, Act, Assert

Example:
```typescript
describe('getUserById', () => {
  it('should return user when valid ID is provided', async () => {
    // Arrange
    const userId = 1;
    const expectedUser = { id: 1, name: 'John Doe' };
    
    // Act
    const result = await getUserById(userId);
    
    // Assert
    expect(result).toEqual(expectedUser);
  });
  
  it('should return null when user does not exist', async () => {
    // Arrange
    const userId = 999;
    
    // Act
    const result = await getUserById(userId);
    
    // Assert
    expect(result).toBeNull();
  });
});
```

## Documentation

- **Update README.md** if you change functionality
- **Update CHANGELOG.md** following Keep a Changelog format
- **Add JSDoc comments** for public functions and classes
- **Update API documentation** if you add/modify endpoints
- **Include inline comments** for complex logic

Example JSDoc:
```typescript
/**
 * Retrieves a user by their ID
 * @param userId - The unique identifier of the user
 * @returns Promise resolving to User object or null if not found
 * @throws {DatabaseError} If database connection fails
 */
async function getUserById(userId: number): Promise<User | null> {
  // Implementation
}
```

## Pull Request Process

1. **Update documentation** to reflect changes
2. **Add tests** for new functionality
3. **Ensure all tests pass**: `npm test`
4. **Ensure code builds**: `npm run build`
5. **Check for security issues**: `npm audit`
6. **Update CHANGELOG.md** with your changes
7. **Create pull request** with clear description

### Pull Request Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
Describe how you tested your changes.

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Screenshots (if applicable)
Add screenshots to help explain your changes.
```

### Review Process

- Pull requests require at least one approval
- All CI checks must pass
- Code must meet quality standards
- Documentation must be updated
- Tests must pass and maintain coverage

## Questions?

If you have questions, please:

1. Check the [README.md](./README.md)
2. Check the [REQUIREMENTS.md](./REQUIREMENTS.md)
3. Search existing [GitHub Issues](https://github.com/cannaplan/Gaia-commons-council-app2.0/issues)
4. Create a new issue with the `question` label

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Gaia Commons Council App! 🌿
