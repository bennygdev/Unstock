document.addEventListener('DOMContentLoaded', function() {
  const savedPhotos = JSON.parse(localStorage.getItem('savedPhotos')) || [];
  const apiKey = 'gY7YL3TYC3zwSfPTln6WPnaKS4psOajcnKlg3a7HJlOj5NfXpzoFFoKJ';

  const noResultsContainer = document.querySelector('.no-results-container');
  const imageGalleryTitle = document.getElementById('images__gallery-title');

  displaySavedImages(savedPhotos);

  function displaySavedImages(savedPhotos) {
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

      // Display saved images
      savedPhotos.forEach((photoId, index) => {
        fetchPhoto(photoId)
          .then(photo => {
            const img = document.createElement('img');
            img.src = photo.src.large;
            img.alt = photo.photographer;
            img.setAttribute('data-photo-id', photo.id);
            img.addEventListener('click', function() {
              showModal(photo.src.original, photo.photographer, photo.id);
            });

            // Determine which column to append the image to using modulo
            const columnIndex = index % 3;
            if (columnIndex === 0) {
              container1.appendChild(img);
            } else if (columnIndex === 1) {
              container2.appendChild(img);
            } else {
              container3.appendChild(img);
            }
          })
          .catch(error => console.error('Error fetching saved photo:', error));
      });
    }
  }

  function fetchPhoto(photoId) {
    const url = `https://api.pexels.com/v1/photos/${photoId}`;

    return fetch(url, {
      headers: {
        'Authorization': apiKey
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
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

    modalImg.src = imageSrc;
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
});
