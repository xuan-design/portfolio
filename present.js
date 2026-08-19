/* ==========================================================================
   小炫 · 设计作品集 2026
   工具栏：我的简历（灯箱查看）+ 全屏展示（浏览器全屏切换）
   移动端不显示工具栏
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
  .present-toolbar{position:fixed;top:20px;right:20px;z-index:9999;display:flex;gap:10px}
  .present-toolbar button{display:inline-flex;align-items:center;gap:8px;padding:10px 16px 10px 14px;background:rgba(15,22,48,.72);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(140,165,230,.22);border-radius:999px;font-size:13px;letter-spacing:.06em;color:#cdd5ee;cursor:pointer;transition:all .25s ease;font-family:inherit}
  .present-toolbar button:hover{background:rgba(28,38,78,.85);border-color:rgba(160,185,245,.45);color:#fff}
  .present-toolbar svg{display:block}
  .present-resume{position:fixed;inset:0;z-index:10000;background:rgba(4,6,15,.92);display:none;align-items:center;justify-content:center;padding:32px;cursor:pointer}
  .present-resume.is-open{display:flex}
  .present-resume img{max-width:100%;max-height:100%;width:auto;height:auto;border-radius:6px;box-shadow:0 12px 48px rgba(0,0,0,.6);cursor:auto}
  .present-resume-close{position:absolute;top:20px;right:20px;width:40px;height:40px;border-radius:50%;background:rgba(15,22,48,.72);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(140,165,230,.22);color:#cdd5ee;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:22px;line-height:1;transition:all .2s ease}
  .present-resume-close:hover{background:rgba(28,38,78,.85);color:#fff}
  :fullscreen .present-toolbar{display:none}
  :-webkit-full-screen .present-toolbar{display:none}
  @media (max-width:640px){
    .present-toolbar{display:none}
  }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- 工具栏容器 ---------- */
  const toolbar = document.createElement('div');
  toolbar.className = 'present-toolbar';
  document.body.appendChild(toolbar);

  /* ---------- 简历按钮（在左）---------- */
  const resumeBtn = document.createElement('button');
  resumeBtn.type = 'button';
  resumeBtn.setAttribute('aria-label', '查看我的简历');
  resumeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><span>我的简历</span>';
  toolbar.appendChild(resumeBtn);

  /* ---------- 全屏按钮（在右）---------- */
  const fsBtn = document.createElement('button');
  fsBtn.type = 'button';
  fsBtn.setAttribute('aria-label', '全屏展示');
  fsBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg><span>全屏展示</span>';
  toolbar.appendChild(fsBtn);

  /* ---------- 简历灯箱 ---------- */
  const overlay = document.createElement('div');
  overlay.className = 'present-resume';
  overlay.innerHTML = '<button class="present-resume-close" type="button" aria-label="关闭">×</button><img src="media/resume.jpg" alt="个人简历 - 吴炫瑾"/>';
  document.body.appendChild(overlay);
  const closeBtn = overlay.querySelector('.present-resume-close');

  function openResume() {
    overlay.classList.add('is-open');
  }
  function closeResume() {
    overlay.classList.remove('is-open');
  }

  resumeBtn.addEventListener('click', openResume);
  closeBtn.addEventListener('click', closeResume);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeResume();
  });

  /* ---------- 全屏切换 ---------- */
  function toggleFS() {
    if (isFS()) exitFS().catch(() => {});
    else requestFS(document.documentElement).catch(() => {});
  }
  fsBtn.addEventListener('click', toggleFS);

  /* ---------- 键盘 ---------- */
  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName ? e.target.tagName : '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) return;

    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      toggleFS();
    }
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeResume();
    }
  });
})();