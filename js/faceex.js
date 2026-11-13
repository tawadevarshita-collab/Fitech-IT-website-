window.__fisReady = true;
/* FaceEX page behaviour (uses the same theme logic as js/script.js) */
function toggleTheme() {
    const isLight = document.body.classList.toggle('light-mode');
    const icon = document.getElementById('themeIcon');
    icon.className = isLight ? 'fa-solid fa-moon text-indigo-500 text-sm' : 'fa-solid fa-sun text-amber-400 text-sm';
    icon.parentNode.setAttribute('title', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    try { localStorage.setItem('fit-theme', isLight ? 'light' : 'dark'); } catch (e) {}
}
(function () {
    const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
    try { if (localStorage.getItem('fit-theme') === 'light') toggleTheme(); } catch (e) {}
    const fy = document.getElementById('footerYear'); if (fy) fy.textContent = new Date().getFullYear();

    /* header + progress */
    const header = document.querySelector('header'), bar = document.getElementById('scrollProgress');
    addEventListener('scroll', () => {
        const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
        if (bar) bar.style.width = (max > 0 ? y / max * 100 : 0) + '%';
        if (header) header.classList.toggle('is-scrolled', y > 30);
    }, { passive: true });

    /* scroll reveal (same classes as the home page) */
    /* no IntersectionObserver => CSS never hid anything (see <head>), nothing to do */
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } }), { threshold: .12 });
    document.querySelectorAll('.reveal-on-scroll,.reveal-left,.reveal-right').forEach(n => io.observe(n));

    /* side dots (same markup/CSS as home page) */
    const defs = [['feTop', 'Overview'], ['feSystem', 'System'], ['feFeatures', 'Features'], ['fePrivacy', 'Privacy'], ['specs', 'Specs'], ['contact', 'Contact']];
    const dots = document.createElement('div'); dots.id = 'sideDots';
    defs.forEach(d => { const a = document.createElement('a'); a.href = '#' + d[0]; a.innerHTML = '<span>' + d[1] + '</span>'; dots.appendChild(a); });
    document.body.appendChild(dots);
    const da = [...dots.children];
    const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const i = defs.findIndex(d => d[0] === e.target.id); da.forEach((a, j) => a.classList.toggle('active', i === j)); } }), { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    defs.forEach(d => { const el = document.getElementById(d[0]); if (el) so.observe(el); });

    /* rotating point-cloud face behind the headline */
    const c = document.getElementById('feCanvas'), x = c && c.getContext('2d'), P = [];
    let W, H, rot = 0, mx = 0;
    for (let i = 0; i < 1500; i++) { const u = Math.random() * 6.283, v = Math.acos(2 * Math.random() - 1); P.push([Math.sin(v) * Math.cos(u) * .78, Math.cos(v), Math.sin(v) * Math.sin(u) * .85, Math.random() * .6 + .4]); }
    [[-.3, .2, .78], [.3, .2, .78]].forEach(e => { for (let i = 0; i < 70; i++) { const a = Math.random() * 6.283, r = Math.random() * .1; P.push([e[0] + Math.cos(a) * r, e[1] + Math.sin(a) * r * .6, e[2], 1.5]); } });
    for (let i = 0; i < 60; i++) P.push([(Math.random() - .5) * .05, -.05 + Math.random() * .4, .9, 1.2]);
    for (let i = 0; i < 80; i++) { const q = Math.random(); P.push([(q - .5) * .5, -.45 - Math.sin(q * 3.14) * .04, .74, 1.2]); }
    const size = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    if (!x) return;
    size(); addEventListener('resize', size);
    addEventListener('mousemove', e => mx = (e.clientX / innerWidth - .5) * .6);
    (function draw() {
        x.clearRect(0, 0, W, H); rot += .0045;
        const s = Math.min(W, H) * .34, cs = Math.cos(rot + mx), sn = Math.sin(rot + mx), lt = document.body.classList.contains('light-mode');
        for (const p of P) {
            const X = p[0] * cs + p[2] * sn, Z = -p[0] * sn + p[2] * cs, d = (Z + 1) / 2;
            x.fillStyle = lt ? `rgba(2,132,199,${.15 + d * .4})` : `rgba(0,242,254,${.08 + d * .4 * p[3] * .7})`;
            x.fillRect(W / 2 + X * s, H * .52 - p[1] * s, p[3] * 1.4 + .4, p[3] * 1.4 + .4);
        }
        if (!RM) requestAnimationFrame(draw);
    })();

    /* page transition for in-site links */
    document.addEventListener('click', e => {
        const a = e.target.closest('a[data-page]'); if (!a || RM) return; e.preventDefault();
        const ov = document.createElement('div');
        ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#02090d;opacity:0;transition:opacity .45s';
        document.body.appendChild(ov); requestAnimationFrame(() => ov.style.opacity = 1);
        setTimeout(() => location.href = a.href, 460);
    });
    addEventListener('pageshow', () => document.querySelectorAll('body > div[style*="z-index:9999"]').forEach(n => n.remove()));
})();

/* ===== Mobile menu (same behaviour as the home page) ===== */
(function () {
    const btn = document.getElementById('mobileMenuBtn'), nav = document.getElementById('mobileNav');
    if (!btn || !nav) return;
    const set = (open) => {
        nav.classList.toggle('open', open);
        nav.setAttribute('aria-hidden', String(!open));
        btn.setAttribute('aria-expanded', String(open));
        btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        btn.firstElementChild.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    };
    btn.addEventListener('click', () => set(!nav.classList.contains('open')));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
    addEventListener('resize', () => { if (innerWidth >= 1024) set(false); });
})();


/* Safety net: anything scrolled past (e.g. after an anchor jump) is always shown */
(function () {
    let t = false;
    function sweep() {
        t = false;
        document.querySelectorAll('.reveal-on-scroll:not(.revealed),.reveal-left:not(.revealed),.reveal-right:not(.revealed)').forEach(el => {
            if (el.getBoundingClientRect().bottom < 0) el.classList.add('revealed');
        });
        document.querySelectorAll('.fx-head:not(.fx-in)').forEach(el => {
            if (el.getBoundingClientRect().bottom < 0) el.classList.add('fx-in');
        });
    }
    addEventListener('scroll', () => { if (!t) { t = true; requestAnimationFrame(sweep); } }, { passive: true });
})();
