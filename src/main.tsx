
  import { injectContentsquareScript } from "@contentsquare/tag-sdk";
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";

  injectContentsquareScript({ clientId: "90b1df2bcdb90" });
  createRoot(document.getElementById("root")!).render(<App />);
