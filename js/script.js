/* Smooth Scroll */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// Hero Buttons 
document.getElementById("heroContact").addEventListener("click", () => {
    document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("heroServices").addEventListener("click", () => {
    document.querySelector("#services").scrollIntoView({ behavior: "smooth" });
});



/* Sticky NavBar + Mobile Menu */
document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    const SCROLL_THRESHOLD = 10;

    function onScroll() {
        if (!header) return;
        if (window.scrollY > SCROLL_THRESHOLD) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('show');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 760) {
                    navLinks.classList.remove('show');
                    navToggle.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 760) {
                if (
                    !navLinks.contains(e.target) &&
                    !navToggle.contains(e.target) &&
                    navLinks.classList.contains('show')
                ) {
                    navLinks.classList.remove('show');
                    navToggle.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }
});


/* Reviews Slider */
(function () {

    const sliderRoot = document.querySelector('.reviews-slider');
    if (!sliderRoot) return;

    const track = sliderRoot.querySelector('.slider-track');
    if (!track) return;

    const slides = Array.from(track.children);
    const prevBtn = sliderRoot.querySelector('.slider-btn.prev');
    const nextBtn = sliderRoot.querySelector('.slider-btn.next');
    const dotsContainer = sliderRoot.querySelector('.slider-dots') || null;

    let slidesVisible = getSlidesVisible();
    let currentIndex = 0;
    let slideWidth = 0;
    let autoplayInterval = 4500;
    let autoplayTimer = null;

    function getSlidesVisible() {
        if (window.innerWidth > 1000) return 3;
        if (window.innerWidth > 600) return 2;
        return 1;
    }

    function buildDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const pages = Math.max(1, Math.ceil(slides.length / slidesVisible));
        for (let i = 0; i < pages; i++) {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            dot.addEventListener('click', () => {
                moveToIndex(i * slidesVisible);
                resetAutoplay();
            });
            dotsContainer.appendChild(dot);
        }
        updateDots();
    }

    function updateDots() {
        if (!dotsContainer) return;
        const dots = Array.from(dotsContainer.children);
        const pageIndex = Math.floor(currentIndex / slidesVisible);
        dots.forEach((d, i) => d.classList.toggle('active', i === pageIndex));
    }

    function setSizes() {
        slidesVisible = getSlidesVisible();
        const wrapper = sliderRoot.querySelector('.slider-track-wrapper');
        if (!wrapper) return;

        const gap = 18;
        slideWidth = (wrapper.clientWidth - gap * (slidesVisible - 1)) / slidesVisible;

        slides.forEach(slide => {
            slide.style.width = `${slideWidth}px`;
        });

        moveToIndex(currentIndex, false);
        if (dotsContainer) buildDots();
    }

    function moveToIndex(index, animate = true) {
        const maxStart = Math.max(0, slides.length - slidesVisible);
        currentIndex = Math.min(Math.max(0, index), maxStart);
        const x = -(currentIndex * (slideWidth + 18));
        track.style.transition = animate ? '' : 'none';
        track.style.transform = `translateX(${x}px)`;
        updateDots();
    }

    function prev() {
        moveToIndex(currentIndex - 1);
        resetAutoplay();
    }

    function next() {
        moveToIndex(currentIndex + 1);
        resetAutoplay();
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            const maxStart = Math.max(0, slides.length - slidesVisible);
            currentIndex >= maxStart ? moveToIndex(0) : moveToIndex(currentIndex + 1);
        }, autoplayInterval);
    }

    function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
        autoplayTimer = null;
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    prevBtn && prevBtn.addEventListener('click', prev);
    nextBtn && nextBtn.addEventListener('click', next);

    window.addEventListener('resize', () => {
        clearTimeout(window.__sliderResize);
        window.__sliderResize = setTimeout(setSizes, 120);
    });

    setSizes();
    startAutoplay();

})();


/* Certificate click to zoom */
document.addEventListener("DOMContentLoaded", function () {

    const modal = document.getElementById("certificateModal");
    if (!modal) return;

    const modalImg = document.getElementById("certModalImg");
    const closeBtn = document.querySelector(".cert-close");
    const certImages = document.querySelectorAll(".cert-img");

    console.log("Certificates found:", certImages.length);

    certImages.forEach(img => {
        img.addEventListener("click", () => {
            modal.classList.add("show");
            modalImg.src = img.src;
            document.body.style.overflow = "hidden";
        });
    });

    function closeModal() {
        modal.classList.remove("show");
        modalImg.src = "";
        document.body.style.overflow = "";
    }

    closeBtn && closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });

});



/* Gallery Slider */
document.addEventListener("DOMContentLoaded", function () {

    const gallery = document.querySelector(".gallery-slider");
    if (!gallery) return;

    const track = gallery.querySelector(".gallery-track");
    const slides = gallery.querySelectorAll(".gallery-slide");
    const prevBtn = gallery.querySelector(".gallery-btn.prev");
    const nextBtn = gallery.querySelector(".gallery-btn.next");

    let index = 0;

    function updateGallery() {
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    prevBtn.addEventListener("click", () => {
        index = index > 0 ? index - 1 : slides.length - 1;
        updateGallery();
    });

    nextBtn.addEventListener("click", () => {
        index = index < slides.length - 1 ? index + 1 : 0;
        updateGallery();
    });

});






/* Whatsapp Auto Message */
document.addEventListener("DOMContentLoaded", function () {

    const waBtn = document.getElementById("waContact");
    if (!waBtn) return;

    const phoneNumber = "919032177230";
    const message = encodeURIComponent(
        "Hi Hyper Fitness, I'm interested in joining the gym. Please share details."
    );

    waBtn.addEventListener("click", function (e) {
        e.preventDefault();

        const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(waUrl, "_blank");
    });

});



/* Sticky Whatsapp Button Logic */
document.addEventListener("DOMContentLoaded", function () {

    const waSticky = document.getElementById("waSticky");
    if (!waSticky) return;

    const phoneNumber = "919032177230";

    const message = encodeURIComponent(
        "Hi Hyper Fitness, I'm interested in joining the gym. Please share details."
    );

    waSticky.addEventListener("click", function (e) {
        e.preventDefault();
        const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(waUrl, "_blank");
    });

});
