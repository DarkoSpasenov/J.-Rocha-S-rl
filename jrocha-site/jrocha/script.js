document.addEventListener('DOMContentLoaded', () => {

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      mainNav.style.display = open ? 'flex' : '';
      if (open) {
        mainNav.style.position = 'absolute';
        mainNav.style.top = '76px';
        mainNav.style.left = '0';
        mainNav.style.right = '0';
        mainNav.style.flexDirection = 'column';
        mainNav.style.background = 'rgba(244,240,232,0.98)';
        mainNav.style.padding = '20px 32px';
        mainNav.style.gap = '16px';
        mainNav.style.borderBottom = '1px solid rgba(28,33,31,0.12)';
      }
    });
    mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      mainNav.style.display = '';
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- scroll reveal ---------- */
  const revealTargets = document.querySelectorAll('.service-card, .reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- before / after slider ---------- */
  const stage = document.getElementById('baSlider');
  const beforeFrame = document.getElementById('baBeforeFrame');
  const handle = document.getElementById('baHandle');

  if (stage && beforeFrame && handle) {
    let dragging = false;

    function setPosition(clientX) {
      const rect = stage.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      beforeFrame.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = pct + '%';
      handle.setAttribute('aria-valuenow', Math.round(pct));
    }

    stage.addEventListener('mousedown', (e) => { dragging = true; setPosition(e.clientX); });
    window.addEventListener('mousemove', (e) => { if (dragging) setPosition(e.clientX); });
    window.addEventListener('mouseup', () => dragging = false);

    stage.addEventListener('touchstart', (e) => { dragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
    stage.addEventListener('touchmove', (e) => { if (dragging) setPosition(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', () => dragging = false);

    handle.addEventListener('keydown', (e) => {
      const rect = stage.getBoundingClientRect();
      const current = parseFloat(handle.style.left) || 50;
      let next = current;
      if (e.key === 'ArrowLeft') next = Math.max(0, current - 4);
      if (e.key === 'ArrowRight') next = Math.min(100, current + 4);
      if (next !== current) {
        setPosition(rect.left + (rect.width * next / 100));
        e.preventDefault();
      }
    });

    /* thumbnail switching */
    const afterImg = document.getElementById('baAfterImg');
    const beforeImg = document.getElementById('baBeforeImg');
    const title = document.getElementById('baTitle');
    const desc = document.getElementById('baDesc');
    const thumbs = document.querySelectorAll('.ba-thumb');

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('is-active'));
        thumb.classList.add('is-active');
        afterImg.src = thumb.dataset.after;
        beforeImg.src = thumb.dataset.before;
        title.textContent = thumb.dataset.title;
        desc.textContent = thumb.dataset.desc;
        setPosition(stage.getBoundingClientRect().left + stage.getBoundingClientRect().width / 2);
      });
    });
  }

  /* ---------- devis form ---------- */
  const form = document.getElementById('devisForm');
  const note = document.getElementById('devisNote');

  if (form && note) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        note.textContent = 'Merci de remplir les champs obligatoires (nom, téléphone, e-mail).';
        note.classList.remove('is-success');
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const subject = encodeURIComponent(`Demande de devis — ${data.get('service') || 'Projet'}`);
      const body = encodeURIComponent(
        `Nom : ${data.get('name')}\n` +
        `Téléphone : ${data.get('phone')}\n` +
        `E-mail : ${data.get('email')}\n` +
        `Ville / NPA : ${data.get('locality') || '—'}\n` +
        `Type de travaux : ${data.get('service')}\n\n` +
        `Message :\n${data.get('message') || '—'}`
      );

      window.location.href = `mailto:info@jrochapeinture.com?subject=${subject}&body=${body}`;

      note.textContent = 'Votre logiciel de messagerie va s\u2019ouvrir avec votre demande pré-remplie.';
      note.classList.add('is-success');
    });
  }

});
