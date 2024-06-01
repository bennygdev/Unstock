document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".main__navbar");
  const navbarHeight = navbar.offsetHeight;
  const logo = navbar.querySelector('.nav__logo');
  const navLinks = navbar.querySelectorAll('.nav__link');
  const searchBar = navbar.querySelector('.nav__search-container');

  let isSticky = false;
  let lastScrollTop = 0;

  // Function to update the logo based on window width
  function updateLogo() {
    if (window.innerWidth <= 1248) {
      logo.src = "media/CameraDiaphragm_orange.png";
      logo.classList.add('nav__logo-resized');
    } else {
      logo.src = "media/unstocklogo_withLogoIcon_orange.png";
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
      if (scrollTop > navbarHeight && !isSticky) {
        navbar.classList.add("sticky");
        isSticky = true;
      }
    } else {
      // Scroll up
      if (scrollTop <= navbarHeight && isSticky) {
        
        navbar.classList.remove("sticky");
        isSticky = false;
      }
    }

    // Function when scroll
    updateLogo();

    lastScrollTop = scrollTop;
  });
});
