async function loadEcoTip() {
    try {
        const response = await fetch("tips.json");
        const tips = await response.json();
        const randomTip = tips[Math.floor(Math.random() * tips.length)];

        document.querySelector(".flip-card-front p").textContent = randomTip.tip;
        document.querySelector(".flip-card-back p").textContent = randomTip.challenge;
    } catch (error) {
        console.error("Error loading eco tips:", error);
    }
}

async function loadDailyQuote() {
    try {
        const response = await fetch("https://api.api-ninjas.com/v1/quotes", {
            headers: {
                "X-Api-Key": "0uh4s4yyTar35WkI7M4PdA==EaGEyoInxMx8wFBz"
            }
        });

        const data = await response.json();
        const quote = data[0];

        document.getElementById("quoteText").textContent = `"${quote.quote}"`;
        document.getElementById("quoteAuthor").textContent = `– ${quote.author || "Unknown"}`;

        window.currentQuote = {
            content: quote.quote,
            author: quote.author || "Unknown"
        };
    } catch (err) {
        console.error("Failed to load quote:", err);
    }
}


function saveQuoteToFavorites() {
    const saved = JSON.parse(localStorage.getItem("favoriteQuotes")) || [];
    const exists = saved.some(q => q.content === window.currentQuote.content);

    if (!exists && window.currentQuote) {
        saved.push(window.currentQuote);
        localStorage.setItem("favoriteQuotes", JSON.stringify(saved));
        alert("Quote saved to favorites!");
    } else if (exists) {
        alert("Quote already saved.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadEcoTip();
    loadDailyQuote();

    document.getElementById("saveQuoteBtn").addEventListener("click", saveQuoteToFavorites);
});