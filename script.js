/* =========================================================
   PORTOFOLIO FERNANDO ARKA PRATAMA - script.js
   Daftar isi:
   0. Data proyek & fungsi bantu
   1. Navbar mobile (hamburger)
   2. Smooth scroll & menu aktif
   3. Render kartu proyek
   4. Filter portofolio
   5. Modal detail proyek
   6. Fade-in saat scroll (Intersection Observer)
   7. Back to top & bar progres scroll
   8. Animasi background jaringan (canvas)
   9. Foto bergelantung di jaring laba-laba (bisa ditarik)
  10. Efek mengetik
  11. Cahaya & miring pada kartu
  ========================================================= */

/* ---------- 0. DATA PROYEK ----------
   "img"  = lokasi foto bukti proyek (taruh file di folder images/)
   "category" harus cocok dengan data-filter tombol (jaringan / web) */
const projects = [
  { id: 1, category: 'jaringan', label: 'Jaringan', title: 'Simulasi Jaringan Sekolah', img: 'images/proyek-1.jpg',
    short: 'Topologi LAN dengan beberapa VLAN di Cisco Packet Tracer.',
    desc: 'Merancang topologi jaringan untuk satu gedung sekolah: pembagian VLAN per ruangan, inter-VLAN routing, dan DHCP server. Hasilnya diuji dengan ping antar-VLAN.',
    tools: ['Cisco Packet Tracer', 'VLAN', 'DHCP', 'Subnetting'] },
  { id: 2, category: 'jaringan', label: 'Jaringan', title: 'Konfigurasi Router MikroTik', img: 'images/proyek-2.jpg',
    short: 'Pengaturan hotspot, bandwidth limit, dan firewall dasar.',
    desc: 'Mengonfigurasi router MikroTik untuk jaringan kecil: NAT, hotspot dengan login, pembatasan bandwidth per pengguna, dan aturan firewall sederhana.',
    tools: ['MikroTik', 'Winbox', 'Firewall', 'Queue'] },
  { id: 3, category: 'web', label: 'Web Dev', title: 'Website Profil Kelas XI TKJ', img: 'images/foto web kelas.png',
    short: 'Situs statis responsif untuk profil dari kelas XI TKJ SMKN 1 KOTA MALANG.',
    desc: 'Membuat website profil XI TKJ yang rapi di layar HP maupun laptop, lengkap dengan galeri kegiatan.',
    tools: ['HTML', 'CSS', 'JavaScript'] },
  { id: 4, category: 'web', label: 'Web Dev', title: 'Website Bisnis Tugas PJBL', img: 'images/foto web.png',
    short: 'To-do list interaktif dengan penyimpanan di browser.',
    desc: 'Website statis untuk membantu usaha agar bisa membeli lewat online.',
    tools: ['JavaScript', 'HTML', 'CSS'] },
  { id: 5, category: 'desain', label: 'Desain Fashion', title: 'Desain Hoodie', img: 'images/foto desain.png',
    short: 'Desain hoodie dengan motif kekinian dan warna cerah.',
    desc: 'Menghasilkan desain hoodie yang menarik agar pembeli tertarik pada produk kami.',
    tools: ['Affinity Designer', 'Canva'] }
];

const $  = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Gambar pengganti otomatis jika file foto belum ada (tidak error / kosong).
   Setelah kamu menaruh foto asli di folder images/, gambar ini tidak muncul lagi. */
function placeholder(text, w = 800, h = 450) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1E293B"/><stop offset="1" stop-color="#0c4a6e"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" fill="#38BDF8" font-family="sans-serif" font-size="${Math.min(w, h) / 9}" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
const imgFallback = (src) => `this.onerror=null;this.src=placeholder('Tambah foto: ${src.replace('images/', '')}')`;

/* Foto profil (ada di HTML): pasang pengganti jika file tidak ditemukan */
const profileImg = $('#photo img');
const useProfileFallback = () => { profileImg.onerror = null; profileImg.src = placeholder(profileImg.dataset.ph, 640, 800); };
profileImg.addEventListener('error', useProfileFallback);
if (profileImg.complete && profileImg.naturalWidth === 0) useProfileFallback();

