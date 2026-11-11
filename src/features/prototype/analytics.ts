type ApplicationEvent = "job_viewed" | "application_started" | "application_submitted";
type AnalyticsEvent = ApplicationEvent | "$pageview" | "offer_link_clicked";

const projectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const productionHost = "jade-maamoul-e2cbc1.netlify.app";
const sessionKey = "doroboty:analytics-session";

function trackEvent(event: AnalyticsEvent, properties: Record<string, string>) {
  if (!projectToken || window.location.hostname !== productionHost) return;

  try {
    let sessionId = window.sessionStorage.getItem(sessionKey);
    if (!sessionId) {
      sessionId = window.crypto.randomUUID();
      window.sessionStorage.setItem(sessionKey, sessionId);
    }

    void fetch("https://eu.i.posthog.com/i/v0/e/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: projectToken,
        event,
        distinct_id: sessionId,
        timestamp: new Date().toISOString(),
        properties: {
          ...properties,
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

function currentPageUrl() {
  const route = window.location.hash.split("?")[0] || "#/";
  return `${window.location.origin}${window.location.pathname}${route}`;
}

export function trackPageview() {
  trackEvent("$pageview", { $current_url: currentPageUrl() });
}

export function trackOfferLinkClick(jobId: string) {
  const pageUrl = currentPageUrl();
  if (!pageUrl.endsWith("#/oferty")) return;
  trackEvent("offer_link_clicked", { $current_url: pageUrl, job_id: jobId });
}

export function trackApplicationEvent(event: ApplicationEvent, jobId: string) {
  trackEvent(event, { job_id: jobId });
}
