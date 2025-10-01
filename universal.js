const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });

    applyResponsiveStyles();

// Lightbox functionality
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".lightbox .close");
    const nextBtn = document.querySelector(".lightbox .next");
    const prevBtn = document.querySelector(".lightbox .prev");

    let currentIndex = 0;
    let images = [];

    function openLightbox(index) {
      currentIndex = index;
      lightbox.style.display = "flex";
      lightboxImg.src = images[currentIndex].src;
    }

    function closeLightbox() {
      lightbox.style.display = "none";
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      lightboxImg.src = images[currentIndex].src;
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      lightboxImg.src = images[currentIndex].src;
    }

    // Gather all images
    window.onload = () => {
      images = document.querySelectorAll(".album img");
      images.forEach((img, index) => {
        img.addEventListener("click", () => openLightbox(index));
      });
    };

    closeBtn.addEventListener("click", closeLightbox);
    nextBtn.addEventListener("click", nextImage);
    prevBtn.addEventListener("click", prevImage);

    // Close on click outside image
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (lightbox.style.display === "flex") {
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "Escape") closeLightbox();
      }
    });


        function playVideoAndRedirect(event, videoFile, url) {
            event.preventDefault();

            const overlay = document.getElementById("videoOverlay");
            const video = document.getElementById("navVideo");
            const source = document.getElementById("videoSource");

            console.log("Loading video:", videoFile);

            source.src = videoFile;
            video.load();
            overlay.style.display = "flex";

            video.play().then(() => {
                console.log("Video started playing.");
            }).catch(err => {
                console.error("Video play failed:", err);
                window.location.href = url; // fallback redirect
            });

            video.onended = function() {
                console.log("Video ended, redirecting to:", url);
                window.location.href = url;
            };
        }