document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('nav__search-bar');
  const searchSuggestions = document.getElementById('search__suggestions');
  const trendingSuggestions = ['Nature', 'Animals', 'Travel', 'Hiking'];

  searchBar.addEventListener('focus', displaySuggestions);
  searchBar.addEventListener('blur', handleBlur);

  searchSuggestions.addEventListener('mousedown', (event) => {
    event.preventDefault(); // Prevent the search bar from losing focus
  });

  document.addEventListener('click', (event) => {
    if (!searchBar.contains(event.target) && !searchSuggestions.contains(event.target)) {
      searchSuggestions.style.display = 'none';
      searchBar.classList.remove('focused');
    }
  });

  function displaySuggestions() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchSuggestions.innerHTML = ''; // Clear any existing suggestions
    searchBar.classList.add('focused');

    // Display recent searches if any
    if (searchHistory.length > 0) {
      const recentSearchesParagraph = document.createElement('p');
      recentSearchesParagraph.innerHTML = `<i class="fa-solid fa-magnifying-glass" id="search__historyLabel-icon"></i> Recent searches`;
      searchSuggestions.appendChild(recentSearchesParagraph);

        searchHistory.forEach(search => {
          const button = document.createElement('button');
          button.className = 'search__historyLabel-button';
          button.innerHTML = `${search} <i class="fa-solid fa-magnifying-glass" id="search__historyLabel-icon"></i>`;
          button.addEventListener('click', () => handleSearchRedirect(search));
          searchSuggestions.appendChild(button);
        });
      }

    // Display trending suggestions if any
    if (trendingSuggestions.length > 0) {
      const trendingParagraph = document.createElement('p');
      trendingParagraph.innerHTML = `<i class="fa-solid fa-arrow-trend-up" id="trending__historyLabel-icon"></i> Trending`;
      searchSuggestions.appendChild(trendingParagraph);

      trendingSuggestions.forEach(suggestion => {
        const button = document.createElement('button');
        button.className = 'search__historyLabel-button';
        button.innerHTML = `${suggestion} <i class="fa-solid fa-magnifying-glass" id="search__historyLabel-icon"></i>`;
        button.addEventListener('click', () => handleSearchRedirect(suggestion));
        searchSuggestions.appendChild(button);
      });
    }

    searchSuggestions.style.display = 'block';
  }

  function handleBlur(event) {
    if (!searchSuggestions.contains(event.relatedTarget)) {
      searchSuggestions.style.display = "none";
      searchBar.classList.remove("focused");
    }
  }

  function handleSearchRedirect(query) {
    if (query) {
      window.location.href = `search.html?result=${encodeURIComponent(query)}`;
    }
  }
});
