# Slope v4.6

## Exercise library restored
Slope now restores the broad exercise library from the original proof-of-concept without overwriting exercises you have already edited or created.

The migration adds missing exercises by name only, including the old push, pull, lower-body, calf/rehab and core library, while retaining Slope's newer slow step-down and lateral-lunge entries.

The library now has:
- search by name, category or equipment
- category filtering
- search when adding an exercise to a template
- custom exercise create/edit/delete as before

## Review upcoming week
Coach now has a separate **Review upcoming week** action. It does not require completing a weekly check-in.

Coach receives:
- the exact strength sessions planned for the coming Monday–Sunday
- exercise order
- phase-adjusted work-set count
- rep ranges and targets
- rest times
- warm-ups
- current deterministic weight prescription
- last sets and RIR
- recent workout and Snozone notes
- Coach memory
- long-view trends
- previous upcoming-week review decisions
- the available exercise library

The programming prompt explicitly treats **no changes** as a successful review and caps changes at four.

Coach may propose:
- changing sets/reps/target/rest/weight/warm-ups
- swapping an exercise
- adding an exercise
- removing an exercise

Every proposal is shown with **Apply / Dismiss**.

### Important behaviour
Accepted changes modify **that planned week's occurrence only**. They do not rewrite Ski A/Ski B or another master template.

Coach-originated changes and dismissed proposals are audited so future coaching can see what was tried or rejected.

Planned sessions with approved changes display a small `coach adjusted` marker.

## Upgrade
Upload the files to the same GitHub Pages origin. Keep the same URL so IndexedDB and your locally stored OpenAI key carry over.

Take a backup before upgrading.
