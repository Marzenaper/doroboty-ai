import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./features/prototype/app";
import { startPageAnalytics } from "./features/prototype/analytics";
import "./app/globals.css";

void startPageAnalytics().catch(() => {
  // The prototype remains usable when the analytics library cannot load.
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
