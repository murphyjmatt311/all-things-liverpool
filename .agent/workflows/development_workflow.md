---
description: Standard workflow for developing, testing, and deploying updates
---

# Development & Deployment Workflow

This guide outlines the standard process for making changes to the application and deploying them to production.

## 1. Local Development (Testing Updates)

Always test your changes locally before pushing them.

1.  **Start the development server** (if not already running):
    ```bash
    npm run dev
    ```
2.  **Open your browser** to [http://localhost:5173](http://localhost:5173).
3.  **Make your code changes**. The browser will automatically reload (Hot Module Replacement) to show your updates instantly.
4.  **Verify** that everything looks and works as expected.

## 2. Commit Changes

Once you are happy with your changes, save them to your local git history.

1.  **Check which files changed**:
    ```bash
    git status
    ```
2.  **Stage your changes** (prepare them for commit):
    ```bash
    git add .
    ```
3.  **Commit your changes** with a descriptive message:
    ```bash
    git commit -m "Brief description of what you changed"
    ```

## 3. Deploy to Production

Since you have connected your GitHub repository to Vercel, deployment is **automatic**.

1.  **Push your changes to GitHub**:
    ```bash
    git push origin main
    ```
2.  **Watch it go live**:
    *   Vercel will detect the new commit on the `main` branch.
    *   It will automatically build and deploy the new version.
    *   This usually takes 1-2 minutes.
3.  **Verify Production**: Visit your live URL (e.g., `https://all-things-liverpool.vercel.app`) to see your changes in production.

## Summary of Commands

```bash
# 1. Make changes...
# 2. Stage and Commit
git add .
git commit -m "Update feature X"

# 3. Push (Triggers Deploy)
git push origin main
```
