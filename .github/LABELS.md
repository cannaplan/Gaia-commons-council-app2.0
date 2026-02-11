# GitHub Labels for Dependabot

This document explains how to create the labels referenced in `dependabot.yml`.

## Required Labels

To use labels with Dependabot, you need to create them in your GitHub repository first. Here are the recommended labels:

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

## How to Create Labels

You can create these labels in two ways:

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

### Option 3: GitHub API

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

## Why Labels are Currently Commented Out

The labels are currently commented out in `dependabot.yml` because they don't exist in the repository yet. Dependabot will fail if it tries to apply labels that don't exist, which is why they need to be created first.

Once you create the labels using one of the methods above, you can uncomment the relevant sections in the configuration file.
