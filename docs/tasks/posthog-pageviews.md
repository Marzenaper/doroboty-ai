# PostHog pageviews and offer-link clicks

Capture pageviews on the production pilot, including hash route changes. Restrict automatic click capture to the “Zobacz rolę” links on the offer list. Exclude form interactions, element text, replay and personal profiles.

Verify `$pageview` and `$autocapture` in Activity → Live after opening the offer list and following a link. Check the click's URL and time in PostHog.
