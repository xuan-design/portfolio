/* ==========================================================================
   小炫 · 设计作品集 2026
   交互：平滑滚动 / 卡片键盘可达 / BorderGlow / 详情视图 SPA 加载
   ========================================================================== */

(() => {
  'use strict';

  /* ---------------- 平滑滚动到锚点 ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------------- 详情视图 SPA（避免整页跳转，保持全屏） ---------------- */
  const catalogEl = document.getElementById('catalog');
  const footerEl = document.querySelector('.site-footer');
  const detailView = document.getElementById('detailView');
  const detailContent = document.getElementById('detailContent');
  const detailBack = document.getElementById('detailBack');

  function bindVideos(container) {
    container.querySelectorAll('.detail-video').forEach(function (v) {
      const overlay = v.nextElementSibling;
      v.addEventListener('click', function () {
        if (v.paused) {
          v.play();
          overlay.classList.add('is-hidden');
        } else {
          v.pause();
          overlay.classList.remove('is-hidden');
        }
      });
      v.addEventListener('ended', function () {
        overlay.classList.remove('is-hidden');
      });
      if (overlay) {
        overlay.addEventListener('click', function (e) {
          e.stopPropagation();
          v.play();
          overlay.classList.add('is-hidden');
        });
      }
    });
  }

  async function openDetail(href) {
    try {
      const resp = await fetch(href);
      const html = await resp.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const main = doc.querySelector('.image-stack');
      detailContent.innerHTML = main ? main.innerHTML : '';
      bindVideos(detailContent);
    } catch (err) {
      detailContent.innerHTML = '';
    }
    catalogEl.hidden = true;
    if (footerEl) footerEl.style.display = 'none';
    detailView.hidden = false;
    document.body.classList.add('detail-open');
    window.scrollTo(0, 0);
  }

  function closeDetail() {
    detailView.hidden = true;
    catalogEl.hidden = false;
    if (footerEl) footerEl.style.display = '';
    document.body.classList.remove('detail-open');
  }

  /* ---------------- 卡片交互 ---------------- */
  const cards = document.querySelectorAll('.catalog .card');
  cards.forEach((card) => {
    if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });

    /* BorderGlow 渐变边框：跟随鼠标角度 */
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      if (dx === 0 && dy === 0) return;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;
      card.style.setProperty('--cursor-angle', angle.toFixed(2) + 'deg');
    });

    /* 点击卡片：SPA 加载详情，不整页跳转 */
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openDetail(card.getAttribute('href'));
    });
  });

  if (detailBack) {
    detailBack.addEventListener('click', (e) => {
      e.preventDefault();
      closeDetail();
    });
  }
})();
