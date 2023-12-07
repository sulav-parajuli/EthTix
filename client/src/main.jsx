import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const Root = () => (
  <BrowserRouter>
    <AppProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="events" element={<Event />} />
      </Routes>
    </AppProvider>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
export default Root;
