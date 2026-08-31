import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/index.js"
import "./index.css";
import { QueryClient, QueryClientProvider } from 'react-query';
// Apply the persisted (or OS-preferred) theme before first paint to avoid a flash.
import { getInitialTheme, applyTheme } from "./utils/theme";
applyTheme(getInitialTheme());

// react router Browser Router
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);

// Register the offline-shell service worker (installable PWA). It's network-first
// for navigations, so it won't serve stale HTML during dev/HMR.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  });
}
