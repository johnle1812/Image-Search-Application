const accessKey = "zyrfAz1WfwmZYDx6zVTW6VkuCu99FNyw8v44Pd7NtUE";

const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".search-results");
const showMoreButton = document.getElementById("show-more-button");

let searchInput = "";
let page = 1;
let searchResultsHTML = "";
async function searchImages() {
  searchInput = searchInputEl.value;
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${searchInput}&client_id=${accessKey}`;

  const response = await fetch(url);
  const data = await response.json();
  if (page === 1) {
    searchResultsEl.innerHTML = "";
  }

  const results = data.results;

  results.forEach((result) => {
    searchResultsHTML += `
      <div class="search-result">
        <a
          href="${result.links.html}"
          target="_blank"
          rel="noopener noreferrer"
          >
          <img
            src="${result.urls.full}"
            alt="${result.alt_description}"
          />  
        </a
        >
      </div>
    `;
  });

  searchResultsEl.innerHTML = searchResultsHTML;

  if (page >= 1) {
    showMoreButton.style.display = "block";
  }
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  searchResultsHTML = "";
  searchImages();
});

showMoreButton.addEventListener("click", () => {
  page++;
  searchImages();
});
