type ApplicationEvent = "job_viewed" | "application_started" | "application_submitted";

const projectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const productionHost = "jade-maamoul-e2cbc1.netlify.app";
const posthogHost = "https://eu.i.posthog.com";
const sessionKey = "doroboty:analytics-session";

export async function startPageAnalytics() {
  if (!projectToken || window.location.hostname !== productionHost) return;

  const { default: posthog } = await import("posthog-js/dist/module.no-external");
  posthog.init(projectToken, {
    api_host: posthogHost,
    persistence: "sessionStorage",
    person_profiles: "never",
    capture_pageview: false,
    capture_pageleave: false,
    autocapture: {
      url_allowlist: [/\/#\/oferty(?:\?|$)/],
      dom_event_allowlist: ["click"],
      css_selector_allowlist: ["a[data-analytics-offer-link]"],
    },
    mask_all_text: true,
    mask_all_element_attributes: true,
    disable_session_recording: true,
    disable_surveys: true,
    disable_web_experiments: true,
    disable_external_dependency_loading: true,
    capture_dead_clicks: false,
    enable_heatmaps: false,
    capture_performance: false,
    before_send: (event) => {
      if (event?.event !== "$pageview" && event?.event !== "$autocapture") return null;
      const route = window.location.hash.split("?")[0] || "#/";
      return {
        ...event,
        properties: {
          distinct_id: event.properties.distinct_id,
          $current_url: `${window.location.origin}${window.location.pathname}${route}`,
          $event_type: event.properties.$event_type,
          $process_person_profile: false,
          $geoip_disable: true,
        },
      };
    },
  });

  const capturePageview = () => posthog.capture("$pageview");
  capturePageview();
  window.addEventListener("hashchange", capturePageview);
}

export function trackApplicationEvent(event: ApplicationEvent, jobId: string) {
  if (!projectToken || window.location.hostname !== productionHost) return;

  try {
    let sessionId = window.sessionStorage.getItem(sessionKey);
    if (!sessionId) {
      sessionId = window.crypto.randomUUID();
      window.sessionStorage.setItem(sessionKey, sessionId);
    }

    void fetch(`${posthogHost}/i/v0/e/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: projectToken,
        event,
        distinct_id: sessionId,
        properties: {
          job_id: jobId,
          $process_person_profile: false,
          $geoip_disable: true,
        },
      }),
      keepalive: true,
      credentials: "omit",
      referrerPolicy: "no-referrer",
    }).catch(() => {
      // Analytics delivery is optional for the prototype journey.
    });
  } catch {
    // Browser storage can be unavailable.
  }
}
