# Gareth's Ski Prep v2

An installable iPhone PWA for the current ski-prep training system.

## What changed from the proof of concept
This version is designed around the job now:
- **Today**: next useful session, weekly adherence, countdown, current phase, ski focus
- **Train**: actual Workout A / B logging with weight, reps and optional RIR; Snozone; cardio; other activity
- **Progress**: bodyweight trend, adherence, training counts, ski notes
- **Plan**: phased programme and live set prescriptions
- **More**: JSON export/restore and local data controls

## Training logic included
- A/B full-body structure
- Re-entry phase starts established exercises at 2 working sets
- Calf + loaded inversion rehab remains 3 sets
- Established exercises move toward 3 sets after re-entry
- Bulgarian split squat and slow step-down are deliberately not forced to 3 sets
- Snozone counts as lower-body training load
- Exercise suggestions use the last logged session and double-progression logic
- Historic June performances are used only as a reference until new sessions are logged

## Hosting on GitHub Pages
1. Create a GitHub repository, e.g. `ski-prep`.
2. Upload the **contents** of this folder to the repository root.
3. GitHub → Settings → Pages.
4. Build and deployment → **Deploy from a branch**.
5. Select `main` and `/ (root)`.
6. Open the Pages URL in Safari on iPhone.
7. Share → **Add to Home Screen**.

## Storage
Data is stored in IndexedDB on the phone/browser. Use **More → Export JSON** as a backup.

## Notes
This is deliberately dependency-free so GitHub Pages can host it directly and future edits remain easy.
