document.addEventListener("DOMContentLoaded", () => {
    // 1. Selector de Temas
    const themeSelector = document.getElementById("theme-selector");
    const savedTheme = localStorage.getItem("erp-theme") || "theme-light";
    document.body.className = savedTheme;
    if (themeSelector) themeSelector.value = savedTheme;

    if (themeSelector) {
        themeSelector.addEventListener("change", (e) => {
            document.body.className = e.target.value;
            localStorage.setItem("erp-theme", e.target.value);
        });
    }

    // 2. Toggle de visualización de colores en stock
    const toggleColorsBtn = document.getElementById("toggle-colors");
    const targetTable = document.querySelector(".taula-estoc");
    const savedColors = localStorage.getItem("show-colors") === "true";

    if (targetTable && savedColors) targetTable.classList.add("show-colors");

    if (toggleColorsBtn && targetTable) {
        toggleColorsBtn.addEventListener("click", () => {
            const state = targetTable.classList.toggle("show-colors");
            localStorage.setItem("show-colors", state);
        });
    }

    // 3. Toggle de Dashboard (Compacto / Complet)
    const toggleDashBtn = document.getElementById("toggle-dashboard");
    const fullDash = document.getElementById("dashboard-full");
    const compDash = document.getElementById("dashboard-compact");

    if (toggleDashBtn && fullDash && compDash) {
        toggleDashBtn.addEventListener("click", () => {
            fullDash.classList.toggle("hidden");
            compDash.classList.toggle("hidden");
            toggleDashBtn.innerText = fullDash.classList.contains("hidden") ? "Veure Tauler Complet" : "Veure Tauler Compacte";
        });
    }
});