/* =========================================================
   app.js — 個人網頁動態渲染引擎
   讀取 content.json 並渲染所有頁面區塊
   ========================================================= */

(async function () {
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const $  = (id) => document.getElementById(id);

  function getYouTubeThumbnail(id) { return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`; }
  function getYouTubeFallback(id)  { return `https://img.youtube.com/vi/${id}/hqdefault.jpg`; }
  function getYouTubeUrl(id)       { return `https://youtu.be/${id}`; }

  // ── SVG icons ─────────────────────────────────────────
  const icons = {
    youtube: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    instagram: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    film: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`,
    play: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    music: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>`,
    line: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>`,
    location: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
    sun: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`,
  };

  // ── 資料載入 ──────────────────────────────────────────
  let data;
  try {
    const res = await fetch('content.json');
    if (!res.ok) throw new Error('Failed to load content.json');
    data = await res.json();
  } catch (e) {
    console.error(e);
    $('loading').innerHTML = `
      <div class="text-center p-8">
        <p class="text-red-500 text-lg font-semibold mb-2">無法載入內容</p>
        <p class="text-sm mb-1" style="color:var(--text-muted)">請使用本地伺服器開啟（Live Server 或 npx serve .）</p>
        <p class="text-xs" style="color:var(--text-muted)">${e.message}</p>
      </div>`;
    return;
  }

  // ── Meta ──────────────────────────────────────────────
  function updateMeta(meta) {
    document.title = meta.siteTitle;
    qs('meta[name="description"]').content = meta.siteDescription;
    qs('meta[property="og:title"]').content = meta.siteTitle;
    qs('meta[property="og:description"]').content = meta.siteDescription;
    qs('meta[property="og:image"]').content = meta.ogImage;
  }

  // ── 主題切換 ──────────────────────────────────────────
  function initThemeToggle() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'dark' || (!saved && prefersDark);
    if (isDark) document.documentElement.classList.add('dark');
    updateThemeIcons(isDark);

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const nowDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', nowDark ? 'dark' : 'light');
        updateThemeIcons(nowDark);
      });
    });
  }

  function updateThemeIcons(isDark) {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.innerHTML = isDark ? icons.sun : icons.moon;
      btn.setAttribute('aria-label', isDark ? '切換亮色模式' : '切換暗色模式');
    });
  }

  // ── Navbar ────────────────────────────────────────────
  function renderNav(nav) {
    $('navbar').innerHTML = `
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#hero" class="font-black text-xl gradient-text tracking-tight">${nav.logo}</a>

        <!-- Desktop -->
        <div class="hidden md:flex items-center gap-6">
          <ul class="flex items-center gap-6">
            ${nav.links.map(l => `
              <li><a href="${l.href}" class="nav-link font-medium transition-colors duration-200 text-sm"
                style="color:var(--text-secondary)"
                onmouseover="this.style.color='#7c3aed'" onmouseout="this.style.color='var(--text-secondary)'">
                ${l.label}
              </a></li>
            `).join('')}
          </ul>
          <button class="theme-toggle-btn" aria-label="切換暗色模式"></button>
          <a href="#contact" class="btn-primary text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md">
            合作洽詢
          </a>
        </div>

        <!-- Mobile right group -->
        <div class="md:hidden flex items-center gap-2">
          <button class="theme-toggle-btn" aria-label="切換暗色模式"></button>
          <button id="hamburger" class="flex flex-col gap-1.5 p-2 rounded-lg transition" aria-label="選單"
            style="background:transparent"
            onmouseover="this.style.background='var(--bg-cat-inactive)'" onmouseout="this.style.background='transparent'">
            <span class="block w-5 h-0.5 transition-all duration-300" style="background:var(--text-primary)"></span>
            <span class="block w-5 h-0.5 transition-all duration-300" style="background:var(--text-primary)"></span>
            <span class="block w-5 h-0.5 transition-all duration-300" style="background:var(--text-primary)"></span>
          </button>
        </div>
      </div>

      <!-- Mobile drawer -->
      <div id="mobile-menu" class="md:hidden hidden border-t shadow-lg" style="background:var(--bg-card); border-color:var(--border-card)">
        <ul class="flex flex-col py-4 px-6 gap-1">
          ${nav.links.map(l => `
            <li><a href="${l.href}" class="mobile-nav-link block py-2.5 font-medium transition-colors"
              style="color:var(--text-primary)"
              onmouseover="this.style.color='#7c3aed'" onmouseout="this.style.color='var(--text-primary)'">
              ${l.label}
            </a></li>
          `).join('')}
          <li class="mt-3">
            <a href="#contact" class="mobile-nav-link btn-primary block text-center text-white font-semibold px-5 py-2.5 rounded-full">
              合作洽詢
            </a>
          </li>
        </ul>
      </div>
    `;
  }

  // ── Hero ──────────────────────────────────────────────
  function renderHero(hero) {
    const socialHtml = hero.socialLinks.map(s => `
      <a href="${s.href}" target="_blank" rel="noopener noreferrer" aria-label="${s.platform}"
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
        style="background:var(--bg-social-btn); color:var(--text-secondary); box-shadow:0 2px 8px rgba(0,0,0,0.12)"
        onmouseover="this.style.color='#7c3aed'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.18)'"
        onmouseout="this.style.color='var(--text-secondary)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.12)'">
        ${icons[s.icon] || ''}
      </a>
    `).join('');

    const ctaHtml = hero.ctaButtons.map(btn => {
      if (btn.style === 'primary') {
        return `<a href="${btn.href}" class="btn-primary text-white font-bold px-7 py-3 rounded-full shadow-lg text-sm sm:text-base inline-block">${btn.label}</a>`;
      }
      return `<a href="${btn.href}" class="font-bold px-7 py-3 rounded-full text-sm sm:text-base inline-block border-2 transition-colors duration-200"
        style="border-color:#7c3aed; color:#7c3aed"
        onmouseover="this.style.background='rgba(124,58,237,0.1)'" onmouseout="this.style.background='transparent'">
        ${btn.label}
      </a>`;
    }).join('');

    const avatarHtml = hero.avatar
      ? `<img src="${hero.avatar}" alt="${hero.avatarAlt}" class="w-full h-full object-cover rounded-full"
           onerror="this.style.display='none'; this.parentElement.querySelector('.avatar-fallback').style.display='flex';">`
      : '';

    $('hero').innerHTML = `
      <div class="w-full" style="background: var(--bg-hero);">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
          <div class="grid md:grid-cols-2 gap-12 items-center">

            <!-- Left: Text -->
            <div class="observe-fade order-2 md:order-1">
              <p class="font-semibold text-sm tracking-widest uppercase mb-3" style="color:#7c3aed">
                Freelance Video Editor
              </p>
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4">
                <span style="color:var(--text-primary)">嗨，我是</span><br>
                <span class="gradient-text">${hero.name}</span>
              </h1>
              <p class="text-lg sm:text-xl font-medium mb-3" style="color:var(--text-secondary)">${hero.title}</p>
              <p class="leading-relaxed mb-8 max-w-lg" style="color:var(--text-secondary)">${hero.description}</p>

              <div class="flex flex-wrap gap-4 mb-8">${ctaHtml}</div>
              <div class="flex gap-3">${socialHtml}</div>
            </div>

            <!-- Right: Avatar -->
            <div class="observe-fade order-1 md:order-2 flex justify-center">
              <div class="avatar-ring w-56 h-56 sm:w-72 sm:h-72 flex-shrink-0 shadow-2xl">
                <div class="w-full h-full rounded-full overflow-hidden relative"
                  style="background: linear-gradient(135deg, #ede9fe, #fce7f3);">
                  ${avatarHtml}
                  <div class="avatar-fallback absolute inset-0 flex items-center justify-center text-6xl"
                    style="${hero.avatar ? 'display:none' : ''}">🎬</div>
                </div>
              </div>
            </div>

          </div>

          <!-- Scroll hint -->
          <div class="flex justify-center mt-16">
            <a href="#portfolio" class="flex flex-col items-center gap-2 transition-colors"
              style="color:var(--text-muted)"
              onmouseover="this.style.color='#7c3aed'" onmouseout="this.style.color='var(--text-muted)'">
              <span class="text-xs tracking-widest">SCROLL</span>
              <svg class="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // ── Portfolio ─────────────────────────────────────────
  let allPortfolioItems = [];

  function buildPortfolioGrid(items) {
    if (items.length === 0) {
      return `<div class="col-span-full text-center py-16" style="color:var(--text-empty)">此分類暫無作品</div>`;
    }
    return items.map(item => `
      <a href="${getYouTubeUrl(item.youtubeId)}" target="_blank" rel="noopener noreferrer"
        class="group block rounded-2xl overflow-hidden border card-hover"
        style="border-color:var(--border-card)">
        <!-- Thumbnail -->
        <div class="relative aspect-video overflow-hidden" style="background:var(--bg-input)">
          <img src="${getYouTubeThumbnail(item.youtubeId)}" alt="${item.title}"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onerror="this.src='${getYouTubeFallback(item.youtubeId)}'; this.onerror=null;"
            loading="lazy">
          <!-- Play overlay -->
          <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div class="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          <span class="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-0.5 rounded font-mono">${item.duration}</span>
          <span class="absolute top-2 left-2 text-xs px-2.5 py-1 rounded-full font-medium text-white"
            style="background:linear-gradient(to right,#7c3aed,#ec4899)">${item.category}</span>
        </div>
        <!-- Info -->
        <div class="p-4">
          <h3 class="font-bold mb-1 line-clamp-1 transition-colors group-hover:text-purple-500"
            style="color:var(--text-primary)">${item.title}</h3>
          <p class="text-sm line-clamp-2 mb-3" style="color:var(--text-secondary)">${item.description}</p>
          <div class="flex flex-wrap gap-1.5">
            ${item.tags.map(tag => `
              <span class="text-xs px-2 py-0.5 rounded-full"
                style="background:rgba(124,58,237,0.12); color:#7c3aed">${tag}</span>
            `).join('')}
          </div>
        </div>
      </a>
    `).join('');
  }

  function filterPortfolio(category) {
    const items = category === '全部'
      ? allPortfolioItems
      : allPortfolioItems.filter(i => i.category === category);
    $('portfolio-grid').innerHTML = buildPortfolioGrid(items);
    initObserver();
  }

  function renderPortfolio(portfolio) {
    allPortfolioItems = portfolio.items;

    $('portfolio').innerHTML = `
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12 observe-fade">
          <h2 class="text-3xl sm:text-4xl font-black mb-3" style="color:var(--text-primary)">${portfolio.sectionTitle}</h2>
          <p class="max-w-xl mx-auto" style="color:var(--text-secondary)">${portfolio.sectionSubtitle}</p>
          <div class="mt-4 mx-auto w-16 h-1 rounded-full" style="background:linear-gradient(to right,#7c3aed,#ec4899)"></div>
        </div>

        <div class="flex flex-wrap justify-center gap-2 mb-10 observe-fade">
          ${portfolio.categories.map((cat, i) => `
            <button class="cat-btn ${i === 0 ? 'active' : ''} px-4 py-2 rounded-full text-sm font-medium"
              data-cat="${cat}">${cat}</button>
          `).join('')}
        </div>

        <div id="portfolio-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${buildPortfolioGrid(allPortfolioItems)}
        </div>
      </div>
    `;

    $('portfolio').querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $('portfolio').querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterPortfolio(btn.dataset.cat);
      });
    });
  }

  // ── Services ──────────────────────────────────────────
  function renderServices(services) {
    const cardsHtml = services.items.map(item => {
      const isHL = item.highlighted;
      return `
        <div class="observe-fade rounded-2xl p-6 flex flex-col gap-4 relative
          ${isHL ? 'service-highlight' : 'card-hover border'}">

          ${isHL ? `<div class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span class="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow">最受歡迎</span>
          </div>` : ''}

          <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style="${isHL ? 'background:rgba(255,255,255,0.2); color:white' : 'background:rgba(124,58,237,0.12); color:#7c3aed'}">
            ${icons[item.icon] || ''}
          </div>

          <div>
            <h3 class="text-lg font-bold mb-2" style="${isHL ? 'color:white' : 'color:var(--text-primary)'}">${item.title}</h3>
            <p class="text-sm leading-relaxed" style="${isHL ? 'color:rgba(255,255,255,0.8)' : 'color:var(--text-secondary)'}">${item.description}</p>
          </div>

          <ul class="flex flex-col gap-2 flex-1">
            ${item.features.map(f => `
              <li class="flex items-center gap-2 text-sm service-feature-check"
                style="${isHL ? 'color:rgba(255,255,255,0.9)' : 'color:var(--text-secondary)'}">
                <span style="${isHL ? 'color:white' : 'color:#7c3aed'}">${icons.check}</span>
                ${f}
              </li>
            `).join('')}
          </ul>

          <div class="pt-4 border-t service-price" style="${isHL ? 'border-color:rgba(255,255,255,0.2)' : 'border-color:var(--border-card)'}">
            <p class="font-bold text-base" style="${isHL ? 'color:white' : 'color:#7c3aed'}">${item.price}</p>
          </div>
        </div>
      `;
    }).join('');

    $('services').innerHTML = `
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-14 observe-fade">
          <h2 class="text-3xl sm:text-4xl font-black mb-3" style="color:var(--text-primary)">${services.sectionTitle}</h2>
          <p class="max-w-xl mx-auto" style="color:var(--text-secondary)">${services.sectionSubtitle}</p>
          <div class="mt-4 mx-auto w-16 h-1 rounded-full" style="background:linear-gradient(to right,#7c3aed,#ec4899)"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          ${cardsHtml}
        </div>
      </div>
    `;
  }

  // ── Contact ───────────────────────────────────────────
  function renderContact(contact) {
    const infoItems = [
      { icon: 'email',    label: '電子郵件', value: contact.email,    href: `mailto:${contact.email}` },
      { icon: 'phone',    label: '電話',     value: contact.phone,    href: `tel:${contact.phone}` },
      { icon: 'line',     label: 'LINE ID',  value: contact.lineId,   href: null },
      { icon: 'location', label: '所在地',   value: contact.location, href: null },
    ];

    const infoHtml = infoItems.map(item => `
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style="background:rgba(124,58,237,0.12); color:#7c3aed">
          ${icons[item.icon] || ''}
        </div>
        <div>
          <p class="text-xs mb-0.5" style="color:var(--text-muted)">${item.label}</p>
          ${item.href
            ? `<a href="${item.href}" class="font-medium transition-colors" style="color:var(--text-primary)"
                onmouseover="this.style.color='#7c3aed'" onmouseout="this.style.color='var(--text-primary)'">${item.value}</a>`
            : `<p class="font-medium" style="color:var(--text-primary)">${item.value}</p>`
          }
        </div>
      </div>
    `).join('');

    const fieldsHtml = contact.formFields.map(field => {
      const baseClass = 'form-input w-full border rounded-xl px-4 py-3 text-sm';
      const req = field.required ? 'required' : '';

      if (field.type === 'textarea') {
        return `
          <div>
            <label class="block text-sm font-medium mb-1.5" style="color:var(--text-label)">
              ${field.label} ${field.required ? '<span style="color:#ec4899">*</span>' : ''}
            </label>
            <textarea name="${field.name}" ${req} rows="4" placeholder="${field.placeholder}"
              class="${baseClass} resize-none"></textarea>
          </div>`;
      }
      if (field.type === 'select') {
        return `
          <div>
            <label class="block text-sm font-medium mb-1.5" style="color:var(--text-label)">
              ${field.label} ${field.required ? '<span style="color:#ec4899">*</span>' : ''}
            </label>
            <select name="${field.name}" ${req} class="${baseClass} cursor-pointer">
              <option value="">${field.placeholder}</option>
              ${field.options.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
          </div>`;
      }
      return `
        <div>
          <label class="block text-sm font-medium mb-1.5" style="color:var(--text-label)">
            ${field.label} ${field.required ? '<span style="color:#ec4899">*</span>' : ''}
          </label>
          <input type="${field.type}" name="${field.name}" ${req} placeholder="${field.placeholder}"
            class="${baseClass}">
        </div>`;
    }).join('');

    $('contact').innerHTML = `
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-14 observe-fade">
          <h2 class="text-3xl sm:text-4xl font-black mb-3" style="color:var(--text-primary)">${contact.sectionTitle}</h2>
          <p class="max-w-xl mx-auto" style="color:var(--text-secondary)">${contact.sectionSubtitle}</p>
          <div class="mt-4 mx-auto w-16 h-1 rounded-full" style="background:linear-gradient(to right,#7c3aed,#ec4899)"></div>
        </div>

        <div class="grid md:grid-cols-5 gap-10">
          <div class="md:col-span-2 observe-fade">
            <div class="rounded-2xl p-6 h-full" style="background:var(--bg-contact-info)">
              <h3 class="font-bold text-lg mb-6" style="color:var(--text-primary)">聯絡方式</h3>
              <div class="flex flex-col gap-5">${infoHtml}</div>
              <div class="mt-8 pt-6" style="border-top:1px solid var(--border-contact)">
                <p class="text-xs" style="color:var(--text-muted)">⏱ ${contact.responseTime}</p>
              </div>
            </div>
          </div>

          <div class="md:col-span-3 observe-fade">
            <form id="contact-form" class="rounded-2xl border p-6 sm:p-8 flex flex-col gap-5"
              style="background:var(--bg-card); border-color:var(--border-card); box-shadow:var(--shadow-card)"
              action="${contact.formspreeEndpoint}" method="POST">
              ${fieldsHtml}
              <button type="submit" id="form-submit-btn"
                class="btn-primary text-white font-bold py-3.5 rounded-xl shadow-lg text-sm mt-2 flex items-center justify-center gap-2">
                <span id="form-btn-text">送出訊息</span>
                <svg id="form-spinner" class="w-4 h-4 animate-spin hidden" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </button>
              <div id="form-success" class="hidden rounded-xl px-4 py-3 text-sm text-center"
                style="background:#f0fdf4; border:1px solid #bbf7d0; color:#15803d">
                ✅ 感謝您的訊息！我會盡快與您聯繫。
              </div>
              <div id="form-error" class="hidden rounded-xl px-4 py-3 text-sm text-center"
                style="background:#fef2f2; border:1px solid #fecaca; color:#dc2626">
                ❌ 送出失敗，請直接寄信至 <a href="mailto:${contact.email}" class="underline">${contact.email}</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    $('contact-form').addEventListener('submit', (e) => handleFormSubmit(e, contact.formspreeEndpoint));
  }

  async function handleFormSubmit(e, endpoint) {
    e.preventDefault();
    const form = e.target;
    const btn = $('form-submit-btn');
    const success = $('form-success');
    const error = $('form-error');

    btn.disabled = true;
    $('form-spinner').classList.remove('hidden');
    $('form-btn-text').textContent = '送出中...';
    success.classList.add('hidden');
    error.classList.add('hidden');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        form.reset();
        success.classList.remove('hidden');
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else throw new Error();
    } catch {
      error.classList.remove('hidden');
    } finally {
      btn.disabled = false;
      $('form-spinner').classList.add('hidden');
      $('form-btn-text').textContent = '送出訊息';
    }
  }

  // ── Footer ────────────────────────────────────────────
  function renderFooter(footer) {
    $('footer').style.background = 'var(--bg-footer)';
    $('footer').style.color = 'var(--text-footer)';
    $('footer').innerHTML = `
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-3">
          <p class="text-sm" style="color:rgba(255,255,255,0.4)">${footer.copyright}</p>
          <p class="gradient-text font-semibold text-sm">${footer.tagline}</p>
        </div>
      </div>
    `;
  }

  // ── Intersection Observer ─────────────────────────────
  function initObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.observe-fade:not(.visible)').forEach(el => observer.observe(el));
  }

  // ── Navbar scroll ─────────────────────────────────────
  function initNavbarScroll() {
    const nav = $('navbar');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('navbar-glass', window.scrollY > 40);
    }, { passive: true });
  }

  // ── Mobile menu ───────────────────────────────────────
  function initMobileMenu() {
    const btn  = $('hamburger');
    const menu = $('mobile-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => menu.classList.toggle('hidden'));
    menu.querySelectorAll('.mobile-nav-link').forEach(l => {
      l.addEventListener('click', () => menu.classList.add('hidden'));
    });
  }

  // ── Back to top ───────────────────────────────────────
  function initBackToTop() {
    const btn = $('back-to-top');
    window.addEventListener('scroll', () => {
      btn.classList.toggle('opacity-0', window.scrollY <= 400);
      btn.classList.toggle('pointer-events-none', window.scrollY <= 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── Smooth scroll ─────────────────────────────────────
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
      }
    });
  }

  // ── Main ──────────────────────────────────────────────
  function renderAll(d) {
    updateMeta(d.meta);
    renderNav(d.nav);
    renderHero(d.hero);
    renderPortfolio(d.portfolio);
    renderServices(d.services);
    renderContact(d.contact);
    renderFooter(d.footer);

    initThemeToggle();
    initNavbarScroll();
    initMobileMenu();
    initBackToTop();
    initSmoothScroll();
    initObserver();
  }

  renderAll(data);

  const loadingEl = $('loading');
  loadingEl.style.opacity = '0';
  setTimeout(() => loadingEl.remove(), 400);
})();
