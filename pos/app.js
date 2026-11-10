/* Warkop POS demo: kasir, laporan, menu. Semua data fiktif, disimpan di localStorage. */
(function () {
  const KEY = 'pos_demo_v1';
  const MENU = [
    ['m1', 'Kopi Hitam', 'Black Coffee', 5000, 'coffee'], ['m2', 'Kopi Susu', 'Milk Coffee', 8000, 'coffee'], ['m3', 'Es Teh', 'Iced Tea', 4000, 'drink'],
    ['m4', 'Teh Tarik', 'Pulled Tea', 9000, 'drink'], ['m5', 'Air Mineral', 'Mineral Water', 3000, 'drink'], ['m6', 'Mi Goreng', 'Fried Noodles', 10000, 'food'],
    ['m7', 'Mi Rebus Telur', 'Noodle Soup + Egg', 12000, 'food'], ['m8', 'Nasi Goreng', 'Fried Rice', 15000, 'food'], ['m9', 'Roti Bakar', 'Toasted Bread', 10000, 'food'],
    ['m10', 'Pisang Goreng', 'Fried Banana', 7000, 'snack'], ['m11', 'Mendoan', 'Tempeh Fritters', 6000, 'snack'], ['m12', 'Tahu Isi', 'Stuffed Tofu', 6000, 'snack'],
  ].map(([id, id_, en, price, cat]) => ({ id, n: { id: id_, en }, price, cat, on: true }));
  const seed = () => {
    const sales = []; let s = 7; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const now = Date.now();
    for (let i = 0; i < 16; i++) {
      const lines = []; const k = 1 + Math.floor(rnd() * 3);
      for (let j = 0; j < k; j++) { const m = MENU[Math.floor(rnd() * MENU.length)]; if (!lines.find((l) => l.id === m.id)) lines.push({ id: m.id, q: 1 + Math.floor(rnd() * 2), p: m.price }); }
      sales.push({ no: 1000 + i, at: now - Math.floor((16 - i) * 17 * 60000 + rnd() * 600000), lines, pay: rnd() > 0.35 ? 'cash' : 'qris' });
    }
    return { menu: MENU, sales, next: 1016 };
  };
  let D = ARZ.store.get(KEY, null) || seed();
  let cart = {}; let pay = 'cash'; let cat = 'all';
  const save = () => ARZ.store.set(KEY, D);
  const item = (id) => D.menu.find((m) => m.id === id);
  const total = (lines) => lines.reduce((a, l) => a + l.q * l.p, 0);
  const cartLines = () => Object.entries(cart).filter(([, q]) => q > 0).map(([id, q]) => ({ id, q, p: item(id).price }));
  const CATS = ['all', 'coffee', 'drink', 'food', 'snack'];

  const T = {
    id: { tab_kasir: 'Kasir', tab_laporan: 'Laporan', tab_menu: 'Menu', all: 'Semua', coffee: 'Kopi', drink: 'Minuman', food: 'Makanan', snack: 'Camilan', cart: 'Pesanan', empty: 'Belum ada pesanan. Ketuk menu untuk menambah.', total: 'Total', cash: 'Tunai', qris: 'QRIS', pay: 'Bayar', paid: 'Pembayaran berhasil, nota #', clear: 'Kosongkan',
      rev: 'Omzet hari ini', trx: 'Transaksi', avg: 'Rata-rata per nota', top: 'Menu terlaris', recent: 'Transaksi terakhir', time: 'Jam', items: 'Item', method: 'Metode', price: 'Harga', avail: 'Tersedia', menuHint: 'Ubah harga atau sembunyikan menu yang habis.', pcs: 'pcs' },
    en: { tab_kasir: 'Register', tab_laporan: 'Reports', tab_menu: 'Menu', all: 'All', coffee: 'Coffee', drink: 'Drinks', food: 'Food', snack: 'Snacks', cart: 'Order', empty: 'No items yet. Tap a menu item to add.', total: 'Total', cash: 'Cash', qris: 'QRIS', pay: 'Pay', paid: 'Payment done, receipt #', clear: 'Clear',
      rev: 'Revenue today', trx: 'Transactions', avg: 'Average per receipt', top: 'Best sellers', recent: 'Latest transactions', time: 'Time', items: 'Items', method: 'Method', price: 'Price', avail: 'Available', menuHint: 'Change prices or hide items that sold out.', pcs: 'pcs' },
  };

  const view = (c, tab) => {
    const { t, ic, esc, money } = c; const L = c.lang;
    if (tab === 'kasir') {
      const tabs = CATS.map((k) => `<button class="pill ${cat === k ? 'on' : ''}" data-act="cat" data-cat="${k}">${t(k)}</button>`).join('');
      const items = D.menu.filter((m) => m.on && (cat === 'all' || m.cat === cat)).map((m) => `<button class="card" style="text-align:left;cursor:pointer" data-act="add" data-id="${m.id}"><b>${esc(m.n[L])}</b><div class="muted">${money(m.price)}</div>${cart[m.id] ? `<span class="chip brand">×${cart[m.id]}</span>` : ''}</button>`).join('');
      const lines = cartLines();
      const rows = lines.map((l) => `<div class="row" style="justify-content:space-between;margin:8px 0"><span>${esc(item(l.id).n[L])}<br><small class="muted">${money(l.p)}</small></span><span class="row"><button class="btn sm" data-act="dec" data-id="${l.id}" aria-label="-">${ic('minus')}</button><b>${l.q}</b><button class="btn sm" data-act="add" data-id="${l.id}" aria-label="+">${ic('plus')}</button></span></div>`).join('');
      return `<div class="grid" style="grid-template-columns:minmax(0,2fr) minmax(280px,1fr);align-items:start">
<section><div class="row" style="margin-bottom:12px">${tabs}</div><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">${items}</div></section>
<aside class="card" style="position:sticky;top:76px"><h3>${ic('receipt')} ${t('cart')}</h3>${rows || `<p class="muted">${t('empty')}</p>`}
<hr style="border:0;border-top:1px solid var(--line);margin:12px 0"><div class="row" style="justify-content:space-between;font-size:20px"><span>${t('total')}</span><b>${money(total(lines))}</b></div>
<div class="row" style="margin:12px 0"><button class="pill ${pay === 'cash' ? 'on' : ''}" data-act="pay" data-m="cash">${t('cash')}</button><button class="pill ${pay === 'qris' ? 'on' : ''}" data-act="pay" data-m="qris">${t('qris')}</button></div>
<div class="row"><button class="btn primary" style="flex:1" data-act="checkout" ${lines.length ? '' : 'disabled'}>${ic('check')} ${t('pay')}</button><button class="btn" data-act="clear" ${lines.length ? '' : 'disabled'}>${ic('trash')}</button></div></aside></div>`;
    }
    if (tab === 'laporan') {
      const day = new Date(); day.setHours(0, 0, 0, 0);
      const today = D.sales.filter((s) => s.at >= day.getTime());
      const rev = today.reduce((a, s) => a + total(s.lines), 0);
      const qty = {}; today.forEach((s) => s.lines.forEach((l) => { qty[l.id] = (qty[l.id] || 0) + l.q; }));
      const topList = Object.entries(qty).sort((a, b) => b[1] - a[1]).slice(0, 6); const mx = topList.length ? topList[0][1] : 1;
      const bars = topList.map(([id, q]) => `<div style="margin:10px 0"><div class="row" style="justify-content:space-between"><span>${esc(item(id).n[L])}</span><b>${q} ${t('pcs')}</b></div><div class="bar"><i style="width:${(q / mx) * 100}%"></i></div></div>`).join('');
      const recent = today.slice().sort((a, b) => b.at - a.at).slice(0, 10).map((s) => `<tr><td>#${s.no}</td><td>${c.time(s.at)}</td><td>${s.lines.map((l) => esc(item(l.id).n[L]) + ' ×' + l.q).join(', ')}</td><td><span class="chip">${t(s.pay)}</span></td><td class="right"><b>${money(total(s.lines))}</b></td></tr>`).join('');
      return `<div class="grid g4"><div class="card stat"><small>${t('rev')}</small><b>${money(rev)}</b></div><div class="card stat"><small>${t('trx')}</small><b>${today.length}</b></div><div class="card stat"><small>${t('avg')}</small><b>${money(today.length ? Math.round(rev / today.length) : 0)}</b></div></div>
<div class="grid g3" style="margin-top:14px"><div class="card"><h3>${ic('chart')} ${t('top')}</h3>${bars || `<p class="muted">–</p>`}</div>
<div class="card" style="grid-column:span 2"><h3>${t('recent')}</h3><div class="tablewrap"><table><tr><th>No</th><th>${t('time')}</th><th>${t('items')}</th><th>${t('method')}</th><th class="right">${t('total')}</th></tr>${recent}</table></div></div></div>
<p style="margin-top:14px"><button class="btn" data-act="reset">${t('reset')}</button></p>`;
    }
    const rows = D.menu.map((m) => `<tr><td>${esc(m.n[L])}</td><td><input class="input" type="number" min="0" step="500" value="${m.price}" data-price="${m.id}" style="width:120px"></td><td><label class="row"><input type="checkbox" data-on="${m.id}" ${m.on ? 'checked' : ''}> ${t('avail')}</label></td></tr>`).join('');
    return `<div class="card"><h3>${t('tab_menu')}</h3><p class="muted">${t('menuHint')}</p><div class="tablewrap"><table><tr><th>Menu</th><th>${t('price')}</th><th></th></tr>${rows}</table></div></div>`;
  };

  ARZ.boot({
    id: 'pos', name: 'Warkop POS', version: '1.0.0', T, view,
    tabs: [{ id: 'kasir', ic: 'coffee' }, { id: 'laporan', ic: 'chart' }, { id: 'menu', ic: 'store' }],
    login: {
      org: 'Andria Rezki', icon: 'store',
      hi: { id: 'Kasir untuk warkop & UMKM', en: 'A register for cafés & small shops' },
      lead: { id: 'Catat penjualan dari HP atau tablet, lihat omzet hari ini, dan tahu menu mana yang paling laku. Tanpa alat khusus.', en: 'Record sales from a phone or tablet, see today’s revenue and which items sell best. No special hardware.' },
      feats: [
        { ic: 'coffee', id: 0, en: 0 }, { ic: 'receipt', id: 0, en: 0 }, { ic: 'chart', id: 0, en: 0 }, { ic: 'wifioff', id: 0, en: 0 },
      ].map((f, i) => ({ ic: f.ic, id: [
        { t: 'Kasir sekali ketuk', d: 'Pilih menu, bayar tunai atau QRIS' }, { t: 'Nota otomatis', d: 'Nomor nota dan riwayat tersimpan' },
        { t: 'Laporan harian', d: 'Omzet, jumlah nota, menu terlaris' }, { t: 'Tetap jalan saat sinyal lemah', d: 'Data tersimpan di perangkat' }][i],
        en: [{ t: 'One-tap register', d: 'Pick items, pay cash or QRIS' }, { t: 'Automatic receipts', d: 'Receipt numbers and history kept' },
        { t: 'Daily report', d: 'Revenue, receipt count, best sellers' }, { t: 'Works with weak signal', d: 'Data stays on the device' }][i] })),
    },
    onAct(c, a, el) {
      const id = el.dataset.id;
      if (a === 'cat') cat = el.dataset.cat;
      else if (a === 'add') cart[id] = (cart[id] || 0) + 1;
      else if (a === 'dec') cart[id] = Math.max(0, (cart[id] || 0) - 1);
      else if (a === 'pay') pay = el.dataset.m;
      else if (a === 'clear') cart = {};
      else if (a === 'checkout') { const lines = cartLines(); if (!lines.length) return; const no = D.next++; D.sales.push({ no, at: Date.now(), lines, pay }); save(); cart = {}; c.toast(c.t('paid') + no); }
      else if (a === 'reset') { D = seed(); save(); cart = {}; }
      c.rerender();
    },
    onChange(c, el) {
      if (el.dataset.price) { const m = item(el.dataset.price); m.price = Math.max(0, Number(el.value) || 0); save(); }
      else if (el.dataset.on) { item(el.dataset.on).on = el.checked; save(); }
    },
  });
})();
