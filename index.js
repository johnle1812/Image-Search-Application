const accessKey = "zyrfAz1WfwmZYDx6zVTW6VkuCu99FNyw8v44Pd7NtUE";

const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".search-results");
const showMoreButton = document.getElementById("show-more-button");
const statusTextEl = document.getElementById("status-text");
const tagButtons = document.querySelectorAll(".tag-button");

let searchInput = "";
let page = 1;
let searchResultsHTML = "";

const renderEmptyState = (message) => {
  searchResultsEl.innerHTML = `<div class="empty-state">${message}</div>`;
};

async function searchImages() {
  searchInput = searchInputEl.value.trim();

  if (!searchInput) {
    showMoreButton.style.display = "none";
    statusTextEl.textContent = "Enter a search term to explore fresh image results.";
    renderEmptyState("Start with a search to load images here.");
    return;
  }

  statusTextEl.textContent = `Searching for "${searchInput}"...`;
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${searchInput}&client_id=${accessKey}`;

  const response = await fetch(url);
  const data = await response.json();
  if (page === 1) {
    searchResultsHTML = "";
    searchResultsEl.innerHTML = "";
  }

  const results = data.results;

  if (!results.length && page === 1) {
    showMoreButton.style.display = "none";
    statusTextEl.textContent = `No results found for "${searchInput}".`;
    renderEmptyState("No images matched that search. Try another keyword or style.");
    return;
  }

  results.forEach((result) => {
    const photographer = result.user?.name || "Unknown creator";

    searchResultsHTML += `
      <div class="search-result">
        <a
          href="${result.links.html}"
          target="_blank"
          rel="noopener noreferrer"
          >
          <img
            src="${result.urls.regular}"
            alt="${result.alt_description || "Unsplash image"}"
          />  
          <div class="result-copy">
            <p class="result-meta">Photo by ${photographer}</p>
          </div>
        </a
        >
      </div>
    `;
  });

  searchResultsEl.innerHTML = searchResultsHTML;
  statusTextEl.textContent = `Showing ${searchResultsEl.children.length} result${
    searchResultsEl.children.length === 1 ? "" : "s"
  } for "${searchInput}".`;

  if (results.length > 0) {
    showMoreButton.style.display = "block";
  }
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  page = 1;
  searchImages();
});

showMoreButton.addEventListener("click", () => {
  page++;
  searchImages();
});

tagButtons.forEach((button) => {
  button.addEventListener("click", () => {
    searchInputEl.value = button.textContent;
    page = 1;
    searchImages();
  });
});

renderEmptyState("Search for a theme, color, mood, or destination to begin.");
