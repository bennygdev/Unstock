// Function to store searches in local storage
function storeSearches(query) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    if (!searchHistory.includes(query.toLowerCase())) {
      searchHistory.push(query.toLowerCase());
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

// search bar button function
document.querySelector('.nav__search-button').addEventListener('click', function() {
    const query = document.querySelector('.nav__search-bar').value;
    
    // prevent blank search with if statement
    if (query) {
      storeSearches(query);
    }
  });

// search bar enter function
document.querySelector('.nav__search-bar').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      const query = document.querySelector('.nav__search-bar').value;

      // prevent blank search with if statement
      if (query) {
        storeSearches(query);
      }
    }
  });