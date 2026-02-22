# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the Gaia Commons API repository.

## Available Workflows

### 1. CI - Smoke Tests (`ci.yml`)

Runs automated tests on every push and pull request to the main branch.

**What it does:**

- Sets up PostgreSQL database
- Installs dependencies
- Builds TypeScript code
- Starts the server
- Runs test suite

**Triggers:**

- Push to `main` branch
- Pull requests to `main` branch

### 2. Setup Repository Labels (`setup-labels.yml`)

Automatically creates the required labels for Dependabot to use.

**What it does:**

- Creates (if missing) a `dependencies` label with a default blue color for dependency updates
- Creates (if missing) an `automated` label with a default gray color for automated PRs
- Creates (if missing) a `github-actions` label with a default black color for GitHub Actions updates
- Safely handles existing labels (no errors if they already exist, and existing colors/descriptions are not changed)

**Triggers:**

- Push to `main` branch (when this workflow file changes)
- Manual trigger via GitHub Actions UI

**How to run manually:**

1. Go to the [Actions tab](https://github.com/cannaplan/Gaia-commons-council-app2.0/actions)
2. Click "Setup Repository Labels" in the left sidebar
3. Click "Run workflow" button
4. Select the branch and click "Run workflow"

**Required permissions:**

- `issues: write` - to create labels

## Adding New Workflows

When adding new workflows:

1. Create a new `.yml` file in this directory
2. Follow the [GitHub Actions syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
3. Test the workflow with the [YAML validator](https://www.yamllint.com/)
4. Document the workflow in this README

## Troubleshooting

### Workflow fails with permissions error

Check that the workflow has the required permissions in the YAML file:

````yaml
permissions:
  issues: write
### Workflow doesn't trigger automatically

Check the `on:` section to ensure the correct events are specified. Note that `setup-labels.yml` uses a `paths:` filter and only auto-runs when the workflow file itself changes:

```yaml
on:
  workflow_dispatch:  # Manual trigger
  push:
    branches: [ main ]
    paths:              # Only runs when these files change
      - '.github/workflows/setup-labels.yml'
````

For workflows without `paths:` filters, a typical configuration might be:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

### Label creation fails

The `setup-labels.yml` workflow uses `actions/github-script@v7` which automatically has access to the GitHub API. If it fails:

1. Check the workflow logs in the Actions tab
2. Verify the repository has the correct permissions
3. Try running the workflow manually

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [GitHub Script Action](https://github.com/actions/github-script)