/* ---------- 1. NAVBAR MOBILE ---------- */
const menuBtn = $('#menu-btn'), mobileNav = $('#mobile-menu');
function setMenu(open) {
  mobileNav.style.maxHeight = open ? mobileNav.scrollHeight + 'px' : '0px'; // buka/tutup dengan tinggi isi
  $('#icon-open').classList.toggle('hidden', open);
  $('#icon-close').classList.toggle('hidden', !open);
  menuBtn.setAttribute('aria-expanded', open);
}
menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));

/* ---------- 2. SMOOTH SCROLL & MENU AKTIF ----------
   Scroll halus diatur CSS (scroll-behavior di style.css). */
$$('.nav-link').forEach(l => l.addEventListener('click', () => setMenu(false)));
const sections = $$('main section, footer#kontak');
const navLinks = $$('.nav-link');
function updateActiveNav() {
  const y = window.scrollY + 120;
  let current = sections[0].id;
  sections.forEach(s => { if (s.offsetTop <= y) current = s.id; });
  if (innerHeight + scrollY >= document.body.scrollHeight - 4) current = 'kontak'; // mentok bawah
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}

/* ---------- 3. RENDER KARTU PROYEK ---------- */
const grid = $('#project-grid');
grid.innerHTML = projects.map(p => `
  <article class="card project-card" data-category="${p.category}" data-id="${p.id}" data-tilt tabindex="0" role="button" aria-label="Lihat detail ${p.title}">
    <div class="aspect-video overflow-hidden">
      <img src="${p.img}" alt="Foto pengerjaan ${p.title}" loading="lazy" class="w-full h-full object-cover" onerror="${imgFallback(p.img)}">
    </div>
    <div class="p-5">
      <span class="chip">${p.label}</span>
      <h3 class="mt-3 font-semibold text-lg">${p.title}</h3>
      <p class="mt-2 text-sm text-slate-400">${p.short}</p>
      <p class="mt-4 text-sm font-medium text-[#38BDF8]">Lihat detail</p>
    </div>
  </article>`).join('');

/* ---------- 4. FILTER PORTOFOLIO ----------
   Kartu yang tidak cocok memudar (class "hiding"), lalu disembunyikan setelah 300ms. */
$$('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
  const f = btn.dataset.filter;
  $$('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
  $$('.project-card').forEach(card => {
    const match = f === 'all' || card.dataset.category === f;
    if (match) { card.classList.remove('hidden'); requestAnimationFrame(() => card.classList.remove('hiding')); }
    else { card.classList.add('hiding'); setTimeout(() => card.classList.contains('hiding') && card.classList.add('hidden'), 300); }
  });
}));

/* ---------- 5. MODAL DETAIL PROYEK ---------- */
const modal = $('#modal'), modalBox = $('#modal-box'), modalImg = $('#modal-img');
let lastFocused = null;

function openModal(id) {
  const p = projects.find(x => x.id === Number(id));
  if (!p) return;
  lastFocused = document.activeElement;
  modalImg.onerror = () => { modalImg.onerror = null; modalImg.src = placeholder('Tambah foto: ' + p.img.replace('images/', '')); };
  modalImg.src = p.img;
  modalImg.alt = 'Foto pengerjaan ' + p.title;
  $('#modal-tag').textContent = p.label;
  $('#modal-title').textContent = p.title;
  $('#modal-desc').textContent = p.desc;
  $('#modal-tools').innerHTML = p.tools.map(t => `<li class="tool">${t}</li>`).join('');
  modal.classList.remove('hidden'); modal.classList.add('flex');
  document.body.style.overflow = 'hidden'; // kunci scroll halaman
  requestAnimationFrame(() => { modal.classList.remove('opacity-0'); modalBox.classList.remove('scale-95'); });
  $('#modal-close').focus();
}
function closeModal() {
  modal.classList.add('opacity-0'); modalBox.classList.add('scale-95');
  document.body.style.overflow = '';
  setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 300);
  lastFocused && lastFocused.focus();
}
grid.addEventListener('click', e => { const c = e.target.closest('.project-card'); c && openModal(c.dataset.id); });
grid.addEventListener('keydown', e => {
  const c = e.target.closest('.project-card');
  if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openModal(c.dataset.id); }
});
$('#modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); }); // klik area gelap
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal(); });

