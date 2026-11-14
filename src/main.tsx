
  import { createRoot, hydrateRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";

  const root = document.getElementById("root")!;

  // Production routes are prerendered. Hydrating preserves that useful first
  // paint while lazy page code loads; createRoot would erase it and briefly
  // replace the page with the Suspense fallback.
  if (root.hasChildNodes()) {
    hydrateRoot(root, <App />);
  } else {
    createRoot(root).render(<App />);
  }
