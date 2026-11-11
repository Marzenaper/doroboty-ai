# PostHog application funnel

Measure offer views, application form entry and successful submissions on the hosted teaching prototype. Link these events within one browser tab using a randomly generated session identifier and a job ID.

- Enable delivery only on the designated Netlify hostname when the build has `VITE_POSTHOG_PROJECT_TOKEN` configured.
- Send only the three explicit events to PostHog EU. Exclude form contents, persona IDs and session recordings.
- Count submission after the prototype accepts it. A failed analytics request must not interrupt the application.

After publication, use synthetic data to complete one journey and check the three events in PostHog Activity. Filter or hold the job ID constant when creating the funnel.
