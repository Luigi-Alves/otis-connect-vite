// main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Deixar aqui pra quando quisermos limpar o localStorage. Por padrão, deixem como comentário.
// localStorage.clear();

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
