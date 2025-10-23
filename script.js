document.addEventListener('DOMContentLoaded', () => {

  const ui = {
    popupOverlay: document.getElementById('popupOverlay'),
    openButtons: Array.from(document.querySelectorAll('#contactBtn, #contactBtnCatalog, #contactBtnBrands, #contactBtnMakeup, #contactBtnSkincare, #contactBtnPerfume')),
    closePopupBtn: document.getElementById('closePopup'),
    popupForm: document.getElementById('popupContactForm'),
    readMoreBtn: document.getElementById('readMoreBtn'),
    aboutShort: document.getElementById('aboutShort'),
    aboutMore: document.getElementById('aboutMore'),
    themeToggle: document.getElementById('themeToggle'),
    changeBgBtn: document.getElementById('changeBgBtn'),
    showTimeBtn: document.getElementById('showTimeBtn'),
    timeDisplay: document.getElementById('timeDisplay'),
    nav: document.getElementById('mainNav'),
    ratingStars: Array.from(document.querySelectorAll('.rating .star')),
    ratingValueSpan: document.getElementById('ratingValue'),
    mainImage: document.getElementById('mainImage'),
    thumbs: Array.from(document.querySelectorAll('.thumbnails .thumb')),
    buyBtn: document.getElementById('buyBtn'),
    playSoundBtn: document.getElementById('playSoundBtn'),
    datetimeFooter: document.getElementById('datetimeFooter'),
    resetContact: document.getElementById('resetContact')
  };

  const state = {
    rating: 0,
    colorIndex: 0,
    colors: ['#0d1b2a','#102233','#859dc2ff','#1b2a36','#4454b3e1'],
    themeLight: false
  };

  const greetingEl = document.getElementById('greeting');
  function updateGreetingByTime() {
    const hour = new Date().getHours();
    let text;
    switch (true) {
      case (hour >= 5 && hour < 12): text = 'Good morning, beauty'; break;
      case (hour >= 12 && hour < 18): text = 'Good afternoon — shine on'; break;
      case (hour >= 18 && hour < 22): text = 'Good evening — relax & pamper '; break;
      default: text = 'Hello — welcome to Adema\'s Beauty Shop'; break;
    }
    if (greetingEl) greetingEl.textContent = text;
  }
  updateGreetingByTime();

  if (ui.readMoreBtn && ui.aboutMore && ui.aboutShort) {
    ui.readMoreBtn.addEventListener('click', () => {
      const shown = ui.aboutMore.style.display === 'block';
      ui.aboutMore.style.display = shown ? 'none' : 'block';
      ui.readMoreBtn.textContent = shown ? 'Read More' : 'Read Less';
    });
  }

  const sharedOpenBtns = Array.from(document.querySelectorAll('#contactBtn, #contactBtnCatalog, #contactBtnBrands, #contactBtnMakeup, #contactBtnSkincare, #contactBtnPerfume'));
  sharedOpenBtns.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', showPopup);
  });
  function showPopup() {
    if (!ui.popupOverlay) return;
    ui.popupOverlay.classList.remove('hidden');
    ui.popupOverlay.setAttribute('aria-hidden', 'false');
    const firstInput = document.getElementById('popupName');
    if (firstInput) firstInput.focus();
  }
  function hidePopup() {
    if (!ui.popupOverlay) return;
    ui.popupOverlay.classList.add('hidden');
    ui.popupOverlay.setAttribute('aria-hidden', 'true');
  }
  if (ui.closePopupBtn) ui.closePopupBtn.addEventListener('click', hidePopup);
  if (ui.popupOverlay) {
    ui.popupOverlay.addEventListener('click', (e) => { if (e.target === ui.popupOverlay) hidePopup(); });
  }

  if (ui.resetContact) ui.resetContact.addEventListener('click', () => { ui.popupForm.reset(); clearPopupErrors(); });

  if (ui.popupForm) {
    ui.popupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearPopupErrors();
      const name = document.getElementById('popupName');
      const email = document.getElementById('popupEmail');
      const message = document.getElementById('popupMessage');
      let ok = true;
      if (!name.value.trim()) { setError('popupNameError','Please enter your name.'); ok = false; }
      if (!validateEmail(email.value.trim())) { setError('popupEmailError','Please enter a valid email.'); ok = false; }
      if (!message.value.trim() || message.value.trim().length < 10) { setError('popupMessageError','Please enter a message of at least 10 characters.'); ok = false; }
      if (!ok) return;

      const successEl = document.getElementById('popupSuccess');
      successEl.textContent = 'Sending…';
      fakePost('/api/contact', { name: name.value, email: email.value, message: message.value }, (err, res) => {
        if (err) {
          successEl.textContent = 'Error sending. Try later.';
        } else {
          successEl.textContent = 'Message sent. Thank you!';
          ui.popupForm.reset();
          setTimeout(() => { successEl.textContent = ''; hidePopup(); }, 1500);
        }
      });
    });
  }

  function fakePost(url, data, cb) {
    setTimeout(() => {
      cb(null, { status: 200, message: 'ok' });
    }, 900);
  }

  function setError(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
  function clearPopupErrors() {
    ['popupNameError','popupEmailError','popupMessageError','popupSuccess'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  }
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (ui.themeToggle) {
    ui.themeToggle.addEventListener('click', () => {
      state.themeLight = !state.themeLight;
      document.documentElement.classList.toggle('light-theme', state.themeLight);
      ui.themeToggle.setAttribute('aria-pressed', state.themeLight ? 'true' : 'false');
      ui.themeToggle.textContent = state.themeLight ? 'Light Theme' : 'Dark Theme';
    });
  }

  if (ui.changeBgBtn) {
    ui.changeBgBtn.addEventListener('click', () => {
      state.colorIndex = (state.colorIndex + 1) % state.colors.length;
      document.body.style.backgroundColor = state.colors[state.colorIndex];
      document.body.animate([{opacity:.9},{opacity:1}],{duration:260});
    });
  }

  if (ui.showTimeBtn && ui.timeDisplay) {
    ui.showTimeBtn.addEventListener('click', () => {
      ui.timeDisplay.textContent = new Date().toLocaleTimeString();
      ui.timeDisplay.animate([{opacity:0},{opacity:1}],{duration:300});
    });
  }

  if (ui.nav) {
    const items = Array.from(ui.nav.querySelectorAll('.nav-item'));
    let focused = 0;
    items.forEach((el, idx) => {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { items[(idx+1) % items.length].focus(); e.preventDefault(); }
        else if (e.key === 'ArrowLeft') { items[(idx-1+items.length) % items.length].focus(); e.preventDefault(); }
      });
    });
  }

  if (ui.ratingStars && ui.ratingStars.length) {
    ui.ratingStars.forEach(star => {
      star.addEventListener('click', () => {
        const val = Number(star.dataset.value);
        state.rating = val;
        updateStars(val);
        try { localStorage.setItem('featuredRating', String(val)); } catch(e){}
      });
      star.addEventListener('mouseover', () => updateStars(Number(star.dataset.value)));
      star.addEventListener('mouseout', () => updateStars(state.rating));
    });
    const saved = Number(localStorage.getItem('featuredRating'));
    if (saved) { state.rating = saved; updateStars(saved); }
  }
  function updateStars(val) {
    ui.ratingStars.forEach(s => {
      const v = Number(s.dataset.value);
      s.classList.toggle('active', v <= val);
      s.setAttribute('aria-checked', v === val ? 'true' : 'false');
      s.textContent = v <= val ? '\u2605' : '\u2606';
    });
    if (ui.ratingValueSpan) ui.ratingValueSpan.textContent = `${val}/5`;
  }

  if (ui.thumbs && ui.mainImage) {
    ui.thumbs.forEach(t => {
      t.addEventListener('click', () => {
        const src = t.dataset.src;
        ui.mainImage.animate([{ transform: 'scale(.98)', opacity:0.6 }, { transform:'scale(1)', opacity:1 }], { duration: 240 });
        ui.mainImage.src = src;
        ui.thumbs.forEach(x => x.classList.remove('selected'));
        t.classList.add('selected');
      });
    });
    if (ui.thumbs[0]) ui.thumbs[0].classList.add('selected');
  }

