// ── CAROUSEL SETUP ──
document.querySelectorAll('.image-scroll').forEach(carousel => {
  const images = carousel.querySelectorAll('img');
  if (images.length === 0) return;

  let current = 0;

  images[0].classList.add('active');

  const prev = document.createElement('button');
  prev.className = 'carousel-btn prev';
  prev.innerHTML = '&#8592;';

  const next = document.createElement('button');
  next.className = 'carousel-btn next';
  next.innerHTML = '&#8594;';

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
  images.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      goTo(i);
    });
    dotsContainer.appendChild(dot);
  });

  carousel.appendChild(prev);
  carousel.appendChild(next);
  carousel.appendChild(dotsContainer);

  if (images.length === 1) {
    prev.style.display = 'none';
    next.style.display = 'none';
    dotsContainer.style.display = 'none';
  }

  function goTo(index) {
    images[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = (index + images.length) % images.length;
    images[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
  }

  prev.addEventListener('click', (e) => {
    e.stopPropagation();
    goTo(current - 1);
  });

  next.addEventListener('click', (e) => {
    e.stopPropagation();
    goTo(current + 1);
  });

  // Open lightbox on click (not after swipe)
  carousel.addEventListener('click', () => {
    if (!carousel._swiped) openLightbox(images, current);
  });

  // Touch swipe support for carousel
  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    carousel._swiped = false;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      carousel._swiped = true;
      goTo(diff > 0 ? current + 1 : current - 1);
    }
  }, { passive: true });

});

// ── LIGHTBOX ──
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(images, startIndex) {
  lightboxImages = Array.from(images);
  lightboxIndex = startIndex;
  updateLightboxImage();
  lightbox.classList.add('open');

  const single = lightboxImages.length === 1;
  lightboxPrev.style.display = single ? 'none' : '';
  lightboxNext.style.display = single ? 'none' : '';
}

function updateLightboxImage() {
  lightboxImg.src = lightboxImages[lightboxIndex].src;
}

lightboxPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  updateLightboxImage();
});

lightboxNext.addEventListener('click', (e) => {
  e.stopPropagation();
  lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
  updateLightboxImage();
});

lightboxClose.addEventListener('click', () => {
  lightbox.classList.remove('open');
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('open');
  }
});

// Touch swipe support for lightbox
let lightboxTouchStartX = 0;
lightbox.addEventListener('touchstart', (e) => {
  lightboxTouchStartX = e.touches[0].clientX;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
  const diff = lightboxTouchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    lightboxIndex = diff > 0
      ? (lightboxIndex + 1) % lightboxImages.length
      : (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightboxImage();
  }
}, { passive: true });

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') lightbox.classList.remove('open');
  if (e.key === 'ArrowLeft') {
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightboxImage();
  }
  if (e.key === 'ArrowRight') {
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    updateLightboxImage();
  }
});