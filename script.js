document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Header Scroll Effect & Performance Optimization
    // ==========================================================================
    const header = document.getElementById('header');
    const floatingCta = document.getElementById('floating-cta');
    const mobileCtaBar = document.getElementById('mobile-cta-bar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;
        
        // Toggle scrolled state on header
        if (scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Show/Hide Floating CTA & Mobile Bottom Bar
        if (scrollY > 400) {
            if (floatingCta) floatingCta.classList.add('show');
            if (mobileCtaBar) mobileCtaBar.classList.add('show');
        } else {
            if (floatingCta) floatingCta.classList.remove('show');
            if (mobileCtaBar) mobileCtaBar.classList.remove('show');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // Run once at start
    updateHeader();


    // ==========================================================================
    // 2. Fullscreen Menu Overlay Logic
    // ==========================================================================
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const overlayLinks = document.querySelectorAll('.overlay-nav a');

    if (menuBtn && menuOverlay) {
        function toggleMenu() {
            const isOpen = document.body.classList.contains('menu-open');
            if (isOpen) {
                document.body.classList.remove('menu-open');
                menuBtn.setAttribute('aria-expanded', 'false');
            } else {
                document.body.classList.add('menu-open');
                menuBtn.setAttribute('aria-expanded', 'true');
            }
        }

        menuBtn.addEventListener('click', toggleMenu);

        // Close menu when clicking navigation links
        overlayLinks.forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('menu-open');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }


    // ==========================================================================
    // 3. Swiper Slider Initializations
    // ==========================================================================
    
    // 3.1. Hero Cinematic Swiper
    const heroSwiper = new Swiper('.hero-swiper', {
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        loop: true,
        speed: 2000,
        autoplay: {
            delay: 7000,
            disableOnInteraction: false,
        },
        allowTouchMove: false
    });

    // 3.2. Staff Coverflow Swiper
    const staffSwiper = new Swiper('.staff-swiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: true,
        speed: 800,
        coverflowEffect: {
            rotate: 15,
            stretch: 0,
            depth: 150,
            modifier: 1,
            slideShadows: false,
        },
        navigation: {
            nextEl: '.staff-next',
            prevEl: '.staff-prev',
        },
        pagination: {
            el: '.staff-pagination',
            clickable: true,
        },
        breakpoints: {
            // Screen width >= 768px
            768: {
                coverflowEffect: {
                    rotate: 10,
                    depth: 180,
                }
            }
        }
    });

    // 3.3. Google Reviews Swiper
    const reviewsSwiper = new Swiper('.reviews-swiper', {
        loop: true,
        speed: 1000,
        spaceBetween: 30,
        autoplay: {
            delay: 6000,
            disableOnInteraction: true,
        },
        pagination: {
            el: '.reviews-pagination',
            clickable: true,
        }
    });


    // ==========================================================================
    // 4. Before / After Interactive Slider (Vanilla JS)
    // ==========================================================================
    const baContainer = document.getElementById('ba-slider');
    const baHandle = document.getElementById('ba-handle');
    const imgAfter = document.getElementById('img-after');

    if (baContainer && baHandle && imgAfter) {
        let isDragging = false;

        function setSliderPosition(x) {
            const rect = baContainer.getBoundingClientRect();
            // Calculate percentage from X coordinate relative to container
            let position = ((x - rect.left) / rect.width) * 100;
            
            // Constrain between 0% and 100%
            if (position < 0) position = 0;
            if (position > 100) position = 100;
            
            // Apply widths
            imgAfter.style.width = `${position}%`;
            baHandle.style.left = `${position}%`;
        }

        // Mouse Events
        baContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            setSliderPosition(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            // Prevent text selection during drag
            e.preventDefault();
            setSliderPosition(e.clientX);
        });

        // Touch Events (Mobile)
        baContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            setSliderPosition(e.touches[0].clientX);
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            setSliderPosition(e.touches[0].clientX);
        }, { passive: false });

        // Window resize adjustments to prevent weird stretching
        window.addEventListener('resize', () => {
            const currentPosition = parseFloat(baHandle.style.left) || 50;
            imgAfter.style.width = `${currentPosition}%`;
            baHandle.style.left = `${currentPosition}%`;
        });
    }


    // ==========================================================================
    // 5. Scroll Reveal Animations (60fps IntersectionObserver)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-zoom, .reveal-text, .reveal-item');

    const revealObserverOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -8% 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Remove observation to optimize performance once animated
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });


    // ==========================================================================
    // 6. Number Counter Animation (Count Up)
    // ==========================================================================
    const counterElements = document.querySelectorAll('.number-val');

    const counterObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetVal = parseFloat(target.getAttribute('data-target'));
                const suffix = target.getAttribute('data-suffix') || '';
                animateValue(target, 0, targetVal, 2000, suffix);
                observer.unobserve(target); // Run only once
            }
        });
    }, counterObserverOptions);

    counterElements.forEach(el => {
        counterObserver.observe(el);
    });

    function animateValue(obj, start, end, duration, suffix) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Easing function: easeOutExpo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = easeProgress * (end - start) + start;
            
            // Format check for floats vs integers
            if (end % 1 === 0) {
                obj.innerHTML = Math.floor(currentVal).toLocaleString() + suffix;
            } else {
                obj.innerHTML = currentVal.toFixed(1) + suffix;
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }


    // ==========================================================================
    // 7. Custom Gallery Lightbox with Swiping / Controls
    // ==========================================================================
    const galleryItems = document.querySelectorAll('.gallery-item-wrapper');
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxCat = lightbox.querySelector('.lightbox-cat');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');

    let currentGalleryIndex = 0;
    const galleryData = [];

    // Compile gallery data array
    galleryItems.forEach((item, index) => {
        const imgSrc = item.getAttribute('data-src');
        const cat = item.querySelector('.gallery-cat').textContent;
        const title = item.querySelector('.gallery-title').textContent;
        galleryData.push({ src: imgSrc, cat: cat, title: title });

        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        currentGalleryIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Unlock scroll
    }

    function updateLightboxContent() {
        const data = galleryData[currentGalleryIndex];
        // Fade transition simulation
        lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImg.src = data.src;
            lightboxImg.alt = data.title;
            lightboxCat.textContent = data.cat;
            lightboxTitle.textContent = data.title;
            lightboxImg.style.opacity = '1';
        }, 150);
    }

    function showNextImage() {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
        updateLightboxContent();
    }

    function showPrevImage() {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
        updateLightboxContent();
    }

    if (lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxNext.addEventListener('click', showNextImage);
        lightboxPrev.addEventListener('click', showPrevImage);

        // Click outside image to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        });
    }

});
