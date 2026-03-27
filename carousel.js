// ── CAROUSEL SETUP ──
document.querySelectorAll('.image-scroll').forEach(carousel => {
  const images = carousel.querySelectorAll('img');
  if (images.length === 0) return;

  let current = 0;

  // Mark first image active
  images[0].classList.add('active');

  // Create prev/next buttons
  const prev = document.createElement('button');
  prev.className = 'carousel-btn prev';
  prev.innerHTML = '&#8592;';

  const next = document.createElement('button');
  next.className = 'carousel-btn next';
  next.innerHTML = '&#8594;';

  // Create dots
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

  // Hide buttons if only one image
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

  // Open lightbox on image click
  carousel.addEventListener('click', () => {
    openLightbox(images[current].src);
  });
});

// ── LIGHTBOX ──
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add('open');
}

lightboxClose.addEventListener('click', () => {
  lightbox.classList.remove('open');
});

// Close on click outside image
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('open');
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') lightbox.classList.remove('open');
});
