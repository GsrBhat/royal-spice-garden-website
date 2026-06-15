// Initialize features on load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initCursorGlow();
  initNavbar();
  initScrollReveal();
  initMenuTabs();
  initGalleryLightbox();
  initReviewsSlider();
  initReservationForm();
  initNewsletterForm();
});

/* =========================================================================
   1. Cursor Glow Effect (Desktop Only)
   ========================================================================= */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  // Show only on non-touch devices
  if (window.matchMedia('(pointer: fine)').matches) {
    glow.style.display = 'block';
    
    document.addEventListener('mousemove', (e) => {
      // Use requestAnimationFrame for smoother performance
      window.requestAnimationFrame(() => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      });
    });
  }
}

/* =========================================================================
   2. Sticky Navbar & Active Section Tracking
   ========================================================================= */
function initNavbar() {
  const wrapper = document.querySelector('.navbar-wrapper');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = navLinks.querySelectorAll('a');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      wrapper.classList.add('scrolled');
    } else {
      wrapper.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Close mobile menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });

  // Active section tracking via IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -50% 0px', // Trigger when section occupies center of viewport
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        links.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });
}

/* =========================================================================
   3. Scroll Reveal Animations
   ========================================================================= */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once revealed
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px', // Trigger slightly before element enters view
    threshold: 0.15
  });

  // Reveal hero items immediately with a delay
  const heroReveal = document.querySelectorAll('.hero-content, .hero-image-wrap');
  heroReveal.forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });

  elements.forEach(el => {
    revealObserver.observe(el);
  });
}

/* =========================================================================
   4. Menu Tab Switching
   ========================================================================= */
function initMenuTabs() {
  const tabs = document.querySelectorAll('.menu-tab-btn');
  const panels = document.querySelectorAll('.menu-category-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active states
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      // Add active state to clicked tab
      tab.classList.add('active');

      // Show matching panel
      const targetId = tab.getAttribute('data-category');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* =========================================================================
   5. Interactive Ambiance Gallery & Lightbox Modal
   ========================================================================= */
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  let currentIndex = 0;
  const galleryImages = [];

  // Extract gallery image sources and captions
  items.forEach((item, index) => {
    const img = item.querySelector('.gallery-img');
    const title = item.querySelector('.gallery-overlay span').textContent;
    
    galleryImages.push({
      src: img.src,
      alt: img.alt,
      caption: title
    });

    item.addEventListener('click', () => {
      currentIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    modal.classList.add('active');
    updateLightboxContent();
    document.body.style.overflow = 'hidden'; // Stop background scroll
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Resume scroll
  }

  function updateLightboxContent() {
    const currentData = galleryImages[currentIndex];
    modalImg.src = currentData.src;
    modalImg.alt = currentData.alt;
    modalCaption.textContent = currentData.caption;
  }

  function navigateLightbox(direction) {
    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % galleryImages.length;
    } else {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    }
    updateLightboxContent();
  }

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigateLightbox('prev'));
  nextBtn.addEventListener('click', () => navigateLightbox('next'));

  // Close lightbox clicking backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigateLightbox('next');
    if (e.key === 'ArrowLeft') navigateLightbox('prev');
  });
}

/* =========================================================================
   6. Testimonials Reviews Slider
   ========================================================================= */
function initReviewsSlider() {
  const slides = document.querySelectorAll('.review-slide');
  const dots = document.querySelectorAll('.dot');
  let currentIndex = 0;
  let autoplayInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
        dots[i].classList.add('active');
      } else {
        slide.classList.remove('active');
        dots[i].classList.remove('active');
      }
    });
    currentIndex = index;
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % slides.length;
      showSlide(nextIndex);
    }, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Dots click events
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      const targetIndex = parseInt(dot.getAttribute('data-slide'));
      showSlide(targetIndex);
      startAutoplay();
    });
  });

  // Initialize slider
  showSlide(0);
  startAutoplay();
}

/* =========================================================================
   7. Reservation Form Validation & Success Overlay
   ========================================================================= */
function initReservationForm() {
  const form = document.getElementById('reservationForm');
  const successCard = document.getElementById('formSuccessCard');
  const resetBtn = document.getElementById('resetFormBtn');

  // Set minimum date picker to "Today" to prevent choosing past dates
  const dateInput = document.getElementById('resDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // Validation functions
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function showInputError(inputEl) {
    const group = inputEl.closest('.form-group');
    if (group) group.classList.add('error');
  }

  function clearInputError(inputEl) {
    const group = inputEl.closest('.form-group');
    if (group) group.classList.remove('error');
  }

  // Real-time error clearing
  form.querySelectorAll('.form-control').forEach(control => {
    control.addEventListener('input', () => clearInputError(control));
    control.addEventListener('change', () => clearInputError(control));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    // Validate fields
    const nameVal = document.getElementById('resName').value.trim();
    const emailVal = document.getElementById('resEmail').value.trim();
    const dateVal = document.getElementById('resDate').value;
    const timeVal = document.getElementById('resTime').value;
    const guestsVal = document.getElementById('resGuests').value;

    // Name Check
    if (nameVal === '') {
      showInputError(document.getElementById('resName'));
      hasError = true;
    } else {
      clearInputError(document.getElementById('resName'));
    }

    // Email Check
    if (emailVal === '' || !validateEmail(emailVal)) {
      showInputError(document.getElementById('resEmail'));
      hasError = true;
    } else {
      clearInputError(document.getElementById('resEmail'));
    }

    // Date Check
    if (dateVal === '') {
      showInputError(document.getElementById('resDate'));
      hasError = true;
    } else {
      clearInputError(document.getElementById('resDate'));
    }

    // Time Check
    if (timeVal === '') {
      showInputError(document.getElementById('resTime'));
      hasError = true;
    } else {
      clearInputError(document.getElementById('resTime'));
    }

    // Guests Check
    if (guestsVal === '') {
      showInputError(document.getElementById('resGuests'));
      hasError = true;
    } else {
      clearInputError(document.getElementById('resGuests'));
    }

    // If validation passes, simulate submitting and show overlay
    if (!hasError) {
      // Inject details into success card
      document.getElementById('successName').textContent = nameVal;
      document.getElementById('successEmail').textContent = emailVal;
      
      // Format Date nicely
      const formattedDate = new Date(dateVal).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      document.getElementById('successDate').textContent = formattedDate;
      
      // Time slots formatting
      const selectedTimeOpt = document.getElementById('resTime').options[document.getElementById('resTime').selectedIndex].text;
      document.getElementById('successTime').textContent = selectedTimeOpt;

      // Show Success Card
      successCard.classList.add('active');
    }
  });

  // Reset form
  resetBtn.addEventListener('click', () => {
    form.reset();
    successCard.classList.remove('active');
    // Clear any leftover validation errors
    form.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
  });
}

/* =========================================================================
   8. Footer Newsletter Submission
   ========================================================================= */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  const status = document.getElementById('newsletterStatus');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const val = input.value.trim();

    if (val !== '') {
      status.textContent = "Thank you! You are now added to the royal registry.";
      status.className = "newsletter-status success";
      input.value = '';
      
      // Clear status after 5s
      setTimeout(() => {
        status.style.display = 'none';
      }, 5000);
    } else {
      status.textContent = "Please enter a valid email address.";
      status.className = "newsletter-status error";
    }
  });
}
