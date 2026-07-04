// ============================================================
// Smart image loader — lets project photos use ANY common
// extension (.jpg, .jpeg, .png, .webp, any case) without
// touching the HTML. Just drop a file with the right base
// name into the right folder.
// ============================================================
function smartImage(img) {
  const exts = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG', 'WEBP'];
  const tried = (img.getAttribute('data-tried') || '').split(',').filter(Boolean);
  const base = img.getAttribute('data-base');
  for (let i = 0; i < exts.length; i++) {
    if (!tried.includes(exts[i])) {
      tried.push(exts[i]);
      img.setAttribute('data-tried', tried.join(','));
      img.src = `${base}.${exts[i]}`;
      return;
    }
  }
  // Nothing worked — fall back to the original placeholder behavior.
  if (img.getAttribute('data-fallback') === 'hide') {
    img.style.display = 'none';
  } else if (img.parentElement) {
    img.parentElement.classList.add('no-photo');
  }
}

// ============================================================
// Keep each gallery tile's lightbox (full-size) source in sync
// with whatever extension smartImage() actually managed to load,
// so clicking a tile never opens a broken image.
// ============================================================
function syncLightboxSrc(img) {
  const tile = img.closest('[data-lightbox-src]');
  if (tile) tile.setAttribute('data-lightbox-src', img.src);
}

// ============================================================
// Footer year
// ============================================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================================
// Mobile nav toggle
// ============================================================
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ============================================================
// Image lightbox — used for gallery photos + circuit diagram.
// Pressing the browser Back button closes the viewer and returns
// you to the page, instead of leaving the site (same behaviour
// as the certificate viewer on the homepage).
// ============================================================
(function imageLightbox() {
  const lightbox = document.getElementById('img-lightbox');
  if (!lightbox) return;

  const lightboxImg = document.getElementById('img-lightbox-img');
  const lightboxTitle = document.getElementById('img-lightbox-title');
  const closeBtn = document.getElementById('img-lightbox-close');
  const triggers = document.querySelectorAll('[data-lightbox-src]');
  let isOpen = false;

  function openLightbox(src, title) {
    lightboxImg.src = src;
    lightboxImg.alt = title || '';
    lightboxTitle.textContent = title || '';
    lightbox.hidden = false;
    isOpen = true;
    document.body.style.overflow = 'hidden';
    history.pushState({ imgLightbox: true }, '', '#photo-view');
  }

  function closeLightbox({ fromPopstate = false } = {}) {
    if (!isOpen) return;
    lightbox.hidden = true;
    isOpen = false;
    document.body.style.overflow = '';
    if (!fromPopstate && history.state && history.state.imgLightbox) {
      history.back();
    }
  }

  triggers.forEach(el => {
    // Skip tiles that failed to load an image (no-photo placeholders)
    if (el.classList.contains('no-photo')) return;
    el.addEventListener('click', () => {
      openLightbox(el.dataset.lightboxSrc, el.dataset.lightboxTitle);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', () => closeLightbox());
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeLightbox();
  });
  window.addEventListener('popstate', () => {
    if (isOpen) closeLightbox({ fromPopstate: true });
  });
})();
