function applyTheme(theme) {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(`${theme}-mode`);
}

function toggleTheme() {
    const current = localStorage.getItem("theme") || "light";
    const next = current === "light" ? "dark" : "light";
    localStorage.setItem("theme", next);
    applyTheme(next);
    document.getElementById("theme-toggle").textContent = next === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
}

function createThemeToggleButton() {
    const btn = document.createElement("button");
    btn.id = "theme-toggle";
    btn.style.position = "absolute";
    btn.style.top = "1rem";
    btn.style.right = "1rem";
    btn.style.zIndex = "999";
    btn.style.padding = "0.5rem 1rem";
    btn.style.borderRadius = "0.5rem";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    btn.style.backgroundColor = "var(--secondary-text)";
    btn.style.color = "white";
    btn.style.fontSize = "0.9rem";
    btn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";

    const theme = localStorage.getItem("theme") || "light";
    applyTheme(theme);
    btn.textContent = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";

    btn.addEventListener("click", toggleTheme);
    document.body.appendChild(btn);
}

document.addEventListener("DOMContentLoaded", createThemeToggleButton);  