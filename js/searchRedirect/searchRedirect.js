// Function to redirect to search page
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
