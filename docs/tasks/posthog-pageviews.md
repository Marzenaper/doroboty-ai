# PostHog pageviews and offer-link clicks

Capture pageviews on the production pilot, including hash route changes. Capture the “Zobacz rolę” links on the offer list with a dedicated click event. Exclude form interactions, element text, replay and personal profiles.

Verify `$pageview` and `offer_link_clicked` in Activity → Live after opening the offer list and following a link. Check the click's URL and time in PostHog.
