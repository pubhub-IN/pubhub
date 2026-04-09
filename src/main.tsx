import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./lib/ThemeContext";
import App from "./App.tsx";
import "./index.css";

const noop = () => undefined;
console.log = noop;
console.info = noop;
console.warn = noop;
console.error = noop;
console.debug = noop;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
