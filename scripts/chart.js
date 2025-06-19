const indicator = "EG.FEC.RNEW.ZS";
const year = 2021;
const baseUrl = "https://api.worldbank.org/v2/country";
let countryList = [];

async function fetchCountries() {
    const url = `${baseUrl}?per_page=300&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    countryList = data[1].filter(c => c.region.id !== "NA");
    populateDropdowns();
}

function populateDropdowns() {
    const select1 = document.getElementById("country1");
    const select2 = document.getElementById("country2");
    countryList.forEach(c => {
        const option1 = document.createElement("option");
        option1.value = c.id;
        option1.textContent = c.name;

        const option2 = option1.cloneNode(true);

        select1.appendChild(option1);
        select2.appendChild(option2);
    });
}

async function fetchRenewable(countryCode) {
    const url = `${baseUrl}/${countryCode}/indicator/${indicator}?date=${year}&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    return data[1]?.[0]?.value ?? null;
}

function renderBarChart(value1, name1, value2, name2) {
    const container = document.getElementById("comparisonChart");
    const safeVal1 = typeof value1 === "number" ? value1 : 0;
    const safeVal2 = typeof value2 === "number" ? value2 : 0;

    container.innerHTML = `
      <div class="bar-row">
        <span>${name1}: ${value1?.toFixed(1) ?? "N/A"}%</span>
        <div class="bar-wrapper">
          <div class="bar" style="width: ${Math.min(safeVal1, 100)}%"></div>
        </div>
      </div>
      <div class="bar-row">
        <span>${name2}: ${value2?.toFixed(1) ?? "N/A"}%</span>
        <div class="bar-wrapper">
          <div class="bar" style="width: ${Math.min(safeVal2, 100)}%"></div>
        </div>
      </div>
    `;
}


async function compareCountries() {
    const select1 = document.getElementById("country1");
    const select2 = document.getElementById("country2");
    const code1 = select1.value;
    const code2 = select2.value;
    const name1 = select1.selectedOptions[0].text;
    const name2 = select2.selectedOptions[0].text;

    const [value1, value2] = await Promise.all([
        fetchRenewable(code1),
        fetchRenewable(code2)
    ]);

    renderBarChart(value1, name1, value2, name2);
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchCountries();
    document.getElementById("compareBtn").addEventListener("click", compareCountries);
});
