const tbody = document.getElementById("leaderboard-body");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const searchInput = document.getElementById("search-input");

let leaderboardData = [];
let filteredData = [];
let currentPage = 1;
const perPage = 10;
let currentSort = { key: null, asc: true };

// Fetch JSON
fetch("LEADER.json")
    .then(res => res.json())
    .then(data => {
        leaderboardData = data.map(player => {
            const [firstName, lastName = ""] = player.name.split(" ");
            return { ...player, firstName, lastName };
        });
        filteredData = leaderboardData;
        renderPage(currentPage);
    })
    .catch(err => console.error("Failed to load leaderboard:", err));

// Render page
function renderPage(page) {
    tbody.innerHTML = "";
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pageData = filteredData.slice(start, end);

    pageData.forEach((player, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td class="rank-cell">
        <img src="${player.avatar_url}" alt="${player.firstName}" />
        ${start + index + 1}
      </td>
      <td>${player.firstName}</td>
      <td>${player.lastName}</td>
      <td>${player.score}</td>
      <td>${player.level}</td>
      <td>${formatDate(player.join_date)}</td>
      <td>${player.country}</td>
    `;
        tbody.appendChild(row);
    });
}

// Format date
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
}

// Pagination
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
    }
});

nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredData.length / perPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
    }
});

// Sorting
function sortBy(key) {
    currentSort.asc = currentSort.key === key ? !currentSort.asc : true;
    currentSort.key = key;

    filteredData.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        if (key === "join_date") {
            valA = new Date(valA);
            valB = new Date(valB);
        }

        if (typeof valA === "string") {
            return currentSort.asc
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
        } else {
            return currentSort.asc ? valA - valB : valB - valA;
        }
    });

    updateSortIcons();
    currentPage = 1;
    renderPage(currentPage);
}

// Update sort icons
function updateSortIcons() {
    document.querySelectorAll(".sort-icon").forEach(icon => {
        const key = icon.dataset.key;
        icon.textContent = key === currentSort.key
            ? (currentSort.asc ? "▲" : "▼")
            : "";
    });
}

// Header listeners
document.getElementById("sort-first").addEventListener("click", () => sortBy("firstName"));
document.getElementById("sort-last").addEventListener("click", () => sortBy("lastName"));
document.getElementById("sort-score").addEventListener("click", () => sortBy("score"));
document.getElementById("sort-level").addEventListener("click", () => sortBy("level"));
document.getElementById("sort-date").addEventListener("click", () => sortBy("join_date"));
document.getElementById("sort-country").addEventListener("click", () => sortBy("country"));

// Search filter
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    filteredData = leaderboardData.filter(player =>
        player.name.toLowerCase().includes(query) ||
        player.country.toLowerCase().includes(query)
    );
    currentPage = 1;
    renderPage(currentPage);
});





