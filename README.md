# Slope v4.6.1

Hotfix for starting Coach-adjusted strength sessions.

## Fixed
- Approved working-weight changes no longer crash workout startup.
- The issue was a runtime `const` reassignment in the occurrence-override path, so normal workouts worked while Coach-adjusted workouts containing a weight override did not.
- Occurrence-level weights are now validated before use.
- Session actions now surface a visible error toast if workout startup ever throws, rather than leaving a Start button that appears to do nothing.

All v4.6 exercise-library and Review Upcoming Week features remain.

Upload over the same GitHub Pages files at the same URL. Existing IndexedDB data, approved Coach adjustments and local API key will carry forward.
