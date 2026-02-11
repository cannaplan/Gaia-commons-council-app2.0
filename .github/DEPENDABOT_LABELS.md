# Dependabot Labels Fix

## Problem

Dependabot was reporting an error because the following labels were referenced in `.github/dependabot.yml` but didn't exist in the GitHub repository:

- `automated`
- `dependencies`
- `github-actions`

## Solution

The labels references have been removed from `.github/dependabot.yml` to prevent Dependabot errors. Labels are optional in Dependabot configuration.

## If You Want to Use Labels

If you want Dependabot to automatically add labels to its pull requests:

### Option 1: Using GitHub CLI (Recommended)

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

## Re-enabling Labels in dependabot.yml

After creating the labels, you can add them back to `.github/dependabot.yml`:

```yaml
# For npm updates:
labels:
  - "dependencies"
  - "automated"

# For GitHub Actions updates:
labels:
  - "dependencies"
  - "github-actions"
```

## References

- [Dependabot configuration options](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [Managing labels](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels)
