/* ==========================================================================
   小炫 · 设计作品集 2026
   全屏演示：全站浮动按钮 + F 键；详情页进入幻灯片放映模式
   ========================================================================== */
(() => {
  'use strict';

  const isDetail = !!document.querySelector('.image-stack');

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
  .present-stage{position:fixed;inset:0;z-index:10000;background:#04060f;display:none;align-items:center;justify-content:center;cursor:pointer}
  .present-stage.is-active{display:flex}
  .present-stage .slide{max-width:100vw;max-height:100vh;width:auto;height:auto;object-fit:contain}
  .present-stage .slide-video{max-width:100vw;max-height:100vh;width:100vw;height:100vh;object-fit:contain;background:#000}
  .present-counter{position:absolute;top:18px;left:50%;transform:translateX(-50%);font-size:13px;letter-spacing:.15em;color:rgba(255,255,255,.6);font-family:inherit}
  .present-hint{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);font-size:12px;color:rgba(255,255,255,.42);letter-spacing:.05em;white-space:nowrap}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- 浮动按钮 ---------- */
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'present-btn';
  btn.setAttribute('aria-label', '全屏演示');
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg><span>全屏演示</span>';
  document.body.appendChild(btn);

  /* ---------- 详情页：幻灯片 ---------- */
  let slides = [];
  let idx = 0;
  let stage = null;
  let counter = null;

  if (isDetail) {
    slides = Array.from(document.querySelectorAll('.image-stack img, .image-stack .media-video-item'));
    stage = document.createElement('div');
    stage.className = 'present-stage';
    stage.innerHTML = '<div class="present-counter"></div><div class="present-hint">← → 切换 · 点击下一页 · Esc 退出</div>';
    document.body.appendChild(stage);
    counter = stage.querySelector('.present-counter');
  }

  function render(i) {
    if (!slides.length) return;
    idx = (i + slides.length) % slides.length;
    const el = slides[idx];

    stage.querySelectorAll('.slide, .slide-video').forEach((n) => n.remove());

    if (el.tagName === 'IMG') {
      const img = el.cloneNode();
      img.className = 'slide';
      img.removeAttribute('loading');
      img.removeAttribute('decoding');
      img.alt = '';
      stage.insertBefore(img, stage.querySelector('.present-hint'));
    } else {
      const src = el.querySelector('video');
      if (src) {
        const video = src.cloneNode(true);
        video.className = 'slide-video';
        video.setAttribute('controls', '');
        video.removeAttribute('preload');
        stage.insertBefore(video, stage.querySelector('.present-hint'));
      }
    }
    counter.textContent = (idx + 1) + ' / ' + slides.length;
  }

  function enterPresent() {
    if (!isDetail) return;
    stage.classList.add('is-active');
    render(0);
    requestFS(document.documentElement).catch(() => {});
  }

  function exitPresent() {
    if (!isDetail) return;
    stage.classList.remove('is-active');
    if (isFS()) exitFS().catch(() => {});
  }

  function togglePlainFullscreen() {
    if (isFS()) exitFS().catch(() => {});
    else requestFS(document.documentElement).catch(() => {});
  }

  /* ---------- 事件 ---------- */
  btn.addEventListener('click', () => {
    if (isDetail) {
      if (stage.classList.contains('is-active')) exitPresent();
      else enterPresent();
    } else {
      togglePlainFullscreen();
    }
  });

  if (isDetail) {
    stage.addEventListener('click', (e) => {
      if (e.target.closest('video')) return;
      render(idx + 1);
    });
  }

  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName ? e.target.tagName : '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) return;

    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      if (isDetail) {
        if (stage.classList.contains('is-active')) exitPresent();
        else enterPresent();
      } else {
        togglePlainFullscreen();
      }
      return;
    }

    if (isDetail && stage.classList.contains('is-active')) {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        render(idx + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        render(idx - 1);
      }
    }
  });

  /* 按 Esc 退出全屏时，同步关闭幻灯片 */
  document.addEventListener('fullscreenchange', syncStage);
  document.addEventListener('webkitfullscreenchange', syncStage);
  function syncStage() {
    if (!isFS() && isDetail && stage.classList.contains('is-active')) {
      stage.classList.remove('is-active');
    }
  }
})();
