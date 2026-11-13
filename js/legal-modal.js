/* Privacy Policy / Terms of Service pop-up (Home, Product, Contact Us).
   The legal text lives only in privacy-policy.html / terms-of-service.html; the pop-up shows those pages
   (?embed=1) in an iframe, so there is a single copy. Without JavaScript the links simply open the pages. */
(function () {
    const DOCS = {
        'privacy-policy': { file: 'privacy-policy.html', title: 'Privacy Policy', width: '56rem' },
        'terms-of-service': { file: 'terms-of-service.html', title: 'Terms of Service', width: '48rem' }
    };
    const css = `
#legalOverlay{position:fixed;inset:0;z-index:9998;display:none;align-items:center;justify-content:center;padding:1rem;background:rgba(0,0,0,.8);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:0;transition:opacity .25s ease}
#legalOverlay.is-open{opacity:1}
#legalOverlay .lm-card{position:relative;width:100%;height:85vh;height:85dvh;background:#03151a;border:1px solid rgba(6,182,212,.4);border-radius:1.5rem;overflow:hidden;box-shadow:0 25px 60px -15px rgba(6,182,212,.25);transform:translateY(12px) scale(.98);transition:transform .25s ease}
#legalOverlay.is-open .lm-card{transform:none}
#legalOverlay iframe{display:none;width:100%;height:100%;border:0;background:#03151a}
#legalOverlay iframe.is-active{display:block}
#legalOverlay .lm-close{position:absolute;top:.75rem;right:1.25rem;z-index:2;width:2.25rem;height:2.25rem;display:flex;align-items:center;justify-content:center;border:0;background:transparent;color:#22d3ee;font-size:1.25rem;cursor:pointer;transition:color .2s}
#legalOverlay .lm-close:hover,#legalOverlay .lm-close:focus-visible{color:#fff;outline:none}
@media(prefers-reduced-motion:reduce){#legalOverlay,#legalOverlay .lm-card{transition:none}}`;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    let overlay, card, closeBtn, current = null, lastFocus = null;
    const frames = {};

    function build() {
        if (overlay) return;
        overlay = document.createElement('div');
        overlay.id = 'legalOverlay';
        overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true');
        card = document.createElement('div'); card.className = 'lm-card';
        closeBtn = document.createElement('button');
        closeBtn.type = 'button'; closeBtn.className = 'lm-close'; closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        closeBtn.addEventListener('click', () => close());
        card.appendChild(closeBtn); overlay.appendChild(card);
        overlay.addEventListener('mousedown', e => { if (e.target === overlay) close(); });
        document.body.appendChild(overlay);
    }
    function frame(key) {
        if (frames[key]) return frames[key];
        build();
        const f = document.createElement('iframe');
        f.src = DOCS[key].file + '?embed=1'; f.title = DOCS[key].title; f.loading = 'eager';
        card.appendChild(f); frames[key] = f; return f;
    }
    function open(key, fromHash) {
        const d = DOCS[key]; if (!d) return;
        if (!current) lastFocus = document.activeElement;
        const f = frame(key);
        Object.keys(frames).forEach(k => frames[k].classList.toggle('is-active', k === key));
        card.style.maxWidth = d.width;
        overlay.setAttribute('aria-label', d.title);
        closeBtn.setAttribute('aria-label', 'Close ' + d.title);
        if (!current) {
            overlay.style.display = 'flex'; void overlay.offsetWidth; overlay.classList.add('is-open');
            document.documentElement.style.overflow = 'hidden';
            try { window.__lenis && window.__lenis.stop(); } catch (e) {}
        }
        current = key;
        if (!fromHash) { try { history.replaceState(null, '', location.pathname + location.search + '#' + key); } catch (e) {} }
        closeBtn.focus({ preventScroll: true });
    }
    function close(fromHash) {
        if (!current) return;
        current = null;
        overlay.classList.remove('is-open');
        setTimeout(() => { if (!current) overlay.style.display = 'none'; }, 260);
        document.documentElement.style.overflow = '';
        try { window.__lenis && window.__lenis.start(); } catch (e) {}
        if (!fromHash && /^#(privacy-policy|terms-of-service)$/.test(location.hash)) {
            try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
        }
        if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
    }
    const keyOf = a => { const m = (a.getAttribute('href') || '').match(/(?:^|\/)(privacy-policy|terms-of-service)\.html(?:[?#].*)?$/); return m && m[1]; };

    document.addEventListener('click', e => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = e.target.closest && e.target.closest('a[href]');
        if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
        const key = keyOf(a); if (!key) return;
        e.preventDefault(); open(key);
    });
    // Warm the pop-up up before the click
    ['mouseover', 'focusin', 'touchstart'].forEach(ev => document.addEventListener(ev, e => {
        const a = e.target.closest && e.target.closest('a[href]'); const key = a && keyOf(a);
        if (key && !frames[key]) frame(key);
    }, { passive: true }));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && current) close(); });
    window.addEventListener('message', e => { if (e.data && e.data.fisLegal === 'close') close(); });
    function fromHash() {
        const k = location.hash.slice(1);
        if (DOCS[k]) open(k, true); else if (current) close(true);
    }
    window.addEventListener('hashchange', fromHash);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fromHash); else fromHash();
})();
