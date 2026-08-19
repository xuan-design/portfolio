/* ==========================================================================
   小炫 · 设计作品集 2026
   交互：平滑滚动 / 卡片键盘可达性
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

  /* ---------------- 键盘可达性：卡片 focus / Enter ---------------- */
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });

    /* ---------------- BorderGlow 渐变边框：跟随鼠标角度 ---------------- */
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
  });
})();