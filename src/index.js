import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { initReactI18next } from "react-i18next";
import i18n from "i18next";

import enTranslation from "./language/en.json";
import hiTranslation from "./language/hi.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    hi: { translation: hiTranslation },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