/* ---------- 6. FADE-IN SAAT SCROLL ---------- */
const io = new IntersectionObserver((entries, obs) => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('show'); obs.unobserve(en.target); } // sekali saja
}), { threshold: 0.15 });
$$('.reveal').forEach(el => io.observe(el));

/* ---------- 7. BACK TO TOP & BAR PROGRES ---------- */
const toTop = $('#to-top'), progress = $('#progress');
function onScroll() {
  const show = scrollY > 400;
  toTop.classList.toggle('opacity-0', !show);
  toTop.classList.toggle('pointer-events-none', !show);
  toTop.classList.toggle('translate-y-4', !show);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`; // lebar bar = persen scroll
  updateActiveNav();
}
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', () => { if (innerWidth >= 768) setMenu(false); });

/* ---------- 8. BACKGROUND JARINGAN (CANVAS) ----------
   Titik-titik (node) bergerak pelan dan saling terhubung dengan garis,
   seperti topologi jaringan. Kursor juga menjadi "node" yang menarik garis. */
(() => {
  const c = $('#bg'), ctx = c.getContext('2d');
  const mouse = { x: -999, y: -999 };
  let w, h, nodes = [];

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(80, Math.floor(w * h / 17000)); // jumlah titik menyesuaikan layar
    nodes = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const a of nodes) {
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;
      ctx.fillStyle = 'rgba(56,189,248,.7)';
      ctx.beginPath(); ctx.arc(a.x, a.y, 1.6, 0, 6.283); ctx.fill();
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {              // garis antar-titik yang berdekatan
        const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) { ctx.strokeStyle = `rgba(56,189,248,${.22 * (1 - d / 130)})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);      // garis ke kursor
      if (dm < 180) { ctx.strokeStyle = `rgba(125,211,252,${.5 * (1 - dm / 180)})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
    }
    if (!reduceMotion) requestAnimationFrame(draw);              // ulangi tiap frame
  }
  addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  addEventListener('resize', () => { resize(); reduceMotion && draw(); });
  resize(); draw();
})();

/* ---------- 9. FOTO BERGELANTUNG DI JARING LABA-LABA ----------
   Foto digantung pada tali dan bergerak seperti bandul (fisika sederhana).
   Tarik fotonya dengan mouse/jari, lalu lepas: foto berayun dan pelan-pelan berhenti.
   Angle (theta) = sudut tali dari posisi lurus ke bawah, dalam radian. */
(() => {
  const stage = $('#web-stage'), swing = $('#swing'), photo = $('#photo'), hint = $('#hint'), svg = $('#web');
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  /* 9a. GAMBAR JARING
     Titik pusat jaring = titik gantung (cx, cy). Ubah rays / rings untuk mengatur kerapatan. */
  const NS = 'http://www.w3.org/2000/svg', cx = 200, cy = 12;
  const rays = 9;                                   // jumlah benang yang memancar
  const rings = [70, 130, 190, 250, 310];           // jarak tiap lingkaran jaring dari pusat
  const point = (i, r) => { const a = Math.PI * (0.08 + 0.84 * i / (rays - 1)); return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
  const add = (d) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', 'rgba(56,189,248,.28)'); p.setAttribute('stroke-width', '1'); svg.appendChild(p); };
  for (let i = 0; i < rays; i++) { const [x, y] = point(i, rings[rings.length - 1]); add(`M${cx} ${cy}L${x} ${y}`); }   // benang lurus
  rings.forEach(r => {                                                                                              // benang melingkar (sedikit melengkung ke dalam)
    let d = '';
    for (let i = 0; i < rays; i++) {
      const [x, y] = point(i, r);
      if (i === 0) { d += `M${x} ${y}`; continue; }
      const [px, py] = point(i - 1, r);
      d += `Q${(px + x) / 2 + (cx - (px + x) / 2) * .12} ${(py + y) / 2 + (cy - (py + y) / 2) * .12} ${x} ${y}`;
    }
    add(d);
  });

  /* 9b. FISIKA BANDUL */
  const K = 14;      // kekuatan gravitasi: makin besar, ayunan makin cepat
  const C = 0.35;    // redaman: makin besar, foto makin cepat berhenti
  let theta = reduceMotion ? 0 : 0.5;   // sudut awal: foto berayun sedikit saat halaman dibuka
  let omega = 0;                        // kecepatan sudut
  let target = 0, dragging = false, last = performance.now();

  function step(now) {
    const dt = Math.min((now - last) / 1000, 0.033);
    last = now;
    if (dragging) {
      // Saat ditarik: sudut mengikuti kursor dengan halus, kecepatan dicatat untuk lemparan
      const prev = theta;
      theta += (target - theta) * Math.min(1, dt * 25);
      omega = dt > 0 ? (theta - prev) / dt : 0;
    } else {
      // Saat dilepas: gravitasi menarik ke bawah, redaman memperlambat, "angin" kecil menjaga tetap hidup
      const wind = reduceMotion ? 0 : 0.5 * Math.sin(now / 1300);
      omega += (-K * Math.sin(theta) - C * omega + wind) * dt;
      theta += omega * dt;
    }
    swing.style.transform = `rotate(${theta}rad)`;
    // Foto sedikit berputar di titik gantungnya sesuai kecepatan ayun (gerak sekunder)
    photo.style.transform = `rotate(${clamp(-omega * 0.05, -0.35, 0.35)}rad)`;
    requestAnimationFrame(step);
  }

  /* 9c. TARIK & LEPAS */
  function aimAt(e) {
    const r = stage.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);   // jarak ke titik gantung (kiri/kanan)
    const dy = e.clientY - (r.top + 12);             // jarak ke titik gantung (bawah)
    target = clamp(-Math.atan2(dx, dy), -1.4, 1.4);  // batas sekitar 80 derajat
  }
  photo.addEventListener('pointerdown', e => {
    dragging = true; photo.classList.add('grabbing');
    photo.setPointerCapture(e.pointerId);
    hint.classList.add('opacity-0');                 // sembunyikan petunjuk setelah dicoba
    aimAt(e);
  });
  photo.addEventListener('pointermove', e => { if (dragging) aimAt(e); });
  const release = () => {
    if (!dragging) return;
    dragging = false; photo.classList.remove('grabbing');
    omega = clamp(omega, -12, 12);                   // batasi kecepatan lemparan
  };
  photo.addEventListener('pointerup', release);
  photo.addEventListener('pointercancel', release);

  requestAnimationFrame(step);
})();

/* ---------- 10. EFEK MENGETIK ----------
   Ubah/ tambah kata di array "roles". */
(() => {
  const roles = ['Jaringan Komputer', 'Pengembangan Web', 'Troubleshooting'];
  const el = $('#typed');
  if (reduceMotion) { el.textContent = roles[0]; return; }
  let r = 0, i = 0, deleting = false;
  (function tick() {
    const word = roles[r];
    i += deleting ? -1 : 1;
    el.textContent = word.slice(0, i);
    let delay = deleting ? 40 : 90;
    if (!deleting && i === word.length) { deleting = true; delay = 1400; }      // jeda setelah selesai ketik
    else if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
    setTimeout(tick, delay);
  })();
})();

/* ---------- 11. CAHAYA & MIRING PADA KARTU ----------
   .card: cahaya biru mengikuti kursor (--mx/--my dipakai style.css).
   [data-tilt]: kartu proyek sedikit miring ke arah kursor. */
document.addEventListener('pointermove', e => {
  const card = e.target.closest && e.target.closest('.card');
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  if (card.hasAttribute('data-tilt') && !reduceMotion) {
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  }
});
$$('[data-tilt]').forEach(c => c.addEventListener('pointerleave', () => c.style.transform = ''));

/* ---------- PENGATURAN AWAL ---------- */
$('#year').textContent = new Date().getFullYear();
onScroll();
