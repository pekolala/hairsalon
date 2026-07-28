document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Initialize Lucide Icons
  // ==========================================================================
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ==========================================================================
  // Background Video Force Play Logic
  // ==========================================================================
  const bgVideo = document.querySelector('.background-video');
  if (bgVideo) {
    const playVideo = () => {
      bgVideo.play().catch(err => {
        console.log("Autoplay prevented or video loading. Retrying on user interaction...", err);
      });
    };
    
    playVideo();
    // Fallback: play on first user interaction if blocked
    document.addEventListener('click', playVideo, { once: true });
    document.addEventListener('touchstart', playVideo, { once: true });
  }

  // ==========================================================================
  // 2. Lenis Smooth Scroll Initialization
  // ==========================================================================
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Synchronize ScrollTrigger updates with Lenis scrolling
    lenis.on('scroll', ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ==========================================================================
  // 3. Header & Floating CTA Scroll Effects
  // ==========================================================================
  const header = document.getElementById('header');
  const floatingCta = document.getElementById('floating-cta');
  const mobileCtaBar = document.getElementById('mobile-cta-bar');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Toggle Header Scrolled Class
    if (scrollY > 80) {
      header.classList.add('scrolled');
      header.classList.remove('py-6');
      header.classList.add('py-4');
    } else {
      header.classList.remove('scrolled');
      header.classList.remove('py-4');
      header.classList.add('py-6');
    }

    // Toggle Floating CTA and Mobile Bar visibility
    if (scrollY > 400) {
      if (floatingCta) {
        floatingCta.classList.remove('opacity-0', 'translate-y-4');
        floatingCta.classList.add('opacity-100', 'translate-y-0');
      }
      if (mobileCtaBar) {
        mobileCtaBar.classList.remove('translate-y-full');
        mobileCtaBar.classList.add('translate-y-0');
      }
    } else {
      if (floatingCta) {
        floatingCta.classList.add('opacity-0', 'translate-y-4');
        floatingCta.classList.remove('opacity-100', 'translate-y-0');
      }
      if (mobileCtaBar) {
        mobileCtaBar.classList.add('translate-y-full');
        mobileCtaBar.classList.remove('translate-y-0');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once initially

  // ==========================================================================
  // 4. Fullscreen Overlay Menu
  // ==========================================================================
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const menuOverlay = document.querySelector('.menu-overlay');
  const overlayLinks = document.querySelectorAll('.overlay-nav a');

  if (menuBtn && menuOverlay) {
    function toggleMenu() {
      const isOpen = document.body.classList.contains('menu-open');
      if (isOpen) {
        document.body.classList.remove('menu-open');
        menuBtn.classList.remove('active');
        menuOverlay.classList.remove('active');
        menuOverlay.classList.add('invisible', 'opacity-0');
        menuBtn.setAttribute('aria-expanded', 'false');
        if (lenis) lenis.start(); // Enable scroll
      } else {
        document.body.classList.add('menu-open');
        menuBtn.classList.add('active');
        menuOverlay.classList.add('active');
        menuOverlay.classList.remove('invisible', 'opacity-0');
        menuBtn.setAttribute('aria-expanded', 'true');
        if (lenis) lenis.stop(); // Disable scroll
      }
    }

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking links
    overlayLinks.forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
        menuBtn.classList.remove('active');
        menuOverlay.classList.remove('active');
        menuOverlay.classList.add('invisible', 'opacity-0');
        menuBtn.setAttribute('aria-expanded', 'false');
        if (lenis) lenis.start();
      });
    });
  }

  // ==========================================================================
  // 5. GSAP + ScrollTrigger Animations
  // ==========================================================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Entry Animation (Page Load)
    gsap.from('.hero-reveal-fade', {
      opacity: 0,
      y: 40,
      duration: 1.2,
      stagger: 0.25,
      ease: 'power3.out',
    });

    // Concept Section Animation
    gsap.from('#about h2, #about p, #about .grid', {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 80%',
      },
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
    });

    // Step Cards Cascade Fade-in (Robust Mobile-Friendly ScrollTrigger)
    gsap.utils.toArray('#steps .grid > div').forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
      });
    });

    // Before/After Section Animation
    gsap.from('#before-after h2, #before-after p, #before-after .grid-cols-2', {
      scrollTrigger: {
        trigger: '#before-after',
        start: 'top 80%',
      },
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
    });

    gsap.from('#before-after .ba-slider-container', {
      scrollTrigger: {
        trigger: '#before-after',
        start: 'top 75%',
      },
      opacity: 0,
      scale: 0.98,
      duration: 1.2,
      ease: 'power2.out',
    });

    // Menu Cards Fade-in (Robust Mobile-Friendly ScrollTrigger)
    gsap.utils.toArray('#services .space-y-8 > div, #services .grid > div').forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
      });
    });

    // Staff Cards Fade-in (Robust Mobile-Friendly ScrollTrigger)
    gsap.utils.toArray('#staff .grid > div').forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
      });
    });

    // Gallery Cards Fade-in
    gsap.from('.gallery-item', {
      scrollTrigger: {
        trigger: '#gallery',
        start: 'top 80%',
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
    });
  }

  // ==========================================================================
  // 6. Before / After Interactive Slider (Vanilla JS)
  // ==========================================================================
  const baContainer = document.getElementById('ba-slider');
  const baHandle    = document.getElementById('ba-handle');
  const imgAfter    = document.getElementById('img-after');
  const afterInner  = document.getElementById('after-inner');

  if (baContainer && baHandle && imgAfter && afterInner) {
    let isDragging = false;

    // after-inner は常にコンテナと同じ幅(px)を維持することで
    // background-size: 200% auto の基準幅が変わらず完全アライメントを実現
    function updateAfterInnerWidth() {
      afterInner.style.width = baContainer.getBoundingClientRect().width + 'px';
    }

    function setSliderPosition(x) {
      const rect = baContainer.getBoundingClientRect();
      let position = ((x - rect.left) / rect.width) * 100;
      if (position < 5)  position = 5;
      if (position > 95) position = 95;

      // AFTER div: right-anchoredで幅 = (100-position)%
      imgAfter.style.width = `${100 - position}%`;
      baHandle.style.left  = `${position}%`;

      // inner は常にフルコンテナ幅(px)
      afterInner.style.width = rect.width + 'px';
    }

    // 初期化
    updateAfterInnerWidth();

    // Mouse Events
    baContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      setSliderPosition(e.clientX);
    });

    // Touch Events (Mobile)
    baContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      setSliderPosition(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.touches[0].clientX);
    }, { passive: false });

    // リサイズ時
    window.addEventListener('resize', () => {
      updateAfterInnerWidth();
      const pos = parseFloat(baHandle.style.left) || 50;
      imgAfter.style.width = `${100 - pos}%`;
      baHandle.style.left  = `${pos}%`;
    });
  }

  // ==========================================================================
  // 7. Swiper Carousel Initializations
  // ==========================================================================
  if (typeof Swiper !== 'undefined') {
    // 7.2. Reviews Loop Swiper
    const reviewsSwiper = new Swiper('.reviews-swiper', {
      loop: true,
      speed: 1000,
      spaceBetween: 30,
      autoplay: {
        delay: 7000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.reviews-next',
        prevEl: '.reviews-prev',
      },
      pagination: {
        el: '.reviews-pagination',
        clickable: true,
      }
    });
  }

  // ==========================================================================
  // 8. Style Gallery Filtering
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.gallery-tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states on tabs
      filterButtons.forEach(b => {
        b.classList.remove('active', 'bg-theme-dark', 'text-white', 'shadow-md');
        b.classList.add('bg-theme-bg', 'text-theme-dark', 'border', 'border-gray-100');
      });
      btn.classList.add('active', 'bg-theme-dark', 'text-white', 'shadow-md');
      btn.classList.remove('bg-theme-bg', 'text-theme-dark', 'border', 'border-gray-100');

      const filterVal = btn.getAttribute('data-filter');

      // Filter gallery cards
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterVal === 'all' || itemCategory === filterVal || (filterVal === 'restoration' && itemCategory === 'restoration') || (filterVal === 'restoration' && item.getAttribute('data-menu').includes('髪質改善'))) {
          item.classList.remove('hidden');
          // simple GSAP bounce animation on entry
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(item, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4 });
          }
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================================================
  // 9. Custom Lightbox Modal
  // ==========================================================================
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-image') : null;
  const lightboxTitle = lightbox ? lightbox.querySelector('.lightbox-title') : null;
  const lightboxDesc = lightbox ? lightbox.querySelector('.lightbox-desc') : null;
  const lightboxMenu = lightbox ? lightbox.querySelector('.lightbox-menu') : null;
  const lightboxStylist = lightbox ? lightbox.querySelector('.lightbox-stylist') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
  const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;

  let currentGalleryIndex = 0;
  let activeGalleryItems = [];

  function getActiveGalleryItems() {
    return Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
  }

  function openLightbox(index) {
    activeGalleryItems = getActiveGalleryItems();
    currentGalleryIndex = index;
    updateLightboxContent();
    
    lightbox.classList.add('active');
    lightbox.classList.remove('invisible', 'opacity-0');
    document.body.style.overflow = 'hidden'; // Lock scrolling
    if (lenis) lenis.stop();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.classList.add('invisible', 'opacity-0');
    document.body.style.overflow = ''; // Unlock scrolling
    if (lenis) lenis.start();
  }

  function updateLightboxContent() {
    const item = activeGalleryItems[currentGalleryIndex];
    if (!item) return;

    const src = item.getAttribute('data-src');
    const title = item.getAttribute('data-title');
    const desc = item.getAttribute('data-desc');
    const menuName = item.getAttribute('data-menu');
    const stylistName = item.getAttribute('data-stylist');

    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = src;
      lightboxImg.alt = title;
      lightboxTitle.textContent = title;
      lightboxDesc.textContent = desc;
      lightboxMenu.textContent = menuName;
      lightboxStylist.textContent = stylistName;
      lightboxImg.style.opacity = '1';
    }, 150);
  }

  function showNextImage() {
    activeGalleryItems = getActiveGalleryItems();
    if (activeGalleryItems.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % activeGalleryItems.length;
    updateLightboxContent();
  }

  function showPrevImage() {
    activeGalleryItems = getActiveGalleryItems();
    if (activeGalleryItems.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
    updateLightboxContent();
  }

  // Attach gallery item click events
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      // Find the index of this item in the currently visible items list
      activeGalleryItems = getActiveGalleryItems();
      const activeIndex = activeGalleryItems.indexOf(item);
      if (activeIndex !== -1) {
        openLightbox(activeIndex);
      }
    });
  });

  if (lightbox) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-modal')) {
        closeLightbox();
      }
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
    });
  }

  // ==========================================================================
  // 10. Interactive FAQ Accordions
  // ==========================================================================
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');

  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling;
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other open accordion contents
      accordionTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger && otherTrigger.getAttribute('aria-expanded') === 'true') {
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherTrigger.nextElementSibling.style.maxHeight = '0px';
        }
      });

      // Toggle current accordion content
      if (isOpen) {
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0px';
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

});
