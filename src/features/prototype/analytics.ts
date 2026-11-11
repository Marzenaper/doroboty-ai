type ApplicationEvent = "job_viewed" | "application_started" | "application_submitted";

const projectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const productionHost = "jade-maamoul-e2cbc1.netlify.app";
const sessionKey = "doroboty:analytics-session";

export function trackApplicationEvent(event: ApplicationEvent, jobId: string) {
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
