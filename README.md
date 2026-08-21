# Slope v4.5.1

Hotfix for Coach.

## Fixed
- Restores `parseCoachReply()` and `friendlyAIError()`, which were accidentally removed during the v4.5 Coach-context refactor.
- This was why OpenAI could return successfully but no Coach reply appeared.
- Failed messages now show a visible inline error and retry without duplicating the user message.
- Outgoing Coach messages are persisted before the network request.
- Empty/incomplete model responses are treated as errors rather than rendering a blank bubble.
- Coach output allowance increased for the richer long-view prompt.
- Errors are scrolled into view instead of disappearing below the composer.

All v4.5 progression, long-view, history, Snozone recall and backup features remain.

Upload to the same GitHub Pages origin so local data and the API key carry forward.
