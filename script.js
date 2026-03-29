// Navigation Scroll Effect
const navbar = document.getElementById('navbar');

const sections = document.querySelectorAll('section, footer');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 250) {
            current = section.getAttribute('id');
        }
    });

    // Make sure we highlight Contact if we hit bottom of page
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        current = 'contact';
    }

    navItems.forEach(a => {
        a.classList.remove('active');
        if (current && a.getAttribute('href') === `#${current}`) {
            a.classList.add('active');
        }
    });
});

// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Toggle Icon between bars and times
    const icon = mobileMenu.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when a link is clicked
const links = document.querySelectorAll('.nav-links a');
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileMenu.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Show More Projects
const showMoreBtn = document.getElementById('show-more-btn');
const hiddenProjects = document.querySelectorAll('.hidden-project');

if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
        hiddenProjects.forEach(project => {
            project.classList.remove('hidden-project');
            project.style.animation = 'fadeInProject 0.5s ease forwards';
        });
        showMoreBtn.style.display = 'none';
    });
}

// Carousel Functionality
window.moveCarousel = function (carouselId, direction) {
    const container = document.getElementById(carouselId);
    if (!container) return;

    const images = container.querySelectorAll('.project-thumbnail');
    let currentIndex = -1;

    // Find the currently active image
    images.forEach((img, index) => {
        if (img.classList.contains('active')) {
            currentIndex = index;
        }
    });

    if (currentIndex === -1) return;

    // Hide the current image
    images[currentIndex].classList.remove('active');
    images[currentIndex].style.display = 'none';

    // Calculate the next image index
    let nextIndex = currentIndex + direction;
    if (nextIndex >= images.length) {
        nextIndex = 0; // Wrap to first
    } else if (nextIndex < 0) {
        nextIndex = images.length - 1; // Wrap to last
    }

    // Show the next image
    images[nextIndex].classList.add('active');
    images[nextIndex].style.display = 'block';
};

// Lightbox Functionality
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentCarouselId = null;

    if (!lightbox) return;

    // Attach click to all project thumbnails
    document.querySelectorAll('.project-thumbnail').forEach(media => {
        media.addEventListener('click', function (e) {
            // If in a carousel, only allow clicking the active one
            if (this.parentElement.classList.contains('carousel-inner') && !this.classList.contains('active')) {
                return;
            }

            e.preventDefault();

            // Setup Navigation Arrows
            if (this.parentElement.classList.contains('carousel-inner')) {
                currentCarouselId = this.parentElement.id;
                lightboxPrev.style.display = 'flex';
                lightboxNext.style.display = 'flex';
            } else {
                currentCarouselId = null;
                lightboxPrev.style.display = 'none';
                lightboxNext.style.display = 'none';
            }

            openLightbox(this);
        });
    });

    function openLightbox(mediaElement) {
        lightbox.style.display = "flex";
        lightbox.style.alignItems = "center";
        lightbox.style.justifyContent = "center";

        lightboxImg.style.display = "none";
        lightboxVideo.style.display = "none";

        if (mediaElement.tagName.toLowerCase() === 'video') {
            lightboxVideo.style.display = "block";
            lightboxVideo.src = mediaElement.currentSrc || mediaElement.src;
            lightboxVideo.play();
        } else {
            if (lightboxVideo) lightboxVideo.pause();
            lightboxImg.style.display = "block";
            lightboxImg.src = mediaElement.src;
        }
    }

    // Lightbox navigation
    const navigateLightbox = (direction) => {
        if (!currentCarouselId) return;
        // Move the carousel underlying HTML
        if (window.moveCarousel) {
            window.moveCarousel(currentCarouselId, direction);
            // Grab the newly active image and show it in lightbox
            const container = document.getElementById(currentCarouselId);
            const activeImg = container.querySelector('.project-thumbnail.active');
            if (activeImg) {
                openLightbox(activeImg);
            }
        }
    };

    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close lightbox
    const closeLightbox = () => {
        lightbox.style.display = "none";
        if (lightboxVideo) {
            lightboxVideo.pause();
        }
        currentCarouselId = null;
    };

    lightboxClose.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on escape key and support arrow keys
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display !== 'none') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox(-1);
            } else if (e.key === 'ArrowRight') {
                navigateLightbox(1);
            }
        }
    });
});

// Typing Animation Loop
document.addEventListener('DOMContentLoaded', () => {
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        // Target list of titles
        const words = ["Less noise, more insight"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typingText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            // Adjust typing and backspacing speeds (in ms)
            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentWord.length) {
                // Pause at the end of a full word securely
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // Move to the next string when completely deleted
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        // Delay the very first typing initialization slightly
        setTimeout(type, 1000);
    }
});
