/* Mark JS as running so CSS reveal states apply (see <head> failsafe) */
window.__fisReady = true;


/* --- 1. SVG Torch / Flashlight Beam Controller --- */
        const torchCircle = document.getElementById('torchCircle');
        const torchCenterGlow = document.getElementById('torchCenterGlow');
        const torchWords = document.querySelectorAll('.torch-word');

        let mouseX = -500;
        let mouseY = -500;
        let torchX = -500;
        let torchY = -500;
        const torchRadius = 180;

        function updateTorchPosition(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }

        window.addEventListener('mousemove', updateTorchPosition);
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                updateTorchPosition(e.touches[0]);
            }
        });

        const torchSvg = document.getElementById('torchSvg');
        function torchRenderLoop() {
            requestAnimationFrame(torchRenderLoop);
            if (!torchCircle || !torchCenterGlow) return;
            const heroVisible = window.scrollY < window.innerHeight * 0.9;
            if (torchSvg) torchSvg.classList.toggle('is-off', !heroVisible);
            if (!heroVisible) return;
            torchX += (mouseX - torchX) * 0.18;
            torchY += (mouseY - torchY) * 0.18;

            torchCircle.setAttribute('cx', torchX);
            torchCircle.setAttribute('cy', torchY);

            torchCenterGlow.setAttribute('cx', torchX);
            torchCenterGlow.setAttribute('cy', torchY);

            torchWords.forEach(word => {
                const rect = word.getBoundingClientRect();
                const wordCenterX = rect.left + rect.width / 2;
                const wordCenterY = rect.top + rect.height / 2;

                const distance = Math.hypot(torchX - wordCenterX, torchY - wordCenterY);

                if (distance < torchRadius) {
                    word.classList.add('headline-illuminated');
                    word.classList.remove('headline-dark');
                } else {
                    word.classList.remove('headline-illuminated');
                    word.classList.add('headline-dark');
                }
            });
        }

        torchRenderLoop();


        /* --- 2. Hero visual (FaceEX): gentle pointer parallax + pause while off-screen (SVG/CSS, no WebGL) --- */
        (function () {
            const wrap = document.querySelector('.hv-wrap'), svg = document.getElementById('heroVisual');
            if (!wrap || !svg) return;
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if ('IntersectionObserver' in window) {
                new IntersectionObserver((es) => {
                    const on = es[0].isIntersecting && !document.hidden;
                    svg.classList.toggle('is-paused', !on);
                    try { on ? svg.unpauseAnimations() : svg.pauseAnimations(); } catch (e) {}
                }, { threshold: 0 }).observe(wrap);
            }
            // phones: crop to the FaceEX device so it stays large and readable
            const mq = window.matchMedia('(max-width: 640px)');
            const fit = () => svg.setAttribute('viewBox', mq.matches ? '0 22 350 515' : '0 0 640 560');
            fit(); (mq.addEventListener ? mq.addEventListener('change', fit) : mq.addListener(fit));
            if (reduce || !window.matchMedia('(hover: hover)').matches) return;
            let raf = 0, nx = 0, ny = 0;
            window.addEventListener('pointermove', (e) => {
                nx = (e.clientX / window.innerWidth - 0.5) * 2;
                ny = (e.clientY / window.innerHeight - 0.5) * 2;
                if (!raf) raf = requestAnimationFrame(() => { raf = 0; wrap.style.setProperty('--hv-px', nx.toFixed(3)); wrap.style.setProperty('--hv-py', ny.toFixed(3)); });
            }, { passive: true });
        })();

        /* --- 3. Scroll Reveal Animation Observer --- */
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -70px 0px',
            threshold: 0.12
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right').forEach(el => {
            revealObserver.observe(el);
        });

        /* --- 4. Interactive Services Filtering & Modal Handling --- */
        const serviceModal = document.getElementById('serviceModal');
        const serviceModalContent = document.getElementById('serviceModalContent');
        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDesc');
        const modalList = document.getElementById('modalList');
        const modalBadge = document.getElementById('modalBadge');

        const serviceDetailsData = [
            {
                title: "Bespoke Engineering",
                desc: "We construct enterprise-grade software engines engineered around your proprietary business workflows. Our modular backend architectures ensure infinite scalability without tech debt.",
                badge: "SYSTEMS ARCHITECTURE",
                highlights: [
                    "Decoupled Microservice & Event-Driven Architecture",
                    "Rigorous Automated Testing & Continuous Quality Gates",
                    "Enterprise Security Compliance (SOC2 / HIPAA / ISO27001)"
                ]
            },
            {
                title: "Omnichannel Platforms",
                desc: "Deliver fluid user experiences across web, native mobile, and embedded devices. Our cross-platform ecosystems ensure 100% visual parity and instant synchronization.",
                badge: "PLATFORM AGILITY",
                highlights: [
                    "Sub-second state synchronization across all client nodes",
                    "Offline-first PWA caching with conflict-free data types",
                    "Adaptive UI framework tailored for high-DPI displays"
                ]
            },
            {
                title: "Creative Systems",
                desc: "Transform complex operational interfaces into frictionless cognitive design systems. We utilize kinetic animation, WebGL graphics, and responsive visual hierarchies.",
                badge: "UI/UX INNOVATION",
                highlights: [
                    "GPU-accelerated 60 FPS interactive visual elements",
                    "Custom accessible design token system for dark/light themes",
                    "Behavioral micro-interactions that boost user retention"
                ]
            },
            {
                title: "Enterprise Commerce",
                desc: "High-concurrency commerce engines capable of handling tens of thousands of checkouts per second during peak high-demand global flash sales.",
                badge: "HIGH-THROUGHPUT COMMERCE",
                highlights: [
                    "Headless API integration with global payment providers",
                    "Real-time inventory lock & dynamic pricing engines",
                    "Automated tax compliance & multi-currency settlement"
                ]
            },
            {
                title: "Data Architecture",
                desc: "Architecting real-time streaming data pipelines that digest millions of events per second with sub-10ms analytical query response times.",
                badge: "REAL-TIME DATA",
                highlights: [
                    "Decoupled data lakehouses powered by ClickHouse & Kafka",
                    "Zero-data-loss ACID compliant transaction guarantees",
                    "Automated ML pipeline integration for predictive insight"
                ]
            },
            {
                title: "Cloud Infrastructure",
                desc: "Self-healing cloud clusters deployed via Infrastructure-as-Code. We ensure your critical enterprise applications remain online no matter the traffic load.",
                badge: "CLOUD & DEVOPS",
                highlights: [
                    "Automated multi-region active-active cluster failover",
                    "GitOps CI/CD pipelines with canary deployment capability",
                    "24/7 intelligent AI cluster monitoring & auto-scaling"
                ]
            }
        ];

        function filterServices(category) {
            const filterBtns = document.querySelectorAll('.service-filter-btn');
            filterBtns.forEach(btn => {
                btn.setAttribute('aria-pressed', 'false');
                btn.classList.remove('active', 'bg-cyan-500/20', 'border-cyan-400', 'text-cyan-300', 'shadow-lg', 'shadow-cyan-500/20');
                btn.classList.add('border-cyan-900', 'bg-slate-900/60', 'text-gray-400');
            });

            const activeBtn = document.getElementById(`btn-filter-${category}`);
            if (activeBtn) {
                activeBtn.setAttribute('aria-pressed', 'true');
                activeBtn.classList.remove('border-cyan-900', 'bg-slate-900/60', 'text-gray-400');
                activeBtn.classList.add('active', 'bg-cyan-500/20', 'border-cyan-400', 'text-cyan-300', 'shadow-lg', 'shadow-cyan-500/20');
            }

            const cardItems = document.querySelectorAll('.service-card-item');
            cardItems.forEach(card => {
                clearTimeout(card._t);
                if (category === 'all' || card.dataset.category === category) {
                    if (card.style.display === 'none') {
                        card.style.display = 'flex';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                    }
                    card.classList.add('revealed');
                    card._t = setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 30);
                    card._t2 = setTimeout(() => { card.style.opacity = ''; card.style.transform = ''; }, 500);
                } else {
                    clearTimeout(card._t2);
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card._t = setTimeout(() => { card.style.display = 'none'; }, 300);
                }
            });
        }

        function openServiceModal(index) {
            const data = serviceDetailsData[index];
            if (!data) return;

            modalTitle.textContent = data.title;
            modalDesc.textContent = data.desc;
            modalBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-cyan-400"></span> ${data.badge}`;
            
            modalList.innerHTML = data.highlights.map(item => 
                `<li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-xs"></i> ${item}</li>`
            ).join('');

            serviceModal.classList.remove('hidden');
            if (window.__lenis) window.__lenis.stop();
            setTimeout(() => {
                serviceModal.classList.remove('opacity-0');
                serviceModalContent.classList.remove('scale-95');
                serviceModalContent.classList.add('scale-100');
            }, 10);
        }

        function closeServiceModal() {
            serviceModal.classList.add('opacity-0');
            serviceModalContent.classList.remove('scale-100');
            serviceModalContent.classList.add('scale-95');
            if (window.__lenis) window.__lenis.start();
            setTimeout(() => {
                serviceModal.classList.add('hidden');
            }, 300);
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !serviceModal.classList.contains('hidden')) closeServiceModal();
        });

        // Close modal when clicking outside box
        serviceModal.addEventListener('click', (e) => {
            if (e.target === serviceModal) {
                closeServiceModal();
            }
        });

        /* --- 5. Day / Night Theme Toggle Functionality --- */
        function toggleTheme() {
            const isLight = document.body.classList.toggle('light-mode');
            const themeIcon = document.getElementById('themeIcon');
            
            if (isLight) {
                themeIcon.className = 'fa-solid fa-moon text-indigo-500 text-sm';
                themeIcon.parentNode.setAttribute('title', 'Switch to Dark Mode');
            } else {
                themeIcon.className = 'fa-solid fa-sun text-amber-400 text-sm';
                themeIcon.parentNode.setAttribute('title', 'Switch to Light Mode');
            }
            try { localStorage.setItem('fit-theme', isLight ? 'light' : 'dark'); } catch (e) {}
        }

