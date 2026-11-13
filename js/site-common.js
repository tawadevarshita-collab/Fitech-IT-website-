/* Behaviour for the standalone legal pages: theme toggle, header/progress, mobile menu, footer year.
   Same logic and storage key ("fit-theme") as the rest of the site. */
window.__fisReady = true;
function toggleTheme() {
    const isLight = document.body.classList.toggle('light-mode');
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = isLight ? 'fa-solid fa-moon text-indigo-500 text-sm' : 'fa-solid fa-sun text-amber-400 text-sm';
        icon.parentNode.setAttribute('title', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    }
    try { localStorage.setItem('fit-theme', isLight ? 'light' : 'dark'); } catch (e) {}
}
(function () {
    const embedded = document.documentElement.classList.contains('is-embed');
    if (!embedded) { try { if (localStorage.getItem('fit-theme') === 'light') toggleTheme(); } catch (e) {} }
    const fy = document.getElementById('footerYear'); if (fy) fy.textContent = new Date().getFullYear();

    const header = document.querySelector('header'), bar = document.getElementById('scrollProgress');
    function onScroll() {
        const y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar) bar.style.width = (max > 0 ? y / max * 100 : 0) + '%';
        if (header) header.classList.toggle('is-scrolled', y > 30);
    }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

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
    window.addEventListener('resize', () => { if (window.innerWidth >= 1024) set(false); });
})();

/* Inside the pop-up (?embed=1): Escape closes the pop-up that hosts this page */
if (document.documentElement.classList.contains('is-embed')) {
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { try { window.parent.postMessage({ fisLegal: 'close' }, '*'); } catch (err) {} }
    });
}
