# Slope v4.7

## Return after a break

Slope now understands a meaningful training/tracking gap instead of expecting you to pretend nothing happened.

### Welcome back
If there has been roughly 14+ days since the last strength workout, or both weight and calorie tracking have been absent for 14+ days, Today can show a **Welcome back** card.

It does not ask you to reconstruct the missing period.

You can:
- **Start re-entry**
- **Carry on normally**

Either path restarts the observed-TDEE evidence baseline so a long gap does not contaminate the new estimate.

### Two-session re-entry
Re-entry lasts for the next two completed strength workouts.

Unless an approved occurrence-level Coach adjustment already says otherwise:
- established/non-rehab movements are capped at 2 work sets
- rehab movements keep their normal prescription
- weighted movements start at roughly 90% of the last successful working load where practical
- bodyweight work restarts from the lower end of its rep range
- the target is roughly 3–4 RIR
- normal progression resumes automatically after the second strength workout

The active workout explicitly shows that it is a re-entry session.

### Coach understands it
Normal Coach conversations and **Review upcoming week** both receive the return-to-training state.

Coach is explicitly told:
- reduced volume/load during re-entry is intentional
- do not interpret these sessions as regression, a stall or weak adherence
- do not inflate the re-entry back to normal volume just because historical numbers were higher
- further reductions/swaps are still valid where notes, recovery or a niggle justify them

Re-entry workout logs are tagged so future Coach context knows what they were. They remain visible in history, but they are excluded from ordinary progression and lift-trend baselines so a deliberately lighter comeback session cannot masquerade as strength regression.

### Evidence reset
Observed TDEE now uses the fresh evidence block after a return gap and also ignores older paired calorie/weight blocks separated by more than seven days.

Older history is retained. It simply does not distort the new observed-TDEE calculation.

## Upgrade
Upload over the same GitHub Pages origin. Keep the same URL so IndexedDB, approved Coach adjustments and your local OpenAI key carry forward.

Take a backup first.
