# GitHub Labels for Dependabot

This document explains the labels used by Dependabot and how they are created.

## Automatic Label Creation

The required labels are **automatically created** by the GitHub Actions workflow `.github/workflows/setup-labels.yml`. This workflow:
- Runs automatically when pushed to main branch
- Can be manually triggered from the Actions tab
- Creates all required Dependabot labels if they don't exist

## Required Labels

The following labels are used by Dependabot:

### 1. dependencies
- **Name**: `dependencies`
- **Description**: Pull requests that update a dependency file
- **Color**: `#0366d6` (blue)

### 2. automated
- **Name**: `automated`
- **Description**: Automated pull requests from bots
- **Color**: `#fbca04` (yellow)

### 3. github-actions
- **Name**: `github-actions`
- **Description**: Pull requests that update GitHub Actions workflows
- **Color**: `#2088ff` (light blue)

## How Labels are Created

### Automatic (Recommended)

The labels are automatically created by the workflow `.github/workflows/setup-labels.yml`:
1. The workflow runs when this file is pushed to the main branch
2. You can also manually trigger it from the GitHub Actions tab
3. Labels are created automatically - no manual intervention needed

### Manual Methods (Alternative)

If you prefer to create labels manually, you can use:

### Option 1: GitHub Web Interface

1. Go to your repository on GitHub
2. Click on "Issues" tab
3. Click on "Labels" button
4. Click "New label" button
5. Enter the label name, description, and color
6. Click "Create label"
7. Repeat for each label

### Option 2: GitHub CLI

If you have the GitHub CLI (`gh`) installed, you can create labels with these commands:

```bash
gh label create "dependencies" --description "Pull requests that update a dependency file" --color "0366d6"
gh label create "automated" --description "Automated pull requests from bots" --color "fbca04"
gh label create "github-actions" --description "Pull requests that update GitHub Actions workflows" --color "2088ff"
```

### Option 3: Helper Script

Use the provided script `.github/create-labels.sh`:

```bash
./.github/create-labels.sh
```

This script uses GitHub CLI to create all required labels.

### Option 4: GitHub API

You can also use the GitHub REST API to create labels:

```bash
# Replace OWNER and REPO with your repository details
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.github.com/repos/OWNER/REPO/labels \
  -d '{"name":"dependencies","description":"Pull requests that update a dependency file","color":"0366d6"}'
```

## Enabling Labels in dependabot.yml

After creating the labels in your repository, you can uncomment the `labels:` sections in `.github/dependabot.yml`:

```yaml
# Change from:
# labels:
#   - "dependencies"
#   - "automated"

# To:
labels:
  - "dependencies"
  - "automated"
```

## Current Status

The labels are automatically created by the setup workflow when this PR is merged. Once the labels exist in the repository, Dependabot will be able to use them without any errors.

The labels sections in `dependabot.yml` are currently commented out as a precaution, but they can be safely uncommented once the workflow has run and created the labels.
