/*!
* Start Bootstrap - Grayscale v7.0.3 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    initNavReveal(mainNav, navbarToggler);
    initSeamlessVideo();
    initReveal();
    initTimelineProgress();

});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/*
 * Hero background loop.
 * res/video/hero-loop-*.mp4 has the crossfade baked in (its last 1.5s dissolve into its first
 * frames), so plain native `loop` on one <video> is seamless with a single decoder.
 * The video pauses while the hero is off screen so it isn't decoding behind the content.
 */
function initSeamlessVideo() {
    const video = document.getElementById('bg-video');
    if (!video) return;
    const show = () => video.classList.add('is-playing');
    if (prefersReducedMotion) {
        video.removeAttribute('autoplay');
        video.pause();
        show(); // still frame (poster), no fade
        return;
    }
    // Fade in from black on first playback, not on every loop or resume.
    if (!video.paused && video.currentTime > 0) show();
    else video.addEventListener('playing', show, { once: true });
    watchVideoStalls(video);
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) video.play().catch(show); // autoplay blocked: fade in the poster instead
        else video.pause();
    }).observe(video);
}

/*
 * Some Windows Chrome/Edge setups freeze the hero loop (often at the loop point) while the
 * element still reports itself as playing. Once a second, check that playback is actually
 * advancing; if it has sat still for ~2s, nudge it with a tiny seek (wrapping to the start
 * when stuck at the end), which makes the decoder resume.
 */
function watchVideoStalls(video) {
    const STALL_TICKS = 2; // seconds without progress before nudging
    let last = -1;
    let still = 0;
    setInterval(() => {
        // Only judge playback we expect to be running: not paused (off screen), tab visible, data loaded.
        if (video.paused || document.hidden || video.readyState < 2 || !video.duration) {
            last = -1;
            still = 0;
            return;
        }
        const t = video.currentTime;
        if (t !== last) {
            last = t;
            still = 0;
            return;
        }
        if (++still < STALL_TICKS) return;
        still = 0;
        last = -1;
        const atEnd = video.duration - t < 0.25;
        video.currentTime = atEnd ? 0 : t + 0.04;
        video.play().catch(() => {});
    }, 1000);
}

/*
 * Hide the section links while the hero video is on screen; fade them in once the
 * masthead has scrolled up behind the navbar, and hide them again back at the top.
 */
function initNavReveal(nav, toggler) {
    const hero = document.querySelector('.masthead');
    if (!nav) return;
    const menu = document.getElementById('navbarResponsive');
    const set = (past) => {
        nav.classList.toggle('is-past-hero', past);
        // Close an open phone menu rather than leave it showing invisible links.
        if (!past && menu && menu.classList.contains('show') && toggler) toggler.click();
    };
    if (!hero) {
        set(true);
        return;
    }
    let past = null;
    const update = () => {
        // "Past" = the hero's bottom edge has slid up behind the navbar.
        const now = hero.getBoundingClientRect().bottom <= nav.offsetHeight;
        if (now !== past) set((past = now));
    };
    document.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
}

/* Fade/slide elements with .reveal into view as they enter the viewport. */
function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('is-visible'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => io.observe(el));
}

/* Fill the timeline spine as the reader scrolls through the Career section. */
function initTimelineProgress() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    const items = timeline.querySelectorAll('.tl-item');
    let ticking = false;
    const update = () => {
        ticking = false;
        const r = timeline.getBoundingClientRect();
        const anchor = window.innerHeight * 0.6;
        const progress = Math.min(Math.max((anchor - r.top) / r.height, 0), 1);
        timeline.style.setProperty('--progress', progress.toFixed(4));
        items.forEach((item) => {
            const node = item.querySelector('.tl-node');
            if (node) item.classList.toggle('is-passed', node.getBoundingClientRect().top < anchor);
        });
    };
    const onScroll = () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
}