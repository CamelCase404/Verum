import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// 1. Принимаем токен и тему из URL
const params = new URLSearchParams(window.location.search);
const tokenFromUrl = params.get("token");
const themeFromUrl = params.get("theme");

if (tokenFromUrl) {
    localStorage.setItem("verum_token", tokenFromUrl);
    params.delete("token");
}
if (themeFromUrl) {
    localStorage.setItem("theme", themeFromUrl);
    params.delete("theme");
}
if (tokenFromUrl || themeFromUrl) {
    const query = params.toString();
    window.history.replaceState(
        {},
        document.title,
        window.location.pathname + (query ? `?${query}` : ""),
    );
}

// 2. Подхватываем тему из localStorage (которую сохранил основной сайт)
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
