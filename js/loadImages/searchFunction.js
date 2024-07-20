document.addEventListener('DOMContentLoaded', function() {
  const apiKey = 'gY7YL3TYC3zwSfPTln6WPnaKS4psOajcnKlg3a7HJlOj5NfXpzoFFoKJ';

  let currentPage = 1; // Track the current page of results
  const perPage = 96; // Number of images per page

  const loadMoreButton = document.getElementById('load-more-button');
  loadMoreButton.style.display = 'none';
  const spinnerContainer = document.querySelector('.spinner__container');
  const modalSpinnerContainer = document.querySelector('.modalSpinner__container');

  function showSpinner() {
    spinnerContainer.style.display = 'flex';
  }

  function hideSpinner() {
    spinnerContainer.style.display = 'none';
  }

  function showModalSpinner() {
    modalSpinnerContainer.style.display = 'flex';
  }

  function hideModalSpinner () {
    modalSpinnerContainer.style.display = 'none';
  }

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
  
    labelWrapper.innerHTML = '';
  
    // Create buttons for each search term
    if (searchHistory.length === 0) {
      recentSearchesWrapper.style.display = 'none';
    } else {
      searchHistory.forEach(search => {
        const button = document.createElement('button');
        button.className = 'search__historyLabel-button';
        button.innerHTML = `${search} <i class="fa-solid fa-magnifying-glass" id="search__historyLabel-icon"></i>`;
        button.addEventListener('click', function() {
          searchImages(search);
          updateURL(search);
          document.querySelector('.nav__search-bar').value = search;
        });
        labelWrapper.appendChild(button);
      });
  
      // Show the recent searches container
      if (searchHistory.length > 0) {
        labelWrapper.style.display = 'block';
      } else {
        labelWrapper.style.display = 'none';
      }
    }
  }

  displayRecentSearches();

  // Search function for images
  function searchImages(query) {
    const noResultsContainer = document.querySelector('.no-results-container');
    noResultsContainer.style.display = 'none';
    showSpinner();
    const url = `https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}`;

    fetch(url, {
      headers: {
        'Authorization': apiKey
      }
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('image-container-1').innerHTML = '';
      document.getElementById('image-container-2').innerHTML = '';
      document.getElementById('image-container-3').innerHTML = '';
      const resultsFor = document.querySelector('.results-for');
      const resultsDivider = document.getElementById('search__result--divider');
      const noResultsContainer = document.querySelector('.no-results-container');
      const resultsSpan = document.getElementById("search__result");

      if (data.photos && data.photos.length > 0) {
        displayImages(data.photos)

        loadMoreButton.style.display = 'block';
        resultsFor.style.display = 'block';
        resultsDivider.style.display = 'block';
        resultsSpan.textContent = `${query}`;
        noResultsContainer.style.display = 'none';
      } else {
        document.getElementById('image-container-1').innerHTML = '';
        document.getElementById('image-container-2').innerHTML = '<p>No images found. <a href="search.html">Go back</a></p>';
        document.getElementById('image-container-3').innerHTML = '';

        loadMoreButton.style.display = 'none';
        resultsFor.style.display = 'none';
        resultsDivider.style.display = 'none';
        noResultsContainer.style.display = 'none';
        }
      })
      .catch(error => {
        console.error('Error fetching the images:', error);
        document.getElementById('image-container-1').innerHTML = '';
        document.getElementById('image-container-2').innerHTML = '<p>An error occurred while fetching the images.</p>';
        document.getElementById('image-container-3').innerHTML = '';

        // Hide the Load More button
        loadMoreButton.style.display = 'none';
        resultsFor.style.display = 'none';
        resultsDivider.style.display = 'none';
        noResultsContainer.style.display = 'none';
      })
      .finally(() => {
        hideSpinner();
      })
  }

  // Display images
  function displayImages(photos) {
    const columns = document.querySelectorAll('.column');

    // Loop through the photos and distribute them across the three columns
    photos.forEach((photo, index) => {
      const img = document.createElement('img');
      img.src = photo.src.large;
      img.alt = photo.photographer;
      img.setAttribute('data-photo-id', photo.id); // set id for each img
      img.addEventListener('click', function() {
        showModal(photo.src.original, photo.photographer, photo.id);
      });

      const columnIndex = index % columns.length;
      columns[columnIndex].appendChild(img);
    });
  }

  // Function to show the modal with the clicked image
  function showModal(imageSrc, photographerName, photoId) {
    const modal = document.getElementById("image__modal");
    const modalImg = document.getElementById("modal__image");
    const downloadButton = document.getElementById("download-button");
    const photographerElement = document.getElementById("image__photographer--name");
    const photographerElementBottom = document.getElementById("image__photographer--name-bottom");
    const saveBookmark = document.querySelector('.save');

    showModalSpinner();
    modalImg.style.display = 'none';

    modalImg.src = imageSrc;
    modalImg.setAttribute('data-photo-id', photoId);

    photographerElement.textContent = `By ${photographerName}`;
    photographerElementBottom.textContent = `By ${photographerName}`;

    downloadButton.onclick = function () {
      downloadImage(imageSrc, photographerName);
    };

    // Check if the photo is saved
    const savedPhotos = JSON.parse(localStorage.getItem('savedPhotos')) || [];
    if (savedPhotos.includes(photoId)) {
      saveBookmark.classList.remove('fa-regular');
      saveBookmark.classList.add('fa-solid');
    } else {
      saveBookmark.classList.remove('fa-solid');
      saveBookmark.classList.add('fa-regular');
    }

    saveBookmark.onclick = function () {
      toggleSave(photoId);
    };

    modalImg.onload = function() {
      hideModalSpinner();
      modalImg.style.display = 'block';
    };

    modal.style.display = "block";
  }

  // Toggle save for an image
  function toggleSave(photoId) {
    const savedPhotos = JSON.parse(localStorage.getItem('savedPhotos')) || [];

    const index = savedPhotos.indexOf(photoId);
    if (index === -1) {
      savedPhotos.push(photoId);
    } else {
      savedPhotos.splice(index, 1);
    }

    localStorage.setItem('savedPhotos', JSON.stringify(savedPhotos));

    const saveBookmark = document.querySelector('.save');
    if (index === -1) {
      saveBookmark.classList.remove('fa-regular');
      saveBookmark.classList.add('fa-solid');
    } else {
      saveBookmark.classList.remove('fa-solid');
      saveBookmark.classList.add('fa-regular');
    }
  }

  // Downloads image of the url
  function downloadImage(url) {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const filename = getFilenameFromUrl(url);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
      })
      .catch((error) => console.error("Error downloading the image:", error));
    }

  // Gets filename from the url and passes it as the download name
  function getFilenameFromUrl(url) {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
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

  document.getElementById('load-more-button').addEventListener('click', loadMoreImages);

  // Function to load more images
  function loadMoreImages() {
    loadMoreButton.style.display = 'none';
    showSpinner();
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
        // console.log(data)
        displayImages(data.photos)

        loadMoreButton.style.display = 'block';
      } else {
        document.getElementById('load-more-container').innerHTML = 'No more images to load';
        loadMoreButton.style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Error fetching more images:', error);
    })
    .finally(() => {
      hideSpinner();
    })
  }

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

  // footer search bar button function
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
});