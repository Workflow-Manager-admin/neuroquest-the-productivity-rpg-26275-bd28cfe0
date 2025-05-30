import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./tailwind-glass.css";
import App from "./App";

// StrictMode remounted with App, as in Vite-style entry.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
