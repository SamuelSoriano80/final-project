const indicator = "EG.FEC.RNEW.ZS";
const year = 2021;
const baseUrl = "https://api.worldbank.org/v2/country/all/indicator/";
const format = `?format=json&per_page=300&date=${year}`;

async function fetchAndRenderRankings() {
    const response = await fetch(`${baseUrl}${indicator}${format}`);
    const data = await response.json();
    const entries = data[1];

    const valid = entries.filter(entry => entry.value !== null && entry.country?.value !== "World");

    const top5 = [...valid].sort((a, b) => b.value - a.value).slice(0, 5);
    const bottom5 = [...valid].sort((a, b) => a.value - b.value).slice(0, 5);

    renderRankingBars("top5", top5, true);
    renderRankingBars("bottom5", bottom5, false);
}

function renderRankingBars(containerId, countries, isTop) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    countries.forEach(entry => {
        const barRow = document.createElement("div");
        barRow.className = "bar-row";

        const label = document.createElement("span");
        label.textContent = `${entry.country.value}: ${entry.value.toFixed(1)}%`;

        const barWrapper = document.createElement("div");
        barWrapper.className = "bar-wrapper";

        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.width = `${Math.min(entry.value, 100)}%`;
        bar.style.backgroundColor = isTop ? "var(--secondary-text)" : "darkred";

        barWrapper.appendChild(bar);
        barRow.appendChild(label);
        barRow.appendChild(barWrapper);
        container.appendChild(barRow);
    });
}

document.addEventListener("DOMContentLoaded", fetchAndRenderRankings);
