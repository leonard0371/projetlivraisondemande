import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { VendorProvider } from "./api/VendorContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <VendorProvider>
      <App />
    </VendorProvider>
  </React.StrictMode>
);
