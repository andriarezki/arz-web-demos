/* ARZ web app core: theme (light/dark/system), language (ID/EN), login template, app shell. No backend: demo data lives in the browser. */
(function () {
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const P = {
    store: '<path d="m2 7 1.5-4h17L22 7"/><path d="M4 7v13h16V7"/><path d="M2 7a3.5 3.5 0 0 0 7 0 3.5 3.5 0 0 0 7 0 3.5 3.5 0 0 0 6 0"/>',
    coffee: '<path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v3M10 2v3M14 2v3"/>',
    receipt: '<path d="M4 2v20l3-2 2 2 3-2 3 2 2-2 3 2V2l-3 2-2-2-3 2-3-2-2 2Z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15v3M12 9v9M17 5v13"/>',
    wifioff: '<path d="M12 20h.01"/><path d="M8.5 16.4a5 5 0 0 1 7 0"/><path d="M5 12.9a10 10 0 0 1 5-2.7"/><path d="M2 8.8a15 15 0 0 1 4.2-2.7"/><path d="m2 2 20 20"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.7a1 1 0 0 0-.2-.6l-3.3-4.4a1 1 0 0 0-.8-.4H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    map: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    clip: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.7 8.9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1Z"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.8-1.6l9.9-10.2a.5.5 0 0 1 .9.4l-1.9 6a1 1 0 0 0 .9 1.4H20a1 1 0 0 1 .8 1.6l-9.9 10.2a.5.5 0 0 1-.9-.4l1.9-6A1 1 0 0 0 11 14Z"/>',
    phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
    plus: '<path d="M5 12h14M12 5v14"/>', minus: '<path d="M5 12h14"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>', play: '<path d="m6 3 14 9-14 9Z"/>', globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
  };
  const ic = (n) => '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || '') + '</svg>';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const C = {
    id: { welcome: 'Selamat datang', welcomeSub: 'Masuk dengan akun yang diberikan admin aplikasi.', user: 'Nama Pengguna atau Email', pass: 'Kata Sandi', login: 'Masuk', forgot: 'Lupa kata sandi?', forgotTxt: 'Minta admin aplikasi untuk mereset kata sandi Anda.', demo: 'Aplikasi demo, data fiktif. Masuk dengan', bad: 'Nama pengguna atau kata sandi salah.', by: 'Dikembangkan oleh', logout: 'Keluar', reset: 'Reset data demo', demoNote: 'Mode demo: data fiktif, tersimpan di browser ini saja.', ver: 'v', theme: 'Tema' },
    en: { welcome: 'Welcome', welcomeSub: 'Sign in with the account given by the app admin.', user: 'Username or Email', pass: 'Password', login: 'Sign in', forgot: 'Forgot password?', forgotTxt: 'Ask the app admin to reset your password.', demo: 'Demo app, made-up data. Sign in with', bad: 'Wrong username or password.', by: 'Developed by', logout: 'Sign out', reset: 'Reset demo data', demoNote: 'Demo mode: made-up data, stored only in this browser.', ver: 'v', theme: 'Theme' },
  };

  // theme
  const sysDark = () => window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  const applyTheme = () => {
    const m = store.get('theme', 'system');
    if (m === 'system') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', m);
  };
  const isDark = () => { const m = store.get('theme', 'system'); return m === 'dark' || (m === 'system' && sysDark()); };
  applyTheme();

  function boot(cfg) {
    const root = document.getElementById('root');
    let lang = store.get('lang', 'id'); if (!C[lang]) lang = 'id';
    const authKey = 'arz_' + cfg.id + '_auth';
    let authed = false; try { authed = sessionStorage.getItem(authKey) === '1'; } catch (e) {}
    const state = { tab: cfg.tabs[0].id, err: false };
    const t = (k) => (cfg.T[lang] && cfg.T[lang][k] != null ? cfg.T[lang][k] : C[lang][k] != null ? C[lang][k] : k);
    const loc = lang === 'id' ? 'id-ID' : 'en-GB';
    const ctx = {
      t, ic, esc, store, state,
      get lang() { return lang; },
      money: (n) => new Intl.NumberFormat(loc, { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n),
      num: (n) => new Intl.NumberFormat(loc).format(n),
      date: (d) => new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d)),
      time: (d) => new Intl.DateTimeFormat(loc, { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(d)),
      toast(msg) { const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; document.body.appendChild(el); setTimeout(() => el.remove(), 2200); },
      rerender: () => draw(),
    };
    const tools = (cls) => `<span class="${cls}"><button class="tool" data-act="lang" title="Language">${ic('globe')}<span>${lang === 'id' ? '<b>ID</b> | EN' : 'ID | <b>EN</b>'}</span></button><button class="tool" data-act="theme" aria-label="${t('theme')}">${ic(isDark() ? 'sun' : 'moon')}</button></span>`;

    function loginHtml() {
      const L = cfg.login;
      const feats = L.feats.map((f) => `<li><span class="auth-tile-ic">${ic(f.ic)}</span><div><b>${esc(f[lang].t)}</b><small>${esc(f[lang].d)}</small></div></li>`).join('');
      return `<main class="auth">
  <section class="auth-side">
    <span class="auth-float a" aria-hidden="true"></span><span class="auth-float b" aria-hidden="true"></span><span class="auth-mark" aria-hidden="true">ARZ</span>
    <div class="auth-inner">
      <div class="auth-org"><span class="auth-tile-ic">${ic(L.icon)}</span>${esc(L.org)}</div>
      <h1>${esc(cfg.name)}<span>${esc(L.hi[lang])}</span></h1>
      <p class="auth-lead">${esc(L.lead[lang])}</p>
      <ul class="auth-feats">${feats}</ul>
      <div class="auth-credit"><span class="arz">ARZ</span><div>${t('by')} <b>ARZ</b><small>${esc(L.org)} · ${t('ver')}${cfg.version}</small></div></div>
    </div>
  </section>
  <section class="auth-main">
    ${tools('auth-tools')}
    <div class="auth-card">
      <div><h2>${t('welcome')}</h2><p class="sub">${t('welcomeSub')}</p></div>
      <div class="auth-demo">${t('demo')} <b>demo</b> / <b>demo123</b></div>
      <form class="stack" data-form="login">
        <div class="field"><label for="u">${t('user')}</label><input class="input" id="u" name="u" autocomplete="username" value="demo" required></div>
        <div class="field"><label for="p">${t('pass')}</label><input class="input" id="p" name="p" type="password" autocomplete="current-password" value="demo123" required></div>
        ${state.err ? `<p class="auth-err">${t('bad')}</p>` : ''}
        <button class="btn primary" type="submit">${t('login')}</button>
      </form>
      <details class="auth-forgot"><summary>${t('forgot')}</summary><p>${t('forgotTxt')}</p></details>
    </div>
    <p class="auth-foot"><span class="arz sm">ARZ</span>© ${new Date().getFullYear()} ${esc(cfg.name)} · ARZ</p>
  </section>
</main>`;
    }
    function shellHtml() {
      const tabs = cfg.tabs.map((x) => `<button data-act="tab" data-tab="${x.id}" class="${state.tab === x.id ? 'on' : ''}">${ic(x.ic)} ${esc(t('tab_' + x.id))}</button>`).join('');
      return `<header class="top"><div class="brand"><span class="arz">ARZ</span><span class="hide-sm">${esc(cfg.name)}</span></div><nav class="tabs">${tabs}</nav><span class="spacer"></span>
${tools('row')}<button class="pill" data-act="logout">${ic('out')}<span class="hide-sm">${t('logout')}</span></button></header>
<div class="wrap">${cfg.view(ctx, state.tab)}<p class="note">${t('demoNote')} · ${esc(cfg.name)} ${t('ver')}${cfg.version} · ARZ</p></div>`;
    }
    function draw() {
      document.documentElement.lang = lang;
      document.title = cfg.name + (authed ? '' : ' · ' + t('login'));
      const keep = document.activeElement && document.activeElement.id;
      root.innerHTML = authed ? shellHtml() : loginHtml();
      if (keep) { const e = document.getElementById(keep); if (e && e.focus) e.focus(); }
    }
    root.addEventListener('click', (e) => {
      const el = e.target.closest('[data-act]'); if (!el) return;
      const a = el.dataset.act;
      if (a === 'lang') { lang = lang === 'id' ? 'en' : 'id'; store.set('lang', lang); draw(); }
      else if (a === 'theme') { store.set('theme', isDark() ? 'light' : 'dark'); applyTheme(); draw(); }
      else if (a === 'tab') { state.tab = el.dataset.tab; draw(); }
      else if (a === 'logout') { authed = false; try { sessionStorage.removeItem(authKey); } catch (x) {} draw(); }
      else cfg.onAct && cfg.onAct(ctx, a, el);
    });
    root.addEventListener('submit', (e) => {
      e.preventDefault(); const f = e.target; const name = f.dataset.form;
      if (name === 'login') {
        const d = new FormData(f);
        if (String(d.get('u')).trim().toLowerCase() === 'demo' && d.get('p') === 'demo123') { authed = true; state.err = false; try { sessionStorage.setItem(authKey, '1'); } catch (x) {} }
        else state.err = true;
        draw();
      } else cfg.onForm && cfg.onForm(ctx, name, f);
    });
    root.addEventListener('change', (e) => { cfg.onChange && cfg.onChange(ctx, e.target); });
    draw();
  }
  window.ARZ = { boot, store };
})();
