/* ==========================================================================
   小炫 · 设计作品集 2026
   全屏展示：全站浮动按钮 + F 键切换浏览器全屏
   ========================================================================== */
(() => {
  'use strict';

  /* ---------- Fullscreen API 兼容 ---------- */
  function requestFS(el) {
    if (el.requestFullscreen) return el.requestFullscreen();
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
    return Promise.reject(new Error('Fullscreen not supported'));
  }
  function exitFS() {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
    return Promise.reject(new Error('Fullscreen not supported'));
  }
  function isFS() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }

  /* ---------- 注入样式 ---------- */
  const css = `
  .present-btn{position:fixed;top:20px;right:20px;z-index:9999;display:inline-flex;align-items:center;gap:8px;padding:10px 16px 10px 14px;background:rgba(15,22,48,.72);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(140,165,230,.22);border-radius:999px;font-size:13px;letter-spacing:.06em;color:#cdd5ee;cursor:pointer;transition:all .25s ease;font-family:inherit}
  .present-btn:hover{background:rgba(28,38,78,.85);border-color:rgba(160,185,245,.45);color:#fff}
  .present-btn svg{display:block}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- 浮动按钮 ---------- */
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'present-btn';
  btn.setAttribute('aria-label', '全屏展示');
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg><span>全屏展示</span>';
  document.body.appendChild(btn);

  function toggle() {
    if (isFS()) exitFS().catch(() => {});
    else requestFS(document.documentElement).catch(() => {});
  }

  /* ---------- 事件 ---------- */
  btn.addEventListener('click', toggle);

  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName ? e.target.tagName : '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) return;
    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      toggle();
    }
  });
})();
