document.addEventListener('DOMContentLoaded', function() {
  const apiKey = 'gY7YL3TYC3zwSfPTln6WPnaKS4psOajcnKlg3a7HJlOj5NfXpzoFFoKJ';  // Replace with your Pexels API key
  let currentPage = 1; // Track the current page of results
  const perPage = 96; // Number of images per page

  fetchCuratedImages();

  // Fetches curated images
  function fetchCuratedImages() {
    const url = `https://api.pexels.com/v1/curated?per_page=${perPage}`;

    fetch(url, {
      headers: {
        'Authorization': apiKey
      }
    })
    .then(response => response.json())
    .then(data => {
      displayImages(data.photos);
    })
    .catch(error => console.error('Error fetching curated images:', error));
  }

  // Fetches response and displays images
  function displayImages(photos) {
    const columns = document.querySelectorAll('.column');

    photos.forEach((photo, index) => {
      const img = document.createElement('img');
      img.src = photo.src.large;
      img.alt = photo.photographer;
      img.id = `image-${index}`; // Set a unique ID for each image
      img.addEventListener('click', function() {
        showModal(photo.src.large, photo.photographer, photo.src.original);
      });

      // Determine which column to append the image to
      const columnIndex = index % columns.length;
      columns[columnIndex].appendChild(img);
    });
  }

  // Shows modal after image is clicked
  function showModal(imageSrc, photographerName, originalImgSize) {
    const modal = document.getElementById("image__modal");
    const modalImg = document.getElementById("modal__image");
    const downloadButton = document.getElementById("download-button");
    const photographerElement = document.getElementById("image__photographer--name");

    modalImg.src = imageSrc;
    originalSize = originalImgSize;
    photographerElement.textContent = `Photographer: ${photographerName}`;

    downloadButton.onclick = function () {
      downloadImage(originalImgSize, photographerName);
    };

    modal.style.display = "block";
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
    currentPage++;
    const url = `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${currentPage}`;

    fetch(url, {
      headers: {
        'Authorization': apiKey
      }
    })
    .then(response => response.json())
    .then(data => {
      displayImages(data.photos);
    })
    .catch(error => console.error('Error fetching more images:', error));
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