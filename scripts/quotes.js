function loadSavedQuotes() {
    const quotes = JSON.parse(localStorage.getItem("favoriteQuotes")) || [];
    const container = document.getElementById("quotesList");
    container.innerHTML = "";

    if (quotes.length === 0) {
        container.innerHTML = "<p>You haven't saved any quotes yet.</p>";
        return;
    }

    quotes.forEach((quote, index) => {
        const card = document.createElement("div");
        card.classList.add("quote-card");

        card.innerHTML = `
        <blockquote>"${quote.content}"</blockquote>
        <cite>– ${quote.author}</cite>
        <button class="remove-quote-btn" data-index="${index}">🗑️ Remove</button>
      `;

        container.appendChild(card);
    });

    attachRemoveHandlers();
}

function attachRemoveHandlers() {
    const buttons = document.querySelectorAll(".remove-quote-btn");

    buttons.forEach(button => {
        button.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            let quotes = JSON.parse(localStorage.getItem("favoriteQuotes")) || [];

            quotes.splice(index, 1);
            localStorage.setItem("favoriteQuotes", JSON.stringify(quotes));
            loadSavedQuotes();
        });
    });
}

document.addEventListener("DOMContentLoaded", loadSavedQuotes);  