function playTone(freq = 880, duration = 180, volume = 0.05) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.value = volume;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    setTimeout(() => { o.stop(); ctx.close(); }, duration);
  } catch (e) {
    console.warn('Audio not available', e);
  }
}

if (ui.playSoundBtn) ui.playSoundBtn.addEventListener('click', () => playTone(1000, 150, 0.06));

if (ui.buyBtn) ui.buyBtn.addEventListener('click', () => {
    ui.buyBtn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 240 });
    alert('Your product is in the cart.');
});


  const products = [
    { id: 1, name: 'PUSY Brow Mascara', category: 'makeup', price: 2932 },
    { id: 2, name: 'VIVIENNE SABO La La Laque', category: 'makeup', price: 3037 },
    { id: 3, name: 'CeraVe Moisturizing Cream', category: 'skincare', price: 4590 },
  ];
  function filterProducts(predicate) { return products.filter(predicate); }
  const makeup = filterProducts(p => p.category === 'makeup').map(p => `${p.name} — ${p.price}₸`);
  console.log('Products (example):', products);
  console.log('Makeup names (map):', makeup);

  function updateAllFooters() {
    const dt = new Date();
    const options = { year:'numeric', month:'long', day:'numeric', hour:'numeric', minute:'2-digit', second:'2-digit' };
    const str = dt.toLocaleString(undefined, options);
    if (ui.datetimeFooter) ui.datetimeFooter.textContent = str;
  }
  updateAllFooters();
  setInterval(updateAllFooters, 1000);

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r') {
      ui.themeToggle && ui.themeToggle.click();
    } else if (e.key.toLowerCase() === 't') {
      ui.showTimeBtn && ui.showTimeBtn.click();
    } else if (e.key.toLowerCase() === 'c') {
      showPopup();
    }
  });
});