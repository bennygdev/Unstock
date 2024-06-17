document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".main__navbar");
  const heroSection = document.querySelector(".hero__section");
  const heroSectionHeight = heroSection.offsetHeight;
  const logo = navbar.querySelector('.nav__logo');
  const searchBar = navbar.querySelector('.nav__search-container');

  let isSticky = false;
  let lastScrollTop = 0;

  // Function to update the logo based on window width
  function updateLogo() {
    if (window.innerWidth <= 1248 && isSticky) {
      logo.src = "media/CameraDiaphragm_orange.png";
      logo.classList.add('nav__logo-resized');
    } else if (window.innerWidth > 1248 && isSticky) {
      logo.src = "media/unstocklogo_withLogoIcon_orange.png";
      logo.classList.remove('nav__logo-resized');
    } else {
      logo.src = "media/unstocklogo_withLogoIcon_white.png";
      logo.classList.remove('nav__logo-resized');
    }
  }

  // Initial check when load
  updateLogo();

  window.addEventListener("resize", updateLogo);

  window.addEventListener("scroll", function () {
    let scrollTop = window.scrollY;

    if (scrollTop > lastScrollTop) {
      // Scroll down
      if (scrollTop > heroSectionHeight && !isSticky) {
        navbar.classList.add("sticky");
        navbar.classList.remove("hidden");
        isSticky = true;

        // Show the search bar
        if (searchBar) {
          searchBar.style.display = "block";
        }
      }
    } else {
      // Scroll up
      if (scrollTop <= heroSectionHeight && isSticky) {
        
        navbar.classList.remove("hidden");
        navbar.classList.remove("sticky");
        isSticky = false;

        // Hide the search bar
        if (searchBar) {
          searchBar.style.display = "none";
        }
      }
    }

    // Function when scroll
    updateLogo();

    lastScrollTop = scrollTop;
  });
});
