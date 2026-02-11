# Development Workflow

## Overview
- **Main branch only** - All feature branches merge directly to `main`
- **Automated checks** - Lint, TypeScript, build validation on PRs
- **Auto-deploy** - Merges to `main` trigger automatic Vercel deployment

## Process

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
# Or: fix/bug-name, docs/update-name, etc.
```

### 2. Make Changes
```bash
git add .
git commit -m "[Feature] - Brief description"
```

Commit format: `[Type] - description`
- `[Feature]` - New feature
- `[Fix]` - Bug fix
- `[Docs]` - Documentation
- `[Refactor]` - Code cleanup
- `[Chore]` - Dependency updates, config

### 3. Push & Create PR
```bash
git push origin feature/your-feature-name
```

Then create a PR on GitHub. Auto-fill the template:
- Link issues with `Closes #123`
- Mark change type
- Confirm testing

### 4. CI Checks Run Automatically
GitHub Actions will:
- ✅ Run ESLint
- ✅ Run TypeScript typecheck
- ✅ Build the app

All must pass to merge.

### 5. Merge to Main
Once checks pass, merge the PR. No manual review required (automated workflow).

### 6. Auto-Deploy
Merging to `main` triggers:
- Vercel deploys to production
- Live in ~2 minutes

## Important Notes

- **No manual testing gate** — CI handles it
- **Straight to main** — No staging/dev branch
- **Issues → Branches** — Link PRs to GitHub Issues for auto-closing
- **Commit format matters** — Used for changelogs and traceability

## GitHub Secrets Setup

Add `VERCEL_TOKEN` to repo secrets:
1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `VERCEL_TOKEN`
4. Value: Your Vercel API token (already in `.env.local`, copy from there)
5. Save

Then CI/CD is fully operational.
