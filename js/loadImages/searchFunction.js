
document.addEventListener('DOMContentLoaded', function() {
  const apiKey = 'gY7YL3TYC3zwSfPTln6WPnaKS4psOajcnKlg3a7HJlOj5NfXpzoFFoKJ';

  let currentPage = 1; // Track the current page of results
  const perPage = 96; // Number of images per page

    // Hide the Load More button by default
    const loadMoreButton = document.getElementById('load-more-button');
    loadMoreButton.style.display = 'none';

    // navigation search bar button function
    document.querySelector('.nav__search-button').addEventListener('click', function() {
        const query = document.querySelector('.nav__search-bar').value;
        
        // prevent blank search with if statement
        if (query) {
            searchImages(query);
            updateURL(query);
            displayRecentSearches();
        }
    });

    // navigation search bar enter function
    document.querySelector('.nav__search-bar').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const query = document.querySelector('.nav__search-bar').value;

            // prevent blank search with if statement
            if (query) {
                searchImages(query);
                updateURL(query);
                displayRecentSearches();
            }
        }
    });

    //  footer search bar button function
    document.querySelector('.footer__search-button').addEventListener('click', function() {
        const query = document.querySelector('.footer__search-bar').value;
        
        // prevent blank search with if statement
        if (query) {
            searchImages(query);
            updateURL(query);
            displayRecentSearches();
        }
    });

    //  footer search bar enter function
    document.querySelector('.footer__search-bar').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const query = document.querySelector('.footer__search-bar').value;

            // prevent blank search with if statement
            if (query) {
                searchImages(query);
                updateURL(query);
                displayRecentSearches();
            }
        }
    });

    // Takes the result from the URL and searches for the image based on the search query
    function updateURL(query) {
        const newURL = window.location.origin + window.location.pathname + '?result=' + encodeURIComponent(query);
        window.history.pushState({path:newURL},'',newURL);
    }

    // Function to retrieve search query from URL
    function getSearchQueryFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('result');
    }

    // Initial search query from URL, if available
    const initialSearchQuery = getSearchQueryFromURL();
    if (initialSearchQuery) {
        document.querySelector('.nav__search-bar').value = initialSearchQuery;
        searchImages(initialSearchQuery);
    }

    // Function to display recent searches as buttons
  function displayRecentSearches() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const labelWrapper = document.querySelector('.label__wrapper');
    const recentSearchesWrapper = document.querySelector('.recentSearches__wrapper');
  
    // Clear any existing buttons
    labelWrapper.innerHTML = '';
  
    // Create buttons for each search term
    if (searchHistory.length === 0) {
      recentSearchesWrapper.style.display = 'none';
    } else {
      searchHistory.forEach(search => {
        const button = document.createElement('button');
        button.className = 'search__historyLabel-button';
        // button.textContent = search;
        button.innerHTML = `${search} <i class="fa-solid fa-magnifying-glass" id="search__historyLabel-icon"></i>`;
        button.addEventListener('click', function() {
          searchImages(search);
          updateURL(search);
          document.querySelector('.nav__search-bar').value = search;
        });
        labelWrapper.appendChild(button);
      });
  
      //Show the recent searches container
      if (searchHistory.length > 0) {
        labelWrapper.style.display = 'block';
      } else {
        labelWrapper.style.display = 'none';
      }
    }
  }
  

  // Display recent searches on page load
  displayRecentSearches();

    // Search functioon for images
  function searchImages(query) {
      const url = `https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}`;

      fetch(url, {
          headers: {
              'Authorization': apiKey
          }
      })
      .then(response => response.json())
      .then(data => {
          // Clear any existing images
          document.getElementById('image-container-1').innerHTML = '';
          document.getElementById('image-container-2').innerHTML = '';
          document.getElementById('image-container-3').innerHTML = '';
          const resultsFor = document.querySelector('.results-for');
          const noResultsContainer = document.querySelector('.no-results-container');
          const resultsSpan = document.getElementById("search__result");

          if (data.photos && data.photos.length > 0) {
              // Loop through the photos and distribute them across the three columns
              data.photos.forEach((photo, index) => {
                  const img = document.createElement('img');
                  img.src = photo.src.large;
                  img.alt = photo.photographer;
                  img.id = `image-${index}`; // Set a unique ID for each image
                    img.addEventListener('click', function() {
                        showModal(photo.src.original, photo.photographer);
                    });

                  if (index % 3 === 0) {
                      document.getElementById('image-container-1').appendChild(img);
                  } else if (index % 3 === 1) {
                      document.getElementById('image-container-2').appendChild(img);
                  } else {
                      document.getElementById('image-container-3').appendChild(img);
                  }
              });

               // Show the Load More button
               loadMoreButton.style.display = 'block';
               resultsFor.style.display = 'block';
               resultsSpan.textContent = `${query}`;
                noResultsContainer.style.display = 'none';
          } else {
              document.getElementById('image-container-1').innerHTML = 'No images found';
              document.getElementById('image-container-2').innerHTML = 'No images found';
              document.getElementById('image-container-3').innerHTML = 'No images found';

            // Hide the Load More button
            loadMoreButton.style.display = 'none';
            resultsFor.style.display = 'none';
            noResultsContainer.style.display = 'none';
          }
      })
      .catch(error => {
          console.error('Error fetching the images:', error);
          document.getElementById('image-container-1').innerHTML = 'An error occurred while fetching the images.';
          document.getElementById('image-container-2').innerHTML = 'An error occurred while fetching the images.';
          document.getElementById('image-container-3').innerHTML = 'An error occurred while fetching the images.';

        // Hide the Load More button
        loadMoreButton.style.display = 'none';
        resultsFor.style.display = 'none';
        noResultsContainer.style.display = 'flex';
      });
  }

  // Function to show the modal with the clicked image
  function showModal(imageSrc, photographerName) {
    const modal = document.getElementById("image__modal");
    const modalImg = document.getElementById("modal__image");
    const downloadButton = document.getElementById("download-button");
    const photographerElement = document.getElementById("image__photographer--name");

    modalImg.src = imageSrc;
    photographerElement.textContent = `Photographer: ${photographerName}`;

    downloadButton.onclick = function () {
      downloadImage(imageSrc, photographerName);
    };

    modal.style.display = "block";
  }

    // Downloads image of the url
    function downloadImage(url, imageId) {
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          // Extract filename from URL
          const filename = getFilenameFromUrl(url);

          // Create a link element, set its href and download attributes, and simulate a click
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          link.click();
          URL.revokeObjectURL(link.href); // Clean up
        })
        .catch((error) => console.error("Error downloading the image:", error));
    }

    // Gets filename from the url and passes it as the download name
    function getFilenameFromUrl(url) {
      // Extract filename from URL
      const urlParts = url.split("/");
      const lastSegment = urlParts[urlParts.length - 1];
      const filename = lastSegment.split("?")[0]; // Remove query params if any
      return filename;
    }


  // Get the modal element
  const modal = document.getElementById('image__modal');

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName('close')[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      modal.style.display = 'none';
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = 'none';
      }
  }

    // Event listener for the "Load more" button
    document.getElementById('load-more-button').addEventListener('click', loadMoreImages);

  // Function to load more images
  function loadMoreImages() {
      currentPage++; // Increment the page number
      const query = document.querySelector('.nav__search-bar').value;
      const url = `https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}&page=${currentPage}`;

      fetch(url, {
          headers: {
              'Authorization': apiKey
          }
      })
      .then(response => response.json())
      .then(data => {
          if (data.photos && data.photos.length > 0) {
              data.photos.forEach((photo, index) => {
                  // Create and append image elements to the appropriate container
                  const img = document.createElement('img');
                  img.src = photo.src.large;
                  img.alt = photo.photographer;
                  img.id = `image-${index}`; // Set a unique ID for each image
                  img.addEventListener('click', function() {
                      showModal(photo.src.original, photo.photographer);
                  });

                  // Determine which column to append the image to
                  const columnIndex = (index + 1) % 3;
                  const containerId = `image-container-${columnIndex === 0 ? 3 : columnIndex}`;

                  document.getElementById(containerId).appendChild(img);
              });

              // Show the Load More button
              loadMoreButton.style.display = 'block';
          } else {
              // No more images to load
              document.getElementById('load-more-container').innerHTML = 'No more images to load';
            // Hide the Load More button
            loadMoreButton.style.display = 'none';
          }
      })
      .catch(error => {
          console.error('Error fetching more images:', error);
      });
  }
});