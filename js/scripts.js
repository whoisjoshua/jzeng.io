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

    initSeamlessVideo();
    initReveal();
    initTimelineProgress();

});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/*
 * Seamless background loop.
 * Native `loop` hard-cuts from the last frame to the first, which reads as a stutter.
 * Two stacked <video>s play the same clip; shortly before the visible one ends the other
 * restarts from 0 and fades in on top, so the loop point becomes a slow dissolve.
 */
function initSeamlessVideo() {
    const FADE_SECONDS = 1.6; // keep in sync with the opacity transition in style-modern.css
    const wrap = document.querySelector('.video-container');
    if (!wrap) return;
    const videos = wrap.querySelectorAll('video');
    let current = videos[0];
    let next = videos[1];
    if (!current) return;

    const reveal = () => current.classList.add('is-visible', 'is-front');
    if (current.readyState >= 2) reveal();
    else current.addEventListener('loadeddata', reveal, { once: true });

    if (!next) return; // single video: just keep native loop
    current.loop = false;

    // Load the second copy only once the first can play, so they don't compete for bandwidth.
    const loadNext = () => {
        if (next.src) return;
        next.src = current.currentSrc || current.querySelector('source').src;
        next.load();
    };
    if (current.readyState >= 4) loadNext();
    else current.addEventListener('canplaythrough', loadNext, { once: true });

    let swapping = false;

    const crossfade = () => {
        if (swapping) return;
        swapping = true;
        const incoming = next;
        const outgoing = current;
        if (!incoming.src) loadNext();
        incoming.currentTime = 0;
        Promise.resolve(incoming.play()).then(() => {
            incoming.classList.add('is-visible', 'is-front');
            outgoing.classList.remove('is-front');
            setTimeout(() => {
                outgoing.classList.remove('is-visible');
                outgoing.pause();
                current = incoming;
                next = outgoing;
                swapping = false;
            }, FADE_SECONDS * 1000 + 100);
        }).catch(() => {
            // Playback refused (e.g. power saving): fall back to a plain restart.
            outgoing.currentTime = 0;
            outgoing.play().catch(() => {});
            swapping = false;
        });
    };

    videos.forEach((v) => {
        v.addEventListener('timeupdate', () => {
            if (v !== current || !v.duration) return;
            if (v.duration - v.currentTime <= FADE_SECONDS + 0.25) crossfade();
        });
        v.addEventListener('ended', () => {
            if (v === current) crossfade();
        });
    });
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