/* ============================================
   SmartDrive Pro - Main JavaScript (MERGED)
   ============================================ */

/* ── PRELOADER ── */
window.addEventListener('load', function() {
  setTimeout(function() {
    var pl = document.getElementById('preloader');
    if (pl) pl.classList.add('done');
  }, 1600);
});

/* ── NAVBAR SCROLL ── */
var navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', function() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* ── MOBILE MENU ── */
var menuToggle = document.getElementById('menuToggle');
var navLinksEl = document.getElementById('navLinks');
if (menuToggle && navLinksEl) {
  menuToggle.addEventListener('click', function() {
    navLinksEl.classList.toggle('active');
  });
}

/* ── BRAND ZOOM ── */
document.querySelectorAll('.brand img').forEach(function(img) {
  img.addEventListener('click', function() { img.classList.toggle('zoomed'); });
});

/* ── HEART BUTTONS ── */
document.querySelectorAll('.heart-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    btn.classList.toggle('liked');
    btn.textContent = btn.classList.contains('liked') ? '♥' : '♡';
  });
});

/* ── SEARCH HANDLER ── */
function handleSearch(e) {
  e.preventDefault();
  var city = document.getElementById('searchCity').value.trim();
  var pickup = document.getElementById('searchPickup').value;
  var ret = document.getElementById('searchReturn').value;
  
  if (!city) { showToast('Enter a city or location', 'error'); return; }
  if (!pickup || !ret) { showToast('Please select pickup and return dates', 'error'); return; }
  if (new Date(ret) <= new Date(pickup)) { showToast('Return date must be after pickup date', 'error'); return; }
  
  showToast('Searching cars in ' + city + '...', 'success');
  setTimeout(function() { window.location.href = 'pages/cars.html'; }, 900);
}
window.handleSearch = handleSearch;

/* Set today as minimum date */
var todayStr = new Date().toISOString().split('T')[0];
var pickupEl = document.getElementById('searchPickup');
var returnEl = document.getElementById('searchReturn');
if (pickupEl) { pickupEl.min = todayStr; }
if (returnEl) { returnEl.min = todayStr; }
if (pickupEl && returnEl) {
  pickupEl.addEventListener('change', function() { returnEl.min = this.value; });
}

/* ── FEATURED CARS FILTER ── */
function filterFeatured(btn) {
  document.querySelectorAll('.cft').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  var cat = btn.getAttribute('data-cat');
  
  document.querySelectorAll('#featuredGrid .car-card').forEach(function(card, i) {
    var match = (cat === 'all' || card.getAttribute('data-cat') === cat);
    if (match) {
      card.style.display = 'flex';
      setTimeout(function() {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 60);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity .3s, transform .3s';
      setTimeout(function() { card.style.display = 'none'; }, 300);
    }
  });
}
window.filterFeatured = filterFeatured;

/* ── SCROLL REVEAL ── */
var ioReveal = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.sr, .sr-l, .sr-r, .reveal').forEach(function(el) {
  ioReveal.observe(el);
});

/* Car cards staggered reveal */
var ioCards = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (!e.isIntersecting) return;
    var cards = e.target.querySelectorAll('.car-card');
    cards.forEach(function(c, i) {
      setTimeout(function() { c.classList.add('visible'); }, i * 120);
    });
    ioCards.unobserve(e.target);
  });
}, { threshold: 0.1 });

var featuredGrid = document.getElementById('featuredGrid');
if (featuredGrid) ioCards.observe(featuredGrid);

/* ── ANIMATED COUNTERS ── */
var ioCount = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (!e.isIntersecting) return;
    var el = e.target;
    var target = +el.getAttribute('data-target');
    var start = performance.now();
    var dur = 2200;
    
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var current = Math.floor(eased * target);
      el.textContent = current >= 1000 ? (current / 1000).toFixed(1) + 'K' : current;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target >= 1000 ? (target / 1000) + 'K+' : target + '+';
    }
    requestAnimationFrame(tick);
    ioCount.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter[data-target]').forEach(function(el) {
  ioCount.observe(el);
});

/* ── 3D TILT EFFECTS ── */
/* Why Cards */
document.querySelectorAll('.why-card').forEach(function(card) {
  card.addEventListener('mousemove', function(e) {
    var r = card.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5;
    var y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transition = 'box-shadow .3s, border-color .3s';
    card.style.transform = 'perspective(600px) rotateX(' + (-y*12) + 'deg) rotateY(' + (x*12) + 'deg) translateY(-8px)';
  });
  card.addEventListener('mouseleave', function() {
    card.style.transform = '';
    card.style.transition = 'transform .5s ease, box-shadow .3s, border-color .3s';
    setTimeout(function() { card.style.transition = ''; }, 500);
  });
});

