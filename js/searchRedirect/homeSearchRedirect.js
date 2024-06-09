// Function to redirect to the search page

// Hero search bar
function handleHeroSearch() {
  const searchBar = document.getElementById('hero__search-bar');
  const query = searchBar.value;
  if (query) {
      window.location.href = `search.html?result=${encodeURIComponent(query)}`;
  }
}

document.getElementById('hero__search-button').addEventListener('click', handleHeroSearch);


document.getElementById('hero__search-bar').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
      handleHeroSearch();
  }
});

// Navigation search bar
function handleNavSearch() {
  const searchBar = document.getElementById('nav__search-bar');
  const query = searchBar.value;
  if (query) {
      window.location.href = `search.html?result=${encodeURIComponent(query)}`;
  }
}

document.getElementById('nav__search-button').addEventListener('click', handleNavSearch);


document.getElementById('nav__search-bar').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
      handleNavSearch();
  }
});

// Trending labels:
function handleTrendingSearch(event) {
  const topic = event.currentTarget.getAttribute('data-topic');
 
  if (topic) {
    window.location.href = `search.html?result=${encodeURIComponent(topic)}`;
  }
}

document.querySelectorAll('.hero__topic-container').forEach(function(topicContainer) {
  const topic = topicContainer.querySelector('span').textContent.toLowerCase();
  topicContainer.setAttribute('data-topic', topic);
  topicContainer.addEventListener('click', handleTrendingSearch);
});

// Footer search bar
function handleFooterSearch() {
  const searchBar = document.getElementById('footer__search-bar');
  const query = searchBar.value;
  if (query) {
      window.location.href = `search.html?result=${encodeURIComponent(query)}`;
  }
}

document.getElementById('footer__search-button').addEventListener('click', handleFooterSearch);


document.getElementById('footer__search-bar').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
      handleFooterSearch();
  }
});