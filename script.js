// ============================================================
// Smart image loader — lets project photos use ANY common
// extension (.jpg, .jpeg, .png, .webp, any case) without
// touching the HTML. Just drop a file with the right base
// name into the right folder.
// ============================================================
function smartImage(img) {
  var exts = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG', 'WEBP'];
  var tried = (img.getAttribute('data-tried') || '').split(',').filter(Boolean);
  var base = img.getAttribute('data-base');
  for (var i = 0; i < exts.length; i++) {
    if (tried.indexOf(exts[i]) === -1) {
      tried.push(exts[i]);
      img.setAttribute('data-tried', tried.join(','));
      img.src = base + '.' + exts[i];
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
// Footer year
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================================
// Mobile nav toggle
// ============================================================
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ============================================================
// GitHub username — update once, applies to header + contact links
// ============================================================
const GITHUB_USERNAME = 'devadharshan27112008-lgtm';
if (GITHUB_USERNAME) {
  const url = `https://github.com/${GITHUB_USERNAME}`;
  document.getElementById('hero-github').href = url;
  document.getElementById('contact-github').href = url;
}

// ============================================================
// EmailJS configuration
// ============================================================
const EMAILJS_PUBLIC_KEY  = 'Ck0ol0Oe6KG1DID9x';
const EMAILJS_SERVICE_ID  = 'service_x9bg4us';
const EMAILJS_TEMPLATE_ID = 'template_h7k8ktg';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ============================================================
// Contact form — sends directly via EmailJS, no redirect
// ============================================================
const form      = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn  = form.querySelector('button[type="submit"]');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();

  // Lock UI while sending
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending\u2026';
  setStatus('', '');

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    from_name:  name,
    from_email: email,
    message:    message,
    to_email:   'devadharshan27112008@gmail.com',
  })
  .then(() => {
    setStatus("Message sent! I'll get back to you soon.", 'success');
    form.reset();
  })
  .catch((err) => {
    console.error('EmailJS error:', err);
    setStatus('Something went wrong. Please email directly.', 'error');
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  });
});


function setStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className = 'form-note' + (type ? ' form-note--' + type : '');
}

// ============================================================
// Certificate lightbox — pressing the browser Back button closes
// the viewer and returns you to the page, instead of leaving the site.
// ============================================================
(function certLightbox() {
  const lightbox = document.getElementById('cert-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const closeBtn = document.getElementById('lightbox-close');
  const certButtons = document.querySelectorAll('.cert-card');
  let isOpen = false;

  function openLightbox(src, title) {
    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightbox.hidden = false;
    isOpen = true;
    document.body.style.overflow = 'hidden';
    // Push a history entry so the Back button closes the viewer first
    history.pushState({ certLightbox: true }, '', '#certificate-view');
  }

  function closeLightbox({ fromPopstate = false } = {}) {
    if (!isOpen) return;
    lightbox.hidden = true;
    isOpen = false;
    document.body.style.overflow = '';
    // If we're closing via the X button (not via Back), undo the pushed
    // history entry so Back doesn't reopen it later.
    if (!fromPopstate && history.state && history.state.certLightbox) {
      history.back();
    }
  }

  certButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      openLightbox(btn.dataset.certSrc, btn.dataset.certTitle);
    });
  });

  closeBtn.addEventListener('click', () => closeLightbox());

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

// ============================================================
// Spine scroll progress — glowing point travels down the PCB trace
// ============================================================
const spine = document.getElementById('spine');
if (spine) {
  const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  glow.setAttribute('cx', '20');
  glow.setAttribute('r', '3.2');
  glow.setAttribute('fill', '#00e5ff');
  glow.style.filter = 'drop-shadow(0 0 6px #00e5ff)';
  spine.appendChild(glow);

  const updateSpine = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    glow.setAttribute('cy', (progress * 100).toFixed(2));
  };
  window.addEventListener('scroll', updateSpine, { passive: true });
  updateSpine();
}

// ============================================================
// Background circuit canvas — subtle animated traces + pulsing nodes
// ============================================================
(function circuitBackground() {
  const canvas = document.getElementById('circuit-bg');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, nodes, pulses;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    generateGrid();
  }

  function generateGrid() {
    const cols = Math.ceil(w / 140) + 1;
    const rows = Math.ceil(h / 140) + 1;
    nodes = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (Math.random() > 0.72) {
          nodes.push({
            x: i * 140 + (Math.random() * 40 - 20),
            y: j * 140 + (Math.random() * 40 - 20),
          });
        }
      }
    }
    pulses = nodes.slice(0, Math.min(10, nodes.length)).map(n => ({
      ...n,
      t: Math.random() * Math.PI * 2,
    }));
  }

  function drawTraces() {
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 170) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(a.x, b.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  function drawNodes() {
    ctx.fillStyle = 'rgba(57, 255, 136, 0.15)';
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawPulses(time) {
    pulses.forEach(p => {
      const glow = (Math.sin(time * 0.001 + p.t) + 1) / 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2 + glow * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${0.12 + glow * 0.25})`;
      ctx.fill();
    });
  }

  function frame(time) {
    ctx.clearRect(0, 0, w, h);
    drawTraces();
    drawNodes();
    drawPulses(time);
    if (!reduceMotion) requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(frame);
  if (reduceMotion) frame(0); // draw once, static
})();
