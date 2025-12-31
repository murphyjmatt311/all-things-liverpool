---
description: How to deploy the application to Vercel via GitHub
---

# Deployment Guide

This guide will walk you through deploying your "All Things Liverpool" app to production using GitHub and Vercel.

## 1. Initialize Git

First, we need to turn your project into a Git repository.

```bash
git init
git add .
git commit -m "Initial commit: All Things Liverpool app"
```

## 2. Create a GitHub Repository

1.  Go to [GitHub.com](https://github.com) and sign in.
2.  Click the **+** icon in the top right and select **New repository**.
3.  Name it `all-things-liverpool` (or whatever you prefer).
4.  Make it **Public** or **Private**.
5.  Do **not** initialize with README, .gitignore, or License (we already have code).
6.  Click **Create repository**.

## 3. Push Code to GitHub

Copy the commands shown on the GitHub "Quick setup" page under "…or push an existing repository from the command line". They will look like this (replace `YOUR_USERNAME` with your actual GitHub username):

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/all-things-liverpool.git
git push -u origin main
```

## 4. Deploy to Vercel

1.  Go to [Vercel.com](https://vercel.com) and sign up/login with GitHub.
2.  Click **Add New...** -> **Project**.
3.  Select your `all-things-liverpool` repository and click **Import**.
4.  Vercel will detect it's a Vite project. The default settings should be correct:
    *   **Framework Preset:** Vite
    *   **Root Directory:** `./`
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
5.  Click **Deploy**.

## 5. Success!

Vercel will build your site and give you a production URL (e.g., `all-things-liverpool.vercel.app`). You can now share this link!