/* ===== Portfolio 3D Carousel =====
   Fix notes (the "smeared / ghosting logos" bug):
   - Scroll used to add (scroll distance x 0.0035) straight into the carousel position, so a nav jump spun the
     cards up to ~70px per frame. Scroll now only adds a small, capped nudge that is applied once per frame.
   - Autoplay is now "dwell and glide": each logo rests crisp in the centre, then eases to the next one.
   - The animated CSS blur() on side cards was removed (it was re-rasterised every frame); depth now comes
     from opacity/scale/rotation only.
   - Pressing "previous" at index 0 no longer spins the whole ring backwards (position is only wrapped
     while no glide is in progress).
   - The loop only runs while the section is on screen. */
function initCarousel(stageId, prevId, nextId, sectionId) {
    const stage = document.getElementById(stageId);
    if (!stage) return;
    const cards = Array.from(stage.querySelectorAll('.partner-card'));
    const n = cards.length;
    const section = document.getElementById(sectionId);
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const DWELL = 3.0;            // seconds each logo rests in the centre before gliding on
    const MAX_GLIDE = 5;          // max glide speed, in cards per second
    const SCROLL_NUDGE = 0.0012;  // cards per scroll pixel (was 0.0035, uncapped)
    const MAX_NUDGE = 0.03;       // max cards moved by scrolling in a single frame

    let pos = 0;                  // fractional "current" index (unbounded while gliding)
    let target = null;            // glide destination (set by arrows / clicks / autoplay)
    let paused = false;
    let dwell = 0;                // time spent resting on the current card
    let kick = 0;                 // scroll distance accumulated since the last frame
    let lastScrollT = 0;
    let lastY = window.scrollY;
    let spread = RM ? 1 : 0, spreadTarget = RM ? 1 : 0;   // entrance (0 = stacked, 1 = fanned out)
    let inView = false, running = false, last = 0;
    let lastKey = '';

    const mod = (v) => ((v % n) + n) % n;

    function layout() {
        const w = stage.clientWidth;
        const spacing = Math.max(150, Math.min(290, w / 4.3)) * spread;
        const key = pos.toFixed(4) + '|' + spread.toFixed(4) + '|' + w;
        if (key === lastKey) return;          // nothing moved: skip all style writes
        lastKey = key;
        cards.forEach((card, i) => {
            let d = mod(i - pos);
            if (d > n / 2) d -= n;
            const a = Math.abs(d);
            const rot = Math.max(-70, Math.min(70, -d * 38));
            const scale = Math.max(0.6, 1 - a * 0.1);
            const opacity = (a > 3.2 ? 0 : Math.max(0.12, 1 - a * 0.28)) * Math.min(1, spread * 1.4);
            const x = Math.round(d * spacing * 10) / 10;
            const y = Math.round((1 - spread) * 70 * 10) / 10;
            const z = Math.round(-a * 130 * spread);
            card.style.transform =
                'translate(-50%, -50%) translateX(' + x + 'px) translateY(' + y + 'px) translateZ(' + z + 'px) rotateY(' + rot.toFixed(2) + 'deg) scale(' + scale.toFixed(3) + ')';
            card.style.opacity = opacity.toFixed(3);
            card.style.zIndex = 100 - Math.round(a * 10);
            card.style.pointerEvents = a > 3.2 ? 'none' : 'auto';
            card.classList.toggle('is-center', a < 0.5);
        });
    }

    function glideTo(t) { target = t; dwell = 0; }
    function nudge(dir) { glideTo((target !== null ? target : Math.round(pos)) + dir); }

    function tick(now) {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;

        spread += (spreadTarget - spread) * Math.min(1, dt * 3.2);
        if (Math.abs(spreadTarget - spread) < 0.001) spread = spreadTarget;

        if (target !== null) {
            // ease toward the target, but never faster than MAX_GLIDE cards/second so rapid clicks stay smooth
            const step = (target - pos) * Math.min(1, dt * 4.5);
            pos += Math.max(-MAX_GLIDE * dt, Math.min(MAX_GLIDE * dt, step));
            if (Math.abs(target - pos) < 0.002) { pos = mod(target); target = null; dwell = 0; }
        } else if (!paused && !document.hidden) {
            if (kick !== 0) {
                // scrolling: small capped drift, applied once per frame
                pos += Math.max(-MAX_NUDGE, Math.min(MAX_NUDGE, kick * SCROLL_NUDGE));
                kick = 0; lastScrollT = now; dwell = 0;
            } else if (now - lastScrollT > 200 && Math.abs(pos - Math.round(pos)) > 0.002) {
                // after scrolling stops, settle onto the nearest logo
                pos += (Math.round(pos) - pos) * Math.min(1, dt * 6);
            } else if (!RM && spread >= 0.98) {
                dwell += dt;
                if (dwell >= DWELL) glideTo(Math.round(pos) + 1);
            }
        }
        kick = 0;
        if (target === null) pos = mod(pos);

        layout();

        if (!inView && spread === 0) { running = false; return; }   // fully stacked + off screen: stop
        requestAnimationFrame(tick);
    }

    function start() {
        if (running) return;
        running = true;
        last = performance.now();
        requestAnimationFrame(tick);
    }

    document.getElementById(nextId).addEventListener('click', () => nudge(1));
    document.getElementById(prevId).addEventListener('click', () => nudge(-1));
    stage.addEventListener('mouseenter', () => { paused = true; });
    stage.addEventListener('mouseleave', () => { paused = false; dwell = 0; });

    // Click a side card to bring it to the centre.
    // Cards that are links (certificates) only follow their link when they are the centred card.
    cards.forEach((card, i) => card.addEventListener('click', (e) => {
        let d = mod(i - pos);
        if (d > n / 2) d -= n;
        if (card.matches('a[href]')) {
            if (Math.abs(d) > 0.5) { e.preventDefault(); glideTo(pos + d); }
            return;
        }
        if (Math.abs(d) > 0.01) glideTo(pos + d);
    }));

    // Touch swipe
    let sx = null;
    stage.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; paused = true; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
        if (sx !== null) {
            const dx = e.changedTouches[0].clientX - sx;
            if (Math.abs(dx) > 40) nudge(dx < 0 ? 1 : -1);
        }
        sx = null; paused = false; dwell = 0;
    });

    // Fan the cards out when the section scrolls into view; run the loop only while it is visible
    new IntersectionObserver((entries) => {
        entries.forEach(en => {
            inView = en.isIntersecting;
            spreadTarget = inView ? 1 : 0;
            if (inView || spread !== 0) start();
        });
    }, { threshold: 0.2 }).observe(section);

    // Scrolling the page gently spins the carousel (accumulated, then capped once per frame)
    window.addEventListener('scroll', () => {
        const y = window.scrollY, dy = y - lastY;
        lastY = y;
        if (RM || !inView) return;
        kick += dy;
    }, { passive: true });

    window.addEventListener('resize', () => { lastKey = ''; layout(); });
    layout();
}
initCarousel('partnerStage', 'partnerPrev', 'partnerNext', 'portfolio');
initCarousel('certStage', 'certPrev', 'certNext', 'certifications');


    /* ===== Global scroll effects ===== */
    (function () {
        const bar = document.getElementById('scrollProgress');
        const header = document.querySelector('header');
        const links = Array.from(document.querySelectorAll('nav a[href^="#"]'));
        const ids = ['home', 'about', 'services', 'portfolio', 'contact'];
        const ACTIVE = ['text-white', 'border-b-2', 'border-cyan-400'];
        let ticking = false;

        function update() {
            const y = window.scrollY;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
            if (header) header.classList.toggle('is-scrolled', y > 30);

            let current = 'home';
            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = id;
            });
            if (max > 0 && y >= max - 4) current = 'contact';
            links.forEach(a => {
                const on = a.getAttribute('href') === '#' + current;
                ACTIVE.forEach(c => a.classList.toggle(c, on));
            });
            ticking = false;
        }
        window.addEventListener('scroll', () => {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        window.addEventListener('resize', update);
        update();
    })();
    

    /* ===== Premium scroll experience ===== */
    (function () {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const html = document.documentElement;
        const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
        const ease = t => t * t * (3 - 2 * t);

        /* 1. Smooth inertia scrolling (Lenis) */
        let lenis = null;
        if (window.Lenis && !reduce) {
            lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.4 });
            window.__lenis = lenis;
            const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
            requestAnimationFrame(raf);
        }
        const modal = document.getElementById('serviceModal');
        if (modal) modal.setAttribute('data-lenis-prevent', '');

        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const id = a.getAttribute('href');
                if (id.length < 2) return;
                const el = document.querySelector(id);
                if (!el) return;
                e.preventDefault();
                if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.6, easing: t => 1 - Math.pow(1 - t, 4) });
                else el.scrollIntoView({ behavior: 'smooth' });
            });
        });

        /* 2. Side dot navigation */
        const dotDefs = [['home', 'Home'], ['about', 'About'], ['services', 'Services'], ['portfolio', 'Portfolio'], ['certifications', 'Certifications'], ['process', 'Process'], ['contact', 'Contact']];
        const dots = document.createElement('div');
        dots.id = 'sideDots';
        dots.innerHTML = dotDefs.map(d => '<a href="#' + d[0] + '" aria-label="' + d[1] + '"><span>' + d[1] + '</span></a>').join('');
        document.body.appendChild(dots);
        dots.querySelectorAll('a').forEach(a => a.addEventListener('click', e => {
            e.preventDefault();
            const el = document.querySelector(a.getAttribute('href'));
            if (!el) return;
            if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.6, easing: t => 1 - Math.pow(1 - t, 4) });
            else el.scrollIntoView({ behavior: 'smooth' });
        }));
        const dotEls = Array.from(dots.querySelectorAll('a'));

        /* 3. Heading reveal */
        const heads = Array.from(document.querySelectorAll('#about h2, #services h2, #process h2'));
        heads.forEach(h => h.classList.add('fx-head'));
        const headIO = new IntersectionObserver(es => es.forEach(en => {
            if (en.isIntersecting) { en.target.classList.add('fx-in'); headIO.unobserve(en.target); }
        }), { threshold: 0.35 });
        heads.forEach(h => headIO.observe(h));

        if (reduce) return;

        /* 4. Ambient orbs */
        const mkOrb = id => { const o = document.createElement('div'); o.id = id; o.className = 'scroll-orb'; document.body.prepend(o); return o; };
        const orbA = mkOrb('scrollOrbA'), orbB = mkOrb('scrollOrbB');

        /* element refs */
        const main = document.getElementById('home');
        const heroLeft = main && main.children[0];
        const heroRight = main && main.children[1];
        const marquee = document.querySelector('.animate-marquee');
        const scrubSecs = ['about', 'services', 'portfolio', 'process'].map(id => document.getElementById(id)).filter(Boolean);
        const gridSecs = Array.from(document.querySelectorAll('.bg-cyber-grid'));
        const svcCards = Array.from(document.querySelectorAll('.service-card-item'));
        const svcGrid = svcCards[0] && svcCards[0].parentElement;
        const SPD = [-0.05, 0.07, -0.05];
        const sectionIds = dotDefs.map(d => d[0]);

        let lastY = window.scrollY, vel = 0, rate = 1, dotCurrent = '';

        let dirty = true;                       // force a full pass on load / resize
        window.addEventListener('resize', () => { dirty = true; });

        function frame() {
            const y = window.scrollY;
            // Idle guard: no scroll, velocity settled -> skip the layout reads/writes below
            if (!dirty && y === lastY && Math.abs(vel) < 0.01 && Math.abs(rate - 1) < 0.01) {
                requestAnimationFrame(frame);
                return;
            }
            dirty = false;
            const vh = window.innerHeight, vw = window.innerWidth;
            const max = Math.max(1, document.documentElement.scrollHeight - vh);
            vel += ((y - lastY) - vel) * 0.14;
            lastY = y;

            /* --- reads (batched) --- */
            const secRects = scrubSecs.map(s => s.getBoundingClientRect());
            const gridRects = gridSecs.map(s => s.getBoundingClientRect());
            const svcRect = svcGrid ? svcGrid.getBoundingClientRect() : null;
            let current = 'home';
            sectionIds.forEach(id => {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= vh * 0.35) current = id;
            });
            if (y >= max - 4) current = 'contact';

            /* --- writes --- */
            // hero: content drifts up & fades, visual sinks & shrinks
            if (heroLeft && heroRight) {
                if (y < vh * 1.3) {
                    const hp = clamp(y / (vh * 0.9), 0, 1);
                    heroLeft.style.translate = '0 ' + (-y * 0.22) + 'px';
                    heroLeft.style.opacity = String(clamp(1 - hp * 1.15, 0, 1));
                    heroRight.style.translate = '0 ' + (y * 0.10) + 'px';
                    heroRight.style.scale = String(1 - hp * 0.12);
                    heroRight.style.opacity = String(clamp(1 - hp * 0.95, 0, 1));
                } else if (heroLeft.style.translate) {
                    heroLeft.style.translate = ''; heroLeft.style.opacity = '0';
                    heroRight.style.translate = ''; heroRight.style.scale = ''; heroRight.style.opacity = '0';
                }
            }

            // ticker speeds up with scroll, reverses when scrolling up
            if (marquee && marquee.getAnimations) {
                const target = vel > 0.6 ? 1 + vel * 0.45 : (vel < -0.6 ? -(1 + Math.abs(vel) * 0.45) : 1);
                rate += (target - rate) * 0.12;
                const anim = marquee.getAnimations()[0];
                if (anim) anim.playbackRate = clamp(rate, -6, 6);
            }

            // cyber-grid background parallax
            gridSecs.forEach((sec, i) => {
                const r = gridRects[i];
                if (r.bottom > 0 && r.top < vh) sec.style.backgroundPosition = '0px ' + (-r.top * 0.18) + 'px';
            });

            // (service-card column drift removed: it pushed cards out of row alignment)

            // orbs
            const pr = y / max;
            orbA.style.transform = 'translate3d(' + (vw * (0.12 + 0.55 * Math.sin(pr * Math.PI * 1.2))) + 'px,' + (vh * (0.10 + 0.6 * pr)) + 'px,0)';
            orbB.style.transform = 'translate3d(' + (vw * (0.85 - 0.5 * Math.sin(pr * Math.PI * 1.2))) + 'px,' + (vh * (0.85 - 0.6 * pr)) + 'px,0)';

            // side dots
            if (current !== dotCurrent) {
                dotCurrent = current;
                dotEls.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
            }

            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    })();
    

    /* ===== Process section: word-by-word scroll highlight + progress line ===== */
    (function () {
        const grid = document.getElementById('processGrid');
        if (!grid) return;
        const fill = document.getElementById('processFill');
        const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const groups = Array.from(grid.querySelectorAll('.process-desc')).map(p => {
            const words = p.textContent.trim().split(/\s+/);
            p.innerHTML = words.map(w => '<span class="w">' + w + '</span>').join(' ');
            return Array.from(p.querySelectorAll('.w'));
        });

        let ticking = false;
        function update() {
            ticking = false;
            const vh = window.innerHeight;
            const r = grid.getBoundingClientRect();
            const p = reduce ? 1 : clamp((vh * 0.9 - r.top) / (vh * 0.5), 0, 1);
            groups.forEach(ws => {
                const lit = Math.round(p * ws.length);
                ws.forEach((w, i) => w.classList.toggle('on', i < lit));
            });
            if (fill) fill.style.width = (clamp((vh * 0.8 - r.top) / (vh * 0.55), 0, 1) * 100) + '%';
        }
        window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
        window.addEventListener('resize', update);
        update();
    })();
    

