# Gareth Training & Ski Prep v3

A self-hosted iPhone PWA built around **Plan → Schedule → Templates → Logs**.

## What is included

- Monday–Sunday week planner with day view or weekly-list view.
- Planned sessions can be started, ticked off, moved, edited, skipped or deleted.
- Fully editable exercise library.
- Templates can be created, renamed, edited, duplicated and deleted.
- Template exercises support working sets, rep ranges, target reps, rest time, starting load, eventual set count, warm-ups, optional/rehab flags and notes.
- During a workout you can add/delete exercises, add/delete sets, add warm-ups, change warm-up/work sets, and edit weights/reps/RIR/rest/notes.
- Completed workout history is separate from templates.
- At workout finish you can keep today's changes only, update the template, or save a new template.
- Daily logging for weight, calories, protein, steps and context.
- Snozone and cardio logging.
- Weight trend, rolling observed-TDEE estimate and ski-trip projections.
- Les Carroz 9 Jan 2027 and Flaine 27 Mar 2027.
- Christmas maintenance/flexibility reflected in projection.
- Full bird's-eye programme visible at any time.
- Weekly review combines calculated data with free-text context for skiing, body/recovery, food and life.
- Optional local OpenAI API key for Review my week.
- JSON export/restore. The API key is never included in backup.

## GitHub Pages

1. Create a GitHub repository.
2. Upload the contents of this folder to the repository root.
3. GitHub → Settings → Pages.
4. Build and deployment → Deploy from a branch.
5. Choose `main` and `/ (root)`.
6. Open the Pages URL in Safari on iPhone.
7. Share → Add to Home Screen.

## AI setup

1. Create a dedicated OpenAI API project.
2. Create a project API key for this app.
3. Put a low spending limit on that project.
4. In the app open More → AI coach.
5. Paste the key and keep or change the model (default `gpt-5.6`).
6. Tap Test connection.
7. Weekly Review will then show Review my week.

The key is stored locally in the browser/device and is not committed to GitHub or exported in backups. Client-side credentials can still be extracted by someone with access to the browser/device, so use a dedicated limited key and revoke it if needed.

## Storage

All app data is stored in IndexedDB on the device/browser. Export a JSON backup periodically.
