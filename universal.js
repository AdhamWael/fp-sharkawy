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


