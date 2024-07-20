document.addEventListener('DOMContentLoaded', function() {
  const savedPhotos = JSON.parse(localStorage.getItem('savedPhotos')) || [];
  const apiKey = 'gY7YL3TYC3zwSfPTln6WPnaKS4psOajcnKlg3a7HJlOj5NfXpzoFFoKJ';

  const noResultsContainer = document.querySelector('.no-results-container');
  const imageGalleryTitle = document.getElementById('images__gallery-title');
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

  displaySavedImages(savedPhotos);

  function displaySavedImages(savedPhotos) {
    showSpinner();
    const container1 = document.getElementById('image__container-1');
    const container2 = document.getElementById('image__container-2');
    const container3 = document.getElementById('image__container-3');

    // Clear existing content
    container1.innerHTML = '';
    container2.innerHTML = '';
    container3.innerHTML = '';

    if (savedPhotos.length === 0) {
      noResultsContainer.style.display = 'block';
      imageGalleryTitle.style.display = 'none';
    } else {
      noResultsContainer.style.display = 'none';
      imageGalleryTitle.style.display = 'block';

      displayImages(savedPhotos)
    }
  }

  function displayImages(photos) {
    const columns = document.querySelectorAll('.column');

    // Display saved images
    photos.forEach((photoId, index) => {
      fetchPhoto(photoId)
        .then(photo => {
          const img = document.createElement('img');
          img.src = photo.src.large;
          img.alt = photo.photographer;
          img.setAttribute('data-photo-id', photo.id);
          img.addEventListener('click', function() {
            showModal(photo.src.original, photo.photographer, photo.id);
          });
          
          const columnIndex = index % columns.length;
          columns[columnIndex].appendChild(img);
        })
        .catch(error => console.error('Error fetching saved photo:', error))
        .finally(() => {
          hideSpinner();
        })
    });
  }

  function fetchPhoto(photoId) {
    const url = `https://api.pexels.com/v1/photos/${photoId}`;

    return fetch(url, {
      headers: {
        'Authorization': apiKey
      }
    })
    .then(response => response.json())
    .then(data => {
      return {
        id: data.id,
        photographer: data.photographer,
        src: {
          original: data.src.original,
          large: data.src.large
        }
      };
    });
  }

  // Show modal
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
      displaySavedImages(savedPhotos);
    } else {
      saveBookmark.classList.remove('fa-solid');
      saveBookmark.classList.add('fa-regular');
      displaySavedImages(savedPhotos);
      modal.style.display = 'none';
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
});
