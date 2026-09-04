/*
    Amber — smooth scrolling and scroll reveals.

    Both are progressive enhancements: with JavaScript off, or the CDN blocked,
    the page is a normal, fully readable document. Both also stand down when the
    visitor asks for reduced motion.

    Pages change in place (instant navigation swaps <main>), so the header-level
    behaviour binds once, and everything that touches the page's content runs
    through setUp(root) — on load, and again for each new <main>.
*/

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/*
    Everything that belongs to the page's content: the reveals inside it, the
    header's current-page mark, and the header's edge for the new scroll position.
*/
function setUp(root) {
    scrollReveals(root);
    markCurrentMenuItem();

    if (window.headerEvaluate) {
        window.headerEvaluate();
    }

    if (window.lenis) {
        window.lenis.resize();
    }
}

/* The mobile menu is a <details> in the header — a page change closes it. */
function closeMenu() {
    document.querySelectorAll('#header details[open]').forEach(function (menu) {
        menu.removeAttribute('open');
    });
}

/*
    The header carries no edge while the page is at the top — it only grows its
    hairline and shadow once content is passing underneath it. The transition
    lives in the markup; this just owns the state.
*/
window.stickyHeader = function () {
    const header = document.getElementById('header');

    if (!header) {
        return;
    }

    function evaluate() {
        header.toggleAttribute('data-scrolled', window.scrollY > 8);
    }

    window.headerEvaluate = evaluate;

    evaluate();
    window.addEventListener('scroll', evaluate, { passive: true });
};

/*
    Lenis eases the wheel/trackpad instead of jumping line by line — the weighted
    glide the design is tuned around. Native scrolling stays if it cannot load.
    One instance lives for the whole visit, whichever page is showing.
*/
window.smoothScrolling = function () {
    if (prefersReducedMotion.matches || typeof Lenis === 'undefined') {
        return;
    }

    const lenis = new Lenis({
        duration: 1.1,
        easing: function (t) {
            return Math.min(1, 1.001 - Math.pow(2, -10 * t));
        },
        smoothWheel: true,
    });

    window.lenis = lenis;

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // In-page links have to go through Lenis, or they fight it and jump. One
    // listener on the document covers the links in every page's content.
    document.addEventListener('click', function (event) {
        const link = event.target.closest ? event.target.closest('a[href*="#"]') : null;

        if (!link) {
            return;
        }

        const id = link.getAttribute('href').split('#')[1];

        // Only hijack links that point at this page.
        if (!id || (link.pathname !== window.location.pathname)) {
            return;
        }

        const target = document.getElementById(id);

        if (!target) {
            return;
        }

        event.preventDefault();
        lenis.scrollTo(target, { offset: -96 });
    });

    // A visitor who turns motion off mid-session should get plain scrolling back.
    prefersReducedMotion.addEventListener('change', function (event) {
        if (event.matches) {
            lenis.destroy();
            window.lenis = null;
        }
    });
};

/*
    Elements marked [data-reveal] rise into place the first time they are seen.
    The hidden state lives behind the .js class in site.css, which is set before
    paint by an inline script in the layout — so this only adds the finished state.
    A new page's elements are observed afresh; the previous page's observer goes.
*/
let revealObserver = null;

window.scrollReveals = function (root) {
    root = root || document;

    if (revealObserver) {
        revealObserver.disconnect();
        revealObserver = null;
    }

    const items = root.querySelectorAll('[data-reveal], [data-reveal-group]');

    if (!('IntersectionObserver' in window)) {
        items.forEach(function (item) {
            item.classList.add('is-revealed');
        });

        return;
    }

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-revealed');
                // Reveal once — re-animating on the way back up is nauseating.
                observer.unobserve(entry.target);
            });
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.1 }
    );

    revealObserver = observer;

    items.forEach(function (item) {
        observer.observe(item);
    });
};

/* aria-current tells screen readers which page you are on, and styles the active link. */
window.markCurrentMenuItem = function () {
    document.querySelectorAll('header nav a').forEach(function (item) {
        if (item.pathname === window.location.pathname && item.pathname !== '/') {
            item.setAttribute('aria-current', 'page');
        } else {
            item.removeAttribute('aria-current');
        }
    });
};

smoothScrolling();
stickyHeader();
setUp(document);

document.addEventListener('instant:navigated', function (event) {
    closeMenu();
    setUp(event.detail.main);
});
