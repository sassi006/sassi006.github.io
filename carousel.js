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

  // Open lightbox, passing this carousel's images and current index
  carousel.addEventListener('click', () => {
    openLightbox(images, current);
  });
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

  // Hide arrows if only one image
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
