# Ski Prep PWA

A tiny installable iPhone-friendly training tracker for a 20-week ski-prep plan.

## What it does
- Shows the full 20-week plan
- Lets you mark every session Done / Skipped / Clear
- Stores progress and week notes in browser localStorage
- Shows done count, skipped count, completion percentage, and a simple week streak
- Works offline after first load
- Can be installed to iPhone Home Screen

## Host on GitHub Pages
1. Create a new GitHub repository, e.g. `ski-prep`.
2. Upload all files from this folder to the repository root.
3. Commit to `main`.
4. In GitHub: Settings → Pages.
5. Under Build and deployment, choose `Deploy from a branch`.
6. Choose branch `main`, folder `/ (root)`, then Save.
7. GitHub will give you a Pages URL.

## Install on iPhone
1. Open your GitHub Pages URL in Safari.
2. Tap Share.
3. Tap **Add to Home Screen**.
4. Open it from the new Ski Prep icon.

## Important storage note
Progress is stored locally on that device/browser. Clearing Safari site data, deleting the PWA, or using another device will not sync your progress.

## Editing the plan
The training plan lives in `data.js`. You can edit week titles, sessions, details and weight targets without changing the app logic.
