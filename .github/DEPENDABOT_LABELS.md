# Dependabot Labels Setup

## Problem

Dependabot requires certain labels to exist in the GitHub repository before it can apply them to pull requests. The required labels are:

- `automated` - for automated PRs
- `dependencies` - for all dependency updates
- `github-actions` - for GitHub Actions updates

## Automated Solution (Recommended)

The repository includes a GitHub Actions workflow (`.github/workflows/setup-labels.yml`) that automatically creates the required labels.

### How It Works

1. The workflow runs automatically when changes to `.github/workflows/setup-labels.yml` are pushed to the `main` branch
2. For other changes (e.g., code-only commits), it does not auto-run and must be triggered manually from the Actions tab
3. When it runs, it creates all three required labels with the correct colors and descriptions
4. If a label already exists, the workflow skips it (no errors)

### Manual Trigger

If the labels don't exist yet and you need them immediately:

1. Go to the repository's Actions tab: https://github.com/cannaplan/Gaia-commons-council-app2.0/actions
2. Click on "Setup Repository Labels" workflow
3. Click "Run workflow" button
4. Select the branch and click "Run workflow"

The labels will be created within seconds.

## Alternative: Manual Creation

If you prefer to create labels manually or the automated workflow is not available:

### Option 1: Using GitHub CLI

1. Install GitHub CLI: https://cli.github.com/
2. Authenticate: `gh auth login`
3. Run the label creation script:
   ```bash
   cd .github
   ./create-labels.sh
   ```

### Option 2: Manual Creation via GitHub Web Interface

1. Go to https://github.com/cannaplan/Gaia-commons-council-app2.0/labels
2. Click "New label"
3. Create these labels:

   **dependencies**
   - Name: `dependencies`
   - Description: `Pull requests that update dependencies`
   - Color: `#0366d6` (blue)

   **automated**
   - Name: `automated`
   - Description: `Automated pull requests`
   - Color: `#ededed` (gray)

   **github-actions**
   - Name: `github-actions`
   - Description: `Pull requests that update GitHub Actions`
   - Color: `#000000` (black)

### Option 3: Using GitHub API

```bash
# Set your GitHub token
GITHUB_TOKEN="your_token_here"
REPO="cannaplan/Gaia-commons-council-app2.0"

# Create dependencies label
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$REPO/labels \
  -d '{"name":"dependencies","description":"Pull requests that update dependencies","color":"0366d6"}'

# Create automated label
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$REPO/labels \
  -d '{"name":"automated","description":"Automated pull requests","color":"ededed"}'

# Create github-actions label
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$REPO/labels \
  -d '{"name":"github-actions","description":"Pull requests that update GitHub Actions","color":"000000"}'
```

## References

- [Dependabot configuration options](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [Managing labels](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels)