/* Car Cards */
document.querySelectorAll('.car-card').forEach(function(card) {
  card.addEventListener('mousemove', function(e) {
    var r = card.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5;
    var y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = 'perspective(900px) rotateX(' + (-y*5) + 'deg) rotateY(' + (x*5) + 'deg) translateY(-14px) scale(1.01)';
  });
  card.addEventListener('mouseleave', function() { card.style.transform = ''; });
});

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-item').forEach(function(item) {
  var q = item.querySelector('.faq-question');
  if (!q) return;
  q.addEventListener('click', function() {
    var isOpen = item.classList.contains('faq-open');
    document.querySelectorAll('.faq-item.faq-open').forEach(function(o) { o.classList.remove('faq-open'); });
    if (!isOpen) item.classList.add('faq-open');
  });
});

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn').forEach(function(btn) {
  btn.addEventListener('mousemove', function(e) {
    var r = btn.getBoundingClientRect();
    var x = e.clientX - r.left - r.width / 2;
    var y = e.clientY - r.top - r.height / 2;
    btn.style.transform = 'translate(' + (x * 0.14) + 'px, ' + (y * 0.22) + 'px)';
  });
  btn.addEventListener('mouseleave', function() { btn.style.transform = ''; });
});

/* ── PAGE TRANSITION ── */
var ptEl = document.getElementById('pageTransition');
if (ptEl) {
  document.querySelectorAll('a[href]').forEach(function(link) {
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('http') === 0 ||
        href.indexOf('mailto') === 0 || href.indexOf('tel') === 0) return;
    link.addEventListener('click', function(e) {
      e.preventDefault();
      ptEl.classList.add('active');
      setTimeout(function() { window.location.href = href; }, 640);
    });
  });
}

/* ── TOAST NOTIFICATIONS ── */
function showToast(msg, type) {
  type = type || 'info';
  var c = document.getElementById('toastWrap');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toastWrap';
    c.style.cssText = 'position:fixed;bottom:28px;right:28px;z-index:99990;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(c);
  }
  var icons = { success: '✅', error: '❌', info: 'ℹ️' };
  var colors = { success: '#4ade80', error: '#f87171', info: '#facc15' };
  var t = document.createElement('div');
  t.style.cssText = 'background:#1e293b;border:1px solid rgba(255,255,255,.1);color:white;padding:14px 20px;border-radius:12px;font-size:14px;min-width:260px;box-shadow:0 16px 50px rgba(0,0,0,.5);display:flex;align-items:center;gap:10px;border-left:3px solid ' + (colors[type]||colors.info) + ';';
  t.innerHTML = '<span style="font-size:18px;">' + (icons[type]||icons.info) + '</span><span>' + msg + '</span>';
  c.appendChild(t);
  setTimeout(function() {
    t.style.opacity = '0'; t.style.transform = 'translateX(40px)'; t.style.transition = '.3s';
    setTimeout(function() { t.remove(); }, 300);
  }, 3500);
}

/* ── TESTIMONIALS INFINITE SCROLL ── */
window.addEventListener('load', function() {
  var track = document.getElementById('testimonialsTrack');
  if (!track) return;
  
  var origCards = Array.from(track.children);
  origCards.forEach(function(c) { track.appendChild(c.cloneNode(true)); });
  origCards.forEach(function(c) { track.appendChild(c.cloneNode(true)); });
  
  var pos = 0;
  var speed = 0.5;
  var cardW = origCards[0] ? (origCards[0].offsetWidth + 28) : 408;
  var setW = cardW * origCards.length;
  
  var wrapper = document.querySelector('.testimonials-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', function() { speed = 0; });
    wrapper.addEventListener('mouseleave', function() { speed = 0.5; });
  }
  
  (function loop() {
    pos -= speed;
    if (Math.abs(pos) >= setW) pos = 0;
    track.style.transform = 'translateX(' + pos + 'px)';
    requestAnimationFrame(loop);
  })();
});

/* ── PARTICLE CANVAS ── */
(function() {
  var canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  var ctx = canvas.getContext('2d');
  var W, H, particles = [];
  
  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  for (var i = 0; i < 55; i++) {
    particles.push({
      x: Math.random() * (window.innerWidth || 1200),
      y: Math.random() * (window.innerHeight || 800),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.45 + 0.1
    });
  }
  
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function(p, i) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(250,204,21,' + p.a + ')'; ctx.fill();
      
      for (var j = i + 1; j < particles.length; j++) {
        var dx = p.x - particles[j].x, dy = p.y - particles[j].y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(250,204,21,' + (0.07 * (1 - dist/100)) + ')'; ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── FOOTER YEAR ── */
var yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();