/* Footer year */
(function () {
    const fy = document.getElementById('footerYear');
    if (fy) fy.textContent = new Date().getFullYear();
})();


/* ===== Mobile menu ===== */
(function () {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mobileNav');
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


/* ===== Small UX helpers ===== */
/* Scroll to the footer contact block (used by the modal's "Request briefing") */
function requestBriefing() {
    closeServiceModal();
    setTimeout(() => {
        const el = document.getElementById('contact');
        if (!el) return;
        if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72, duration: 1.6 });
        else el.scrollIntoView({ behavior: 'smooth' });
    }, 340);
}

/* "Explore" rows behave like real buttons for keyboard users */
document.querySelectorAll('.service-card-item [role="button"]').forEach(el => {
    el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
});

/* Restore the visitor's saved theme (matches faceex.html) */
(function () {
    try { if (localStorage.getItem('fit-theme') === 'light' && !document.body.classList.contains('light-mode')) toggleTheme(); } catch (e) {}
})();


/* Safety net: anything scrolled past (e.g. after an anchor jump) is always shown */
(function () {
    let t = false;
    function sweep() {
        t = false;
        // At the very bottom of the page the footer's last row sits inside the observer's 70px bottom margin
        // (and starts 45px lower still), so it can never intersect. Show whatever is on screen there.
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        document.querySelectorAll('.reveal-on-scroll:not(.revealed),.reveal-left:not(.revealed),.reveal-right:not(.revealed)').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.bottom < 0 || (atBottom && r.top < window.innerHeight)) el.classList.add('revealed');
        });
        document.querySelectorAll('.fx-head:not(.fx-in)').forEach(el => {
            if (el.getBoundingClientRect().bottom < 0) el.classList.add('fx-in');
        });
    }
    addEventListener('scroll', () => { if (!t) { t = true; requestAnimationFrame(sweep); } }, { passive: true });
})();
