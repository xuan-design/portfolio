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
  });
})();