const indicators = {
    co2: "EN.GHG.CO2.PC.CE.AR5",
    energy: "EG.USE.PCAP.KG.OE",
    renewable: "EG.FEC.RNEW.ZS"
};

const latestYear = 2021; // used this year since it has data of all countries more consistently
const baseUrl = "https://api.worldbank.org/v2/country";
const format = "json";

let countryList = [];

async function fetchCountryList() {
    const url = "https://api.worldbank.org/v2/country?per_page=300&format=json";
    const response = await fetch(url);
    const data = await response.json();
    if (Array.isArray(data[1])) {
        countryList = data[1]
            .filter((c) => c.region.id !== "NA")
            .map((c) => ({
                name: c.name,
                code: c.id
            }));
    }
}

async function fetchCountryStats(countryCode) {
    const results = {};

    for (const [key, indicator] of Object.entries(indicators)) {
        const url = `${baseUrl}/${countryCode}/indicator/${indicator}?date=${latestYear}&format=${format}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (Array.isArray(data) && data[1]) {
                results[key] = data[1][0]?.value ?? "No data";
            } else {
                results[key] = "Unavailable";
            }
        } catch (error) {
            console.error(`Error fetching ${key}:`, error);
            results[key] = "Error";
        }
    }

    return results;
}

function renderStats(stats, countryName) {
    const container = document.querySelector(".stats-cards");
    const title = document.querySelector("#country-stats h2");

    title.innerHTML = `Sustainability Stats: ${countryName}`;
    const friendly = (val) =>
        val === "Unavailable" || val === "No data" || val === null
            ? "Data not available"
            : val;

    container.innerHTML = `
      <div><h3>CO₂ Emissions per Capita</h3><p>${friendly(stats.co2)} metric tons</p></div>
      <div><h3>Energy Use per Capita</h3><p>${friendly(stats.energy)} kg of oil equivalent</p></div>
      <div><h3>Renewable Energy %</h3><p>${friendly(stats.renewable)}%</p></div>
    `;
}

function setupCountrySearch() {
    const input = document.getElementById("countrySearch");

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const search = input.value.trim().toLowerCase();

            const match = countryList.find((c) =>
                c.name.toLowerCase() === search ||
                c.name.toLowerCase().startsWith(search)
            );

            if (match) {
                fetchCountryStats(match.code).then((stats) => {
                    renderStats(stats, match.name);
                });
            } else {
                alert("Country not found. Please try a different name.");
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchCountryList();

    // Default country: Mexico
    const defaultCountry = countryList.find((c) => c.code === "MEX");
    if (defaultCountry) {
        const stats = await fetchCountryStats(defaultCountry.code);
        renderStats(stats, defaultCountry.name);
    }

    setupCountrySearch();
});
