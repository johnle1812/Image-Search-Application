const accessKey = "zyrfAz1WfwmZYDx6zVTW6VkuCu99FNyw8v44Pd7NtUE";

const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".search-results");
const showMoreButton = document.getElementById("show-more-button");
const statusTextEl = document.getElementById("status-text");
const tagButtons = document.querySelectorAll(".tag-button");
const resultsShellEl = document.getElementById("results-shell");

let searchInput = "";
let page = 1;
let totalResultsShown = 0;

const renderEmptyState = (message) => {
  searchResultsEl.innerHTML = `<div class="empty-state">${message}</div>`;
};

const showResultsShell = () => {
  resultsShellEl.classList.remove("is-hidden");
};

const createResultCard = (result) => {
  const photographer = result.user?.name || "Unknown creator";

  return `
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
      </a>
    </div>
  `;
};

async function searchImages() {
  searchInput = searchInputEl.value.trim();

  if (!searchInput) {
    resultsShellEl.classList.add("is-hidden");
    showMoreButton.style.display = "none";
    return;
  }

  showResultsShell();
  statusTextEl.textContent = `Searching for "${searchInput}"...`;
  showMoreButton.disabled = true;
  showMoreButton.textContent = "Loading...";

  try {
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${encodeURIComponent(searchInput)}&client_id=${accessKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const results = data.results || [];

    if (page === 1) {
      totalResultsShown = 0;
      searchResultsEl.innerHTML = "";
    }

    if (!results.length && page === 1) {
      showMoreButton.style.display = "none";
      statusTextEl.textContent = `No results found for "${searchInput}".`;
      renderEmptyState("No images matched that search. Try another keyword or style.");
      return;
    }

    if (!results.length && page > 1) {
      showMoreButton.style.display = "none";
      statusTextEl.textContent = `You've reached the end of the results for "${searchInput}".`;
      return;
    }

    const cardsHTML = results.map(createResultCard).join("");
    searchResultsEl.insertAdjacentHTML("beforeend", cardsHTML);
    totalResultsShown += results.length;

    statusTextEl.textContent = `Showing ${totalResultsShown} result${
      totalResultsShown === 1 ? "" : "s"
    } for "${searchInput}".`;

    showMoreButton.style.display = results.length > 0 ? "block" : "none";
  } catch (error) {
    showMoreButton.style.display = "none";
    statusTextEl.textContent = "Something went wrong while loading images.";
    renderEmptyState("The search request failed. Please try again in a moment.");
    console.error(error);
  } finally {
    showMoreButton.disabled = false;
    showMoreButton.textContent = "Show more";
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
