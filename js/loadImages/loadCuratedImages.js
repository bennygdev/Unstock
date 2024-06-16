document.addEventListener('DOMContentLoaded', function() {
  const apiKey = 'gY7YL3TYC3zwSfPTln6WPnaKS4psOajcnKlg3a7HJlOj5NfXpzoFFoKJ';
  let currentPage = 1; // Track the current page of results
  const perPage = 96; // Number of images per page

  const loadMoreButton = document.getElementById('load-more-button');
  const spinnerContainer = document.querySelector('.spinner__container');
  const loadSpinnerContainer = document.querySelector('.loadSpinner__container');
  const modalSpinnerContainer = document.querySelector('.modalSpinner__container');

  function showSpinner() {
    spinnerContainer.style.display = 'flex';
  }

  function hideSpinner() {
    spinnerContainer.style.display = 'none';
  }

  function showLoadSpinner() {
    loadSpinnerContainer.style.display = 'flex';
  }

  function hideLoadSpinner() {
    loadSpinnerContainer.style.display = 'none';
  }

  function showModalSpinner() {
    modalSpinnerContainer.style.display = 'flex';
  }

  function hideModalSpinner () {
    modalSpinnerContainer.style.display = 'none';
  }

  fetchCuratedImages();

  // Fetches curated images
  function fetchCuratedImages() {
    showSpinner();
    const url = `https://api.pexels.com/v1/curated?per_page=${perPage}`;

    fetch(url, {
      headers: {
        'Authorization': apiKey
      }
    })
    .then(response => response.json())
    .then(data => {
      displayImages(data.photos);
      // console.log(data)
    })
    .catch(error => console.error('Error fetching curated images:', error))
    .finally(() => {
      hideSpinner();
    })
  }

  // Fetches response and displays images
  function displayImages(photos) {
    const columns = document.querySelectorAll('.column');

    photos.forEach((photo, index) => {
      const img = document.createElement('img');
      img.src = photo.src.large;
      img.alt = photo.photographer;
      img.setAttribute('data-photo-id', photo.id); // set id for each image
      img.addEventListener('click', function() {
        showModal(photo.src.original, photo.photographer, photo.id);
      });

      // Determine which column to append the image to
      const columnIndex = index % columns.length;
      columns[columnIndex].appendChild(img);
    });
  }

  // Shows modal after image is clicked
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
      // console.log('click')
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
  function downloadImage(url, photographerName) {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const filename = getFilenameFromUrl(url);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${photographerName}_${filename}`;
        link.click();
        URL.revokeObjectURL(link.href);
      })
      .catch(error => console.error("Error downloading the image:", error));
  }

  // Gets filename from the url and passes it as download name
  function getFilenameFromUrl(url) {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
  }

  // Load more images
  function loadMoreImages() {
    loadMoreButton.style.display = 'none';
    showLoadSpinner();
    currentPage++;
    const url = `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${currentPage}`;

    fetch(url, {
      headers: {
        'Authorization': apiKey
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.photos && data.photos.length > 0) {
        displayImages(data.photos);
        loadMoreButton.style.display = 'block';
      } else {
        document.getElementById('load-more-container').innerHTML = 'No more images to load';
        // Hide the Load More button
        loadMoreButton.style.display = 'none';
      }
    })
    .catch(error => console.error('Error fetching more images:', error))
    .finally(()  => {
      hideLoadSpinner();
    })
  }

  // Load more images function
  document.getElementById('load-more-button').addEventListener('click', loadMoreImages);

  const modal = document.getElementById('image__modal');
  const span = document.getElementsByClassName('close')[0];

  span.onclick = function() {
    modal.style.display = 'none';
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }
});