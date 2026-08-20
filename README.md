# Slope v4

A light-first, local-first iPhone PWA for training, ski preparation and ongoing AI coaching.

## What changed from v3

This is not another feature pass. The interaction model was rebuilt around three flows:

1. **Today** — low-friction logging. Tap a metric, type over the selected value, save. Notes are optional and automatically available to Coach.
2. **Workout** — compact exercise accordions, editable sets, warm-ups, weight/reps/RIR, rest timer, adding/removing exercises, and active-workout persistence.
3. **Coach** — a persistent coaching relationship rather than a weekly report. Coach receives your logs automatically, asks only targeted missing questions, maintains editable memory, and can be used at any point in the week.

Other changes:
- warm, light-first visual system
- compact day-strip week planner instead of seven giant stacked day sections
- sheet scroll locking to avoid the v3 nested-scroll bug
- numeric inputs allow empty values and select current content on focus
- friendly AI errors instead of raw JSON alerts
- existing `garethTrainingV3` IndexedDB is deliberately reused so an in-place update on the same GitHub Pages origin can keep v3 data
- bird's-eye Les Carroz → Flaine plan remains available under More
- templates and exercise library remain editable under More

## Host / upgrade

If replacing v3 on the same GitHub Pages site:

1. Export a JSON backup from v3 first.
2. Replace the repository root files with the **contents** of this folder.
3. Commit/push.
4. Refresh the installed PWA. If Safari keeps an old cached build, remove/re-add the Home Screen app or clear the site cache.

Because the database name is unchanged, local data should survive an in-place update on the same origin. The backup is still recommended before replacing files.

For a fresh site:
1. Upload the folder contents to a GitHub repo.
2. Settings → Pages → Deploy from branch → `main` → `/ (root)`.
3. Open the Pages URL in Safari → Share → Add to Home Screen.

## AI

The existing local-key approach remains:
- More → AI Coach
- paste a dedicated OpenAI API key
- save locally
- test connection

The key is held in browser localStorage and is excluded from JSON backups. A client-side key is convenient for a private personal app but is not production-grade secret storage. Use a dedicated project/key with a low spending cap.

## Deliberate limitations in this build

- It is still a dependency-free static PWA rather than a compiled React/Framer Motion app. The motion/interaction layer is implemented with CSS and browser APIs so the build can be dropped straight onto GitHub Pages without a build pipeline.
- Week sessions can be moved via a date sheet but are not yet drag-and-drop.
- Coach can recommend changes conversationally; structured one-tap application of AI-proposed programme changes is not yet enabled.
- The app cannot read ParrotPal or Apple Health automatically from a GitHub Pages PWA.
