#!/bin/bash
# Script to create GitHub labels for Dependabot
# This script requires GitHub CLI (gh) to be installed and authenticated
#
# Usage: ./create-labels.sh [owner/repo]
#        If owner/repo is not provided, it will auto-detect from git remote
#
# Note: Labels have been removed from dependabot.yml to avoid errors.
# If you want to use labels with Dependabot, run this script first,
# then uncomment the labels section in dependabot.yml

set -e

# Get repository from argument or auto-detect from git remote
if [ -n "$1" ]; then
  REPO="$1"
else
  # Auto-detect from git remote origin
  REPO=$(git remote get-url origin | sed -e 's/.*github.com[:/]\(.*\)\.git/\1/' -e 's/.*github.com[:/]\(.*\)/\1/')
  if [ -z "$REPO" ]; then
    echo "Error: Could not auto-detect repository. Please provide owner/repo as argument."
    echo "Usage: $0 owner/repo"
    exit 1
  fi
fi

echo "Creating GitHub labels for repository: $REPO"

# Create 'dependencies' label
gh label create "dependencies" \
  --repo "$REPO" \
  --description "Pull requests that update dependencies" \
  --color "0366d6" \
  --force

# Create 'automated' label
gh label create "automated" \
  --repo "$REPO" \
  --description "Automated pull requests" \
  --color "ededed" \
  --force

# Create 'github-actions' label
gh label create "github-actions" \
  --repo "$REPO" \
  --description "Pull requests that update GitHub Actions" \
  --color "000000" \
  --force

echo "✅ Labels created successfully!"
echo ""
echo "Next steps:"
echo "1. Uncomment the 'labels:' sections in .github/dependabot.yml"
echo "2. Commit and push the changes"
