/* Fleet Ops demo: dasbor, perjalanan, kendaraan, driver. Semua data fiktif, disimpan di localStorage. */
(function () {
  const KEY = 'fleet_demo_v1';
  const seed = () => ({
    vehicles: [
      { id: 'v1', plate: 'XX 1001 AA', model: 'Minibus 12 seat', km: 48210, svc: 'ok' }, { id: 'v2', plate: 'XX 1002 AA', model: 'SUV 7 seat', km: 61800, svc: 'soon' },
      { id: 'v3', plate: 'XX 1003 AA', model: 'Sedan', km: 33450, svc: 'ok' }, { id: 'v4', plate: 'XX 1004 AA', model: 'Pickup', km: 90320, svc: 'due' },
      { id: 'v5', plate: 'XX 1005 AA', model: 'Minibus 12 seat', km: 27100, svc: 'ok' }, { id: 'v6', plate: 'XX 1006 AA', model: 'SUV 7 seat', km: 55900, svc: 'ok' },
    ],
    drivers: [
      { id: 'd1', name: 'Budi Santoso', phone: '0812-0000-0001' }, { id: 'd2', name: 'Rina Marlina', phone: '0812-0000-0002' }, { id: 'd3', name: 'Joko Prasetyo', phone: '0812-0000-0003' },
      { id: 'd4', name: 'Dewi Lestari', phone: '0812-0000-0004' }, { id: 'd5', name: 'Agus Salim', phone: '0812-0000-0005' },
    ],
    trips: [
      { id: 't1', dest: 'Bandara', who: 'Tim Sales', v: 'v1', d: 'd1', st: 'run', time: '08:00' }, { id: 't2', dest: 'Kantor Cabang', who: 'Tim Finance', v: 'v3', d: 'd2', st: 'plan', time: '10:00' },
      { id: 't3', dest: 'Gudang Pusat', who: 'Logistik', v: 'v4', d: 'd3', st: 'plan', time: '11:30' }, { id: 't4', dest: 'Stasiun', who: 'Tamu', v: 'v5', d: 'd4', st: 'done', time: '07:00' },
      { id: 't5', dest: 'Hotel Mawar', who: 'Direksi', v: 'v6', d: 'd5', st: 'done', time: '06:30' },
    ],
    n: 6,
  });
  let D = ARZ.store.get(KEY, null) || seed();
  const save = () => ARZ.store.set(KEY, D);
  const veh = (id) => D.vehicles.find((x) => x.id === id); const drv = (id) => D.drivers.find((x) => x.id === id);
  const busy = (kind, id) => D.trips.some((x) => x.st !== 'done' && x[kind] === id);

  const T = {
    id: { tab_dash: 'Dasbor', tab_trips: 'Perjalanan', tab_vehicles: 'Kendaraan', tab_drivers: 'Driver', plan: 'Terjadwal', run: 'Berjalan', done: 'Selesai', tripsToday: 'Perjalanan hari ini', vfree: 'Kendaraan tersedia', dfree: 'Driver tersedia', svcAlert: 'Perlu servis',
      start: 'Mulai', finish: 'Selesai', dest: 'Tujuan', who: 'Pemesan', vehicle: 'Kendaraan', driver: 'Driver', time: 'Jam', status: 'Status', add: 'Tambah perjalanan', addHint: 'Hanya kendaraan dan driver yang sedang bebas yang bisa dipilih.', none: 'Tidak ada yang bebas', added: 'Perjalanan ditambahkan',
      ok: 'Baik', soon: 'Servis segera', due: 'Servis jatuh tempo', avail: 'Tersedia', inuse: 'Dipakai', free: 'Bebas', onTrip: 'Bertugas', empty: 'Kosong' },
    en: { tab_dash: 'Dashboard', tab_trips: 'Trips', tab_vehicles: 'Vehicles', tab_drivers: 'Drivers', plan: 'Scheduled', run: 'In progress', done: 'Completed', tripsToday: 'Trips today', vfree: 'Vehicles available', dfree: 'Drivers available', svcAlert: 'Need service',
      start: 'Start', finish: 'Finish', dest: 'Destination', who: 'Requested by', vehicle: 'Vehicle', driver: 'Driver', time: 'Time', status: 'Status', add: 'Add trip', addHint: 'Only vehicles and drivers that are free can be picked.', none: 'None free', added: 'Trip added',
      ok: 'Good', soon: 'Service soon', due: 'Service due', avail: 'Available', inuse: 'In use', free: 'Free', onTrip: 'On duty', empty: 'Empty' },
  };
  const chipSt = (s) => (s === 'done' ? 'ok' : s === 'run' ? 'brand' : '');
  const next = (s) => (s === 'plan' ? 'run' : 'done');

  const tripCard = (c, x) => `<div class="card" style="padding:12px;margin-bottom:10px"><b>${c.esc(x.dest)}</b> <span class="chip ${chipSt(x.st)}">${c.t(x.st)}</span>
<div class="muted">${c.ic('clip')} ${c.esc(x.who)} · ${x.time}<br>${c.ic('truck')} ${veh(x.v).plate} · ${c.ic('users')} ${c.esc(drv(x.d).name)}</div>
${x.st !== 'done' ? `<p style="margin:8px 0 0"><button class="btn sm primary" data-act="adv" data-id="${x.id}">${c.ic(x.st === 'plan' ? 'play' : 'check')} ${c.t(x.st === 'plan' ? 'start' : 'finish')}</button></p>` : ''}</div>`;

  const view = (c, tab) => {
    const { t, ic, esc } = c;
    if (tab === 'dash') {
      const vf = D.vehicles.filter((v) => !busy('v', v.id)).length, df = D.drivers.filter((d) => !busy('d', d.id)).length, sv = D.vehicles.filter((v) => v.svc !== 'ok').length;
      const col = (st) => `<div><h3>${t(st)} <span class="chip">${D.trips.filter((x) => x.st === st).length}</span></h3>${D.trips.filter((x) => x.st === st).map((x) => tripCard(c, x)).join('') || `<p class="muted">${t('empty')}</p>`}</div>`;
      return `<div class="grid g4"><div class="card stat"><small>${t('tripsToday')}</small><b>${D.trips.length}</b></div><div class="card stat"><small>${t('vfree')}</small><b>${vf}/${D.vehicles.length}</b></div><div class="card stat"><small>${t('dfree')}</small><b>${df}/${D.drivers.length}</b></div><div class="card stat"><small>${t('svcAlert')}</small><b>${sv}</b></div></div>
<div class="grid g3" style="margin-top:14px">${col('plan')}${col('run')}${col('done')}</div>`;
    }
    if (tab === 'trips') {
      const fv = D.vehicles.filter((v) => !busy('v', v.id)), fd = D.drivers.filter((d) => !busy('d', d.id));
      const form = `<form class="card row" data-form="trip"><b>${ic('plus')} ${t('add')}</b><input class="input" name="dest" placeholder="${t('dest')}" required><input class="input" name="who" placeholder="${t('who')}" required><input class="input" name="time" type="time" value="13:00" required>
<select name="v" required>${fv.map((v) => `<option value="${v.id}">${v.plate} · ${esc(v.model)}</option>`).join('') || `<option value="">${t('none')}</option>`}</select>
<select name="d" required>${fd.map((d) => `<option value="${d.id}">${esc(d.name)}</option>`).join('') || `<option value="">${t('none')}</option>`}</select>
<button class="btn primary" type="submit" ${fv.length && fd.length ? '' : 'disabled'}>${t('add')}</button><small class="muted" style="flex-basis:100%">${t('addHint')}</small></form>`;
      const rows = D.trips.map((x) => `<tr><td>${x.time}</td><td><b>${esc(x.dest)}</b><br><small class="muted">${esc(x.who)}</small></td><td>${veh(x.v).plate}</td><td>${esc(drv(x.d).name)}</td><td><span class="chip ${chipSt(x.st)}">${t(x.st)}</span></td>
<td class="right">${x.st !== 'done' ? `<button class="btn sm primary" data-act="adv" data-id="${x.id}">${t(x.st === 'plan' ? 'start' : 'finish')}</button>` : ''}</td></tr>`).join('');
      return `${form}<div class="card tablewrap" style="margin-top:14px"><table><tr><th>${t('time')}</th><th>${t('dest')}</th><th>${t('vehicle')}</th><th>${t('driver')}</th><th>${t('status')}</th><th></th></tr>${rows}</table></div>`;
    }
    if (tab === 'vehicles') {
      return `<div class="grid g3">${D.vehicles.map((v) => `<div class="card"><h3>${ic('truck')} ${v.plate}</h3><div class="muted">${esc(v.model)} · ${c.num(v.km)} km</div>
<p><span class="chip ${busy('v', v.id) ? 'brand' : 'ok'}">${t(busy('v', v.id) ? 'inuse' : 'avail')}</span> <span class="chip ${v.svc === 'ok' ? '' : v.svc === 'soon' ? 'warn' : 'bad'}">${t(v.svc)}</span></p></div>`).join('')}</div>`;
    }
    return `<div class="grid g3">${D.drivers.map((d) => `<div class="card"><h3>${ic('users')} ${esc(d.name)}</h3><div class="muted">${ic('phone')} ${d.phone}</div><p><span class="chip ${busy('d', d.id) ? 'brand' : 'ok'}">${t(busy('d', d.id) ? 'onTrip' : 'free')}</span></p></div>`).join('')}</div>
<p style="margin-top:14px"><button class="btn" data-act="reset">${t('reset')}</button></p>`;
  };

  ARZ.boot({
    id: 'fleet', name: 'Fleet Ops', version: '1.0.0', T, view,
    tabs: [{ id: 'dash', ic: 'chart' }, { id: 'trips', ic: 'map' }, { id: 'vehicles', ic: 'truck' }, { id: 'drivers', ic: 'users' }],
    login: {
      org: 'Andria Rezki', icon: 'truck',
      hi: { id: 'Operasional armada & driver', en: 'Fleet & driver operations' },
      lead: { id: 'Admin menyusun jadwal perjalanan, driver menjalankannya, dan semua perubahan langsung terlihat di dasbor.', en: 'Admins plan trips, drivers carry them out, and every change shows on the dashboard right away.' },
      feats: [
        { ic: 'map', id: { t: 'Jadwal perjalanan', d: 'Tujuan, pemesan, jam, kendaraan, driver' }, en: { t: 'Trip scheduling', d: 'Destination, requester, time, vehicle, driver' } },
        { ic: 'shield', id: { t: 'Tanpa bentrok', d: 'Kendaraan dan driver yang sibuk tidak bisa dipilih' }, en: { t: 'No double booking', d: 'Busy vehicles and drivers cannot be picked' } },
        { ic: 'truck', id: { t: 'Status kendaraan', d: 'Tersedia, dipakai, jadwal servis' }, en: { t: 'Vehicle status', d: 'Available, in use, service schedule' } },
        { ic: 'phone', id: { t: 'Mudah di HP', d: 'Tampilan nyaman di layar kecil' }, en: { t: 'Phone friendly', d: 'Comfortable on small screens' } },
      ],
    },
    onAct(c, a, el) {
      if (a === 'adv') { const x = D.trips.find((q) => q.id === el.dataset.id); x.st = next(x.st); save(); }
      else if (a === 'reset') { D = seed(); save(); }
      c.rerender();
    },
    onForm(c, name, f) {
      if (name !== 'trip') return; const d = new FormData(f);
      D.trips.unshift({ id: 't' + D.n++, dest: String(d.get('dest')), who: String(d.get('who')), time: String(d.get('time')), v: String(d.get('v')), d: String(d.get('d')), st: 'plan' });
      save(); c.toast(c.t('added')); c.rerender();
    },
  });
})();
